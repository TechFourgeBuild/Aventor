import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AppHome from "./pages/AppHome"; // actual music app (after login)
import Search from "./pages/SearchBar";
import LikedSongs from "./pages/LikedSongs";
import Profile from "./pages/Profile";
import SongCredential from "./pages/SongCredential";
import PlayerBar from "./reactComponents/PlayerBar";
import Moods from "./pages/Moods";

import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "./services/supabase";
import {
  setUser,
  setSession,
  logout,
  setLoading,
} from "./store/slices/authSlice";


// ── Route Guards ──────────────────────────────────

const LoadingScreen = () => (
  <div
    style={{
      minHeight: "100vh",
      background: "#080811",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        width: 40,
        height: 40,
        border: "3px solid rgba(124,58,237,0.3)",
        borderTopColor: "#7c3aed",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }}
    />
    <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
  </div>
);

// Only accessible when NOT logged in
const PublicRoute = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);
  if (loading) return <LoadingScreen />;
  return user ? <Navigate to="/app" replace /> : children;
};

// Only accessible when logged in
const PrivateRoute = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);
  if (loading) return <LoadingScreen />;
  return user ? children : <Navigate to="/" replace />;
};

// ─────────────────────────────────────────────────────────────────────────────

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check session on app load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        dispatch(setUser(session.user));
        dispatch(setSession(session));
      } else {
        dispatch(setLoading(false));
      }
    });

    // Listen for ANY auth change
    // (login, logout, token refresh, Google OAuth return)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      //console.log("Auth event:", _event); // helpful for debugging

      if (_event === "TOKEN_REFRESHED") {
        // Silent refresh — just update Redux, no redirect
        dispatch(setUser(session.user));
        dispatch(setSession(session));
        return;
      }

      if (_event === "SIGNED_OUT") {
        dispatch(logout());
        // No need to navigate — PrivateRoute handles it
        return;
      }

      if (session) {
        dispatch(setUser(session.user));
        dispatch(setSession(session));
      } else {
        dispatch(logout());
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public routes (redirect to /app if logged in) */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Home />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />

          {/* Private routes (redirect to / if not logged in) */}
          <Route
            path="/app"
            element={
              <PrivateRoute>
                <AppHome />
              </PrivateRoute>
            }
          />
          <Route
            path="/app/search"
            element={
              <PrivateRoute>
                <Search />
              </PrivateRoute>
            }
          />
          <Route
            path="/app/liked"
            element={
              <PrivateRoute>
                <LikedSongs />
              </PrivateRoute>
            }
          />
          <Route
            path="/app/song/:id"
            element={
              <PrivateRoute>
                <SongCredential />
              </PrivateRoute>
            }
          />
          <Route
            path="/app/accounts"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/app/moods"
            element={
              <PrivateRoute>
                <Moods />
              </PrivateRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <PlayerBar />   
    </>
  );
}
//
export default App;
