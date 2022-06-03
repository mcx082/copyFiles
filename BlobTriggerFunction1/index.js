const Client = require('ssh2-sftp-client');
const { BlobServiceClient } = require("@azure/storage-blob");
const {BlobNameAndPath} = require('../SharedCode/BlobData.js');
const BlobMetaData = require('../SharedCode/BlobMetaDataFile.js');
const inBlobContainer = "testblobcontainer1";

module.exports = async function (context, myBlobXML) {
    //context.log("JavaScript blob XML trigger function processed blob \n Blob:", context.bindingData.blobTrigger);

    getBlobNameAndPath(context.bindingData.blobTrigger.toString());
    var InBlobMetaData = new BlobMetaData(
        getGUID(),
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
    /*
    let blobMetaData = {
        id: getGUID(),
        uploadDate: new Date().toISOString(),
        blobPath: context.bindingData.blobTrigger.toString(),
        workerPath: BlobNameAndPath.path,
        fileName: BlobNameAndPath.name,
        sha1: "something",
        MD5: context.bindingData.properties.contentMD5.toString(),
        appState: "blob dispatched"
    }
    */
    // new Date().toISOString() + Math.random().toString().substr(2,8)
    
    

    //context.log("My Blob:\n", JSON.stringify(blobMetaData) );
    //context.bindings.myQueueWorker1 = JSON.stringify(blobMetaData);

    wrtiteToDB(context, InBlobMetaData);
    copyBlob(context, InBlobMetaData);
    
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
        blobMetaData.id,
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
        wrtiteToDB(context, OutBlobMetaData);

    } else if (blobMetaData.workerPath.endsWith("testfolder2")) {
        context.bindings.outputBlobWorker2 = context.bindings.myBlobXML;
        context.log("blob mooved to testfolder2");
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

function getGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {  
        var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);  
        return v.toString(16);  
     });  
}