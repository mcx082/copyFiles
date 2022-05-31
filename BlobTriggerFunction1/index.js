const Client = require('ssh2-sftp-client');
const {BlobNameAndPath} = require('../SharedCode/BlobData.js');
const BlobMetaData = require('../SharedCode/BlobMetaDataFile.js');


module.exports = async function (context, myBlobXML) {
    context.log("JavaScript blob XML trigger function processed blob \n Blob:", context.bindingData.blobTrigger);

    getBlobNameAndPath(context.bindingData.blobTrigger.toString());
    var blobMetaData = new BlobMetaData(
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
    
    

    context.log("My Blob:\n", JSON.stringify(blobMetaData) );
    //context.bindings.myQueueWorker1 = JSON.stringify(blobMetaData);

  
    copyBlob(context, blobMetaData);
    wrtiteToDB(context, blobMetaData);

/*

     let client = new Client();

     const config = {
        host: 'ftpstoragemcx.blob.core.windows.net',
        port: 22,
        username: 'ftpstoragemcx.remoteftp.marek',
        password: 'XT7/VvTqSGY8Xjz2t63ebxZeIXg3ATnshYxrcGq9B0w73CSFwShWop6kNemg9JdNN5vmEg2GL1nJl4kFnyEm5Q=='
      };

    let data = context.bindings.myBlobXML;;
    let remote = '/'+blobMetaData.fileName;
     
    client.connect(config)
       .then(() => {
        //console.log("wysyłam..");
         return client.put(data, remote);
       })
       .then(() => {
        //console.log("jest PUT");
         return client.end();
       })
       .catch(err => {
        console.log(err.message);
       });
       context.log("Sended to sftp");
*/

};

//******************************* */
// FUCTIONS

function getBlobNameAndPath(blobURI){
    let index = blobURI.lastIndexOf("/");
    BlobNameAndPath.path = blobURI.substring(0,index);
    BlobNameAndPath.name = blobURI.substring(index + 1);
};
/*
function getWorkerPath (blobURI){
    let index = blobURI.lastIndexOf("/");
    return blobURI.substring(0,index);
};

function getFileName (blobURI){
    let index = blobURI.lastIndexOf("/");
    return blobURI.substring(index + 1);
};
*/

function copyBlob(context, blobMetaData){
    if (blobMetaData.workerPath.endsWith("testfolder1")){    
        context.bindings.outputBlobWorker1 = context.bindings.myBlobXML;
        context.log("blob mooved to testfolder1");
        context.bindings.myQueueWorker1 = blobMetaData.blobFileName; //JSON.stringify(blobMetaData);
        context.log("do kolejki: ", blobMetaData.blobFileName)
    } else if (blobMetaData.workerPath.endsWith("testfolder2")) {
        context.bindings.outputBlobWorker2 = context.bindings.myBlobXML;
        context.log("blob mooved to testfolder2");
    } else {
        context.log("found nothing, blob no mooved");
    }
};

function wrtiteToDB (context, blobMetaData){
    context.bindings.outputDocument = JSON.stringify(blobMetaData);
};

function getGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {  
        var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);  
        return v.toString(16);  
     });  
}