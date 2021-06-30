import React, { Fragment, useState } from 'react';
//import FileSaver from 'file-saver';

const Files = () =>
{
  const [file, setFile] = useState('');
  const [filename, setFilename] = useState('Choose File');
  const [key, setKey] = useState('Enter Any Key');

  const onFileChange = (event) =>
  {
    setFile((event.target.files[0] !== undefined) ? event.target.files[0] : '');
    setFilename((event.target.files[0] !== undefined) ? event.target.files[0].name : 'Choose File');
  };

  const onKeyChange = (event) => { setKey(event.target.value); console.log(key) };

  const encryptFile = () =>
  {
    const fileToByteArray = () =>
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

    const encryptData = async (data) =>
    {
      const algorithm = { name: "AES-GCM", iv: new TextEncoder().encode("Initialization Vector") };
      const encryptedData =  await window.crypto.subtle.encrypt( algorithm, key, data );
      return encryptedData;
    }

    try
    {
      (async () =>
        {
          // generating key
          const key = await window.crypto.subtle.generateKey(
            { name: "AES-GCM", length: 128 },
            false,
            ["encrypt", "decrypt"]
          );
          setKey(key);

          // file to bytes
          const fileBytes = await fileToByteArray();

          // encrypting bytes
          const encryptedFile = await encryptData(fileBytes);

          const encryptedFileString = String.fromCharCode.apply(null, encryptedFile);
          const encryptedBase64FileData = btoa(encryptedFileString);

          console.log(encryptedFile)
          const element = document.createElement("a");
          const txtFile = new Blob([encryptedBase64FileData], {type: 'text/plain'});
          element.href = URL.createObjectURL(txtFile);
          element.download = "myFile.txt";
          document.body.appendChild(element);
          element.click();

          // saving the encrypted data on server
          //FileSaver.saveAs(encryptedBase64FileData, filename);
        }
      )();
    }
    catch (err) { console.log(err); };
  };

  const decryptFile = () =>
  {
    try
    {
      (async () =>
        {
          //

          // saving the encrypted data on server
          //FileSaver.saveAs(encryptedFileBytes, filename);
        }
      )();
    }
    catch (err) { console.log(err); };
  };

  return (
    <Fragment>
      <form>
        <div className='custom-file mt-5'>
          <input type='file' className='custom-file-input' id='customFile' onChange={onFileChange} />
          <label className='custom-file-label' htmlFor='customFile'> {filename} </label>
          <input type='text' className='custom-text-input' id='customKey' onChange={onKeyChange} />
        </div>

        <input type='button' value='Encrypt' onClick={encryptFile} className='btn btn-primary btn-block mt-2' />
        <input type='button' value='Decrypt' onClick={decryptFile} className='btn btn-primary btn-block' />
      </form>
    </Fragment>
  );
};

export default Files;