import { useState } from "react";
import { registerReq } from "../../api/authApi";
import { Navigate, useNavigate } from "react-router-dom";
const RegisterForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [userType, setUserType] = useState("Passenger");
    const navigate = useNavigate();
    const handleSubmit = async () => {
        const registerData = {
            name,
            email,
            phone,
            password,
            userType
        };
        try{
            const response = await registerReq(registerData);
            console.log(response);
            navigate("/login", {replace: true});
        }
        catch(error){
            alert(error);
        }
        
        
        
    };
    return (
        <div className="container mt-5">
            <div className="mx-auto" style={{ maxWidth: "400px" }}>
                
                <div className="mb-3">
                    <input
                        type="text"
                        placeholder="Name"
                        required
                        className="form-control"
                        onChange={(e)=>{setName(e.target.value)} }
                    />
                </div>

                <div className="mb-3">
                    <input
                        type="email"
                        required
                        className="form-control"
                        placeholder="Email"
                        onChange={(e)=>{setEmail(e.target.value)} }
                    />
                </div>

                <div className="mb-3">
                    <input
                        type="number"
                        required
                        className="form-control"
                        placeholder="Phone Number"
                        onChange={(e)=>{setPhone(e.target.value)} }
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

                <div className="mb-3" >
                    <select className="form-select" onChange={(e)=>{setUserType(e.target.value)} }>
                        <option>Passenger</option>
                        <option>Driver</option>
                    </select>
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

export default RegisterForm;