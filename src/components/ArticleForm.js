import {
  BrowseButton,
  FormContainer,
  H1,
  InputLabelContainer,
  Label,
  Input,
  TextArea,
  FileInput,
  SubmitForm,
  ErrorMessage,
  SuccessMessage,
} from "../styles/FormStyles";
import { useState, useEffect } from "react";
import { binaryStringToBytesArray, setSrcImg } from "../utils";
import { Link } from "react-router-dom";
import { MyButton } from "./Button";
import { logger } from "../utils/logger";
import { DynamicImageComponent } from "./DynamicImageComponent";

const ArticleForm = ({ formTitle, onSubmit, action, article }) => {
  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [fileInput, setFileInput] = useState(null);
  const [file, setFile] = useState(null);
  const [content, setContent] = useState("");
  const [rawData, setRawData] = useState([]);
  const [encodedData, setEncodedData] = useState("");
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState("");
  const [filename, setFileName] = useState("");
  const [isSet, setIsSet] = useState(false);

  const [titleError, setTitleError] = useState("");
  const [authorError, setAuthorError] = useState("");
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    if (article && !isSet) {
      const data = article.file.content.data;
      logger.debug("data before converting to set content", data);
      setRawData(data);
      setEncodedData(btoa(data));

      setTitle(article.title);
      setDate(article.date);
      setBody(article.body);
      setFileInput(article.file);
      setFileName(article.file.fileName);
      setType(article.file.mimeType);
      setAuthor(article.author);
      // it is a bit complicated:
      // when we don't change the image file of the already existing image article the content retrieved from the server is an array of uint8. To send it back to the server we need to convert it to a base64 encoded string, so StringFromCharCode gives us a binary String and btoa encode it in base64 string so the server can handle it the same way it does on a new input file throught handleFileChange(). Note that it is not only a serverside problem, in fact the submit button convert the good looking array of uint8 that we get from article.file.content.data into a useless string so that's why it is better to convert the array into a good looking string right here
      if (article.file.content.data) {
        try {
          const charArray = Array.from(data, (byte) =>
            String.fromCharCode(byte)
          );
          setContent(btoa(charArray.join("")));
        } catch (error) {
          logger.debug(
            `cannot set content with this data: ${article.file.content.data}`,
            error
          );

          try {
            const toUint8Array = new Uint8Array(data);
            logger.debug("content converted to uInt8:", toUint8Array);
            const convertedData = btoa(String.fromCharCode(...toUint8Array));
            logger.debug("content set after trying btoa:", convertedData);
            setContent(convertedData);
          } catch (error) {
            logger.debug("cannot convert this form of data", error);
          }
        }
      }
      // logger.debug("content in useEffect",String.fromCharCode(...article.file.content.data))
      setFile(article.file);
      setIsSet(true);
    }
  }, [
    article,
    title,
    date,
    body,
    file,
    filename,
    type,
    author,
    isSet,
    setFile,
    setEncodedData,
    setRawData,
    rawData,
    encodedData,
  ]);
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title) {
      setTitleError("Title is required");
      return;
    }

    if (!author) {
      setAuthorError("Author is required");
      return;
    }

    onSubmit({ title, author, body, content, type, filename });
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);

    if (e.target.value.length > 100) {
      setTitleError("Title must not exceed 100 characters");
    } else {
      setTitleError("");
    }
  };
  // let decoder = new TextDecoder("utf-8");
  const handleFileChange = (e) => {
    const fileInput = e.target.files[0];
    setFileInput(fileInput);
    setFile(fileInput);
    setFileName(fileInput.name);
    setType(fileInput.type);
    // logger.debug('filename',fileInput.name)
    // logger.debug('type',fileInput.type)
    // logger.debug("Input File",fileInput)
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = event.target.result;
      logger.debug("file content on input change:", fileContent);

      // logger.debug("File Content",fileContent)
      // let decodedContent = decoder.decode(fileContent);
      // let        encoder = new TextEncoder()
      // let        encoded =encoder.encode(fileContent)
      let encoded = btoa(fileContent);
      logger.debug("file content before encoding", fileContent);
      logger.debug("encoded data", encoded);
      setContent(encoded);

      setRawData(binaryStringToBytesArray(fileContent));
      logger.debug("rawData:", rawData);
    };
    reader.readAsBinaryString(fileInput);
  };

  const handleAuthorChange = (e) => {
    setAuthor(e.target.value);

    if (e.target.value.length > 50) {
      setAuthorError("Author name must not exceed 50 characters");
    } else {
      setAuthorError("");
    }
  };

  return (
    <FormContainer>
      <H1>{formTitle}</H1>

      <form encType="application/json" onSubmit={handleSubmit}>
        <InputLabelContainer>
          <Label>
            Titre :
            <Input
              type="text"
              value={title}
              onChange={handleTitleChange}
              onBlur={handleTitleChange}
            />
          </Label>
        </InputLabelContainer>

        <InputLabelContainer>
          <Label>
            Auteur:
            <Input
              type="text"
              value={author}
              onChange={handleAuthorChange}
              onBlur={handleAuthorChange}
            />
          </Label>
        </InputLabelContainer>

        <InputLabelContainer>
          <Label>
            Corps de l'article:
            <TextArea value={body} onChange={(e) => setBody(e.target.value)} />
          </Label>
        </InputLabelContainer>

        <InputLabelContainer>
          <Label>
            Sélectionnez une image pour l'article :
            <FileInput
              id="file"
              type="file"
              onInput={handleFileChange}
              name={filename}
              accept="image/*"
            />
            <BrowseButton htmlFor="file">Parcourir</BrowseButton>
          </Label>
        </InputLabelContainer>

        <InputLabelContainer>
          {fileInput && <Label>Image sélectionnée :</Label>}{" "}
          {fileInput && (
            <DynamicImageComponent
              src={setSrcImg(rawData, type)}
              alt={`uploaded: ${fileInput.title}`}
            />
          )}
        </InputLabelContainer>

        <MyButton onClick={handleSubmit} type="submit">
          {action}
        </MyButton>
      </form>
    </FormContainer>
  );
};
export default ArticleForm;
