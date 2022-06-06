const modluleDB = require('../SharedCode/CosmosDb.js');
const moduleSFTP = require('../SharedCode/sFtpSrv.js');

const cosmosDbConnStr = process.env.CosmosDbConnStr;

module.exports = async function (context, myQueueWorker2) {
    context.log('JavaScript queue trigger function processed work item', myQueueWorker2);
    context.log("Starting function QueueTrigerWorker2FN");
    context.log("Passed parameter: " + myQueueWorker2);

    // get db recor object
    const dbRecord = await modluleDB.DbRecord(cosmosDbConnStr,myQueueWorker2);

    // copy blob from 
    var sentBlobMataData = moduleSFTP.sFtpSend(context, dbRecord);

    context.log("END *******************");

};