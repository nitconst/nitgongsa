import React from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Outlet,
  Link,
  Navigate,
} from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Profile from "../routes/Profile";
import Navigation from "./Navigation";

export default function AppRouter({ isLoggedIn, userObj, refreshUser }) {
  return (
    <div>
      <h1>사외공사장 테스트</h1>
      {/* Routes nest inside one another. Nested route paths build upon
            parent route paths, and nested route elements render inside
            parent route elements. See the note about <Outlet> below. */}
      <Router>
        <Routes>
          {isLoggedIn ? (
            <>
              <Route path="/" element={<Navigation />}>
                {/* <Route index element={<Home />} />
                <Route path="about" element={<Register userObj = {userObj} />} /> */}
                <Route
                  path="profile"
                  element={
                    <Profile userObj={userObj} refreshUser={refreshUser} />
                  }
                />
                {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
              </Route>
              <Route path="*" element={<Navigate replace to="/" />} />
            </>
          ) : (
            <Route exact path="/" element={<Auth />} />
          )}
        </Routes>
      </Router>
    </div>
  );
}

function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}
