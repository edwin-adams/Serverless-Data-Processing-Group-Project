import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@chakra-ui/react';

const Dashboard = () => {
    return (
        <>
            Logged in
            <Link to="/edituser">
                <Button colorScheme="blue">Edit User</Button>
            </Link>
        </>
    );
}

export default Dashboard;
