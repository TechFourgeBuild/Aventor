import React from "react";
import { Eye, EyeClosed } from "lucide-react";
import { useState, useEffect } from "react";
import { loginWithGoogle, loginWithEmail } from "../services/authService";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import {
  setUser,
  setSession,
  setError,
  setLoading,
} from "../store/slices/authSlice";

const Login = () => {
  const [show, IsShow] = useState(false);

  // ========= Track window width properly =========
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0,
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ email, password }) => {
    try {
      dispatch(setLoading(true));
      const data = await loginWithEmail(email, password);

      dispatch(setUser(data.user));
      dispatch(setSession(data.session));
      navigate("/app");
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      // No navigate needed here —
      // Google redirects back automatically
      // onAuthStateChange listener handles the rest
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

  return (
    <>
      {/* <div className="bg-gradient-to-br from-[#1a112e] via-[#4d0342] to-[#08070b]"> */}
      <div className="min-h-screen flex justify-center items-start bg-gradient-to-br from-[#1a112e] via-[#4d0342] to-[#08070b] px-4 pb-32">
        <div className="w-full max-w-sm">
          {" "}
          {/* border-2 border-red-500 */}
          <div
            style={{ marginTop: 23 }}
            className="flex items-center justify-center flex-col"
          >
            {/* === welcome user */}
            <h3
              style={{ fontFamily: "inherit" }}
              className="text-[24px] font-bold text-[#ffffff] font-serif"
            >
              Welcome to Aventor
            </h3>
            <p style={{ fontFamily: "initial" }} className="text-[#b4b2b2]">
              We've built a platform for All Music Lovers
            </p>
            {/* ======== */}
          </div>
          &nbsp;
          {/* ==== Continue with Google ====*/}
          <button
            type="button"
            style={{
              paddingTop: 12,
              paddingBottom: 12,
              width: "100%",
            }}
            onClick={handleGoogle}
            className=" bg-[#181818] text-white cursor-pointer hover:bg-[black]  active:scale-95 active:cursor-progress duration-300 flex justify-center items-center gap-3 rounded-md "
          >
            <img className="w-5" src="/google.svg" alt="logo" /> Continue with
            Google
          </button>
          {/* ================== */}
          {/* ✅ FORM with handleSubmit */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* ==== email and password fileds==== */}
            <div style={{ marginTop: 17 }} className="">
              <div className="flex flex-col">
                {/* ==== Email field==== */}
                <label
                  style={{ marginTop: 5, fontWeight: 550 }}
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  {...register("email", { required: true })}
                  style={{
                    paddingTop: 4,
                    paddingBottom: 4,
                    marginTop: 2,
                    paddingLeft: 10,
                  }}
                  className="border active:border active:border-[#8b8b8b] bg-[#dbd8d8] border-gray-300 rounded"
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your Email"
                />

                {/* ==================== */}

                {/*  ==== Password field ====*/}
                <label
                  style={{ marginTop: 14, fontWeight: 550 }}
                  htmlFor="password"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    {...register("password", { required: true, minLength: 8 })}
                    style={{
                      paddingTop: 4,
                      paddingBottom: 4,
                      marginTop: 2,
                      paddingRight: 30,
                      paddingLeft: 10,
                    }}
                    className="border  active:border active:border-[#8b8b8b] bg-[#dbd8d8] border-gray-300 rounded w-full"
                    type={show ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="Enter your Password"
                  />

                  {/* ====================== */}

                  {/* ===== Conditional Rendering for eye close and eye open */}
                  <div
                    onClick={() => IsShow(!show)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                  >
                    {show ? <Eye /> : <EyeClosed />}
                  </div>

                  {/* ==================== */}
                </div>
              </div>
            </div>
            {/* ============== */}
            {/* ======= Login account Button ======== */}
            {/* ✅ BUTTON inside form — type="submit" triggers handleSubmit */}
            <button
              type="submit"
              style={{
                paddingTop: 10,
                paddingBottom: 10,
                marginTop: 24,
                width: "100%",
              }}
              className="flex bg-blue-600 text-white  cursor-pointer hover:bg-blue-700  active:scale-95 active:cursor-progress duration-300 justify-center items-center gap-3 rounded-md"
            >
              {/* <img className="w-5" src="/google.svg" alt="logo" /> Continue with */}
              {/* Google */}
              Login
            </button>
            {/* ================== */}
          </form>
          {/* ====== Don't have an account ======= */}
          <div className="flex justify-center items-center ">
            <p className="text-[gray] font-extralight">
              Don't have an account?{" "}
              <span className="hover:text-blue-600 hover:underline cursor-pointer">
                <NavLink to="/signup">create</NavLink>
              </span>
            </p>
          </div>
          {/* ================================= */}
        </div>

        <footer
          className={`fixed bottom-0 ${windowWidth < 500 ? "hidden":""} h-[80px] w-full bg-gradient-to-br from-[#1a112e] via-[#270221] to-[#08070b] flex justify-between items-center px-8`}
        >
          {/* Left Side: Logo and Tagline */}

          {/* ============== Rendering Logo and the name of application */}
          <div className="flex items-center gap-3">
            <img
              src="/AventorLogo.png"
              alt="logo"
              className="object-cover w-12"
            />
            <div className="flex items-baseline gap-2">
              <span
                style={{
                  fontFamily: "'Syne',sans-serif",
                  fontWeight: 800,
                  fontSize: 16,
                  letterSpacing: "-0.02em",
                }}
                className="text-white"
              >
                Aventor
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.35)",
                }}
              >
                · Your Rhythm. Your Realm.
              </span>
            </div>
          </div>

          {/* =================================================  */}

          {/* ================== Rendering the copyright related text =================== */}
          {/* Right Side: Copyright Text */}
          <div
            style={{
              fontSize: 11,
              fontWeight: 400,
              color: "rgba(255,255,255,0.38)",
            }}
          >
            © 2026 Aventor. Built with 💖 for music lovers.
          </div>

          {/* ============================================================================  */}
        </footer>
      </div>

      {/* </div> */}
    </>
  );
};

export default Login;
