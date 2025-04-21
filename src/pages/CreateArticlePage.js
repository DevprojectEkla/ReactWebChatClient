// Your main component using ArticleForm
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ArticleForm from '../components/ArticleForm';
import PopUp from '../components/PopUp';
import { usePopup } from '../utils/helpers';

const CreateArticlePage = () => {
    const { isPopupOpen, popUpType, popUpMessage, configurePopup } = usePopup();

    const navigate = useNavigate();
    const closePopup = () => {
        configurePopup(false, '', '');
        if (popUpType === 'success') {
            navigate('/articles');
        }
    };

    return (
        <div>
            <ArticleForm
                formTitle='Créer un article'
                action='create'
                popUpConfig={configurePopup}
            />
            {isPopupOpen && (
                <PopUp
                    isOpen={isPopupOpen}
                    type={popUpType}
                    onClose={closePopup}
                    message={popUpMessage}
                />
            )}
        </div>
    );
};

export default CreateArticlePage;
