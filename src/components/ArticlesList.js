import { apiBaseUrl, THEME_COLOR } from "config"; //ATTENTION: cette import utilise un symlink client/node_modules/config.js poitant vers ../../config.rs ce qui correspond à la racine du projet le fichier config devant être partagé entre server/ et client/
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CustomButton } from "./Button";
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
  //       console.log("CACHED", cachedData)
  //     setArticles(JSON.parse(cachedData));
  //         console.log(reFetch)
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
        console.log("getArticles is triggered with session",sessionId)
        let response = await fetch(apiBaseUrl + "/api/articles", {method: 'GET', headers:{
            'Content-type':'application/json',
            'Cookie':`session_data=${sessionData}`,
        }});
      if (!response.ok) {
        throw new Error(`Failed to fetch articles. Status: ${response.status}`);
      }
      let data = await response.json();

      setArticles(data);
      // localStorage.setItem("cachedData", JSON.stringify(data));
    } catch (error) {
      setError(error.message);
      console.log(error);
    }
  };
  const setImgSrc = (article) => {
    // Assuming article is your object containing the image data
    const imageData = article.file.content.data;
    // console.log(imageData)

    // Create a Uint8Array from the array of integers
    const uint8Array = new Uint8Array(imageData);
    // console.log(decoded)

    // Create a Blob from the Uint8Array
    const blob = new Blob([uint8Array], { type: article.file.mimeType });
    // console.log(blob)

    // Create a data URL for the Blob
    const dataURL = URL.createObjectURL(blob);
    return dataURL;
  };
  const displayData = (articles) => {
    return articles.map((article, index) => (
      <div key={index}>
        <h3>{article.title}</h3>
        <DynamicImageComponent
          src={setImgSrc(article)}
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
    <div className="listArticleContainer">
      <div>
        <h1>Articles</h1>
      </div>
      {error ? (
        <p>Cannot Display articles. Error: {error}</p>
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
    </div>
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
