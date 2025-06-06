import { apiBaseUrl, THEME_COLOR } from '../config';
import React, { useState, useEffect, useCallback } from 'react';
import { logger } from '../utils/logger';
import { Link } from 'react-router-dom';
import { CustomButton, MyButton } from './Button';
import { ListArticleContainer } from '../styles/ArticlesStyles';
import { DynamicItemImageComponent } from './DynamicImageComponent';
import { ClipLoader } from 'react-spinners';
import { getCookie } from '../utils/cookieUtils';

const ArticlesList = () => {
    window.scrollTo(0, 0);
    let [articles, setArticles] = useState([]);
    let [error, setError] = useState(null);

    const getArticles = useCallback(async () => {
        try {
            const sessionData = await getCookie('session_data');
            if (!sessionData) {
                throw new Error(
                    `no session cookie available. You have to be logged in to get access to this resource`,
                );
            }
            const sessionId = sessionData.id;
            logger.debug('getArticles is triggered with session', sessionId);
            let response = await fetch(apiBaseUrl + '/api/articles', {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Cookie': `session_data=${sessionData}`,
                },
            });
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error(
                        `Failed to fetch articles. You Need to Be Logged in to Access this resource. Status Code: ${response.status}`,
                    );
                } else {
                    throw new Error(
                        `Failed to fetch articles. Status: ${response.status}`,
                    );
                }
            }
            let data = await response.json();
            setArticles(data);

            // localStorage.setItem("cachedData", JSON.stringify(data));
        } catch (error) {
            setError(error.message);
            logger.debug(error);
        }
    }, []);

    useEffect(() => {
        if (articles.length === 0) {
            getArticles();
        }
    });

    const displayData = (articles) => {
        return articles.map((article, index) => (
            <div key={index}>
                <h3>{article.title}</h3>
                <DynamicItemImageComponent
                    apiUrl={`${apiBaseUrl}/api/articleImage/${article._id}`}
                />

                <MyButton
                    label={
                        <Link
                            to={`detail/${index}`}
                            state={{
                                article,
                                index,
                            }}
                        >
                            Lire l'article
                        </Link>
                    }
                />
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

export default ArticlesList;
