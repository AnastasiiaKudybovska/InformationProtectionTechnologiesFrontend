import React, { useState } from 'react';
import axios from 'axios';
import css from "./MD5.module.css";
import Link from 'next/link';
import Loader from '@/components/Loader/Loader';

export default function MD5() {
  const [stringForHash, setStringForHash] = useState("");
  const [resHash, setResHash] = useState("");
  const [resHashInp, setResHashInp] = useState("");
  const [isValidText, setIsValidText] = useState(true);
  const [isValidFile, setIsValidFile] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [userHash, setUserHash] = useState("");
  const [isValidUserHash, setIsValidUserHash] = useState(true);
  const [checkHash, setCheckHash] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingCheck, setLoadingCheck] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleStringForHashChange = (event) => {
    const inputValue = event.target.value
    setStringForHash(inputValue);
    setResHash('');
    if(inputValue.length > 100000){
      setIsValidText(false)
    } else {
      setIsValidText(true)
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file); 
    setResHash('');
    const MAX_FILE_SIZE = 300 * 1024 * 1024;
    if (file && file.size > MAX_FILE_SIZE) {
      setIsValidFile(false)
    } else{
      setIsValidFile(true)
    }
  };
  
  const handleUserHashChange = (event) => {
    const inputValue = event.target.value
    setUserHash(inputValue);
    setResHash('');
    if(inputValue.length > 32){
      setIsValidUserHash(false)
    } else {
      setIsValidUserHash(true)
    }
  };


 const handleMD5Click = async () => {
    setCheckHash('');
    if (stringForHash || !selectedFile) {
      try {
        setLoading(true);
        const response = await axios.post('http://127.0.0.1:5000/md5_hash', {
          s: stringForHash
        });
        setResHash(response.data);
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
        formData.append('input_file', selectedFile);
        const response = await axios.post('http://127.0.0.1:5000/md5_hash_file', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setResHash(response.data);
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

  const handleMD5CheckClick = async () => {
    setResHash('');
    setCheckHash('');
    if (stringForHash || !selectedFile) {
      try {
        setLoadingCheck(true);
        const response = await axios.post('http://127.0.0.1:5000/check_hash', {
          s: stringForHash, 
          hash_check: userHash
        });
        setCheckHash(response.data);
        if (!stringForHash) setResHashInp('epmty_text');
        else {setResHashInp('text');}
      } catch (error) {
        console.error('There was a problem with the Axios request:', error);
      } finally {
        setLoadingCheck(false);
      }
    } else if (selectedFile) {
      try {
        setLoadingCheck(true);
        const formData = new FormData();
        formData.append('input_file', selectedFile);
        formData.append('hash_check', userHash)
        const response = await axios.post('http://127.0.0.1:5000/check_hash_file',  {
          input_file: selectedFile, 
          hash_check: userHash
        }, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setCheckHash(response.data);
        setResHashInp('file');
      } catch (error) {
        console.error('There was a problem with the Axios request:', error);
      }
      finally {
        setLoadingCheck(false);
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
              <h1 className={css.title}>MD5 Hash Generator</h1>
      <div className={css.generatorContent}>
        <div className={css.inputWrapper}>
          <label className={css.label} htmlFor="stringForHash">Text:</label>
          <div>
          <textarea className={`
            ${css.input} 
            ${selectedFile ? css.disabledInp : ''}
           `} 
            required
            type="text" 
            id="stringForHash" 
            name="stringForHash"
            value={stringForHash} 
           // placeholder='Hello world!'
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
                      setResHash('')
                    }      
                  }}
                  >
                  <svg className={css.cancelButtonIcon} >
                    <use className={css.icon} href={`/sprite.svg#icon-cancel`}></use>
                  </svg> 
                  Clear text          
                </p>
                {!isValidText && <p className={css.invalid}>Error! The maximum sequence lenght is 100000!</p>}
                </>              
              )}
             
            </div>
        </div>
        <div className={`ml-[48px] ${css.inputWrapper}`}>
          <p className={css.label} >File:</p> 
          <div>
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
                        setResHash('')
                      }                  
                    }}
                    >
                    <use className={css.icon} href={`/sprite.svg#icon-cancel`}></use>
                  </svg> 
                  Selected file: {selectedFile.name}               
                </p>
                {!isValidFile && <p className={css.invalid}>Error! The maximum file size is 300MB!</p>}
                </>
              )}
          </div>          
        </div>
      <div>
    </div>
        {/* {!isValid && <p className={css.invalid}>Invalid input! The sequence lenght can only contain positive numbers!</p>} */}
        {/* {isMaxNum && <p className={css.invalid}>Invalid input! The maximum sequence lenght is 100000!</p>} */}
      </div>
      </div>

      <div className={`${css.buttonsContainer} ${!resHash ? css.centerCont : ''}`}>
          
        <button  
          className="min-w-[332px] generateButton"
          disabled={!isValidText || !isValidFile}
          onClick={handleMD5Click}>
          Hash
        </button>
          {resHash.length !== 0 &&
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
       
        
      </div>
      {loading && <Loader/> }
      {resHash.length !== 0 &&
        <div className={css.hashWrapper}>
          <p>
            {/* <b>MD5 Hash:</b> */}
            {resHashInp === 'epmty_text' ? <b>MD5 Hash of Empty String:</b> : <b>MD5 Hash:</b>}
            {' '}{resHash}
          </p>
        </div>  
      }
      <div className={`${css.buttonsContainer} ${!resHash ? css.centerCont : ''}`}>
        <div>
          <input className={`
            ${css.inpHash}
            ${css.input} 
            ${selectedFile ? css.disabledInp : ''}
           `} 
            required
            type="text" 
            id="user_hash" 
            name="user_hash"
            value={userHash} 
            placeholder='hash'
            onChange={handleUserHashChange} 
            disabled={!selectedFile && !stringForHash}
            />
            {!isValidUserHash && <p className={css.invalid}>Error! Invalid hash!</p>}
        </div>
          <button  
            className={`min-w-[332px] generateButton ${css.checkButt}`}
            disabled={!userHash && (!stringForHash || !selectedFile)}
            onClick={handleMD5CheckClick}>
            Check Hash
          </button>
        </div>
      <>
      {loadingCheck && <Loader/> }
      {checkHash.length !== 0 &&
        <div className={css.hashWrapper}>
          <p className={css.check}><b>
            {checkHash}
          </b>           
          </p>
        </div>  
      }
      </>  
    </div>
  );
};


