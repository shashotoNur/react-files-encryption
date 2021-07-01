import React, { Fragment, useState } from 'react';
import encryptFile from '../lib/encryptFile';
import decryptFile from '../lib/decryptFile';

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

  const onKeyChange = (event) => { setKey(event.target.value); };
  const encrypt = () => { encryptFile(file, filename); };
  const decrypt = () => { decryptFile(file, filename, key); };

  return (
    <Fragment>
      <form>
        <div className='custom-file mt-5'>
          <input type='file' className='custom-file-input' id='customFile' onChange={onFileChange} />
          <label className='custom-file-label' htmlFor='customFile'> {filename} </label>
          <input type='text' className='custom-text-input' id='customKey' onChange={onKeyChange} />
        </div>

        <input type='button' value='Encrypt' onClick={encrypt} className='btn btn-primary btn-block mt-2' />
        <input type='button' value='Decrypt' onClick={decrypt} className='btn btn-primary btn-block' />
      </form>
    </Fragment>
  );
};

export default Files;