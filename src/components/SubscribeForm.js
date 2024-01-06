import {useState} from "react"
import {Button} from "./Button";
import  DynamicImageComponent from "./DynamicImageComponent";

const SubscribeForm = ({onSubmit,file, setFile}) => {
    const [username,setUserName] = useState("");
    const [password,setPassword] = useState("")
    const [date,setDate] = useState("")
    const [quote,setQuote] = useState("");
    const [fileInput,setFileInput] = useState(null);
    const [content,setContent] = useState("");

    const [userNameError,setUserNameError] = useState("");
    const [passwordError,setPasswordError] = useState("");
    const [dateError,setDateError] = useState("")

    const handleSubmit = (e) => {
    e.preventDefault();

    if (!username) {
      setUserNameError('Title is required');
      return;
    }

    if (!password) {
      setPasswordError('Author is required');
      return;
    }

    // Assuming onSubmit is a function passed as a prop to handle form submission
    onSubmit({ username, password,file, content});
  };

  const handleUserNameChanged = (e) => {
    setUserName(e.target.value);

    if (e.target.value.length > 100) {
      setUserNameError('Title must not exceed 100 characters');
    } else {
      setUserNameError('');
    }
  };
        // let decoder = new TextDecoder("utf-8");
    const handleFileChange = (e) => {
        const fileInput = e.target.files[0]
        setFile(fileInput);
        setFileInput(fileInput)
    console.log("Input File",fileInput)
const reader = new FileReader();
        reader.onload = (event) => {const fileContent = event.target.result;console.log("File Content",fileContent)
        // let decodedContent = decoder.decode(fileContent);
// let        encoder = new TextEncoder()
// let        encoded =encoder.encode(fileContent)
let        encoded =btoa(fileContent)
        console.log(encoded)
    setContent(encoded)
        }
        reader.readAsBinaryString(fileInput)

    }


  const handlePasswordChange = (e) => {
    setPassword(e.target.value);

    if (e.target.value.length > 50) {
      setPasswordError('Author name must not exceed 50 characters');
    } else {
      setPasswordError('');
    }
  };

    return( 
        <div className="formContainer">
        <div className="inputLabelContainer">
        <h1>Créer votre compte
        </h1>
        </div>

        <form  encType="application/json" onSubmit={handleSubmit}>
        <div className="inputLabelContainer">
      <label>
        Email:
        <input
          type="text"
          value={username}
          onChange={handleUserNameChanged}
          onBlur={handleUserNameChanged}
        />
        {userNameError && <span style={{ color: 'red' }}>{userNameError}</span>}
      </label>
        </div>
        <div className="inputLabelContainer">
      <br />
      <label>
        mot de passe:
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          onBlur={handlePasswordChange}
        />
        {passwordError && <span style={{ color: 'red' }}>{passwordError}</span>}
      </label>
      <br/>

        <div className="inputLabelContainer">

      <label className="inputLabelContainer" for="quote">
        Une citation:
        <textarea id="quote"value={quote} onChange={(e) => setQuote(e.target.value)} />
      </label>
        <br />
        </div>
        <div className="inputLabelContainer">
        <label>
        choisissez une image pour votre avatar:
          <input id="file"  type="file" onInput={handleFileChange} accept="image/*" />
        </label>
      <br />
        </div>
        <div className="inputLabelContainer">

        {fileInput && <label>
        Votre avatar:
        </label> 
}        { fileInput && <DynamicImageComponent src={`data:image/png;base64,${btoa(content)}`} alt={`uploaded: ${fileInput.title}`}></DynamicImageComponent>}

        </div>
        <div className="submitForm"> 

        <br/>
      <Button onClick={handleSubmit} type="submit">
        créer mon compte</Button></div>

        <br/>
        </div>
    </form>
        
        </div>
)};        
  
       
export default SubscribeForm 
