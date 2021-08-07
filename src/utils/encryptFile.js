import { saveAs } from 'file-saver';
import deriveKey from './deriveKey';

const fileToByteArray = (file) =>
{
    return new Promise((resolve, _reject) =>
    {
        try
        {
            let reader = new FileReader();
            let fileByteArray = [];

            reader.readAsArrayBuffer(file);
            reader.onloadend = (event) =>
            {
                if (event.target.readyState === FileReader.DONE)
                {
                    let arrayBuffer = event.target.result;
                    fileByteArray = new Uint8Array(arrayBuffer);
                };
                resolve(fileByteArray);
            }
        }
        catch (err) { console.log(err.message); };
    });
};

const encryptData = async (data, encrypting, key) =>
{
    try
    {
        const algorithm = { name: "AES-GCM", iv: new TextEncoder().encode("Initialization Vector") };
        const encryptedData =  await window.crypto.subtle.encrypt( algorithm, key, data );

        const uint8ArrayData = new Uint8Array(encryptedData);

        if(encrypting === 'file') return uint8ArrayData;
        
        const stringData = String.fromCharCode.apply(null, uint8ArrayData);
        const encryptedBase64Data = btoa(stringData);

        return encryptedBase64Data;
    }
    catch (err) { console.log(err.message); };
}

const encryptFile = async (file, filename, passkey) =>
  {
    try
    {
      (async () =>
        {
            const key = await deriveKey(passkey);

            const fileBytesArray = await fileToByteArray(file);
            const encryptedFileData = await encryptData(fileBytesArray, 'file', key);

            const extension = /[^.]*$/.exec(filename)[0];
            const encodedFilename = new TextEncoder().encode(filename);
            const encryptedName = await encryptData(encodedFilename, 'name', key);

            const binFile = new Blob([encryptedFileData], { type: 'application/octet-stream' });
            saveAs(binFile, `${ encryptedName }.${ extension }`);
        }
      )();
    }
    catch (err) { console.log(err.message); };
  };

export default encryptFile;