import React, { useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";

import axios from "axios";

const backUrl = process.env.REACT_APP_BACKEND_URL_USER;

//isuser 삼항연산자

const Navigation = ({ userObj }) => {
  const [isType, setIsType] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const q = {
        phone: userObj.displayName,
      };
      await axios
        .get(backUrl, { params: q })
        .then((res) => {
          if (res.data === "") {
            setIsType(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchData();

    // const type = query(
    //   collection(dbService, "usertype"),
    //   where("phone", "==", userObj.displayName)
    // );
    // onSnapshot(type, (snapshot) => {
    //   const typearr = snapshot.docs.map((doc) => ({
    //     id: doc.id,
    //     ...doc.data(),
    //   }));

    //   if (typearr == "") {
    //     setIsType(false);
    //   }
    // });
  }, []);

  return (
    <>
      {isType ? (
        <div>
          {/* A "layout route" is a good place to put markup you want to
            share across all the pages on your site, like navigation. */}
          <nav>
            <div className="nav-header">
              <div className="nav-content">
                <div className="nav-brand"></div>
                <div className="nav-ul">
                  <ul
                    style={{
                      display: "flex",
                      justifyContent: "right",
                      paddingTop: 20,
                      marginRight: 20,
                    }}
                  >
                    <li>
                      <Link to="/">
                        <span className="icon-text is-large">
                          <span className="icon ">
                            <i className="fas fa-lg fa-home"></i>
                          </span>
                          <span>홈</span>
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/profile"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <span className="icon-text is-large">
                          <span className="icon ">
                            <i className="fas fa-lg fa-user"></i>
                          </span>
                          <span>My</span>
                        </span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </nav>

          {/* An <Outlet> renders whatever child route is currently active,
            so you can think about this <Outlet> as a placeholder for
            the child routes we defined above. */}
          <Outlet />
        </div>
      ) : (
        <div>
          {/* A "layout route" is a good place to put markup you want to
          share across all the pages on your site, like navigation. */}
          <nav>
            <div className="nav-header">
              <div className="nav-content">
                <div className="nav-brand"></div>
                <div className="nav-ul">
                  <ul
                    style={{
                      display: "flex",
                      justifyContent: "right",
                      paddingTop: 20,
                      marginRight: 20,
                    }}
                  ></ul>
                </div>
              </div>
            </div>
          </nav>

          {/* An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. */}
          <Outlet />
        </div>
      )}
    </>
  );
};

export default Navigation;
