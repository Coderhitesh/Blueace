import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Login.css'

const Login = () => {
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:7987/api/v1/Login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Email, Password }),
        });

        if (response.ok) {
            const data = await response.json();
            // console.log('data',data.user.Role)
            // Assuming the API returns a token
            sessionStorage.setItem('token', data.token);
            // console.log('data.token',data.token)
            const role = data.user?.Role === "Admin"
            // console.log("user",data)
            sessionStorage.setItem('role', role);
            toast.success('Login successful!');
            // navigate('/'); // Redirect to the home page or dashboard
            window.location.href ='/'
        } else {
            const error = await response.json();
            toast.error(error.message || 'Login failed. Please try again.');
        }
    };
    return (
        <>
            <section className="login">
                <div className="container">
                    <form onSubmit={handleLogin}>
                        <h2>Login Your <span>Admin</span> Account</h2>
                        <input
                            type="Email"
                            name="Email"
                            placeholder="Email :"
                            value={Email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            name="Password"
                            placeholder="Password :"
                            value={Password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <button type="submit">LOGIN</button>
                    </form>
                </div>
            </section>
        </>
    )
}

export default Login