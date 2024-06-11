import { apiBaseUrl, THEME_COLOR } from "../config"; //ATTENTION: cette import utilise un symlink client/node_modules/config.js poitant vers ../../config.rs ce qui correspond à la racine du projet le fichier config devant être partagé entre server/ et client/
import React, { useState, useEffect } from "react";
import { logger } from "../utils/logger"
import { Link } from "react-router-dom";
import { CustomButton } from "./Button";
import { ListArticleContainer } from "../styles/ArticlesStyles"
import DynamicImageComponent from "./DynamicImageComponent";
import { useScrollToTopContext } from "../contexts/ScrollToTop";
import Spinner from "./Spinner";
import { ClipLoader } from "react-spinners";
import { getCookie} from "../utils/cookieUtils"

const ArticlesList = () => {
  window.scrollTo(0, 0);
  let [articles, setArticles] = useState([]);
  let [title, setTitle] = useState("");
  let [reFetch, setRefetch] = useState(true);
  let [decodedImage, setDecodedImage] = useState(null);
  let [error, setError] = useState(null);
 
useEffect(() => {
            if (articles.length === 0) {
          
    getArticles();
      }
  }, );

  // useEffect(() => {
  //   const cachedData = localStorage.getItem("cachedData");
  //     const parsedData = JSON.parse(cachedData);
  //     if (parsedData && Object.keys(parsedData).length > 0 && !reFetch) {
  //       logger.debug("CACHED", cachedData)
  //     setArticles(JSON.parse(cachedData));
  //         logger.debug(reFetch)
  //   } else {
  //     getArticles();
  //       setRefetch(false)
  //   }
  // }, [reFetch]);

  const getArticles = async () => {
    try {
        
        const sessionData = await getCookie('session_data')
        if (!sessionData) {throw new Error(`no session cookie available. You have to be logged in to get access to this resource`)
            
        }
        const sessionId = sessionData.id
        logger.debug("getArticles is triggered with session",sessionId)
        let response = await fetch(apiBaseUrl + "/api/articles", {method: 'GET', headers:{
            'Content-type':'application/json',
            'Cookie':`session_data=${sessionData}`,
        }});
      if (!response.ok) {
          if (response.status === 401){

        throw new Error(`Failed to fetch articles. You Need to Be Logged in to Access this resource. Status Code: ${response.status}`);
          }
          else{
        throw new Error(`Failed to fetch articles. Status: ${response.status}`);
      }}
      let data = await response.json();

        setArticles(data.map(article => ({...article,imageSrc:null})));
        fetchImages(data);
      // localStorage.setItem("cachedData", JSON.stringify(data));
    } catch (error) {
      setError(error.message);
      logger.debug(error);
    }
  };

    const fetchImages = (articles) => {
        articles.forEach( async (article,index) => {
            const imageSrc = await setImgSrc(article);
            setArticles(prevArticles => {
                const newArticles = [...prevArticles];
                newArticles[index].imageSrc = imageSrc;
                return newArticles;
            });
            
        });
    }

  const setImgSrc = async (article) => {
    // Assuming article is your object containing the image data
    const imageData = article.file.content.data;
    // logger.debug(imageData)

    // Create a Uint8Array from the array of integers
    const uint8Array = new Uint8Array(imageData);
    // logger.debug(decoded)

    // Create a Blob from the Uint8Array
    const blob = new Blob([uint8Array], { type: article.file.mimeType });
    // logger.debug(blob)

    // Create a data URL for the Blob
    const dataURL = URL.createObjectURL(blob);
    return dataURL;
  };
  const displayData = (articles) => {
    return articles.map((article, index) => (
      <div key={index}>
        <h3>{article.title}</h3>
        <DynamicImageComponent
          src={article.imageSrc}
          alt={`Image pour ${article.title}`}
        />
        <CustomButton>
          <Link
            to={`detail/${index}`}
            state={{
              article,
              index,
            }}
          >
            Lire l'article
          </Link>
        </CustomButton>
      </div>
    ));
  };
  //pour utiliser des arguments dans une fonction onClick
  //on utilise .bind, l'argument null
  //onClick={getArticleBody.bind(null, article)}
  return (
    <ListArticleContainer>
      <div>
        <h1>Articles</h1>
      </div>
      {error ? (
        <p> Error: {error}</p>
      ) : (
        <div>
          {articles && articles.length > 0 ? (
            <div>{displayData(articles)}</div>
          ) : (
            <div>
              <ClipLoader color={THEME_COLOR} />
            </div>
          )}
        </div>
      )}
    </ListArticleContainer>
  );
};

const binaryToString = (base64Data) => {
  const binaryData = atob(base64Data);
  const textDecoder = new TextDecoder("utf-8");
  return textDecoder.decode(
    new Uint8Array(binaryData.split("").map((char) => char.charCodeAt(0)))
  );
};
export default ArticlesList;
