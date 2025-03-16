import { CustomButton } from '../styles/CustomButtonStyles';

const clickCallBack = async () => {
    alert('button clicked');
};

const MyButton = ({ label, onClick, deleteItem = false }) => {
    return (
        <>
            <CustomButton onClick={onClick} deleteitem={deleteItem.toString()}>
                {label}
            </CustomButton>
        </>
    );
};

export { MyButton, CustomButton, clickCallBack };
