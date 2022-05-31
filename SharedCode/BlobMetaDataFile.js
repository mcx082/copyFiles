module.exports = function BlobMetaData (id, uploadDate, blobPath, workerPath, fileName, sha1, MD5, appState,blobFileName, blobUri) {
    this.id=id,
    this.uploadDate=uploadDate,
    this.blobPath=blobPath,
    this.workerPath=workerPath,
    this.fileName=fileName,
    this.sha1=sha1,
    this.MD5=MD5,
    this.appState=appState,
    this.blobFileName=blobFileName,
    this.blobUri=blobUri
}