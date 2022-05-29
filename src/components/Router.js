import React from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Navigation from "components/Navigation";

export default function AppRouter({
  isLoggedIn,
  userObj,
  refreshUser,
  codeNum,
}) {
  return (
    <div>
      {/* Routes nest inside one another. Nested route paths build upon
            parent route paths, and nested route elements render inside
            parent route elements. See the note about <Outlet> below. */}
      <Router>
        <Routes>
          {isLoggedIn ? (
            <>
              <Route path="/" element={<Navigation />}>
                <Route
                  index
                  element={<Home userObj={userObj} codeNum={codeNum} />}
                />
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
            <>
              <Route exact path="/" element={<Auth />} />
              <Route path="*" element={<Navigate replace to="/" />} />
            </>
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
