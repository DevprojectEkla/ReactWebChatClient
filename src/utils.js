import { useState } from 'react';
import { apiBaseUrl, MUTLIPART_BOUNDARY } from './config';

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const login = async (email, password) => {
  let data = {
    email: email,
    password: password,
  };
  let response = await fetch(apiBaseUrl + '/api/login', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-type': 'application/json' },
  });
  if (response.status === 404 || response.status === 500) {
    console.error('login failed due to:', response.statusText);
  } else {
  }
};

export const setSrcImg = (dataFile, type) => {
  // console.log(`setting src attribute with data: ${dataFile} and type ${type}`)
  const binaryBuffer = new Uint8Array(dataFile);
  const blob = new Blob([binaryBuffer], { type: type });
  const dataUrl = URL.createObjectURL(blob);
  return dataUrl;
};
export const binaryStringToBytesArray = (binaryString) => {
  const bytesArray = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytesArray[i] = binaryString.charCodeAt(i);
  }

  return bytesArray;
};

export const headers = {
  multipart: {
    'Content-type': `multipart/form-data; boundary="${MUTLIPART_BOUNDARY}"`,
  },
  json: { 'Content-type': 'application/json' },
};
export const setRequest = (method, data, headers) => {
  return {
    method: method,
    body: data,
    headers: headers,
  };
};
export const usePopup = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [popUpType, setPopUpType] = useState('success');
  const [popUpMessage, setPopUpMessage] = useState('');

  const configurePopup = (showPopUp, type, message) => {
    setPopupOpen(showPopUp);
    setPopUpType(type);
    setPopUpMessage(message);
  };

  return {
    isPopupOpen,
    popUpType,
    popUpMessage,
    configurePopup,
  };
};
