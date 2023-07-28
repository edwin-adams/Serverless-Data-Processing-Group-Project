import React, {useEffect, useState} from 'react';
import {Box, Button, FormControl, FormLabel, Input, Text, VStack,} from '@chakra-ui/react';
import {updateUserDetails} from "./service/UpdateUserDetails";
import {UserModel} from "./user.model";

const UserEditPage = () => {
    // Sample user data
    const [userData, setUserData] = useState({
        userId: '12345',
        email: 'example@example.com',
        firstName: 'John',
        lastName: 'Doe',
    });

    useEffect(() => {
        const LoggedInUser = JSON.parse(localStorage.getItem('user'));
        userData.userId = LoggedInUser.user_id;
        userData.email = LoggedInUser.email;
        userData.firstName = LoggedInUser.first_name;
        userData.lastName = LoggedInUser.last_name;
        console.log(userData);
        setUserData(userData);
    }, []);

    // State to store user details
    const [user, setUser] = useState(userData);

    // State to track changes in first name and last name
    const [firstName, setFirstName] = useState(userData.firstName);
    const [lastName, setLastName] = useState(userData.lastName);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUser({...user, firstName, lastName});

        let newUser: UserModel = {
            firebase_user_id: JSON.parse(localStorage.getItem('user')).user_id,
            first_name: firstName,
            last_name: lastName,
            email: '',
            question1: '',
            question2: '',
            question3: '',
            answer1: '',
            answer2: '',
            answer3: ''
        };

        const updatedUser = await updateUserDetails(newUser);
        console.log(updatedUser);
    };

    useEffect(() => {
        setFirstName(user.firstName);
        setLastName(user.lastName);
    }, [user]);

    return (<>
            <Text fontSize="xl" fontWeight="bold">
                Edit User
            </Text>
            <Box p={4}>
                <VStack spacing={4} alignItems="flex-start">
                    <FormControl>
                        <FormLabel>User ID</FormLabel>
                        <Input type="text" value={user.userId} isReadOnly/>
                    </FormControl>

                    <FormControl>
                        <FormLabel>Email ID</FormLabel>
                        <Input type="email" value={user.email} isReadOnly/>
                    </FormControl>

                    <FormControl>
                        <FormLabel>First Name</FormLabel>
                        <Input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Last Name</FormLabel>
                        <Input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </FormControl>

                    <Button colorScheme="blue" onClick={handleSubmit}>
                        Save Changes
                    </Button>
                </VStack>
            </Box>
        </>
    );
};

export default UserEditPage;
