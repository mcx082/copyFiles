const Client = require('ssh2-sftp-client');
const { BlobServiceClient } = require("@azure/storage-blob");
const {BlobNameAndPath} = require('../SharedCode/BlobData.js');
const BlobMetaData = require('../SharedCode/BlobMetaDataFile.js');
const commonCode = require('../SharedCode/CommonCode.js');
const inBlobContainer = "testblobcontainer1";

module.exports = async function (context, myBlobXML) {
    //context.log("JavaScript blob XML trigger function processed blob \n Blob:", context.bindingData.blobTrigger);

    context.log("Creating metadata object about file and copy flow piątek. ");

    getBlobNameAndPath(context.bindingData.blobTrigger.toString());
    var newGuid = commonCode.GetGUID();
    var InBlobMetaData = new BlobMetaData(
        newGuid,
        new Date().toISOString(),
        context.bindingData.blobTrigger.toString(),
        BlobNameAndPath.path,
        BlobNameAndPath.name,
        "something",
        context.bindingData.properties.contentMD5.toString(),
        "blob dispatched",
        context.bindingData.filename,
        context.bindingData.uri
    );
    //context.log("My Blob:\n", JSON.stringify(InBlobMetaData) );
    context.log("Metadata object - done!");
  
    
    //context.bindings.myQueueWorker1 = JSON.stringify(blobMetaData);
    context.log("Trying to write metadata object to Cosmos DB...");
    wrtiteToDB(context, InBlobMetaData);
    context.log("Metadata saved - Done!");

    context.log("Trying to dispatch file to proper blob storage, queue and copy flow..");
    copyBlob(context, InBlobMetaData);
    context.log("File dispatch - Done!");
    
};

//******************************* */
// FUCTIONS

function getBlobNameAndPath(blobURI){
    let indexFirst = blobURI.indexOf("/");
    let indexLast = blobURI.lastIndexOf("/");

    BlobNameAndPath.path = blobURI.substring(indexFirst,indexLast);
    BlobNameAndPath.name = blobURI.substring(indexLast + 1);
};

function copyBlob(context, blobMetaData){
    var OutBlobMetaData = new BlobMetaData(
        commonCode.GetGUID(),
        new Date().toISOString(),
        "",
        BlobNameAndPath.path,
        BlobNameAndPath.name,
        "something",
        blobMetaData.MD5,
        "blob moved",
        blobMetaData.blobFileName,
        ""
    );

    if (blobMetaData.workerPath.endsWith("testfolder1")){    
        context.bindings.outputBlobWorker1 = context.bindings.myBlobXML;
        context.log("blob mooved to testfolder1");
        context.bindings.myQueueWorker1 = blobMetaData.blobFileName; //JSON.stringify(blobMetaData);
        context.log("blob file name sended to queue: ", blobMetaData.blobFileName);
        deleteBlob(inBlobContainer, blobMetaData.blobFileName);
        OutBlobMetaData.blobPath = `worker1${BlobNameAndPath.path}/${BlobNameAndPath.name}`;
        OutBlobMetaData.blobUri = `https://storageaccountmarekvpn.blob.core.windows.net/${OutBlobMetaData.blobPath}`
        wrtiteToDBdispatched(context, OutBlobMetaData);

    } else if (blobMetaData.workerPath.endsWith("testfolder2")) {
        context.bindings.outputBlobWorker2 = context.bindings.myBlobXML;
        context.log("blob mooved to testfolder2");
        context.bindings.myQueueWorker2 = blobMetaData.blobFileName; //JSON.stringify(blobMetaData);
        context.log("blob file name sended to queue: ", blobMetaData.blobFileName);
        deleteBlob(inBlobContainer, blobMetaData.blobFileName);
        OutBlobMetaData.blobPath = `worker2${BlobNameAndPath.path}/${BlobNameAndPath.name}`;
        OutBlobMetaData.blobUri = `https://storageaccountmarekvpn.blob.core.windows.net/${OutBlobMetaData.blobPath}`

        wrtiteToDBdispatched(context, OutBlobMetaData);

    } else {
        context.log("found nothing, blob no mooved");
    }
};

function deleteBlob(containerName, blobFileName){
    const connString = process.env.AzureWebJobsStorage;
    if (!connString) throw Error('Azure Storage Connection string not found');
  
    const blobServiceClient = BlobServiceClient.fromConnectionString(connString);
    blobServiceClient.getContainerClient(containerName).getBlobClient(blobFileName).deleteIfExists();
    console.log("Input Blob deleted: " + blobFileName);
}

function wrtiteToDB (context, blobMetaData){
    context.bindings.outputDocument = JSON.stringify(blobMetaData);
};

function wrtiteToDBdispatched (context, blobMetaData){
    context.bindings.outputDocumentDispatch = JSON.stringify(blobMetaData);
};
