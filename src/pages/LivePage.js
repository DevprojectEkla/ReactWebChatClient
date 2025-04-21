import { Link } from 'react-router-dom';
import Live from '../components/Live';
import { MyButton } from '../components/Button';
import { ArticlesPageContainer } from '../styles/ArticlesStyles';

const LivePage = () => {
    return (
        <ArticlesPageContainer>
            <div>
                <Live />
            </div>
            <div>
                <MyButton label={<Link to='/'>Retour</Link>} />
            </div>
        </ArticlesPageContainer>
    );
};

export default LivePage;
