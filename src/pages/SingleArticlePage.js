import {useLocation,useParams} from "react-router-dom";
import Article from "../components/Article"
const SingleArticlePage = () => {const location = useLocation();
  window.scrollTo(0, 0);
    const { article } = location.state || {}
                   const index = useParams();
                    
    console.log("INDEX",index)
    return (


        <div className="bodyContainer">
        <Article article={article} index={index}/>
        </div>
    )
}

export default SingleArticlePage
