import { db } from "@src/core/domains/database/services/Database";
import TestFailedWorkerModel from "@src/tests/models/models/TestFailedWorkerModel";
import TestWorkerModel from "@src/tests/models/models/TestWorkerModel";
import { DataTypes } from "sequelize";

const resetWorkerTables = async () => {
    const workerTable = TestWorkerModel.getTable()
    const workerFailedTable = TestFailedWorkerModel.getTable()

    if(await db().schema().tableExists(workerTable)) {
        await db().schema().dropTable(workerTable);
    }

    if(await db().schema().tableExists(workerFailedTable)) {
        await db().schema().dropTable(workerFailedTable);
    }

    await db().schema().createTable(workerTable, {
        queueName: DataTypes.STRING,
        eventName: DataTypes.STRING,
        payload: DataTypes.JSON,
        attempt: DataTypes.INTEGER,
        retries: DataTypes.INTEGER,
        createdAt: DataTypes.DATE
    });

    await db().schema().createTable(workerFailedTable, {
        queueName: DataTypes.STRING,
        eventName: DataTypes.STRING,
        payload: DataTypes.JSON,
        error: DataTypes.STRING,
        failedAt: DataTypes.DATE
    })
}

export default resetWorkerTables