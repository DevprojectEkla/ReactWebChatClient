import { useEffect, useState } from "react";
import { useHeaderContext } from "../contexts/HeaderContext";
import { DynamicArticleImageComponent } from "./DynamicImageComponent";
import { MyButton } from "./Button";
import { Link } from "react-router-dom";
import { apiBaseUrl } from "../config";
const { loremIpsum } = require("lorem-ipsum");
const Article = ({ article, index }) => {
  const [fetchedArticle, setFetchedArticle] = useState(null);
  const loremText = loremIpsum({
    count: 13, // Number of paragraphs
    units: "paragraphs", // Output type: 'paragraphs', 'words', 'sentences'
    format: "html", // Output format: 'html' or 'text'
  });
  const { setHeaderTitle } = useHeaderContext();
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/articles/${index.id}`);
        const data = await response.json();
        setFetchedArticle(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (!article && fetchedArticle === null) {
      fetchArticle();
    }

    setHeaderTitle(article ? article.title : "Article");
  }, [setHeaderTitle, article, fetchedArticle, setFetchedArticle, index]);

  article = article || fetchedArticle;
  console.log("article:", article);
  return (
    <>
      {article && article.message !== "Article Not Found" ? (
        <>
          <div>
            <h1>{article.title}</h1>
          </div>
          <div>
            <DynamicArticleImageComponent
              article={article}
            ></DynamicArticleImageComponent>
          </div>
          <div className="articleContent">
            {
              // <p> {article.body}</p>
            }

            <div dangerouslySetInnerHTML={{ __html: loremText }} />
          </div>
          <MyButton>
            <Link to={`/articles/update/${article._id}`} state={{ article }}>
              éditer l'article
            </Link>
          </MyButton>
        </>
      ) : (
        <h1>No Article available for index {index.id} </h1>
      )}{" "}
    </>
  );
};

export default Article;
