import {useState} from "react"
import {useNavigate, Link} from "react-router-dom"
import {Button} from "./Button"
import { apiBaseUrl } from "config"

const Login = () => {
    const [email, setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [emailError,setEmailError] = useState("")
    const [passwordError,setPasswordError] = useState("")
    
    const navigate = useNavigate()

    const onClick = async () => {

        setEmailError("")
        setPasswordError("")

        if ("" === email){
            setEmailError("Please enter your email")
            return
        }
        
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
        {
            setEmailError("Please enter a valid email address")
            return
        }
        
        if ("" === password){
            setPasswordError("Please enter a password")
            return
        }
        if (password.length < 7)

        {setPasswordError("The password must be 8 characters minimum")
        return}
        console.log(email,password)
let         data = {
    email: email,
    password: password,
}
        let response = await fetch(apiBaseUrl+'/api/login',
            {
                method: 'POST',
                body: JSON.stringify(data),
                headers:{'Content-type':'application/json'}

            })


    }

    return(
        <div className="loginContainer">
        <h1>Login
        </h1>


        <form encType="application/json">
        <div className="inputContainer">
        <input className="inputBox" value={email} placeholder="enter your email" onChange={ev => setEmail(ev.target.value)}/>
        <label className="label-error">{emailError}</label>
        </div>
        <div className="inputContainer">
        <input type="password" className="inputBox" value={password} placeholder="enter your password"
        onChange={ev => setPassword(ev.target.value)}/>
        <label className="label-error">{passwordError}</label>
        </div>
        <div>
        <Button type="submit" onClick={onClick}>login</Button>
        <Link to="/subscribe">Sign in</Link>
        </div>
        


        </form>
        </div>
    )
}

export default Login
