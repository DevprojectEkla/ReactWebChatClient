import { apiBaseUrl,THEME_COLOR } from "config"; //ATTENTION: cette import utilise un symlink client/node_modules/config.js poitant vers ../../config.rs ce qui correspond à la racine du projet le fichier config devant être partagé entre server/ et client/
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CustomButton } from "./Button";
import DynamicImageComponent from "./DynamicImageComponent";
import {useScrollToTopContext} from "../contexts/ScrollToTop"
import Spinner from "./Spinner";
import {ClipLoader} from 'react-spinners'



const ArticlesList = () => {
    window.scrollTo(0,0)
  let [articles, setArticles] = useState([]);
    let [reFetch, setRefetch] = useState(true)
  let [decodedImage, setDecodedImage] = useState(null);
  let [error, setError] = useState(null);
 useEffect(() => {
        if (articles.length > 0){
            console.log(articles)

    }else{getArticles()}
    },[articles])

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
      let response = await fetch(apiBaseUrl + "/api/articles");
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
   
  return (
    <div className="listArticleContainer">
      <div>
      <h1>Articles</h1>
      </div>
      {error ? (
        <p>Cannot Display articles. Error: {error}</p>
      ) : (
        <div>
          {articles && articles.length>0? (
            <div>
              {articles.map((article, index) => (
                <div key={index}>
                  <h3>{article.title}</h3>
                  <DynamicImageComponent
                    src={`data:${article.file.mimeType};base64,${article.file.content}`}
                    alt={`Image pour ${article.title}`}
                  />
                  <CustomButton onClick={getArticleBody.bind(null, article)}>
                    <Link
                      to={`detail/${index}`}
                      state={{
                        article, index
                      }}
                    >
                      Lire l'article
                    </Link>
                  </CustomButton>
                </div>
              ))}
            </div>
              
          ):(<div><ClipLoader color={THEME_COLOR}/></div>

          )}
        </div>
      )}

    </div>
  );
};

const getArticleBody = (article) => {
  console.log(article.body);
  return article.body;
};

const binaryToString = (base64Data) => {
  const binaryData = atob(base64Data);
  const textDecoder = new TextDecoder("utf-8");
  return textDecoder.decode(
    new Uint8Array(binaryData.split("").map((char) => char.charCodeAt(0)))
  );
};
const base64ToArrayBuffer = (base64Data) => {
  const binaryData = atob(base64Data);
  const arrayBuffer = new ArrayBuffer(binaryData.length);

  return arrayBuffer;
};
export default ArticlesList;
