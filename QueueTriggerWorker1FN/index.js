const Client = require('ssh2-sftp-client');
const BlobMetaData = require('../SharedCode/BlobMetaDataFile.js');
const { Writable } = require('stream');
const containerName = "worker1";
const Blob = require('buffer');

const cosmos = require('@azure/cosmos');
const cosmosDbConnStr = process.env.CosmosDbConnStr;
//const key = process.env.COSMOS_API_KEY;
const { CosmosClient } = cosmos;

const client = new CosmosClient(cosmosDbConnStr);
// All function invocations also reference the same database and container.
const container = client.database("copyfilesdb").container("dbcontainer1");

module.exports = async function (context, myQueueWorker1) {

    context.log("Starting function QueueTrigerWorker1FN");
    context.log("Passed parameter: " + myQueueWorker1);

    var sqlSelect = "SELECT * FROM c where c.blobFileName = ";
    var sqlParam = "'"+myQueueWorker1+"'"; //'testblobcontainer1/testfolder2/JpkSession_2016-08-19_12-05-57_.xml' \
    var sqlOrder = "ORDER BY c.uploadDate desc OFFSET 0 LIMIT 1";
    var sqlQuery = sqlSelect.concat(sqlParam.concat(sqlOrder))

    const querySpec = {
        query: sqlQuery
      };

    //context.log("SQL query: " + JSON.stringify(querySpec));

    const { resources: itemArray } = await container.items.query(querySpec).fetchAll();   //readAll().fetchAll();
    //context.log("zapytanie sql: " + JSON.stringify(itemArray));
    var blobFileName;
    var blobMD5;
    context.log("Cosmos data:");
    itemArray.forEach(item => {
        context.log(`${item.id} - ${item.fileName}`);
        blobFileName = item.fileName;
        blobMD5 = item.MD5;
      });

    //context.bindings.inputCopyBlob

    //var inputBlobData = JSON.parse(myQueueWorker1);
    //var blobMetaData = myQueueWorker1;
    //blobMetaData = inputBlobData;
    //blobMetaData.appState = "blob sended to sftp";

    sentToSFTP(context, blobFileName );



    //connecttoblob();
    //const outStream = new Writable({
    //    write(chunk, encoding, callback) {
    //      console.log(chunk.toString());
    //      callback();
     //   }
     // });

    //downloadBlobAsStream(getContCl(),blobMetaData.blobFileName, outStream);
    
};




function sentToSFTP (context, blobMetaData){
    let client = new Client();

    const config = {
       host: 'ftpstoragemcx.blob.core.windows.net',
       port: 22,
       username: 'ftpstoragemcx.remoteftp.marek',
       password: 'XT7/VvTqSGY8Xjz2t63ebxZeIXg3ATnshYxrcGq9B0w73CSFwShWop6kNemg9JdNN5vmEg2GL1nJl4kFnyEm5Q=='
     };

     
     //context.bindings.inputCopyBlob.path = 'testblobcontainer1/testfolder2/JpkSession_2016-08-19_12-05-57_.xml';
     var data = context.bindings.inputCopyBlob;

     if (data == null){
        throw new Error('Blob object data is null or udefined', "Blob: "+ blobMetaData);
    }
 
    var blobdata = Blob.Buffer.from(data);
    let remote = "./"+blobMetaData; //"./jakisplik.xml";
    
   client.connect(config)
      .then(() => {
       console.log("wysyłam..");
        return client.put(blobdata,remote);
      })
      .then(() => {
       console.log("jest PUT");
        return client.end();
      })
      .catch(err => {
       console.log("error while sending to sftp!" + err.message);
      });
      context.log("Sended to sftp");

}

const { BlobServiceClient } = require('@azure/storage-blob');
//require('dotenv').config()

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