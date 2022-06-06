const modluleDB = require('../SharedCode/CosmosDb.js');
const moduleSFTP = require('../SharedCode/sFtpSrv.js');
const commonCode = require('../SharedCode/CommonCode.js');

const cosmosDbConnStr = process.env.CosmosDbConnStr;

module.exports = async function (context, myQueueWorker1) {

    // function trigger payload is the pointer (url) for the blob
    context.log("Starting function QueueTrigerWorker1FN");
    context.log("Passed parameter: " + myQueueWorker1);

    // get db recor object
    context.log("Trying to get metadata of file from CosmosDB...");
    const dbRecord = await modluleDB.DbRecord(cosmosDbConnStr,myQueueWorker1);
    context.log("Get record from CosmosDb - done!");

    // copy blob from 
    context.log("Trying to send file to sFTP remote resource...");
    var sentBlobMataData = await moduleSFTP.sFtpSend(context, dbRecord);
    context.log("send to sFTP - done!");

    //save state to DB
    context.log("Trying to update ComosDb about current copy flow state...");
    sentBlobMataData.id = commonCode.GetGUID();
    var msg = await modluleDB.DbWrite(cosmosDbConnStr, sentBlobMataData);
    context.log(msg);

    context.log("END *******************");
};


//----- test code
/* 
const { BlobServiceClient } = require('@azure/storage-blob');

function getContCl(){
    
    const connString = process.env.AzureWebJobsStorage;
    if (!connString) throw Error('Azure Storage Connection string not found');

    const blobServiceClient = BlobServiceClient.fromConnectionString(connString);

    // const serviceGetPropertiesResponse = blobServiceClient.getProperties();
    // console.log(`${JSON.stringify(serviceGetPropertiesResponse)}`);

    return blobServiceClient.getContainerClient(containerName);
}

function downloadBlobAsStream(containerClient, blobName, writableStream) {

    const blobClient = containerClient.getBlobClient(blobName);
    const downloadResponse = blobClient.download();

    downloadResponse.readableStreamBody.pipe(writableStream);
    console.log(`download of ${blobName} succeeded`);
} 
*/