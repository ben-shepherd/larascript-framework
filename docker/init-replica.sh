#!/bin/bash
echo "[init-replica.sh] Starting replica set initialization..."
echo "[init-replica.sh] Current directory: $(pwd)"

# Verify environment variables
if [ -z "$MONGO_INITDB_ROOT_USERNAME" ] || [ -z "$MONGO_INITDB_ROOT_PASSWORD" ]; then
    echo "[init-replica.sh] Error: MongoDB credentials not found in environment variables"
    exit 1
fi

# Function to check if MongoDB is ready
check_mongo() {
    mongosh --quiet --eval "db.adminCommand('ping')" >/dev/null 2>&1
    return $?
}

# Wait for MongoDB to be ready
echo "[init-replica.sh] Waiting for MongoDB to start..."
for i in {1..60}; do
    if check_mongo; then
        echo "[init-replica.sh] MongoDB is ready!"
        break
    fi
    echo "[init-replica.sh] Waiting... attempt $i/60"
    sleep 2
done

# Check if replica set is already initialized
echo "[init-replica.sh] Checking replica set status..."
RS_STATUS=$(mongosh --quiet --eval "rs.status()" 2>/dev/null || echo "NotYetInitialized")

if [[ $RS_STATUS == *"NotYetInitialized"* ]]; then
    echo "[init-replica.sh] Initializing replica set..."
    mongosh --quiet --eval "
        db.getSiblingDB('admin').auth('$MONGO_INITDB_ROOT_USERNAME', '$MONGO_INITDB_ROOT_PASSWORD');
        rs.initiate({
            _id: 'rs0',
            members: [{ _id: 0, host: 'larascript-mongodb:27017' }]
        });
        
        // Wait for the replica set to be fully initialized
        for (let i = 0; i < 30; i++) {
            const status = rs.status();
            if (status.ok && status.members[0].stateStr === 'PRIMARY') {
                print('Replica set is now initialized and primary');
                break;
            }
            sleep(1000);
        }
    "
else
    echo "[init-replica.sh] Replica set already initialized"
fi

echo "[init-replica.sh] Final replica set configuration:"
mongosh --quiet --eval "
    db.getSiblingDB('admin').auth('$MONGO_INITDB_ROOT_USERNAME', '$MONGO_INITDB_ROOT_PASSWORD');
    rs.conf()
"

echo "[init-replica.sh] Completed"