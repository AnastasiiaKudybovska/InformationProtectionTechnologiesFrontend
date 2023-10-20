import React, { useState } from 'react';
import axios from 'axios';
import css from "./LinearCongruentialGenerator.module.css";
import Link from 'next/link';
import Loader from '@/components/Loader/Loader';

export default function LinearCongruentialGenerator() {
  const [sequenceLength, setSequenceLength] = useState(null);
  const [randNumbers, setRandNumbers] = useState([]);
  const [period, setPeriod] = useState(null);
  const [showGeneratorParam, setShowGeneratorParam] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [isMaxNum, setIsMaxNum] = useState(false);
  const [showDetailPeriod, setShowDetailPeriod] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

 const handleSequenceLenghtChange = (event) => {
    const inputValue = event.target.value
    setSequenceLength(inputValue);
    const isValidInput = /^[0-9]*$/.test(inputValue);
    setIsValid(isValidInput);
    if(inputValue > 100000){
      setIsMaxNum(true)
    }
  };

  const handleGenerateRandomSequence = async () => {
    if (sequenceLength){
    try {
      setLoading(true);
      const response = await axios.post('http://127.0.0.1:5000/generate_pseudo_random_sequence',
        {
          n:sequenceLength
        }
      );
      setShowDetailPeriod(false)
      setRandNumbers(response.data);
      getPeriod();
      console.log(response.data);
    } catch (error) {
      console.error('There was a problem with the Axios request:', error);
    } finally {
      setLoading(false);
    }
  }
  };

  const getPeriod = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/get_period_of_generated_pseudo_random_sequence');
      if (response.data.error) {
        console.error(`Server returned error code ${response.data.error.code}: ${response.data.error.message}`);
      } else if (response.data.period) {
        setPeriod(response.data.period);
      } else {
        console.error('Unknown response format');
      }
    } catch (error) {
      console.error('There was a problem with the Axios request:', error);
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
      <h1 className={css.title}
        onClick={() => {setShowGeneratorParam((prev) => !prev)}}
      >Linear Congruential Pseudorandom Number Generator</h1>
      <div className={css.generatorContent}>
        <label className={css.label} htmlFor="sequenceLength">Sequence length:</label>
        <input className={`${css.input} ${isValid ? '' : css.invalid}`} 
            required
            type="text" 
            id="sequenceLength" 
            name="sequenceLength"
            pattern="[0-9]*" 
            // value={sequenceLength} 
            placeholder='0'
            onChange={handleSequenceLenghtChange} />
        {!isValid && <p className={css.invalid}>Invalid input! The sequence lenght can only contain positive numbers!</p>}
        {isMaxNum && <p className={css.invalid}>Invalid input! The maximum sequence lenght is 100000!</p>}
      </div>
      <div className={css.buttonsContainer}>
        <button  
          disabled={!isValid || isMaxNum}
          className={`generateButton ${css.generateButton}`} 
          onClick={handleGenerateRandomSequence}>
          Generate Sequence
        </button>
        {randNumbers.length !== 0 &&
          <Link 
              href="http://127.0.0.1:5000/write_to_file_generated_pseudo_random_sequence"
              className={css.downoloadButton}
              onClick={handleDownloadClick}
              disabled={downloaded}
              >
              {!downloaded && 
              <svg className={css.downoloadButtonIcon}>
                <use className={css.icon} href={`/sprite.svg#icon-download`}></use>
               </svg>
               }
              <span className={css.downoloadButtonText}> {downloaded ? "File downloaded" : "Download file"}</span>    
            </Link> 
        }
      </div>
      {loading ? <Loader/> : <>
      {randNumbers.length !== 0 &&
          <div className={css.generatedSequenceWrapper}>
          {period !== -1 &&
            <div className='flex items-center'
                onClick={() => {setShowDetailPeriod((prev) => !prev)}}>
              <p className={css.generatedSequenceTitle} >
               <svg className={css.detailsIcon}>
                <use href={`/sprite.svg#icon-details`}></use>
               </svg>
                Period :</p>
              <span>{period}</span>
            </div>
          }
          {showDetailPeriod &&
            <div className={css.generatedSequenceNumWrapperPeriod}>  
             {/* <p>{randNumbers.join(', ')}</p>  */}
             <div className={css.detailPeriodWrapper}>
              <div className={css.detailPeriodBox}> 
                {randNumbers.slice(0, 10).map((number, index) => (
                   <p key={index}
                     className={`${index < 5 ? css.activeNum : ''}`}>
                     <span>{index + 1} : {number}</span>
                      {index !== 9 && ', '}
                  </p>
                ))}
              </div>
              <div className={css.detailPeriodBox}> 
                {randNumbers.slice(period - 3, period + 7).map((number, index) => (
                   <p key={index}
                      className={`${index > 2 && index < 8 ? css.activeNum : ''}`}>
                     <span>{index + period - 3 + 1} : {number}</span>
                      {index !== 9 && ', '}
                  </p>
                ))}
              </div>
             </div>         
           </div>
          }
          <h2 className={css.generatedSequenceHeader}>Generated Pseudorandom Sequence:</h2>
          <div className={css.generatedSequenceNumWrapper}>  
            {/* <p>{randNumbers.join(', ')}</p>  */}
            <p> {randNumbers.map((number, index) => (
                <span key={index}>
                  <span>{number}</span>
                  {index !== randNumbers.length - 1 && ', '}
                </span>
              ))}
            </p>
          </div>

          {/* <pre>{JSON.stringify(randNumbers, null, 2)}</pre> */}
        </div>
      }</>}
      {/* {showGeneratorParam && <p></p>} */}
    </div>
  );
};


