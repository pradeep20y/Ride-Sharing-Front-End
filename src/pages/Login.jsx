import {useState} from "react";
import LoginForm from "../components/auth/LoginForm"; 
import { Link } from "react-router-dom";
import Register from "./Register";

export default function Login() {
    return (
    <>
        <div>
            <h3>Login</h3>
            <LoginForm />
            <Link to="/register">Register</Link>
        </div>
    </>
    );
}


