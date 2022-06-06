const Client = require('ssh2-sftp-client');
const Blob = require('buffer');

async function sendToSFTPpriv (context, blobMetaData){
    //var retunMsg = "";
    let client = new Client();

    const sftpConfig = {
       host: 'ftpstoragemcx.blob.core.windows.net',
       port: 22,
       username: 'ftpstoragemcx.remoteftp.marek',
       password: 'XT7/VvTqSGY8Xjz2t63ebxZeIXg3ATnshYxrcGq9B0w73CSFwShWop6kNemg9JdNN5vmEg2GL1nJl4kFnyEm5Q=='
     };
     
     //context.bindings.inputCopyBlob.path = 'testblobcontainer1/testfolder2/JpkSession_2016-08-19_12-05-57_.xml';
     var data = context.bindings.inputCopyBlob;

     if (data == null){
        throw new Error('Blob object data is null or udefined', "Blob: "+ blobMetaData.blobPath);
    }
 
    var blobdata = Blob.Buffer.from(data);
    let remoteFile = blobMetaData.fileName; //"./jakisplik.xml";
    var remoteDir = blobMetaData.workerPath;
    await client.connect(sftpConfig)
    .then(() => {
        console.log("check if remote directory exists...");
        return client.mkdir(remoteDir, true);
    })
    .then(() => {
        console.log("directory created...");
        console.log("sending file to sftp...");
        return client.put(blobdata,`./${remoteDir}/${remoteFile}`);
    })
    .then(() => {
        
        blobMetaData.appState="blob tranfered to sfpt";
        blobMetaData.blobUri=`sftp://ftpstoragemcx.blob.core.windows.net${remoteDir}/${remoteFile}`;
        console.log("file sended: "+ blobMetaData.blobUri);
        return client.end();
    })
    .catch(err => {
        console.error(err.message);
    });
    //await client.end();
    blobMetaData.id = null;
    return blobMetaData;
};



module.exports = {
    sFtpSend: async function sendToSFTP(context, blobMetaData){
        return await sendToSFTPpriv(context, blobMetaData);
    },
}