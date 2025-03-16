import { useCallback,useMemo, useState } from 'react';
import { useHeaderContext } from '../contexts/HeaderContext';
import { DynamicItemImageComponent } from './DynamicImageComponent';
import { MyButton } from './Button';
import { Link } from 'react-router-dom';
import { apiBaseUrl } from '../config';
const { loremIpsum } = require('lorem-ipsum');
const Article = ({ article, index }) => {
    const [fetchedArticle, setFetchedArticle] = useState(null);
    const loremText = loremIpsum({
        count: 13, // Number of paragraphs
        units: 'paragraphs', // Output type: 'paragraphs', 'words', 'sentences'
        format: 'html', // Output format: 'html' or 'text'
    });
    const { setHeaderTitle } = useHeaderContext();
    const fetchArticle = useCallback(async () => {
        try {
            const response = await fetch(
                `${apiBaseUrl}/api/articles/${index.id}`,
            );
            const data = await response.json();
            setFetchedArticle(data);
        } catch (error) {
            console.log(error);
        }
    }, [index.id]);

    const memoizedArticle = useMemo(() => {
        if (!article && fetchedArticle === null) {
            fetchArticle();
        }

        setHeaderTitle(article ? article.title : 'Article');
        return article || fetchedArticle;
    }, [fetchArticle, setHeaderTitle, article, fetchedArticle]);
    return (
        <>
            {memoizedArticle && memoizedArticle.message !== 'Article Not Found' ? (
                <>
                    <div>
                        <h1>{memoizedArticle.title}</h1>
                    </div>
                    <div>
                        <DynamicItemImageComponent
                            apiUrl={`${apiBaseUrl}/api/articleImage/${memoizedArticle._id}`}
                        ></DynamicItemImageComponent>
                    </div>
                    <div className='articleContent'>
                        {
                            // <p> {article.body}</p>
                        }

                        <div dangerouslySetInnerHTML={{ __html: loremText }} />
                    </div>
                    <MyButton
                        label={
                            <Link
                                to={`/articles/update/${memoizedArticle._id}`}
                                state={{ memoizedArticle }}
                            >
                                éditer l'article
                            </Link>
                        }
                    />
                </>
            ) : (
                <h1>No Article available for index {index.id} </h1>
            )}{' '}
        </>
    );
};

export default Article;
