import { saveAs } from 'file-saver';
import deriveKey from './deriveKey';

const getFileData = (file) =>
{
    return new Promise((resolve, _reject) =>
    {
        try
        {
            let reader = new FileReader();

            reader.readAsArrayBuffer(file);
            reader.onload = (event) => { resolve(event.target.result) };
        }
        catch (err) { console.log(err); };
    });
};

const decryptData = async (data, decrypting, key) =>
{
    try
    {
        const algorithm = { name: "AES-GCM", iv: new TextEncoder().encode("Initialization Vector") };

        if(decrypting === 'name')
        {
            const actualData = data.replace(".bin",'');
            const decodedBase64Filename = atob(actualData);
            const uint8ArrayFilename = new Uint8Array( [...decodedBase64Filename].map((char) => char.charCodeAt(0)) );

            const decryptedName = await window.crypto.subtle.decrypt( algorithm, key, uint8ArrayFilename )
            const originalFilename = new TextDecoder().decode(decryptedName);

            return originalFilename;
        }

        else if(decrypting === 'file') return await window.crypto.subtle.decrypt( algorithm, key, data );
    }

    catch(err) { console.log(err); };
};

const decryptFile = async (file, filename, passkey) =>
  {
    try
    {
      (async () =>
        {
            const key = await deriveKey(passkey);

            const fileUint8Array = await getFileData(file);
            const decryptedFileData = await decryptData(fileUint8Array, 'file', key);

            const originalName = await decryptData(filename, 'name', key);

            const extension = /[^.]*$/.exec(originalName)[0];
            const type = `image/${extension}`;

            const originalFile = new Blob([decryptedFileData], { type });
            saveAs(originalFile, `${originalName}`);
        }
      )();
    }
    catch (err) { console.log(err); };
  };

export default decryptFile;