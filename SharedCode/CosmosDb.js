const cosmos = require('@azure/cosmos');
const { CosmosClient } = cosmos;
const BlobMetaData = require('../SharedCode/BlobMetaDataFile.js');

function getContainerPriv(cosmosDbConnStr){
    const client = new CosmosClient(cosmosDbConnStr);
    // All function invocations also reference the same database and container.
    const container = client.database("copyfilesdb").container("dbcontainer1");
    return container;
};

function getDbSelectPriv (myQueueWorker){
    var sqlSelect = "SELECT * FROM c where c.blobFileName = ";
    var sqlParam = `'${myQueueWorker}'`; //'testblobcontainer1/testfolder2/JpkSession_2016-08-19_12-05-57_.xml' \
    var sqlOrder = "ORDER BY c.uploadDate desc OFFSET 0 LIMIT 1";
    var sqlQuery = sqlSelect.concat(sqlParam.concat(sqlOrder))

    return querySpec = {
        query: sqlQuery
    };
};

async function getDbRecordPriv (cosmosDbConnStr, myQueueWorker){
    const OutBlobMetaData = new BlobMetaData();
    const dbContainer = getContainerPriv(cosmosDbConnStr);
    const dbSelect = getDbSelectPriv(myQueueWorker);

    const { resources: itemArray } = await dbContainer.items.query(dbSelect).fetchAll();   //readAll().fetchAll();
    //context.log("Cosmos data:"+JSON.stringify(itemArray[0]));
    itemArray.forEach(item => {
        //context.log(`${item.id} - ${item.fileName}`);
        OutBlobMetaData.id = item.id;
        OutBlobMetaData.uploadDate = item.uploadDate;
        OutBlobMetaData.blobPath = item.blobPath;
        OutBlobMetaData.workerPath = item.workerPath;
        OutBlobMetaData.fileName = item.fileName;
        OutBlobMetaData.sha1 = item.sha1;
        OutBlobMetaData.MD5 = item.MD5;
        OutBlobMetaData.appState = item.appState;
        OutBlobMetaData.blobFileName = item.blobFileName;
        OutBlobMetaData.blobUri = item.blobUri;
    })

    return OutBlobMetaData;
};

module.exports = {
    DbContainer: function getContainer(cosmosDbConnStr){
        container = getContainerPriv(cosmosDbConnStr);
        return container;
    },
    DbSelectStr: function getDbSelect (myQueueWorker){
        return getDbSelectPriv(myQueueWorker);
    },
    DbRecord: async function getDbRecord(cosmosDbConnStr, myQueueWorker){
        return getDbRecordPriv (cosmosDbConnStr, myQueueWorker)
    }

}