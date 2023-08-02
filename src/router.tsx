// router.js
import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Always lazy load all components/modules
const Login = lazy(() => import("./auth/login"));
const SignUp = lazy(() => import("./auth/signup"));
const PasswordReset = lazy(() => import("./auth/PasswordReset"));
const Dashboard = lazy(() => import("./auth/Dashboard"));
const EditUser = lazy(() => import("./auth/EditUser"));
const TeamPage = lazy(() => import("./team_management/teamPage"));
const Accepted = lazy(() => import("./team_management/accepted"));
const RejectInvite = lazy(() => import("./team_management/rejected"));
const AcceptInvite = lazy(() => import("./team_management/acceptInvite"));
const TeamDashboard = lazy(() => import("./team_management/teamcreation"));

const AppRouter = () => {
  return (
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
          <Route path="/editUser" Component={EditUser} />
          <Route path="/teamDashboard" Component={TeamDashboard} />
          <Route path="/team/:teamId" Component={TeamPage} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRouter;
