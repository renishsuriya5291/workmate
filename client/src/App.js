// src/App.js
import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FHome from "./Pages/FreeLancer/Home";
import CHome from "./Pages/Client/Home";
import FAbout from "./Pages/FreeLancer/About";
import CAbout from "./Pages/Client/About";
import FContact from "./Pages/FreeLancer/Contact";
import CContact from "./Pages/Client/Contact";
import Login from "./Pages/Login";
import ProtectedRoute from "./Components/ProtectedRoute";
import NotFound from "./Pages/NotFound";
import NavBar from "./Components/NavBar"; // Default Navbar for all pages except /
import NavBarLanding from "./Components/NavBar_landing"; // Separate Navbar for home page
import Footer from "./Components/Footer";
import Register from "./Pages/Register";
import { useDispatch, useSelector } from "react-redux";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import PageTransitionWrapper from "./Components/PageTransitionWrapper"; // Import the new component
import ScrollToTop from "./Components/ScrollTop";
import EditProfile from "./Pages/FreeLancer/Profile";
import axios from "axios";
import { setUser, logout, addAllPropsal } from "./react-redux/store";
import Proposals from "./Pages/Client/Proposals";
import Contract from "./Pages/Client/Contract";

function App() {
  const role = useSelector((state) => state.auth?.user?.role);
  const user = useSelector((state) => state.auth.user);
  const isAuth = useSelector((state) => state.auth?.isAuthenticated); // Check isAuthenticated from Redux
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/user", {
          withCredentials: true,
        });

        if (response.status === 200 && response.data.user) {
          dispatch(
            setUser({
              isAuthenticated: true,
              user: response.data.user,
            })
          );
        } else {
          dispatch(logout()); // Call logout to reset Redux state
          localStorage.removeItem("persist:root"); // Clear persisted state
        }
      } catch (error) {}
    };

    fetchUser();
  }, [dispatch]);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Home Route with NavBarLanding */}
        <Route
          path="/"
          element={
            <>
              {isAuth ? <NavBar role={role} /> : <NavBarLanding />}
              <PageTransitionWrapper>
                <Home />
              </PageTransitionWrapper>
            </>
          }
        />

        {/* Other routes with the default NavBar */}
        <Route
          path="/signin"
          element={
            <>
              <NavBarLanding />
              <PageTransitionWrapper>
                <Login />
              </PageTransitionWrapper>
            </>
          }
        />

        <Route
          path="/signup"
          element={
            <>
              <NavBarLanding />
              <PageTransitionWrapper>
                <Register />
              </PageTransitionWrapper>
            </>
          }
        />

        <Route
          path="/about"
          element={
            <>
              {isAuth ? <NavBar role={role} /> : <NavBarLanding />}
              <PageTransitionWrapper>
                <About />
              </PageTransitionWrapper>
            </>
          }
        />

        <Route
          path="/contact"
          element={
            <>
              {isAuth ? <NavBar role={role} /> : <NavBarLanding />}
              <PageTransitionWrapper>
                <Contact />
              </PageTransitionWrapper>
            </>
          }
        />

        {/* Protected Freelancer and Client routes */}
        <Route
          path="/freelancer/home"
          element={
            <>
              <NavBar role={role} />
              <PageTransitionWrapper>
                <ProtectedRoute>
                  <FHome />
                </ProtectedRoute>
              </PageTransitionWrapper>
            </>
          }
        />

        <Route
          path="/client/home/:jobId"
          element={
            <>
              <NavBar role={role} />
              <PageTransitionWrapper>
                <ProtectedRoute>
                  <Proposals />
                </ProtectedRoute>
              </PageTransitionWrapper>
            </>
          }
        />

        <Route
          path="/freelancer/about"
          element={
            <>
              <NavBar role={role} />
              <PageTransitionWrapper>
                <ProtectedRoute>
                  <FAbout />
                </ProtectedRoute>
              </PageTransitionWrapper>
            </>
          }
        />

        <Route
          path="/freelancer/contact"
          element={
            <>
              <NavBar role={role} />
              <PageTransitionWrapper>
                <ProtectedRoute>
                  <FContact />
                </ProtectedRoute>
              </PageTransitionWrapper>
            </>
          }
        />

        <Route
          path={`/${role}/profile`}
          element={
            <>
              <NavBar role={role} />
              <PageTransitionWrapper>
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              </PageTransitionWrapper>
            </>
          }
        />

        <Route
          path="/client/home"
          element={
            <>
              <NavBar role={role} />
              <PageTransitionWrapper>
                <ProtectedRoute>
                  <CHome />
                </ProtectedRoute>
              </PageTransitionWrapper>
            </>
          }
        />

        <Route
          path="/client/contract/:contractId"
          element={
            <>
              <NavBar role={role} />
              <PageTransitionWrapper>
                <ProtectedRoute>
                  <Contract />
                </ProtectedRoute>
              </PageTransitionWrapper>
            </>
          }
        />

        <Route
          path="/freelancer/contract/:contractId"
          element={
            <>
              <NavBar role={role} />
              <PageTransitionWrapper>
                <ProtectedRoute>
                  <Contract />
                </ProtectedRoute>
              </PageTransitionWrapper>
            </>
          }
        />

        <Route
          path="/client/about"
          element={
            <>
              <NavBar role={role} />
              <PageTransitionWrapper>
                <ProtectedRoute>
                  <CAbout />
                </ProtectedRoute>
              </PageTransitionWrapper>
            </>
          }
        />

        <Route
          path="/client/contact"
          element={
            <>
              <NavBar role={role} />
              <PageTransitionWrapper>
                <ProtectedRoute>
                  <CContact />
                </ProtectedRoute>
              </PageTransitionWrapper>
            </>
          }
        />

        {/* Catch-all route for 404 pages */}
        <Route
          path="*"
          element={
            <>
              <NavBar role={role} />
              <PageTransitionWrapper>
                <NotFound />
              </PageTransitionWrapper>
            </>
          }
        />
      </Routes>

      {/* Footer appears across all pages */}
      {/* <Footer role={role} /> */}
    </Router>
  );
}

export default App;
