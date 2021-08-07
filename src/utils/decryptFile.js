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
        catch (err) { console.log(err.message); };
    });
};

const decryptData = async (data, decrypting, key) =>
{
    try
    {
        const algorithm = { name: "AES-GCM", iv: new TextEncoder().encode("Initialization Vector") };

        if(decrypting === 'file') return await window.crypto.subtle.decrypt(algorithm, key, data);

        const uptoLastFullStop = data.split(/[^.]*$/)[0];
        const filteredData = uptoLastFullStop.substring(0, uptoLastFullStop.length - 1);

        const decodedBase64Filename = atob(filteredData);
        const uint8ArrayFilename = new Uint8Array(
          [...decodedBase64Filename].map(
            (char) => char.charCodeAt(0)
          )
        );

        const decryptedName = await window.crypto.subtle.decrypt(algorithm, key, uint8ArrayFilename)
        const originalFilename = new TextDecoder().decode(decryptedName);

        return originalFilename;
    }
    catch(err)
    {
        console.log(err.message);

        if(err.message.includes(`Failed to execute 'atob' on 'Window'`))
        {
            const extension = /[^.]*$/.exec(data)[0];
            return `original_name_could_not_be_recovered.${ extension }`;
        };
    };
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

            const originalFile = new Blob( [decryptedFileData] );
            saveAs(originalFile, originalName);
        }
      )();
    }
    catch (err) { console.log(err.message); };
  };

export default decryptFile;