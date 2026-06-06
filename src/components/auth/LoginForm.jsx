import {useState} from "react";
import {loginReq} from "../../api/authApi";
import { setToken } from "../../utils/tokenUtils";
import { useNavigate } from "react-router-dom";
import useAuth from "../../auth/context/AuthContext";




const LoginForm = () => {
    const navigate = useNavigate();
    const [identifier,setIdentifier] = useState("");
    const [password,setPassword] = useState("");
    const {login,userInformation} = useAuth();
    const handleSubmit = async () => {
        try{
            const response = await loginReq({identifier,password});
            const { userType, token, ...userDetails } = response;
            login(token);
            userInformation({
                userDetails: userDetails, // Contains: name, email, phone, userId, profileId
                role: userType            // Contains: "DRIVER"
            });

            console.log("AuthContext successfully updated with:", response);
            navigate(response.userType === "PASSENGER" ? "/passengerPage" : "/driverPage", { replace: true });
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