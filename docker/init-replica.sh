#!/bin/bash
echo "[init-replica.sh] Starting replica set initialization..."

# Wait for MongoDB to be ready
until mongosh --quiet --eval "db.adminCommand('ping')" >/dev/null 2>&1; do
    echo "[init-replica.sh] Waiting for MongoDB to start..."
    sleep 2
done

echo "[init-replica.sh] MongoDB is ready"

# Initialize replica set
mongosh --quiet --eval "
    db.getSiblingDB('admin').auth('$MONGO_INITDB_ROOT_USERNAME', '$MONGO_INITDB_ROOT_PASSWORD');
    
    // Check if replica set is already initialized
    const status = rs.status();
    if (status.ok !== 1) {
        rs.initiate({
            _id: 'rs0',
            members: [
                { _id: 0, host: 'larascript-mongodb:27017', priority: 1 }
            ]
        });
        
        // Wait for the replica set to initialize
        let counter = 0;
        while (true) {
            const status = rs.status();
            if (status.ok === 1 && status.members[0].stateStr === 'PRIMARY') {
                break;
            }
            if (counter++ > 20) {
                throw new Error('Replica set initialization timeout');
            }
            sleep(1000);
        }
        print('Replica set initialized successfully');
    } else {
        print('Replica set already initialized');
    }
"

echo "[init-replica.sh] Completed"