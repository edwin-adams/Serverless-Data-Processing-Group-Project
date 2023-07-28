// router.js
import React, {lazy, Suspense} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

// Always lazy load all components/modules
const Login = lazy(() => import('./auth/login'));
const SignUp = lazy(() => import('./auth/signup'));
const PasswordReset = lazy(() => import('./auth/PasswordReset'));
const Dashboard = lazy(() => import('./auth/Dashboard'));

const AppRouter = () => {
    return (
        <Router>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/" Component={Login}/>
                    <Route path="/signup" Component={SignUp}/>
                    <Route path='/forgot_password' Component={PasswordReset}/>
                    <Route path='/dashboard' Component={Dashboard}/>
                </Routes>
            </Suspense>
        </Router>
    );
};

export default AppRouter;
