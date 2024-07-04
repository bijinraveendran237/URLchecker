import React, { useState, useEffect, useCallback } from 'react';
import { throttle } from 'lodash';

const Queryscreen = () => {
    const [url, setUrl] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [result, setResult] = useState(null);

  const validateUrl = (value) => {
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(value);
  };

  const checkUrlExists = async (url) => {
    // sample code to fetch data from url
    // try {
    //     const response = await fetch(url, {
    //       method: 'GET',
    //       headers: {
    //       }
    //     });
    //     if (!response.ok) {
    //       throw new Error('Network response was not ok');
    //     }
    //     const data = await response.json();
    // Mock server response based on simple heuristics
    return new Promise((resolve) => {
      setTimeout(() => {
        if (url.endsWith('/')) {
          resolve({ exists: true, type: 'folder' });
        } else if (url.match(/\.\w+$/)) {
          resolve({ exists: true, type: 'file' });
        } else {
          resolve({ exists: false, type: null });
        }
      }, 1000);
    });
  };

  const throttledCheck = useCallback(throttle(async (url) => {
    if (validateUrl(url)) {
      const result = await checkUrlExists(url);
      setResult(result);
    }
  }, 3000), []);

  useEffect(() => {
    if (validateUrl(url)) {
      setIsValid(true);
      throttledCheck(url);
    } else {
      setIsValid(false);
      setResult(null);
    }
  }, [url, throttledCheck]);

  return (
    <div>
      <input 
        type="text" 
        value={url} 
        onChange={(e) => setUrl(e.target.value)} 
        placeholder="Enter URL" 
      />
      {!isValid && url && <p>Invalid URL format</p>}
      {result && (
        <p>
          {result.exists ? `URL is a ${result.type}` : 'URL does not exist'}
        </p>
      )}
    </div>
  );
};

export default Queryscreen;