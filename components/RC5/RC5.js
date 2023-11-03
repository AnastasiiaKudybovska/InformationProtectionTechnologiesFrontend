import React, { useState } from 'react';
import axios from 'axios';
import css from "./RC5.module.css";
import Link from 'next/link';
import Loader from '@/components/Loader/Loader';

export default function RC5() {
  const [keyEncrypt, setKeyEncrypt] = useState("");
  const [stringForHash, setStringForHash] = useState("");  
  const [isValidText, setIsValidText] = useState(true);
  const [isValidFile, setIsValidFile] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);

  const [keyDecrypt, setKeyDecrypt] = useState("");
  const [stringForDecrypt, setStringForDecrypt] = useState("");  
  const [isValidDecryptText, setIsValidDecryptText] = useState(true);
  const [isValidDecryptFile, setIsValidDecryptFile] = useState(true);
  const [selectedDecryptFile, setSelectedDecryptFile] = useState(null);
  
  const [result, setResult] = useState("");


  const [resHashInp, setResHashInp] = useState("");

  const [userHash, setUserHash] = useState("");
  const [checkHash, setCheckHash] = useState("");


  const [loading, setLoading] = useState(false);
  const [loadingCheck, setLoadingCheck] = useState(false);
  const [downloaded, setDownloaded] = useState(false);


  const handlekeyEncryptChange = (event) => {
    const inputValue = event.target.value
    setKeyEncrypt(inputValue);
    setResult('');
  };
  const handlekeyDecryptChange = (event) => {
    const inputValue = event.target.value
    setKeyDecrypt(inputValue);
    setResult('');
  };

  const handleStringForHashChange = (event) => {
    const inputValue = event.target.value
    setStringForHash(inputValue);
    setResult('');
    if(inputValue.length > 100000){
      setIsValidText(false)
    } else {
      setIsValidText(true)
    }
  };
  const handleStringForDecryptChange = (event) => {
    const inputValue = event.target.value
    setStringForDecrypt(inputValue);
    setResult('');
    if(inputValue.length > 100000){
      setIsValidDecryptText(false)
    } else {
      setIsValidDecryptText(true)
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file); 
    setResult('');
    const MAX_FILE_SIZE = 300 * 1024 * 1024;
    if (file && file.size > MAX_FILE_SIZE) {
      setIsValidFile(false)
    } else{
      setIsValidFile(true)
    }
  };
  const handleDecryptFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedDecryptFile(file); 
    setResult('');
    const MAX_FILE_SIZE = 300 * 1024 * 1024;
    if (file && file.size > MAX_FILE_SIZE) {
      setIsValidDecryptFile(false)
    } else{
      setIsValidDecryptFile(true)
    }
  };

 const handlRC5EncryptClick = async () => {
    setCheckHash('');
    if (stringForHash || !selectedFile) {
      try {
        setLoading(true);
        const response = await axios.post('http://127.0.0.1:5000/rc5_encode_text', {
          key: keyEncrypt,
          text: stringForHash
        });
        // console.log((response.data))
        setResult(response.data);
        if (!stringForHash) setResHashInp('epmty_text');
        else {setResHashInp('text');}
      } catch (error) {
        console.error('There was a problem with the Axios request:', error);
      } finally {
        setLoading(false);
      }
    } else if (selectedFile) {
      try {
      
        setLoading(true);
        const formData = new FormData();
        formData.append('key', keyEncrypt);
        formData.append('selected_file', selectedFile);

        axios.post('http://127.0.0.1:5000/rc5_encode_file', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          responseType: 'blob' 
        }).then(response => {
          console.log(response)

          const url = window.URL.createObjectURL(new Blob([response.data]));
  
          const link = document.createElement('a');
          link.href = url;
        
          const parts = selectedFile.name.split('.');
          link.setAttribute('download', 'code_' + selectedFile.name);
          
          document.body.appendChild(link);
          link.click();
          window.URL.revokeObjectURL(url);
        });
        setResHashInp('file');
      } catch (error) {
        console.error('There was a problem with the Axios request:', error);
      }
      finally {
        setLoading(false);
      }
    } else {
      console.error('No text or file selected');
    }
  };


  const handlRC5DecryptClick = async () => {
    if (stringForDecrypt || !selectedDecryptFile) {
      try {
        setLoading(true);
        const response = await axios.post('http://127.0.0.1:5000/rc5_decode_text', {
          key: keyDecrypt,
          text: stringForDecrypt
        });
        // console.log((response.data))
        setResult(response.data);
      } catch (error) {
        console.error('There was a problem with the Axios request:', error);
      } finally {
        setLoading(false);
      }
    } else if (selectedDecryptFile) {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append('key', keyDecrypt);
        formData.append('selected_file', selectedDecryptFile);

        const response = await axios.post('http://127.0.0.1:5000/rc5_decode_file', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          responseType: 'blob' 
        });
    

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        
        link.setAttribute('download', 'encode_' + selectedDecryptFile.name);
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        
        // setResult(response.data);
        setResHashInp('file');
      } catch (error) {
        console.error('There was a problem with the Axios request:', error);
      }
      finally {
        setLoading(false);
      }
    } else {
      console.error('No text or file selected');
    }
  };


  const handleDownloadClick = () => {
    setDownloaded(true);
    setTimeout(() => {
      setDownloaded(false);
    }, 5000); 
  };


  return (
    <div className={css.generatorWrapper}>
      <div className={css.mainWrapper}>
        <h1 className={css.title}>RC5 Encryption and Decryption</h1>
      <div className={css.generatorContent}>
        <div className={css.inputWrapper}>
          <p className={css.label}>Encryption:</p>
            <div className={css.InpBox}>
              <label className={css.paramLabel} htmlFor='keyEncrypt'>Key:</label>
              <textarea className={`
                ${css.input} 
                ${selectedFile ? css.disabledInp : ''}
              `} 
                required
                type="text" 
                id="keyEncrypt" 
                name="keyEncrypt"
                value={keyEncrypt} 
                // placeholder='Key for encryption'
                onChange={handlekeyEncryptChange} 
                onInput={(e) => {
                  e.target.style.height = '46px';  
                  e.target.style.height = e.target.scrollHeight + 2 + 'px'; 
                }}
              />
            </div>
            <div className={css.InpBox}>
              <label className={css.paramLabel} htmlFor='stringForHash'>Text:</label>
              <div>
                <div className={css.inpCl}>
                <textarea className={`
                  ${css.input} 
                  ${selectedFile ? css.disabledInp : ''}
                  `} 
                  required
                  type="text" 
                  id="stringForHash" 
                  name="stringForHash"
                  value={stringForHash} 
                  // placeholder='String for encryption'
                  onChange={handleStringForHashChange} 
                  onInput={(e) => {
                    e.target.style.height = '46px';  
                    e.target.style.height = e.target.scrollHeight + 2 + 'px'; 
                  }}
                  disabled={selectedFile}
                />
                {stringForHash && (
                  <>
                  <p className={css.clearText} 
                    onClick={() => {
                      if (!loading){
                        setStringForHash('');
                        setResult('')
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
              {stringForHash && !isValidText && <p className={css.invalid}>Error! The maximum sequence lenght is 100000!</p>}     
            </div>
            </div>
            <div className={css.InpBox}>
              <label className={css.paramLabel} htmlFor='fileForHash'>File:</label>
              <div>
            <div className={css.inpCl}>
               <label className={`${css.uploadFile} 
                ${stringForHash ? css.disabledUploadFile : ''}`}
                htmlFor="fileForHash">
                  <svg className={css.uploadFileButtonIcon} onClick={() => setSelectedFile('')}>
                    <use className={css.icon} href={`/sprite.svg#icon-upload-file`}></use>
                  </svg> 
                  { !selectedFile ? 'Select file' : 'Change file'}
              <input className={css.help} 
                required
                type="file" 
                id="fileForHash" 
                name="fileForHash"
                onChange={handleFileChange} 
                disabled={stringForHash}/>
              </label>  
              {selectedFile && (
                <>
                <p className={css.selectedFile}> 
                  <svg 
                    className={css.cancelButtonIcon}
                    onClick={() => {
                      if (!loading){
                        setSelectedFile('')
                        setResult('')
                      }                  
                    }}
                    >
                    <use className={css.icon} href={`/sprite.svg#icon-cancel`}></use>
                  </svg> 
                </p>
                </>
              )}
            </div>
              {selectedFile && (
                <>
                <p className={css.selectedFile}
                    onClick={() => {
                      if (!loading){
                        setSelectedFile('')
                        setResult('')
                      }                  
                    }}
                    >

                  Selected file: {selectedFile.name}               
                </p>
                {!isValidFile && <p className={css.invalid}>Error! The maximum file size is 300MB!</p>}
                </>
              )}
              </div>
            </div>
            <div>
              <button  
                className="mt-[14px] min-w-[332px] generateButton"
                disabled={!isValidText || !isValidFile }
                onClick={handlRC5EncryptClick}>
                  Encrypt
              </button>
            </div>

           
 
        </div>
        <div className={`ml-[48px] ${css.inputWrapper}`}>
          <p className={css.label} >Decryption:</p> 
            <div className={css.InpBox}>
              <label className={css.paramLabel} htmlFor='keyDecrypt'>Key:</label>
              <textarea className={`
                ${css.input} 
                ${selectedDecryptFile ? css.disabledInp : ''}
              `} 
                required
                type="text" 
                id="keyDecrypt" 
                name="keyDecrypt"
                value={keyDecrypt} 
                // placeholder='Key for decryption'
                onChange={handlekeyDecryptChange} 
                onInput={(e) => {
                  e.target.style.height = '46px';  
                  e.target.style.height = e.target.scrollHeight + 2 + 'px'; 
                }}
              />
            </div>
            <div className={css.InpBox}>
              <label className={css.paramLabel} htmlFor='stringForDecrypt'>Crypted Text:</label>
              <div>
                <div className={css.inpCl}>
                <textarea className={`
                  ${css.input} 
                  ${selectedFile ? css.disabledInp : ''}
                  `} 
                  required
                  type="text" 
                  id="stringForDecrypt" 
                  name="stringForDecrypt"
                  value={stringForDecrypt} 
                  // placeholder='String for decryption'
                  onChange={handleStringForDecryptChange} 
                  onInput={(e) => {
                    e.target.style.height = '46px';  
                    e.target.style.height = e.target.scrollHeight + 2 + 'px'; 
                  }}
                  disabled={selectedDecryptFile}
                />
                {stringForDecrypt && (
                  <>
                  <p className={css.clearText} 
                    onClick={() => {
                      if (!loading){
                        setStringForDecrypt('');
                        setResult('')
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
              {stringForDecrypt && !isValidDecryptText && <p className={css.invalid}>Error! The maximum sequence lenght is 100000!</p>}     
            </div>
            </div>
            <div className={css.InpBox}>
              <label className={css.paramLabel} htmlFor='fileForDecrypt'>File:</label>
              <div>
            <div className={css.inpCl}>
               <label className={`${css.uploadFile} 
                ${stringForDecrypt ? css.disabledUploadFile : ''}`}
                htmlFor="fileForDecrypt">
                  <svg className={css.uploadFileButtonIcon} onClick={() => setSelectedDecryptFile('')}>
                    <use className={css.icon} href={`/sprite.svg#icon-upload-file`}></use>
                  </svg> 
                  { !selectedDecryptFile ? 'Select file' : 'Change file'}
              <input className={css.help} 
                required
                type="file" 
                id="fileForDecrypt" 
                name="fileForDecrypt"
                onChange={handleDecryptFileChange} 
                disabled={stringForDecrypt}/>
              </label>  
              {selectedDecryptFile && (
                <>
                <p className={css.selectedFile}> 
                  <svg 
                    className={css.cancelButtonIcon}
                    onClick={() => {
                      if (!loading){
                        setSelectedDecryptFile('')
                        setResult('')
                      }                  
                    }}
                    >
                    <use className={css.icon} href={`/sprite.svg#icon-cancel`}></use>
                  </svg> 
                </p>
                </>
              )}
            </div>
              {selectedDecryptFile && (
                <>
                <p className={css.selectedFile}
                    onClick={() => {
                      if (!loading){
                        setSelectedDecryptFile('')
                        setResult('')
                      }                  
                    }}
                    >

                  Selected file: {selectedDecryptFile.name}               
                </p>
                {!isValidDecryptFile && <p className={css.invalid}>Error! The maximum file size is 300MB!</p>}
                </>
              )}
              </div>
            </div>
            <div>
              <button  
                className="mt-[14px] min-w-[332px] generateButton"
                disabled={!isValidDecryptText || !isValidDecryptFile }
                onClick={handlRC5DecryptClick}>
                  Decrypt
              </button>
            </div>      
        </div>
      <div>
    </div>
        {/* {!isValid && <p className={css.invalid}>Invalid input! The sequence lenght can only contain positive numbers!</p>} */}
        {/* {isMaxNum && <p className={css.invalid}>Invalid input! The maximum sequence lenght is 100000!</p>} */}
      </div>
      </div>

      {/* <div className={`${css.buttonsContainer} ${!result ? css.centerCont : ''}`}>
          
        
          {result.length !== 0 &&
          <Link 
              href="http://127.0.0.1:5000/download_file_with_hash"
              className={`min-w-[332px] ${css.downoloadButton}`}
              onClick={handleDownloadClick}
              disabled={downloaded}
              >
              {!downloaded && 
              <svg className={css.downoloadButtonIcon}>
                <use className={css.icon} href={`/sprite.svg#icon-download`}></use>
               </svg>
               }
              <span className={css.downoloadButtonText}> {downloaded ? "File downloaded" : "Download MD5 hash"}</span>    
          </Link> 
        }
       
        
      </div> */}
      {loading && <Loader/> }
      {result.length !== 0 &&
      <div className='mt-[48px]'>
        <b className={css.label}>Result:</b>
        <div className={css.resWrapper}>
          
          <p> 
            {' '}{result}
          </p>
        </div>  
      </div>
      }
    </div>
  );
};


