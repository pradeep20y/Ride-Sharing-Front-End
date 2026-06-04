import {useState} from "react";
import {login} from "../../api/authApi";
import { setToken } from "../../utils/tokenUtils";
const LoginForm = () => {

    const [identifier,setIdentifier] = useState("");
    const [password,setPassword] = useState("");

    const handleSubmit = async () => {
        try{
            const response = await login({identifier,password});
            setToken(response.token)
            console.log(response);
        }
        catch(error) {
            alert(error);
        }    
    }


    return (
        
        <div className="container mt-5">
           
            <div className="mx-auto" style={{ maxWidth: "400px" }}>
                
                <div className="mb-3">
                    <input
                        type="number"
                        required
                        className="form-control"
                        placeholder="Phone Number"
                        onChange={(e)=>{setIdentifier(e.target.value)} }
                    />
                </div>

                <div className="mb-3">
                    <input
                        type="password"
                        required
                        className="form-control"
                        placeholder="Password"
                        onChange={(e)=>{setPassword(e.target.value)} }
                    />
                </div>

                <button 
                className="btn btn-primary w-100"
                onClick={handleSubmit}
                >
                    Submit
                </button>

            </div>
        </div>
    );
};

export default LoginForm;