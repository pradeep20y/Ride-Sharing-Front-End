const RegisterForm = () => {
    return (
        <div className="container mt-5">
            <div className="mx-auto" style={{ maxWidth: "400px" }}>
                
                <div className="mb-3">
                    <input
                        type="text"
                        placeholder="Name"
                        required
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <input
                        type="email"
                        required
                        className="form-control"
                        placeholder="Email"
                    />
                </div>

                <div className="mb-3">
                    <input
                        type="number"
                        required
                        className="form-control"
                        placeholder="Phone Number"
                    />
                </div>

                <div className="mb-3">
                    <input
                        type="password"
                        required
                        className="form-control"
                        placeholder="Password"
                    />
                </div>

                <div className="mb-3">
                    <select className="form-select">
                        <option>Passenger</option>
                        <option>Driver</option>
                    </select>
                </div>

                <button className="btn btn-primary w-100">
                    Submit
                </button>

            </div>
        </div>
    );
};

export default RegisterForm;