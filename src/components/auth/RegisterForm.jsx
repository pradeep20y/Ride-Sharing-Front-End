import { useState } from "react";
import { registerReq, registerDriverReq } from "../../api/authApi";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [userType, setUserType] = useState("Passenger");
    const [licensePlate, setLicensePlate] = useState("");
    const [vehicleType, setVehicleType] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (userType === "Driver" && (!licensePlate || !vehicleType)) {
            alert("Please fill in license plate and vehicle type.");
            return;
        }

        try {
            if (userType === "Driver") {
                await registerDriverReq({ name, email, phone, password, licensePlate, vehicleType });
            } else {
                await registerReq({ name, email, phone, password });
            }
            
            navigate("/login", { replace: true });
        } catch (error) {
            alert(error.response?.data?.message || "Registration failed. Please try again.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="mx-auto" style={{ maxWidth: "400px" }}>

                <div className="mb-3">
                    <input type="text" placeholder="Name" className="form-control"
                        onChange={(e) => setName(e.target.value)} />
                </div>

                <div className="mb-3">
                    <input type="email" placeholder="Email" className="form-control"
                        onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="mb-3">
                    <input type="text" placeholder="Phone Number" className="form-control"
                        onChange={(e) => setPhone(e.target.value)} />
                </div>

                <div className="mb-3">
                    <input type="password" placeholder="Password" className="form-control"
                        onChange={(e) => setPassword(e.target.value)} />
                </div>

                <div className="mb-3">
                    <select className="form-select" onChange={(e) => setUserType(e.target.value)}>
                        <option value="Passenger">Passenger</option>
                        <option value="Driver">Driver</option>
                    </select>
                </div>

                {userType === "Driver" && (
                    <>
                        <div className="mb-3">
                            <input type="text" placeholder="License Plate (e.g. TN01AB1234)"
                                className="form-control"
                                onChange={(e) => setLicensePlate(e.target.value.toUpperCase())} />
                        </div>

                        <div className="mb-3">
                            <select className="form-select" onChange={(e) => setVehicleType(e.target.value)}>
                                <option value="">Select Vehicle Type</option>
                                <option value="ECONOMY">Economy</option>
                                <option value="COMFORT">Comfort</option>
                                <option value="PREMIUM">Premium</option>
                            </select>
                        </div>
                    </>
                )}

                <button className="btn btn-primary w-100" onClick={handleSubmit}>
                    Register
                </button>

            </div>
        </div>
    );
};

export default RegisterForm;