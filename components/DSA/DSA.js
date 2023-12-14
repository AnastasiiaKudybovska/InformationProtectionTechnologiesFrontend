import React, { useState } from 'react';
import axios from 'axios';
import css from "@/components/RSA/RSA.module.css";
import Loader from '@/components/Loader/Loader';
import CustomAlert from '../CustomAlert/CustomAlert';

export default function DSA() {
  
  const [keyLength, setKeyLength] = useState(1024); 
  
  const [publicKey, setPublicKey] = useState(null);
  const [textEncrypt, setTextEncrypt] = useState("");  
  const [encryptedText, setEncryptedText] = useState("");
  const [encryptedTextTime, setEncryptedTextTime] = useState("");
  const [encryptedFileTime, setEncryptedFileTime] = useState("");
  const [isValidTextEncrypt, setIsValidTextEncrypt] = useState(false);

  const [isValidFileEncrypt, setIsValidFileEncrypt] = useState(false);
  const [fileEncrypt, setFileEncrypt] = useState(null);
  
  const [privateKey, setPrivateKey] = useState(null);
  const [textDecrypt, setTextDecrypt] = useState("");  
  const [decryptedText, setDecryptedText] = useState("");
  const [decryptedTextTime, setDecryptedTextTime] = useState("");
  const [isValidTextDecrypt, setIsValidTextDecrypt] = useState(false);
  
  const [isValidFileDecrypt, setIsValidFileDecrypt] = useState(false);
  const [fileDecrypt, setFileDecrypt] = useState(null);
  const [decryptedFileTime, setDecryptedFileTime] = useState("");

  const [loadingKeys, setLoadingKeys] = useState(false);
  const [loadingEncryption, setLoadingEncryption] = useState(false);
  const [loadingEncryptionFile, setLoadingEncryptionFile] = useState(false);
  const [loadingDecryption, setLoadingDecryption] = useState(false);
  const [loading, setLoading] = useState(false);

  const [signatureInput, setSignatureInput] = useState(null);


  const handleSelectKeyLengthChange = (event) => {
    setKeyLength(event.target.value);
  };

  const handleFilePublicKeyChange = (e) => {
    const file = e.target.files[0];
    setPublicKey(file); 
    setEncryptedText('');
    setEncryptedTextTime('');
    setEncryptedFileTime('');
    setDecryptedText('');
    setDecryptedTextTime('');
    setDecryptedFileTime('');
  };

  const handleTextEncryptChange = (event) => {
    const inputValue = event.target.value
    setTextEncrypt(inputValue);
    setEncryptedText('');
    setEncryptedTextTime('');
    setEncryptedFileTime('');
    setDecryptedText('');
    setDecryptedTextTime('');
    setDecryptedFileTime('');
    if(inputValue.length > 100000 || inputValue.length === ''){
        setIsValidTextEncrypt(false)
    } else {
        setIsValidTextEncrypt(true)
    }
  };

  const handleFileEncryptChange = (e) => {
    const file = e.target.files[0];
    setFileEncrypt(file); 
    setEncryptedText('');
    setEncryptedTextTime('');
    setEncryptedFileTime('');
    setDecryptedText('');
    setDecryptedTextTime('');
    setDecryptedFileTime('');
    const MAX_FILE_SIZE = 300 * 1024 * 1024;
    if (file && file.size > MAX_FILE_SIZE) {
      setIsValidFileEncrypt(false)
    } else{
      setIsValidFileEncrypt(true)
    }
  };

  const handleFilePrivateKeyChange = (e) => {
    const file = e.target.files[0];
    setPrivateKey(file); 
    setDecryptedText('');
    setEncryptedText('');
    setEncryptedTextTime('');
    setEncryptedFileTime('');
    setDecryptedTextTime('');
    setDecryptedFileTime('');
  };

  const handleFileSignatureChange = (e) => {
    const file = e.target.files[0];
    setSignatureInput(file); 
    setDecryptedText('');
    setEncryptedText('');
    setEncryptedTextTime('');
    setEncryptedFileTime('');
    setDecryptedTextTime('');
    setDecryptedFileTime('');
  };

  const handleFileDecryptChange = (e) => {
    const file = e.target.files[0];
    setFileDecrypt(file); 
    setDecryptedText('');
    setEncryptedText('');
    setEncryptedTextTime('');
    setEncryptedFileTime('');
    setDecryptedTextTime('');
    setDecryptedFileTime('');
    const MAX_FILE_SIZE = 300 * 1024 * 1024;
    if (file && file.size > MAX_FILE_SIZE) {
      setIsValidFileDecrypt(false)
    } else{
      setIsValidFileDecrypt(true)
    }
  };

  const handleTextDecryptChange = (event) => {
    const inputValue = event.target.value
    setTextDecrypt(inputValue);
    setDecryptedText('');
    setEncryptedText('');
    setEncryptedTextTime('');
    setEncryptedFileTime('');
    setDecryptedTextTime('');
    setDecryptedFileTime('');
    if(inputValue.length > 100000 || inputValue.length === ''){
        setIsValidTextDecrypt(false)
    } else {
        setIsValidTextDecrypt(true)
    }
  };

  const handleDSAGenerateKeysClick = async () => {
    try {
       setLoadingKeys(true)
      // console.log('Selected Key Length:', keyLength);
      const response = await axios.post('http://127.0.0.1:5000/dsa_generate_keys', 
        { keySize: keyLength },
        { responseType: 'arraybuffer' }
      );
      const blob = new Blob([response.data], { type: 'application/zip' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'DSA_keys.zip';
      link.click();
    } catch (error) {
      console.error('Error generating keys:', error);
      setLoadingKeys(false);
    } finally {
    setLoadingKeys(false);
    }
  };

  const handlDSASigningClick = async () => {
    if (textEncrypt || !fileEncrypt) {
      try {
        setLoadingEncryption(true);
        const formData = new FormData();
        formData.append('private_key', publicKey);
        formData.append('text_sign', textEncrypt);
        const response = await axios.post('http://127.0.0.1:5000/dsa_sign_text', formData);
        console.log(response)
        const blob = new Blob([response.data]);
      console.log(response)
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      // link.download = 'sign_' + fileEncrypt.name;
      link.download = "signed_text.txt"
      // setLoadingEncryptionFile(true);
      link.click();
        // setEncryptedText(response.data.signed_text);
        // setEncryptedTextTime(response.data.encryption_time)
      } catch (error) {
        console.error('There was a problem with the Axios request:', error);
      } finally {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        setLoadingEncryption(false);
        
      }
    } else if (fileEncrypt) {
      try {
        setLoadingEncryptionFile(true);
        const formData = new FormData();
        formData.append('private_key', publicKey);
        formData.append('file_sign', fileEncrypt);
        const response = await axios.post('http://127.0.0.1:5000/dsa_sign_file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
      });

      const blob = new Blob([response.data]);
      console.log(response)
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      // link.download = 'sign_' + fileEncrypt.name;
      link.download = "signed_file.txt"
      setLoadingEncryptionFile(true);
      link.click();
      } catch (error) {
        console.error('There was a problem with the Axios request:', error);
      }
      finally {
        setLoadingEncryptionFile(false);
      }
    } else {
      console.error('No text or file selected');
    }
  };

  const handlDSAVerifySignatureClick = async () => {
    if (textDecrypt || !fileDecrypt) {
      try {
        setLoadingDecryption(true);
        const formData = new FormData();
        formData.append('public_key', privateKey);
        formData.append('signature', signatureInput);
        formData.append('text_sign', textDecrypt);
        const response = await axios.post('http://127.0.0.1:5000/dsa_verify_text', formData);
        setDecryptedText(response.data.res);
        // setDecryptedTextTime(response.data.decryption_time);
      } catch (error) {
        console.error('There was a problem with the Axios request:', error);
      } finally {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        setLoadingDecryption(false);
      }
    } else if (fileDecrypt) {
      try {
        setLoadingDecryption(true);
        const formData = new FormData();
        formData.append('public_key', privateKey);
        formData.append('signature', signatureInput);
        formData.append('file_sign', fileDecrypt);
        const response = await axios.post('http://127.0.0.1:5000/dsa_verify_file', formData);
        setDecryptedText(response.data.res);
      } catch (error) {
        console.error('There was a problem with the Axios request:', error);
      }
      finally {
        setLoadingDecryption(false);
      }
    } else {
      console.error('No text or file selected');
    }
  };


  return (
    <div className={css.generatorWrapper}>
      <div className={css.mainWrapper}>
        <h1 className={css.title}>DSA Key Generator</h1>
      <div className={css.generatorContent}>
        <div className={css.inputWrapperKey}>
            <div className={css.InpBox}>
             <div className={css.InpBoxSelectOne}>
              <label className={`${css.paramLabelSlect} ${css.label}`} htmlFor='keyEncrypt'>Key Length:</label>
              <div className={css.customSelect}>
                <select className={css.select} onChange={handleSelectKeyLengthChange}>
                    <option value="1024">1024</option>
                    <option value="2048">2048</option>
                    <option value="4096">4096</option>
                </select>
              </div>
              </div>
            <div className={css.InpBoxSelect}>
              <button  
                disabled={loadingKeys}
                className={`mt-[24px] w-[300px] flex-center generateButton  ${loadingKeys ? css.disabledButton : ""}`}
                onClick={handleDSAGenerateKeysClick}>
                  Generate keys
              </button>  
            </div>
            </div>
        </div>
      </div>
      <h1 className={css.title}>DSA Signing, Verify Signature</h1>
      <div className={css.generatorContent}>
        <div className={css.inputWrapper}>
          <p className={css.label}>Signing:</p>
            <div className={css.InpBox}>
              <label className={css.paramLabel} htmlFor='publicKey'>Private key:</label>
            <div>
                <div className={css.inpCl}>
                    <label className={`${css.uploadFile}`} htmlFor="publicKey">
                    <svg className={css.uploadFileButtonIcon} onClick={() => setPublicKey('')}>
                        <use className={css.icon} href={`/sprite.svg#icon-upload-file`}></use>
                    </svg> 
                  { !publicKey ? 'Select file' : 'Change file'}
                    <input className={css.help} 
                    required
                    type="file" 
                    id="publicKey" 
                    name="publicKey"
                    onChange={handleFilePublicKeyChange} 
                    />
                </label>  
                {publicKey && (
                <>
                <p className={css.selectedFile}> 
                  <svg 
                    className={css.cancelButtonIcon}
                    onClick={() => {
                      if (!loading){
                        setPublicKey('');
                        setEncryptedText('');
                        setEncryptedTextTime('');
                        setEncryptedFileTime('');
                      }                  
                    }}
                    >
                    <use className={css.icon} href={`/sprite.svg#icon-cancel`}></use>
                  </svg> 
                </p>
                </>
              )}
            </div>
              {publicKey && (
                <>
                <p className={css.selectedFile}
                    onClick={() => {
                      if (!loading){
                        setPublicKey('');
                        setEncryptedText('');
                        setEncryptedTextTime('');
                        setEncryptedFileTime('');
                      }                  
                    }}
                    >

                  Selected file: {publicKey.name}               
                </p>
                </>
              )}
              </div>
              </div>
            <div className={css.InpBox}>
              <label className={css.paramLabel} htmlFor='textEncrypt'>Text:</label>
              <div>
                <div className={css.inpCl}>
                <textarea className={`
                  ${css.input} 
                  ${fileEncrypt ? css.disabledInp : ''}
                  `} 
                  required
                  type="text" 
                  id="textEncrypt" 
                  name="textEncrypt"
                  value={textEncrypt} 
                  onChange={handleTextEncryptChange} 
                  onInput={(e) => {
                    e.target.style.height = '46px';  
                    e.target.style.height = e.target.scrollHeight + 2 + 'px'; 
                  }}
                  disabled={fileEncrypt}
                />
                {textEncrypt && (
                  <>
                  <p className={css.clearText} 
                    onClick={() => {
                      if (!loading){
                        setTextEncrypt('');
                        setEncryptedText('');
                        setEncryptedTextTime('');
                        setEncryptedFileTime('');
                      }      
                    }}
                  >
                    <svg className={css.cancelButtonIcon} >
                      <use className={css.icon} href={`/sprite.svg#icon-cancel`}></use>
                    </svg>          
                  </p>
                </>              
              )}
            </div>
              {textEncrypt && !isValidTextEncrypt && <p className={css.invalid}>Error! The maximum sequence length is 100000!</p>}     
            </div>
            </div>
            <div className={css.InpBox}>
              <label className={css.paramLabel} htmlFor='fileEncrypt'>File:</label>
            <div>
            <div className={css.inpCl}>
               <label className={`${css.uploadFile} 
                ${textEncrypt ? css.disabledUploadFile : ''}`}
                htmlFor="fileEncrypt">
                  <svg className={css.uploadFileButtonIcon} onClick={() => setFileEncrypt('')}>
                    <use className={css.icon} href={`/sprite.svg#icon-upload-file`}></use>
                  </svg> 
                  { !fileEncrypt ? 'Select file' : 'Change file'}
              <input className={css.help} 
                required
                type="file" 
                id="fileEncrypt" 
                name="fileEncrypt"
                onChange={handleFileEncryptChange} 
                disabled={textEncrypt}/>
              </label>  
              {fileEncrypt && (
                <>
                <p className={css.selectedFile}> 
                  <svg 
                    className={css.cancelButtonIcon}
                    onClick={() => {
                      if (!loading){
                        setFileEncrypt('');
                        setEncryptedText('');
                        setEncryptedTextTime('');
                        setEncryptedFileTime('');
                      }                  
                    }}
                    >
                    <use className={css.icon} href={`/sprite.svg#icon-cancel`}></use>
                  </svg> 
                </p>
                </>
              )}
            </div>
              {fileEncrypt && (
                <>
                <p className={css.selectedFile}
                    onClick={() => {
                      if (!loading){
                        setFileEncrypt('');
                        setEncryptedText('');
                        setEncryptedTextTime('');
                        setEncryptedFileTime('');
                      }                  
                    }}
                    >

                  Selected file: {fileEncrypt.name}               
                </p>
                {!isValidFileEncrypt && <p className={css.invalid}>Error! The maximum file size is 300MB!</p>}
                </>
              )}
              </div>
            </div>
            <div>
              <button  
                className={`mt-[14px] min-w-[332px] generateButton
                   ${((((!isValidTextEncrypt || textEncrypt === '' ) && (!fileEncrypt || !isValidFileEncrypt) ) || !publicKey) || loadingEncryption) ? css.disabledButton : ''} `}
                disabled={(((!isValidTextEncrypt || textEncrypt === '' )  && (!isValidFileEncrypt || !fileEncrypt)) || !publicKey) || loadingEncryption}
                onClick={handlDSASigningClick}>
                  Sign
              </button>
            </div>
        </div>
        <div className={`ml-[48px] ${css.inputWrapper}`}>
          <p className={css.label}>Verify Signature:</p>
            <div className={css.InpBox}>
              <label className={css.paramLabel} htmlFor='privateKey'>Public key:</label>
            <div>
                <div className={css.inpCl}>
                    <label className={`${css.uploadFile}`} htmlFor="privateKey">
                    <svg className={css.uploadFileButtonIcon} onClick={() => setPrivateKey('')}>
                        <use className={css.icon} href={`/sprite.svg#icon-upload-file`}></use>
                    </svg> 
                  { !privateKey ? 'Select file' : 'Change file'}
                    <input className={css.help} 
                    required
                    type="file" 
                    id="privateKey" 
                    name="privateKey"
                    onChange={handleFilePrivateKeyChange} 
                    />
                </label>  
                {privateKey && (
                <>
                <p className={css.selectedFile}> 
                  <svg 
                    className={css.cancelButtonIcon}
                    onClick={() => {
                      if (!loading){
                        setPrivateKey('')
                        setDecryptedText('')
                        setDecryptedTextTime('');
                      }                  
                    }}
                    >
                    <use className={css.icon} href={`/sprite.svg#icon-cancel`}></use>
                  </svg> 
                </p>
                </>
              )}
            </div>
              {privateKey && (
                <>
                <p className={css.selectedFile}
                    onClick={() => {
                      if (!loading){
                        setPrivateKey('')
                        setDecryptedText('')
                        setDecryptedTextTime('');
                      }                  
                    }}
                    >

                  Selected file: {privateKey.name}               
                </p>
                </>
              )}
              </div>
              </div>
              <div className={css.InpBox}>
              <label className={css.paramLabel} htmlFor='signatureInput'>Signature:</label>
            <div>
                <div className={css.inpCl}>
                    <label className={`${css.uploadFile}`} htmlFor="signatureInput">
                    <svg className={css.uploadFileButtonIcon} onClick={() => setSignatureInput('')}>
                        <use className={css.icon} href={`/sprite.svg#icon-upload-file`}></use>
                    </svg> 
                  { !signatureInput ? 'Select file' : 'Change file'}
                    <input className={css.help} 
                    required
                    type="file" 
                    id="signatureInput" 
                    name="signatureInput"
                    onChange={handleFileSignatureChange} 
                    />
                </label>  
                {signatureInput && (
                <>
                <p className={css.selectedFile}> 
                  <svg 
                    className={css.cancelButtonIcon}
                    onClick={() => {
                      if (!loading){
                        setSignatureInput('')
                        setDecryptedText('')
                        setDecryptedTextTime('');
                      }                  
                    }}
                    >
                    <use className={css.icon} href={`/sprite.svg#icon-cancel`}></use>
                  </svg> 
                </p>
                </>
              )}
            </div>
              {signatureInput && (
                <>
                <p className={css.selectedFile}
                    onClick={() => {
                      if (!loading){
                        setSignatureInput('')
                        setDecryptedText('')
                        setDecryptedTextTime('');
                      }                  
                    }}
                    >

                  Selected file: {signatureInput.name}               
                </p>
                </>
              )}
              </div>
              </div>
            <div className={css.InpBox}>
              <label className={css.paramLabel} htmlFor='textDecrypt'>Text:</label>
              <div>
                <div className={css.inpCl}>
                <textarea className={`
                  ${css.input} 
                  ${fileDecrypt ? css.disabledInp : ''}
                  `} 
                  required
                  type="text" 
                  id="textDecrypt" 
                  name="textDecrypt"
                  value={textDecrypt} 
                  onChange={handleTextDecryptChange} 
                  onInput={(e) => {
                    e.target.style.height = '46px';  
                    e.target.style.height = e.target.scrollHeight + 2 + 'px'; 
                  }}
                  disabled={fileDecrypt}
                />
                {textDecrypt && (
                  <>
                  <p className={css.clearText} 
                    onClick={() => {
                      if (!loading){
                        setTextDecrypt('');
                        setDecryptedText('')
                        setDecryptedTextTime('');
                      }      
                    }}
                  >
                    <svg className={css.cancelButtonIcon} >
                      <use className={css.icon} href={`/sprite.svg#icon-cancel`}></use>
                    </svg>          
                  </p>
                </>              
              )}
            </div>
              {textDecrypt && !isValidTextDecrypt && <p className={css.invalid}>Error! The maximum sequence length is 100000!</p>}     
            </div>
            </div>
            <div className={css.InpBox}>
              <label className={css.paramLabel} htmlFor='fileDecrypt'>File:</label>
            <div>
            <div className={css.inpCl}>
               <label className={`${css.uploadFile} 
                ${textDecrypt ? css.disabledUploadFile : ''}`}
                htmlFor="fileDecrypt">
                  <svg className={css.uploadFileButtonIcon} onClick={() => setFileDecrypt('')}>
                    <use className={css.icon} href={`/sprite.svg#icon-upload-file`}></use>
                  </svg> 
                  { !fileDecrypt ? 'Select file' : 'Change file'}
              <input className={css.help} 
                required
                type="file" 
                id="fileDecrypt" 
                name="fileDecrypt"
                onChange={handleFileDecryptChange} 
                disabled={textDecrypt}/>
              </label>  
              {fileDecrypt && (
                <>
                <p className={css.selectedFile}> 
                  <svg 
                    className={css.cancelButtonIcon}
                    onClick={() => {
                      if (!loading){
                        setFileDecrypt('')
                        setDecryptedText('')
                        setDecryptedTextTime('');
                        setDecryptedFileTime('');
                      }                  
                    }}
                    >
                    <use className={css.icon} href={`/sprite.svg#icon-cancel`}></use>
                  </svg> 
                </p>
                </>
              )}
            </div>
              {fileDecrypt && (
                <>
                <p className={css.selectedFile}
                    onClick={() => {
                      if (!loading){
                        setFileDecrypt('')
                        setDecryptedText('')
                        setDecryptedTextTime('');
                        setDecryptedFileTime('');
                      }                  
                    }}
                    >

                  Selected file: {fileDecrypt.name}               
                </p>
                {!isValidFileDecrypt && <p className={css.invalid}>Error! The maximum file size is 300MB!</p>}
                </>
              )}
              </div>
            </div>
            
            <div>
              <button  
                 className={`mt-[14px] min-w-[332px] generateButton
                 ${((((!isValidTextDecrypt || textDecrypt === '' ) && (!fileDecrypt || !isValidFileDecrypt) ) || !privateKey || !signatureInput) || loadingDecryption) ? css.disabledButton : ''} `}
              disabled={((((!isValidTextDecrypt || textDecrypt === '' ) && (!fileDecrypt || !isValidFileDecrypt) ) || !privateKey || !signatureInput) || loadingDecryption)}
                onClick={handlDSAVerifySignatureClick}>
                  Verify
              </button>
            </div>
        </div>
      </div>
      </div>
      {loadingKeys && <CustomAlert message="Generating DSA Keys..." success={true}/>}
      {loadingEncryption && <CustomAlert message="Loading..." success={true}/>}
      {loadingEncryptionFile && <CustomAlert message="Loading..." success={true}/>}
      {loadingDecryption && <CustomAlert message="Loading..." success={true}/>}
      {loading && <Loader/> }    
      {decryptedText.length !== 0 &&
      <>
      <div className='mt-[48px]'>
        <div className={css.DSARes}>
            <b className={css.label}>Verify Signature</b>
        <div className={css.resWrapperDSA}>
        <p className={css.resWrapperP}> 
            {' '}{decryptedText}
          </p>
        </div> 
        </div>
        
      </div>
      </>
      }
    </div>
  );
};


