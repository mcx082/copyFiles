const modluleDB = require('../SharedCode/CosmosDb.js');
const moduleSFTP = require('../SharedCode/sFtpSrv.js');
const commonCode = require('../SharedCode/CommonCode.js');

const cosmosDbConnStr = process.env.CosmosDbConnStr;

module.exports = async function (context, myQueueWorker2) {
 
    // function trigger payload is the pointer (url) for the blob
    context.log("Starting function QueueTrigerWorker1FN");
    context.log("Passed parameter: " + myQueueWorker2);

    // get db recor object
    context.log("Trying to get metadata of file from CosmosDB...");
    const dbRecord = await modluleDB.DbRecord(cosmosDbConnStr,myQueueWorker2);
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