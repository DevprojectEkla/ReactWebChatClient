import {Link} from "react-router-dom"
import ArticlesList from "../components/ArticlesList"
import {MyButton} from "../components/Button"
import { ArticlesPageContainer } from "../styles/ArticlesStyles"

const ArticlesPage = () => {

    return (
    <ArticlesPageContainer>
    <div>
    <ArticlesList/>
    </div>
    <div><MyButton> <Link to="/">Retour</Link></MyButton></div>
    </ArticlesPageContainer>

)}

export default ArticlesPage
