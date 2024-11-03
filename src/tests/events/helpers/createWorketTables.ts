import { App } from "@src/core/services/App";
import TestFailedWorkerModel from "@src/tests/models/models/TestFailedWorkerModel";
import TestWorkerModel from "@src/tests/models/models/TestWorkerModel";
import { DataTypes } from "sequelize";

export const dropWorkerTables = async () => {
    await App.container('db').schema().dropTable((new TestWorkerModel).table);

    await App.container('db').schema().dropTable((new TestFailedWorkerModel).table);
}

export const createWorkerTables = async () => {

    await App.container('db').schema().createTable((new TestWorkerModel).table, {
        queueName: DataTypes.STRING,
        eventName: DataTypes.STRING,
        payload: DataTypes.JSON,
        attempt: DataTypes.INTEGER,
        retries: DataTypes.INTEGER,
        createdAt: DataTypes.DATE
    });

    await App.container('db').schema().createTable((new TestFailedWorkerModel).table, {
        queueName: DataTypes.STRING,
        eventName: DataTypes.STRING,
        payload: DataTypes.JSON,
        error: DataTypes.STRING,
        failedAt: DataTypes.DATE
    })
}

export default createWorkerTables