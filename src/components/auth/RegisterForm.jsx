import { useState } from "react";
import { register } from "../../api/authApi";
const RegisterForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [userType, setUserType] = useState("Passenger");

    const handleSubmit = async () => {
        const registerData = {
            name,
            email,
            phone,
            password,
            userType
        };
        const response = await register(registerData);

        console.log(response);
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