import { useState } from "react";
import { useLogin } from "../hooks/userLoginHook";
import Button from '../components/Button';
import '../styles/Login.css';

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [isRegister, setIsRegistered] = useState(false);

    const {handleLogin, loading, error, successMessage, handleRegister} = useLogin();

    const onSubmit = (e) => {
        e.preventDefault();
        if (isRegister) {
            handleRegister({username, email, password});
        } else {
        handleLogin(username, password);
        }
    };

    return (
        <div className="login-container"> 
        <form className="login-form" onSubmit={onSubmit}> 
            <h2>{isRegister ? "Register" : "Login"}</h2> 
            
            {error && ( <p className="error-message">{error}</p> 
            )}

             {successMessage && 
             ( <p className="success-message"> 
             {successMessage} 
             </p> 
             )} 


             
             <div className="form-group"> 
                <label htmlFor="username">Username</label> 
                <input 
                id="username" 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                 required 
                 /> 
                 
                 
            </div>
             {isRegister && 
             ( <div className="form-group"> 
             <label htmlFor="email">Email</label> 
             <input 
             id="email" 
             type="email" 
             value={email} 
             onChange={(e) => setEmail(e.target.value)}
              required 
              /> 
              </div> 
              )} 
              
              
            <div className="form-group"> 
                <label htmlFor="password">Password</label> 
                <input 
                id="password" 
                type="password"
                 value={password} onChange={(e) => setPassword(e.target.value)} 
                 required 
                 />


            </div> 
            <Button type="submit" disabled={loading}> 
                {loading ? "Please wait..." : isRegister ? "Register" : "Login"} 
                </Button> 
                
                <p> 
                    {isRegister 
                    ? "Already have an account?" : "Don't have an account?"} 
                    
                    
            <button 
            type="button" 
            onClick={() => setIsRegistered(!isRegister)} 
            disabled={loading} > {isRegister ? "Login" : "Register"} 
            </button> 
            </p>             
        </form>             
     </div> 
    
);    

}