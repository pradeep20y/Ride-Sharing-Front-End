import {useState} from "react";

const LoginForm = () => {

    const [number,setNumber] = useState("");
    const [password,setPassword] = useState("");

    return (
        
        <div className="container mt-5">
            {number}
            {[password]}
            <div className="mx-auto" style={{ maxWidth: "400px" }}>
                
                <div className="mb-3">
                    <input
                        type="number"
                        required
                        className="form-control"
                        placeholder="Phone Number"
                        onChange={(e)=>{setNumber(e.target.value)} }
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

                <button className="btn btn-primary w-100">
                    Submit
                </button>

            </div>
        </div>
    );
};

export default LoginForm;