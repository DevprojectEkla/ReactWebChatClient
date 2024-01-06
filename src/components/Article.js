import { useEffect } from "react";
import { useHeaderContext } from "../contexts/HeaderContext";
import { useScrollToTopContext } from "../contexts/ScrollToTop";
import DynamicImageComponent from "./DynamicImageComponent";
import {Button} from './Button'
import {Link} from "react-router-dom";
const {loremIpsum} = require("lorem-ipsum");
const Article = ({ article }) => {

  const loremText = loremIpsum({
    count: 13, // Number of paragraphs
    units: "paragraphs", // Output type: 'paragraphs', 'words', 'sentences'
    format: "html", // Output format: 'html' or 'text'
  });
  const { setHeaderTitle } = useHeaderContext();
  const scrollPosition = useScrollToTopContext();
  useEffect(() => {
    setHeaderTitle(article ? article.title : "Article");
  }, [setHeaderTitle, article]);

  return (
    <>
      <div>
      <h1>{article.title}</h1>
      </div>
      <div>
        <DynamicImageComponent
          src={`data:${article.file.mimeType};base64,${article.file.content}`}
          alt={`Titre: ${article.title}`}
        ></DynamicImageComponent>
      </div>
      <div className="articleContent">
      {// <p> {article.body}</p>
      }

      <div dangerouslySetInnerHTML={{ __html: loremText }} />
      </div>
      <Button><Link to={`/articles/update/${article._id}`} state={{article}}>éditer l'article</Link></Button>
    </>
  );
};

export default Article;
