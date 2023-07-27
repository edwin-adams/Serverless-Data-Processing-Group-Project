import React, {useState} from 'react';
import 'firebase/auth';
import {initializeApp} from 'firebase/app';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import {Box, Button, FormControl, FormLabel, Heading, Input, Link as ChakraLink, Text} from '@chakra-ui/react';
import {Link as RouterLink} from 'react-router-dom';
import {firebaseConfig} from "../CloudConfig/getFirebaseConfig";
import {signUpWithGoogle} from "./service/signInAndSignUpusingGoogleAccount";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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


    const handleGoogleLogin = async () => {
        const user = await signUpWithGoogle();
        console.log(user);
    };

    return (
        <>
            <Box maxW="md" m="auto" p="4">
                <Heading size="lg" textAlign="center" mb="6">
                    Login
                </Heading>
                <FormControl id="email" mb="4">
                    <FormLabel>Email</FormLabel>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </FormControl>
                <FormControl id="password" mb="2">
                    <FormLabel>Password</FormLabel>
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </FormControl>
                <Box display="flex" justifyContent="flex-end" mb="6">
                    <Text>
                        <ChakraLink as={RouterLink} to="/forgot_password">
                            Forgot Password?
                        </ChakraLink>
                    </Text>
                </Box>
                <Button colorScheme="blue" onClick={handleLogin} width="100%" mb="4">
                    Login
                </Button>
                <Button colorScheme="blue" onClick={handleGoogleLogin} width="100%" mb="8">
                    Log in using Google
                </Button>

                <Button as={RouterLink} to="/signup" colorScheme="red" width="100%" mb="4">
                    Sign Up
                </Button>

                <Button as={RouterLink} to="/signup?social_account=google" colorScheme="red" width="100%">
                    Sign Up using Google
                </Button>
            </Box>
        </>
    );
};

export default Login;