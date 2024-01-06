// Your main component using ArticleForm
import React, {useState} from 'react';
import ArticleForm from '../components/ArticleForm';
import Success from '../components/Success'
import{ apiBaseUrl,MUTLIPART_BOUNDARY } from 'config'

const CreateArticlePage = () => {
    const [file,setFile] = useState(null)
    const [success,setSuccess] = useState(false)
    const [isPopupOpen, setPopupOpen] = useState(false);

   const popUpMessage = "Article créé avec succès"
  const openPopup = () => {
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  const handleFormSubmit = async (formData) => {
      console.log("FORMDATA:",formData)
    
    // Make an HTTP request to your server to create a new article using formData
    // You can use libraries like axios or fetch for making HTTP requests
    try {
        const fileData = new FormData();

        fileData.append('title', formData.title)
        fileData.append('author', formData.author)
        fileData.append('body', formData.body)
        fileData.append('filename', formData.filename);
        fileData.append('type',formData.type)
        fileData.append('content',formData.content)
    
    
        console.log("FILEDATA",fileData)
      const response = await fetch(apiBaseUrl+'/api/articles/create', {
        method: 'POST',
        body: fileData,
        headers: {
          'Content-Type': `multipart/form-data; boundary="${MUTLIPART_BOUNDARY}"`

        },
      })
           // .then(response => response.json().then(data => console.log(data)).catch(error => console.error("Error: ",error)))
      if (response.ok) {
          
        // Handle successful article creation
        console.log('Article created successfully');
          
                    setSuccess(true)
          openPopup()
      } else {
        // Handle error
        console.error('Error creating article');
      }
    } catch (error) {
      // Handle network error
      console.error('Network error:', error);
    }
  };

  return (
    <div>
      <h1>Create New Article</h1>
      <ArticleForm formTitle="Créer un article" onSubmit={handleFormSubmit} setFile={setFile} action="Créer"/>
      {isPopupOpen && <Success isOpen={isPopupOpen} onClose={closePopup} message={popUpMessage}/>}

    </div>
  );
};

export default CreateArticlePage;
