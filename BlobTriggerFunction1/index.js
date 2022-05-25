module.exports = async function (context, myBlobXML) {
    context.log("JavaScript blob XML trigger function processed blob \n Blob:", context.bindingData.blobTrigger, "\n Blob Size:", myBlobXML.length, "Bytes");

    if (myBlobXML) {
        context.bindings.outputDocument = JSON.stringify({
            // create a random ID
            id: new Date().toISOString() + Math.random().toString().substr(2,8),
            name: myBlobXML
        });
    }
};