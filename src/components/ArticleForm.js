import React, { useRef } from 'react';
import { useState, useCallback } from 'react';

import { MyButton } from './Button';
import {
    DynamicImageComponent,
    DynamicItemImageComponent,
} from './DynamicImageComponent';
import { apiBaseUrl } from '../config';
import { getCookie } from '../utils/cookieUtils';
import { logger } from '../utils/logger';
import { binaryStringToBytesArray } from '../utils/helpers';

import {
    BrowseButton,
    FormContainer,
    H1,
    InputLabelContainer,
    Label,
    Input,
    TextArea,
    FileInput,
} from '../styles/FormStyles';

const ArticleForm = ({ formTitle, action, article, configurePopup }) => {
    const [date, setDate] = useState('');
    const [title, setTitle] = useState(article?.title);
    const [fileInput, setFileInput] = useState(null);
    const [srcImg, setSrcImg] = useState(null);
    const [content, setContent] = useState('');
    const [rawData, setRawData] = useState([]);
    const [author, setAuthor] = useState(article?.author);
    const [body, setBody] = useState(article?.body);
    const [type, setType] = useState(article?.file?.mimeType);
    const [filename, setFileName] = useState(article?.file?.fileName);
    const [titleError, setTitleError] = useState('');
    const [authorError, setAuthorError] = useState('');
    const [dateError, setDateError] = useState('');
    const titleRef = useRef(null);
    const authorRef = useRef(null);
    const bodyRef = useRef(null);
    const fileRef = useRef(null);

    const formValidation = useCallback(() => {
        if (!title) {
            titleRef.current.focus();
            titleRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
            setTitleError('Title is required');
            return false;
        }

        if (!author) {
            setAuthorError('Author is required');
            return false;
        }
        return true;
    }, [title, author]);

    const buildFormData = useCallback(() => {
        const data = { title, author, body, filename, type, content };
        const fileData = new FormData();
        for (var [key, value] of Object.entries(data)) {
            fileData.append(key, value);
        }
        return fileData;
    }, [title, author, filename, body, type, content]);
   
    const fetcher = useCallback(
        async (payload, url, method, message) => {
            const sessionData = await getCookie('session_data');
            try {
                const response = await fetch(url, {
                    method: method,
                    body: payload,
                    headers: {
                        Cookie: `session_data=${sessionData}`,
                    },
                    credentials: 'include',
                });
                if (response.ok) {
                   configurePopup(true, 'success', message);
                } else {
                   configurePopup(true, 'failure', response.error);
                    console.error('Error creating article');
                }
            } catch (error) {
                   configurePopup(true, 'failure', error) 
                console.error('Network error:', error);
            }
        },
        [configurePopup],
    );
     const create = useCallback(async (formData) => {
        const apiUrl = apiBaseUrl + "/api/articles/create"
   fetcher(formData, apiUrl, 'POST', 'Article created successfully') 
    }, [fetcher]);
    const update = useCallback(
        async (fileData) => {
            const apiUrl = apiBaseUrl + `/api/articles/update/${article?._id}`;
            fetcher(fileData, apiUrl, 'PUT', 'Article updated successfully');
        },
        [fetcher, article?._id],
    );

    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            if (!formValidation()) {
                return;
            }

            const fileData = buildFormData();
            if (!article) {
                await create(fileData);
                return
            }
            await update(fileData);
        },
        [buildFormData, create, update, formValidation, article],
    );

    const handleTitleChange = useCallback((e) => {
        setTitle(e.target.value);
        if (e.target.value.length > 100) {
            setTitleError('Title must not exceed 100 characters');
        } else {
            setTitleError('');
        }
    }, []);
    const handleFileChange = useCallback(
        (e) => {
            const fileInput = e.target.files[0];
            setFileInput(fileInput);
            setFileName(fileInput.name);
            setType(fileInput.type);
            const readerPreview = new FileReader();
            readerPreview.onload = (e) => setSrcImg(e.target.result);
            readerPreview.readAsDataURL(fileInput);

            const readerBinary = new FileReader();
            readerBinary.onload = (e) => {
                const fileContent = e.target.result;

                let encoded = btoa(fileContent);
                setContent(encoded);
                setRawData(binaryStringToBytesArray(fileContent));
            };
            readerBinary.readAsBinaryString(fileInput);
        },
        [],
    );

    const handleAuthorChange = (e) => {
        setAuthor(e.target.value);

        if (e.target.value.length > 50) {
            setAuthorError('Author name must not exceed 50 characters');
        } else {
            setAuthorError('');
        }
    };

    return (
        <FormContainer>
            <H1>{formTitle}</H1>

            <form encType='application/json' onSubmit={handleSubmit}>
                <InputLabelContainer>
                    <Label>
                        Titre :
                        <Input
                            ref={titleRef}
                            type='text'
                            value={title || titleError}
                            onChange={handleTitleChange}
                        />
                    </Label>
                </InputLabelContainer>

                <InputLabelContainer>
                    <Label>
                        Auteur:
                        <Input
                            ref={authorRef}
                            type='text'
                            value={author}
                            onChange={handleAuthorChange}
                        />
                    </Label>
                </InputLabelContainer>

                <InputLabelContainer>
                    <Label>
                        Corps de l'article:
                        <TextArea
                            ref={bodyRef}
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                        />
                    </Label>
                </InputLabelContainer>

                <InputLabelContainer>
                    <Label>
                        Sélectionnez une image pour l'article :
                        <FileInput
                            ref={fileRef}
                            id='file'
                            type='file'
                            onInput={handleFileChange}
                            name={filename}
                            accept='image/*'
                        />
                        <BrowseButton htmlFor='file'>Parcourir</BrowseButton>
                    </Label>
                </InputLabelContainer>

                <InputLabelContainer>
                    {fileInput && (
                        <>
                            <Label>Image sélectionnée :</Label>
                            <DynamicImageComponent
                                src={srcImg}
                                alt={article?.file?.filename}
                            />
                        </>
                    )}
                    {!fileInput && article && (
                        <>
                            <Label>Image actuelle :</Label>
                            <DynamicItemImageComponent
                                apiUrl={`${apiBaseUrl}/api/articleImage/${article?._id}`}
                                setContent={setContent}
                            />
                        </>
                    )}
                </InputLabelContainer>

                <MyButton onClick={handleSubmit} type='submit'>
                    {action}
                </MyButton>
            </form>
        </FormContainer>
    );
};
export default ArticleForm;
