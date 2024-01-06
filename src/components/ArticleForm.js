import {useState, useEffect} from "react"
import {Link} from 'react-router-dom'
import {Button} from "./Button";
import DynamicImageComponent from "./DynamicImageComponent";

const ArticleForm = ({formTitle, onSubmit, action,article}) => {
    const [date,setDate] = useState("")
    const [title,setTitle] = useState("");
    const [fileInput,setFileInput] = useState(null);
    const [file,setFile] = useState(null)
    const [content,setContent] = useState("");
    const [author,setAuthor] = useState("");
    const [body,setBody] = useState("");
    const [type,setType] = useState("");
    const [filename,setFileName] = useState("");
    const [isSet, setIsSet] = useState(false);

    const [titleError,setTitleError] = useState("");
    const [authorError,setAuthorError] = useState("");
    const [dateError,setDateError] = useState("");

    useEffect(() => {
        if (article && !isSet) {
            

            setTitle(article.title);
            setDate(article.date);
            setBody(article.body)
            setFileInput(article.file)
            setFileName(article.file.fileName)
            setType(article.file.mimeType)
            setAuthor(article.author)
            setContent(article.file.content)
            setFile(article.file)
            setIsSet(true)
            
        }
    },[article,title,date,body,file,filename,type,author,isSet,setFile])
    const handleSubmit = (e) => {
    e.preventDefault();

    if (!title) {
      setTitleError('Title is required');
      return;
    }

    if (!author) {
      setAuthorError('Author is required');
      return;
    }

    // Assuming onSubmit is a function passed as a prop to handle form submission
    onSubmit({ title, author, body, content, type, filename});
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);

    if (e.target.value.length > 100) {
      setTitleError('Title must not exceed 100 characters');
    } else {
      setTitleError('');
    }
  };
        // let decoder = new TextDecoder("utf-8");
    const handleFileChange = (e) => {
        const fileInput = e.target.files[0]
        setFileInput(fileInput)
        setFile(fileInput);
        setFileName(fileInput.name)
        setType(fileInput.type)
        // console.log('filename',fileInput.name)
        // console.log('type',fileInput.type)
    // console.log("Input File",fileInput)
const reader = new FileReader();
        reader.onload = (event) => {const fileContent = event.target.result;
            // console.log("File Content",fileContent)
        // let decodedContent = decoder.decode(fileContent);
// let        encoder = new TextEncoder()
// let        encoded =encoder.encode(fileContent)
let        encoded =btoa(fileContent)
        // console.log(encoded)
    setContent(encoded)
        }
        reader.readAsBinaryString(fileInput)

    }


  const handleAuthorChange = (e) => {
    setAuthor(e.target.value);

    if (e.target.value.length > 50) {
      setAuthorError('Author name must not exceed 50 characters');
    } else {
      setAuthorError('');
    }
  };

    return( 
        <div className="formContainer">
        <div className="inputLabelContainer">

        <h1>{formTitle}
        </h1>
        </div>

        <form  encType="application/json" onSubmit={handleSubmit}>
        <div className="inputLabelContainer">
      <label>
        Titre :
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          onBlur={handleTitleChange}
        />
        {titleError && <span style={{ color: 'red' }}>{titleError}</span>}
      </label>

      <br />
        </div>
        <div className="inputLabelContainer">
      <label>
        Auteur:
        <input
          type="text"
          value={author}
          onChange={handleAuthorChange}
          onBlur={handleAuthorChange}
        />
        {authorError && <span style={{ color: 'red' }}>{authorError}</span>}
      </label>
      <br />
        </div>

        <div className="inputLabelContainer">
      <label>
       Corps de l'article:
        <textarea value={body} onChange={(e) => setBody(e.target.value)} />
      </label>

        <br />
        </div>
        <div className="inputLabelContainer">
        <label>
        sélectionnez une image pour l'article :

          <input id="file"  type="file" onInput={handleFileChange} name={filename} accept="image/*" />
        </label>
      <br />
        
        </div>
        <div className="inputLabelContainer">
        {fileInput && <label>
       Image sélectionnée :
        </label> 
}        { fileInput && <DynamicImageComponent src={`data:image/jpg;base64,${content}`} alt={`uploaded: ${fileInput.title}`}/>}
        
        </div>

        <br />
     <Button onClick={handleSubmit} type="submit">{action}</Button>
    
    </form>
        
        </div>
)};        
  
       
export default ArticleForm 
