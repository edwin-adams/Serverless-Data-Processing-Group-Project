import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const firebaseConfig = {
        apiKey: "AIzaSyAzdpklV8zQ8UJTXTJ65Md9vBpQX5TnH8Q",
        authDomain: "serverless-5410-388502.firebaseapp.com",
        projectId: "serverless-5410-388502",
        storageBucket: "serverless-5410-388502.appspot.com",
        messagingSenderId: "998159362895",
        appId: "1:998159362895:web:e7fca9050356604001733a",
        measurementId: "G-XE225EJ9GV"
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const navigate = useNavigate();


    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
                const user = userCredential.user;
                sendEmailVerification(user)
                    .then(() => {
                        console.log('Verification email sent');
                    })
                    .catch((error) => {
                        console.error('Error sending verification email:', error);
                    });
                })
                .catch((error) => {
                    console.error('Error signing up:', error);
                });
            // Handle successful signup
            console.log('User signed up:', userCredential.user);

            navigate('/login');

        } catch (error) {
            // Handle signup error
            console.error('Signup error:', error);
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={handleSignup}>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;
function signInWithPopup(provider) {
    throw new Error('Function not implemented.');
}

