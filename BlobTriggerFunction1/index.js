module.exports = async function (context, myBlobXML) {
    context.log("JavaScript blob XML trigger function processed blob \n Blob:", context.bindingData.blobTrigger, "\n Blob Size:", myBlobXML.length, "Bytes");
};