import React, { useCallback, useEffect, useRef, useState } from 'react';
import { usePopup } from '../utils/helpers';
import PopUp from './PopUp';
import { MyButton } from './Button';

export default function ButtonChoice({
    label,
    onClick,
    deleteItem,
    choice,
    children,
}) {
    const { isPopupOpen, popUpType, popUpMessage, configurePopup } = usePopup();
    const [confirmAction, setConfirmAction] = useState(null);
    const eventRef = useRef(null);
    const closePopup = useCallback(() => {
        configurePopup(false);
        setConfirmAction(null);
    }, [configurePopup]);

    console.log(configurePopup);
    const onClickWrapper = useCallback(
        (e) => {
            const confirm = () => {
                if (confirmAction) confirmAction();
                closePopup();
            };
            eventRef.current = e;
            configurePopup(
                true,
                'failure',
                'Êtes-vous sûr ? (cette action est irréversible)',
            );
            console.log(confirm);
            if (confirm) {
                onClick?.(e);
                configurePopup(false);
            }
        },
        [onClick, closePopup, confirmAction, configurePopup],
    );

    return (
        <>
            {isPopupOpen && (
                <PopUp
                    type={popUpType}
                    isOpen={isPopupOpen}
                    onClose={closePopup}
                    message={popUpMessage}
                    setConfirm={setConfirmAction}
                    choice={choice}
                />
            )}
            {children}
            <MyButton
                label={label}
                onClick={onClickWrapper}
                deleteItem={true}
            />
        </>
    );
}
