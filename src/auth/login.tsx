import React, { useState } from 'react';
import 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { Box, Button, FormControl, FormLabel, Heading, Input } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Link as ChakraLink, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';


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

    const handleLogin = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        console.log(e);
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Login successful, do something with the user data
                console.log(userCredential.user);
            })
            .catch((error) => {
                console.log(email);
                console.log(password);
                console.log(error);
                alert(error);
            });
    };

    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/signup');
    };


    const handleGoogleLogin = () => {
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

                alert(errorMessage);
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
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

                </FormControl>
                <FormControl id="password" mb="4">
                    <FormLabel>Password</FormLabel>
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </FormControl>
                <Button colorScheme="blue" onClick={handleLogin} width="100%">
                    Login
                </Button>
                <Button colorScheme="blue" onClick={handleGoogleLogin}>
                    Log in using Google
                </Button>

                <Text>
                    <ChakraLink as={RouterLink} to="/forgot_password">Forgot Password?</ChakraLink>
                </Text>

                <Button colorScheme="red" onClick={handleClick}>
                    Sign Up
                </Button>
            </Box>
        </>
    );
};

export default Login;