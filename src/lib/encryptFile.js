import { saveAs } from 'file-saver';

const fileToByteArray = (file) =>
{
    return new Promise((resolve, reject) =>
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
        catch (err) { reject(err); };
    });
};

const encryptData = async (data, encrypting, key) =>
{
    const algorithm = { name: "AES-GCM", iv: new TextEncoder().encode("Initialization Vector") };
    const encryptedData =  await window.crypto.subtle.encrypt( algorithm, key, data );

    const uint8ArrayData = new Uint8Array(encryptedData);

    if(encrypting === 'name')
    {
    const stringData = String.fromCharCode.apply(null, uint8ArrayData);
    const encryptedBase64Data = btoa(stringData);
    return encryptedBase64Data;
    }

    return uint8ArrayData;
}

const generateKey = async () =>
{
    const algorithm = { name: "AES-GCM", length: 128 };
    const key = await window.crypto.subtle.generateKey( algorithm, false, ["encrypt", "decrypt"] );
    return key;
}

const encryptFile = (file, filename) =>
  {
    try
    {
      (async () =>
        {
          const key = generateKey();

          const fileBytesArray = await fileToByteArray(file);
          const encryptedFileData = await encryptData(fileBytesArray, 'file', key);

          const encodedFilename = new TextEncoder().encode(filename);
          const encryptedName = await encryptData(encodedFilename, 'name', key);

          const binFile = new Blob([encryptedFileData], { type: 'application/octet-stream' });
          saveAs(binFile, `${encryptedName}.bin`);
        }
      )();
    }
    catch (err) { console.log(err); };
  };

export default encryptFile;