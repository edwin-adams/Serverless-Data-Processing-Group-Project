// router.js
import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./team_management/teamcreation";
import AcceptInvite from "./team_management/acceptInvite";
import RejectInvite from "./team_management/rejected";
import Accepted from "./team_management/accepted";
// import ChatComponent from "./chatbot";

// Always lazy load all components/modules
const Login = lazy(() => import("./auth/login"));
const SignUp = lazy(() => import("./auth/signup"));
const PasswordReset = lazy(() => import("./auth/PasswordReset"));

const AppRouter = () => {
  return (
    <>
      {/* <ChatComponent /> */}

      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" Component={Login} />
            <Route path="/signup" Component={SignUp} />
            <Route path="/forgot_password" Component={PasswordReset} />
            <Route path="/dashboard" Component={Dashboard} />
            <Route
              path="/acceptInvite/:teamName/:sender/:subscribee/:uuid"
              Component={AcceptInvite}
            />
            <Route path="/accepted" Component={Accepted} />

            <Route path="/rejected" Component={RejectInvite} />
          </Routes>
        </Suspense>
      </Router>
    </>
  );
};

export default AppRouter;
