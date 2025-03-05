import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ArticleForm from '../components/ArticleForm';
import PopUp from '../components/PopUp';
import { usePopup } from '../utils/helpers';
import init, { add, hello } from '../wasm/utils_wasm_lib';

const UpdateArticlePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { article } = location.state || {};
    const runwasm = async () => {
        await init();
        const message = hello('can you work please?')
        const res = add(4+4)
        console.log(res)
    };
    runwasm();

    const { isPopupOpen, popUpType, popUpMessage, configurePopup } = usePopup();

    const closePopup = () => {
        if (popUpType === 'success') {
            navigate('/articles');
        }
    };

    return (
        <div>
            <h1>Editer l'article</h1>
            <ArticleForm
                article={article}
                formTitle="Editer l'article"
                configurePopup={configurePopup}
                action='Editer'
            />
            {isPopupOpen && (
                <PopUp
                    type={'success'}
                    isOpen={isPopupOpen}
                    onClose={closePopup}
                    message={popUpMessage}
                />
            )}
        </div>
    );
};

export default UpdateArticlePage;
