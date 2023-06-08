// router.js
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './shared/header';

// Always lazy load all components/modules
const Login = lazy(() => import('./auth/login'));
const SignUp = lazy(() => import('./auth/signup'));
const PasswordReset = lazy(() => import('./auth/PasswordReset'));
const Dashboard = lazy(() => import('./in-game-experinence/dashboard'));
const Game = lazy(() => import('./in-game-experinence/game'));

const AppRouter = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" Component={Login} />
          <Route path="/login" Component={Login} />
          <Route path="/signup" Component={SignUp} />
          <Route path='/forgot_password' Component={PasswordReset}/>
          <Route path="/dashboard" Component={Dashboard} />
          <Route path="/game" Component={Game} />
          
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRouter;
