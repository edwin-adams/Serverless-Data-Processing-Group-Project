import React, {useEffect, useRef, useState} from 'react';
import {initializeApp} from 'firebase/app';
import {createUserWithEmailAndPassword, getAuth, sendEmailVerification} from 'firebase/auth';
import {useLocation, useNavigate} from 'react-router-dom';
import {firebaseConfig} from "../CloudConfig/getFirebaseConfig";
import {Box, Button, FormControl, FormLabel, Heading, Input, Select,} from '@chakra-ui/react';
import {putDataToDynamo} from "./service/storeUserToDynamo";
import {signUpWithGoogle} from "./service/signInAndSignUpusingGoogleAccount";
import {fetchData, putData} from "./service/RestCall";

const GET_getQuestionsFromDynamo = 'https://30quej290j.execute-api.us-east-1.amazonaws.com/prod';

const Signup = () => {

    const PUT_storeUserToDynamoDB: string = 'https://csxvr7woxf.execute-api.us-east-1.amazonaws.com/prod';

    const emailRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const firstnameRef = useRef<HTMLInputElement | null>(null);
    const lastnameRef = useRef<HTMLInputElement | null>(null);
    const q1Ref = useRef<HTMLSelectElement | null>(null);
    const a1Ref = useRef<HTMLInputElement | null>(null);
    const q2Ref = useRef<HTMLSelectElement | null>(null);
    const a2Ref = useRef<HTMLInputElement | null>(null);
    const q3Ref = useRef<HTMLSelectElement | null>(null);
    const a3Ref = useRef<HTMLInputElement | null>(null);

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const navigate = useNavigate();

    const [questionsFromDynamoDB, setQuestions] = useState<string[]>([]);

    const [isSignUpUsingSocial, setSocial] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        console.log(searchParams.get('social_account'));
        setSocial(searchParams.get('social_account') !== null);
        fetchData(GET_getQuestionsFromDynamo).then((data) => {
            data = JSON.parse(data['body']);
            setQuestions(data);
        });
    }, []);

    const handleSignup = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        try {
            await createUserWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value).then((userCredential) => {
                console.log(userCredential);

                const user = userCredential.user;
                console.log(user);
                const payload = {
                    firebase_user_id: user.uid,
                    first_name: firstnameRef.current.value,
                    last_name: lastnameRef.current.value,
                    question1: q1Ref.current.value,
                    answer1: a1Ref.current.value,
                    question2: q2Ref.current.value,
                    answer2: a2Ref.current.value,
                    question3: q3Ref.current.value,
                    answer3: a3Ref.current.value,
                    email: emailRef.current.value
                };
                putData(PUT_storeUserToDynamoDB, payload).then((isDataUpdated) => {
                    console.log(isDataUpdated);
                    sendEmailVerification(user)
                        .then(() => {
                            console.log('Verification email sent');
                        })
                        .catch((error) => {
                            console.error('Error sending verification email:', error);
                        });
                })
            })
                .catch((error) => {
                    console.error('Error signing up:', error);
                }).finally(() => {
                    navigate('/');

                });
        } catch (error) {
            console.error('Signup error:', error);
        }
    };


    const handleGoogleLogin = async () => {
        const user = await signUpWithGoogle();
        console.log(user);
        const userToSave = {
            firebase_user_id: user.uid,
            first_name: user.displayName.split(" ")[0].trim(),
            last_name: user.displayName.split(" ")[1].trim(),
            question1: q1Ref.current.value,
            answer1: a1Ref.current.value,
            question2: q2Ref.current.value,
            answer2: a2Ref.current.value,
            question3: q3Ref.current.value,
            answer3: a3Ref.current.value,
            email: user.email
        };
        putDataToDynamo(userToSave).then((isUserSaved) => {
            if (isUserSaved) {
                console.log("Login Success with Social Media account: Google ")
            } else {
                console.error("Google login success but user info not saved in dynamodb")
            }
        });
    };
    return (
        <>
            <Box maxW="md" mx="auto" p="4">
                <Heading mb="4">Sign Up</Heading>
                <form onSubmit={handleSignup}>
                    {!isSignUpUsingSocial && <FormControl mb="4">
                        <FormLabel>Email:</FormLabel>
                        <Input
                            type="email"
                            // value={email}
                            ref={emailRef}
                            // onChange={(e) => setEmail(e.target.value)}
                            variant="outline"
                            size="md"
                        />
                    </FormControl>
                    }
                    {!isSignUpUsingSocial &&
                        <FormControl mb="4">
                            <FormLabel>Password:</FormLabel>
                            <Input
                                type="password"
                                variant="outline"
                                size="md"
                                ref={passwordRef}
                            />
                        </FormControl>
                    }
                    {!isSignUpUsingSocial &&
                        <FormControl mb="4">
                            <FormLabel>First Name:</FormLabel>
                            <Input
                                type="text"
                                ref={firstnameRef}
                                variant="outline"
                                size="md"
                            />
                        </FormControl>
                    }
                    {!isSignUpUsingSocial &&
                        <FormControl mb="4">
                            <FormLabel>Last Name:</FormLabel>
                            <Input
                                type="text"
                                ref={lastnameRef}
                                variant="outline"
                                size="md"
                            />
                        </FormControl>
                    }
                    <FormControl mb="4">
                        <FormLabel>Question 1:</FormLabel>
                        <Select
                            ref={q1Ref}
                            variant="outline"
                            size="md"
                        >
                            {questionsFromDynamoDB.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl mb="4">
                        <FormLabel>Answer 1:</FormLabel>
                        <Input
                            type="text"
                            ref={a1Ref}
                            variant="outline"
                            size="md"
                        />
                    </FormControl>
                    <FormControl mb="4">
                        <FormLabel>Question 2:</FormLabel>
                        <Select
                            ref={q2Ref}
                            variant="outline"
                            size="md"
                        >
                            {questionsFromDynamoDB.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </Select>

                    </FormControl>
                    <FormControl mb="4">
                        <FormLabel>Answer 2:</FormLabel>
                        <Input
                            type="text"
                            ref={a2Ref}
                            variant="outline"
                            size="md"
                        />
                    </FormControl>
                    <FormControl mb="4">
                        <FormLabel>Question 3:</FormLabel>
                        <Select
                            ref={q3Ref}
                            variant="outline"
                            size="md"
                        >
                            {questionsFromDynamoDB.map((option, index) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </Select>

                    </FormControl>
                    <FormControl mb="4">
                        <FormLabel>Answer 3:</FormLabel>
                        <Input
                            type="text"
                            ref={a3Ref}
                            variant="outline"
                            size="md"
                        />
                    </FormControl>
                    {!isSignUpUsingSocial &&
                        <Button type="submit" colorScheme="blue" mr="4">
                            Sign Up
                        </Button>
                    }
                    {isSignUpUsingSocial &&
                        <Button colorScheme="blue" onClick={handleGoogleLogin}>
                            Sign up using Google
                        </Button>
                    }
                </form>
            </Box>

        </>
    );
};

export default Signup;