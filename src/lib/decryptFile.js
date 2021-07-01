import { saveAs } from 'file-saver';

const getFileData = (file) =>
{
    return new Promise((resolve, reject) =>
    {
    try
    {
        let reader = new FileReader();

        reader.readAsArrayBuffer(file);
        reader.onload = (event) => {
        resolve(event.target.result)
        };
    }
    catch (err) { reject(err); };
    });
};

const decryptData = async (data, decrypting, key) =>
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

    else if(decrypting === 'file')
    {
    console.log(key)
    const decryptedArrayBuffer = await window.crypto.subtle.decrypt( algorithm, key, data );
    return decryptedArrayBuffer;
    };
};

const decryptFile = (file, filename, key) =>
  {
    try
    {
      (async () =>
        {
          const fileUint8Array = await getFileData(file);
          const decryptedFileData = await decryptData(fileUint8Array, 'file', key);

          const originalName = await decryptData(filename, 'name', key);
          console.log(originalName);

          // get original file extension

          const originalFile = new Blob([decryptedFileData], { type: 'image/png' });
          saveAs(originalFile, `${originalName}`);
        }
      )();
    }
    catch (err) { console.log(err); };
  };

export default decryptFile;