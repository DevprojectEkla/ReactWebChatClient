import { useState } from 'react';
export const setSrcImg = (dataFile, type) => {
    // console.log(`setting src attribute with data: ${dataFile} and type ${type}`)
    const binaryBuffer = new Uint8Array(dataFile);
    const blob = new Blob([binaryBuffer], { type: type });
    const dataUrl = URL.createObjectURL(blob);
    return dataUrl;
  };
export  const binaryStringToBytesArray = (binaryString) => {
    const bytesArray = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      bytesArray[i] = binaryString.charCodeAt(i);
    }

    return bytesArray;
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

