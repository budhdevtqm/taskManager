import React, { Fragment } from "react";
import { Route, Routes } from "react-router-dom";
import Auth from "./components/auth/Auth";
import Layout from "./components/layout/Layout";
import Dashboard from "./components/home/Dashboard";
import Profile from "./components/profile/Profile";
import Users from "./components/users/Users";
import Teams from "components/teams/Teams";
import TeamForm from "components/teams/TeamForm";
import Projects from "components/projects/Projects";
import ProjectForm from "components/projects/ProjectForm";
import Task from "components/home/Task";
import TaskForm from "components/home/TaskForm";
import UserForm from "components/users/UserForm";

const App: React.FC = () => {
  return (
    <Fragment>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/home">
            <Route index element={<Dashboard />} />
            <Route path="/home/task/:id" element={<Task />} />
            <Route path="/home/task/create" element={<TaskForm />} />
            <Route path="/home/task/update/:id" element={<TaskForm />} />
          </Route>
          <Route path="/profile" element={<Profile />} />
          <Route path="/users">
            <Route index element={<Users />} />
            <Route path="/users/update/:id" element={<UserForm />} />
            <Route path="/users/create" element={<UserForm />} />
          </Route>
          {/* <Route path="/teams">
            <Route index element={<Teams />} />
            <Route path="/teams/create" element={<TeamForm />} />
            <Route path="/teams/update/:id" element={<TeamForm />} />
          </Route> */}
          <Route path="/projects">
            <Route index element={<Projects />} />
            <Route path="/projects/create" element={<ProjectForm />} />
            <Route path="/projects/update/:id" element={<ProjectForm />} />
          </Route>
        </Route>
      </Routes>
    </Fragment>
  );
};

export default App;
