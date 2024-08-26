import EnvService from "./core/services/EnvService";

// setup-database.js
const readline = require('readline');
const { exec } = require('child_process');
const util = require('util');
const fs = require('fs').promises;

const execPromise = util.promisify(exec);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let dbPackage, dbType;

function question(query): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function installDb(db) {
  console.log(`Installing ${db} package...`);
  try {
    await execPromise(`yarn add ${db}`);
    console.log(`${db} package installed successfully.`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to install ${db} package. Please install it manually.`);
      console.error(`Error: ${error.message}`);
    }
  }
}

async function updatePackageJson(dbType) {
  const command = `docker-compose -f docker-compose.base.yml -f docker-compose.${dbType}.yml up -d`;

  try {
    const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));

    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }

    packageJson.scripts.up = command;

    // Add a new script to connect to the database
    if (dbType === 'postgres') {
      packageJson.scripts.connect = 'psql postgresql://root:example@localhost:5432/larascript_db';
    } else if (dbType === 'mongodb') {
      packageJson.scripts.connect = 'mongo mongodb://root:example@localhost:27017/larascript_db?authSource=admin';
    }

    await fs.writeFile('package.json', JSON.stringify(packageJson, null, 2));
    console.log('Updated package.json with the new "up" and "connect" scripts.');
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to update package.json.');
      console.error(`Error: ${error.message}`);
    }
  }
}

async function setupDatabase() {
  console.log("Which database would you like to use?");
  console.log("1. MongoDB");
  console.log("2. PostgreSQL");

  const choice = await question("Enter your choice (1 or 2): ");

  if (choice === "1") {
    console.log("Starting with MongoDB...");
    dbPackage = "mongodb";
    dbType = "mongodb";
  } else if (choice === "2") {
    console.log("Starting with PostgreSQL...");
    dbPackage = "pg";
    dbType = "postgres";
  } else {
    console.log("Invalid choice. Please run the script again and select 1 or 2.");
    rl.close();
    return;
  }

  await installDb(dbPackage);
  await updatePackageJson(dbType);

  console.log("Database setup complete!");
  console.log("You can now run 'yarn up' to start your Docker containers.");
  console.log("To connect to your database, run 'yarn connect'.");
  rl.close();
}

async function setupEnvDatabaseDriver() {
  const envService = new EnvService();
  envService.copyFileFromEnvExample();
  await envService.updateValues({ DATABASE_DRIVER: dbType });
}

type PackageJson = {
  scripts?: {
    up?: string;
  }
}


async function main() {
  try {
    const packageJson: PackageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));

    if (packageJson?.scripts?.up) {
      const answer = await question("An 'up' script already exists in package.json. Do you want to continue and overwrite it? (y/n): ");
      if (answer.toLowerCase() !== 'y') {
        console.log("Setup cancelled. Existing 'up' script was not modified.");
        rl.close();
        return;
      }
    }
  } catch (error) {
    console.error("Error reading package.json. Make sure it exists and is valid JSON.");
    rl.close();
    return;
  }

  await setupDatabase();

  console.log('Setting up .env')
  await setupEnvDatabaseDriver();
  
}

main();