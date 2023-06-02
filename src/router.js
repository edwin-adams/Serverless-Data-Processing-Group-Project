// router.js
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


// Always lazy load all components/modules
const Login = lazy(() => import('./auth/login'));
const SignUp = lazy(() => import('./auth/signup'));

const AppRouter = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/login" Component={Login} />
          <Route path="/signup" Component={SignUp} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRouter;
