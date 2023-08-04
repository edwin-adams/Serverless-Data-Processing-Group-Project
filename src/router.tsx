// router.js
import React, {lazy, Suspense} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Header from './shared/header';
import Leaderboard from './leaderboard/leaderboard';

// Always lazy load all components/modules
const Login = lazy(() => import('./auth/login'));
const SignUp = lazy(() => import('./auth/signup'));
const PasswordReset = lazy(() => import('./auth/PasswordReset'));
const Game = lazy(() => import('./in-game-experinence/game'));
const Dashboard = lazy(() => import('./auth/Dashboard'));
const EditUser = lazy(() => import('./auth/EditUser'));

const AppRouter = () => {
    return (
        <Router>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/" Component={Login}/>
                    <Route path="/login" Component={Login}/>
                    <Route path="/signup" Component={SignUp}/>
                    <Route path='/forgot_password' Component={PasswordReset}/>
                    <Route path="/dashboard" Component={Dashboard}/>
                    <Route path="/game" Component={Game}/>
                    <Route path='/editUser' Component={EditUser}/>
                    <Route path="/leaderboard" Component={Leaderboard} />
                </Routes>
            </Suspense>
        </Router>
    );
};

export default AppRouter;
