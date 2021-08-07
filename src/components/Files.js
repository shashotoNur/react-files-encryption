import React, { useState } from 'react';

import encryptFile from '../utils/encryptFile';
import decryptFile from '../utils/decryptFile';

const Files = () =>
  {
    const [file, setFile] = useState('');
    const [filename, setFilename] = useState('Choose A File');
    const [passkey, setPasskey] = useState('Enter A Passkey');

    const onFileChange = (event) =>
      {
        setFile((event.target.files[0] !== undefined) ? event.target.files[0] : '');
        setFilename((event.target.files[0] !== undefined) ? event.target.files[0].name : 'Choose File');
      };

    const onKeyChange = (event) => { setPasskey(event.target.value); };
    const encrypt = () => { encryptFile(file, filename, passkey); };
    const decrypt = () => { decryptFile(file, filename, passkey); };

    return (
      <>
        <h1> Files Encryption </h1>
        <form>
          <div className='input-file-key'>
            <input type='file' className='input' id='customFile' onChange={ onFileChange } />
            <input type='text' className='input' id='customKey' onChange={ onKeyChange } placeholder={ passkey } />
          </div>

          <input type='button' value='Encrypt' onClick={ encrypt } className='button' />
          <input type='button' value='Decrypt' onClick={ decrypt } className='button' />
        </form>
      </>
    );
  };

export default Files;