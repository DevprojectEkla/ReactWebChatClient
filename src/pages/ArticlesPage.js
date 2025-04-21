import { Link } from 'react-router-dom';
import ArticlesList from '../components/ArticlesList';
import { MyButton } from '../components/Button';
import { ArticlesPageContainer } from '../styles/ArticlesStyles';

const ArticlesPage = () => {
    return (
        <ArticlesPageContainer>
            <div>
                <ArticlesList />
            </div>
            <div>
                <MyButton label={<Link to='/'>Retour</Link>} />
            </div>
        </ArticlesPageContainer>
    );
};

export default ArticlesPage;
