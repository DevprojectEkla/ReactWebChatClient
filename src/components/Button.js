import styled from 'styled-components'
import { THEME_COLOR } from 'config'
const CustomButton = styled.button.attrs({type: 'button'})

`
  background-color: ${THEME_COLOR}; /* Light blue with some transparency */
  color: #fff; /* White text */
  padding: 10px 20px; /* Adjust padding as needed */
  border: none;
  border-radius: 8px; /* Rounded corners */
  cursor: pointer;
  font-size: 20px; /* Adjust font size as needed */
  
    transition: background-color 0.3s ease; /* Smooth transition for hover effect */

  &:hover {
    background-color:rgba(70, 130, 180, 1) ; /* Fully opaque on hover */
  }
`;

const clickCallBack = async () =>{
    alert('button clicked')
    let response = await fetch('http://localhost:8000/api/articles')
    let data = await response.json();
    

console.log("Articles:",data)

}

const ConsulterArticles = () => {
    return (
        <div>
        </div>
    )
    
}
const Button = ({children,onClick}) => {
    return (
        <CustomButton onClick = {onClick}>{children}</CustomButton>
    )
}


export  {Button, CustomButton, clickCallBack,}
