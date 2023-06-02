import React, { useState } from 'react';
import firebase, { initializeApp } from 'firebase/app';
import 'firebase/auth';
import { GoogleAuthProvider, getAuth, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { Box, Button, FormControl, FormLabel, Heading, Input } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

    const handleLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Login successful, do something with the user data
                console.log(userCredential.user);
            })
            .catch((error) => {
                // Login error, handle the error
                console.log(error);
            });
    };

    const navigate = useNavigate();

    const handleClick = () => {
        // Navigate to the desired page
        navigate('/signup');
    };


    const handleGoogleLogin = (e) => {
        const provider = new GoogleAuthProvider();
        const auth = getAuth();
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential?.accessToken;
                // The signed-in user info.
                const user = result.user;
                // IdP data available using getAdditionalUserInfo(result)
                // ...

                console.log(token);
                console.log(user);
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);

                console.log(errorCode);

                console.log(errorMessage);

                console.log(email);

                console.log(credential);
                // ...
            });
    };

    return (
        <>
            <Box maxW="md" m="auto" p="4">
                <Heading size="lg" textAlign="center" mb="6">
                    Login
                </Heading>
                <FormControl id="email" mb="4">
                    <FormLabel>Email</FormLabel>
                    <Input type="email" />
                </FormControl>
                <FormControl id="password" mb="4">
                    <FormLabel>Password</FormLabel>
                    <Input type="password" />
                </FormControl>
                <Button colorScheme="blue" onClick={handleLogin} width="100%">
                    Login
                </Button>
                <Button colorScheme="blue" onClick={handleGoogleLogin}>
                    Log in using Google
                </Button>
                <Button colorScheme="red" onClick={handleClick}>
                    Sign Up
                </Button>
            </Box>
            {/* <div>
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <div>
                        <label>Email:</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit">Login</button>
                </form>
                </div> */}


        </>
    );
};





export default Login;
