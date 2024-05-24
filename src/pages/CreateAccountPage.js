// Your main component using ArticleForm
import React, {useState} from 'react';
import SubscribeForm from '../components/SubscribeForm';
import PopUp from '../components/PopUp'
import{ apiBaseUrl,MUTLIPART_BOUNDARY } from '../config'
import {usePopup} from '../utils';
import {useNavigate} from 'react-router-dom';

const CreateAccountPage = () => {
    const [file,setFile] = useState(null)
    const [success,setSuccess] = useState(false)
    // const [isPopupOpen, setPopupOpen] = useState(false);
    const navigate = useNavigate()
    const {isPopupOpen, popUpType, popUpMessage, configurePopup }= usePopup();
   // const popUpMessage = "Compte créé avec succès"
  
  const closePopup = () => {
      configurePopup(false,"","")
      if (popUpType === 'success'){
      navigate('/')

      }
   };


  const handleFormSubmit = async (formData) => {
      console.log("FORMDATA:",formData)
    
    // Make an HTTP request to your server to create a new article using formData
    // You can use libraries like axios or fetch for making HTTP requests
    try {
        const fileData = new FormData();

        fileData.append('username', formData.username)
        fileData.append('password', formData.password)
        fileData.append('email', formData.email)
        fileData.append('quote', formData.quote)
        fileData.append('filename', formData.file.name);
        fileData.append('type',formData.file.type)
        fileData.append('content',formData.content)
    
    
        // console.log("FILEDATA",fileData)
      const response = await fetch(apiBaseUrl+'/api/subscribe', {
        method: 'POST',
        body: fileData,
        headers: {
          'Content-Type': `multipart/form-data; boundary="${MUTLIPART_BOUNDARY}"`

        },
      })
        const data = await response.json();
        console.log("data:",data)
           // .then(response => response.json().then(data => console.log(data)).catch(error => console.error("Error: ",error)))
      if (response.ok) {
          
        // Handle successful article creation
        console.log('Account created successfully');
          
                    setSuccess(true)
          configurePopup(true,"success",`Bienvenue sur ta plateforme ${data.userData.username}`)
      } else {

        // Handle error
        console.error('Error creating account');
      }
    } catch (error) {
          configurePopup(true,"failure",`cannot create account due to ${error}`)
      // Handle network error
      console.error('Network error:', error);
    }
  };

  return (
    <div>
      <SubscribeForm formTitle="Créer un Compte" onSubmit={handleFormSubmit} setFile={setFile} action="Créer"/>
      {isPopupOpen && <PopUp isOpen={isPopupOpen} onClose={closePopup} type={popUpType} message={popUpMessage}/>}

    </div>
  );
};

export default CreateAccountPage;
