import React, { useState } from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
} from '@chakra-ui/react';
import {  getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { initializeApp } from 'firebase/app';


const PasswordReset = () => {
    const [email, setEmail] = useState('');
    const [isResetSent, setIsResetSent] = useState(false);
  

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


    const handlePasswordReset = async () => {
      try {
        await sendPasswordResetEmail(auth, email);
        setIsResetSent(true);
      } catch (error) {
        console.error(error);
      }
    };
  
    return (
      <Box maxW="md" m="auto" p="4">
        <Heading size="lg" textAlign="center" mb="6">
          Password Reset
        </Heading>
        {isResetSent ? (
          <p>Password reset link sent to your email.</p>
        ) : (
          <>
            <FormControl id="email" mb="4">
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <Button
              colorScheme="blue"
              onClick={handlePasswordReset}
              width="100%"
            >
              Reset Password
            </Button>
          </>
        )}
      </Box>
    );
  };
  
  export default PasswordReset;
  