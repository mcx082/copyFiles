module.exports = async function (context, myBlobXML) {
    context.log("JavaScript blob XML trigger function processed blob \n Blob:", context.bindingData.blobTrigger);

    let blobMetaData = {
        id: new Date().toISOString() + Math.random().toString().substr(2,8),
        uploadDate: new Date().toISOString(),
        blobPath: context.bindingData.blobTrigger.toString(),
        workerPath: getWorkerPath(context.bindingData.blobTrigger.toString()),
        fileName: getFileName(context.bindingData.blobTrigger.toString()),
        sha1: "something",
        MD5: context.bindingData.properties.contentMD5.toString()
    }

    context.log("My Blob:\n", JSON.stringify(blobMetaData) );
  
    copyBlob(context, blobMetaData);
    wrtiteToDB(context, blobMetaData);
};

function getWorkerPath (blobURI){
    let index = blobURI.lastIndexOf("/");
    return blobURI.substring(0,index);
};

function getFileName (blobURI){
    let index = blobURI.lastIndexOf("/");
    return blobURI.substring(index + 1);
};

function copyBlob(context, blobMetaData){
    if (blobMetaData.workerPath.endsWith("testfolder1")){
        context.log("found testfolder1");
        context.bindings.outputBlobWorker1 = context.bindings.myBlobXML;
    } else if (blobMetaData.workerPath.endsWith("testfolder2")) {
        context.log("found testfolder2");
        context.bindings.outputBlobWorker2 = context.bindings.myBlobXML;
    } else {
        context.log("found nothing");
    }
}

function wrtiteToDB (context, blobMetaData){
    context.bindings.outputDocument = JSON.stringify(blobMetaData);
}
