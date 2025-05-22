import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, UserCircle, Mail, Lock, CheckCircle } from "lucide-react";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Password dan Konfirmasi Password tidak cocok!");
      return;
    }
    // TODO: Tambahkan logika registrasi di sini
    console.log("Full Name:", fullName);
    console.log("Email:", email);
    console.log("Password:", password);
    // navigate('/signin');
  };

  const handleGoogleSignUp = () => {
    // TODO: Tambahkan logika sign up Google di sini
    console.log("Sign up with Google");
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-16 left-16 w-40 h-40 bg-purple-800 rounded-full opacity-5 blur-2xl"></div>
      <div className="absolute bottom-16 right-16 w-48 h-48 bg-blue-800 rounded-full opacity-5 blur-2xl"></div>
      <div className="absolute top-1/3 left-1/3 w-32 h-32 bg-indigo-800 rounded-full opacity-3 blur-xl"></div>
      <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-purple-700 rounded-full opacity-3 blur-lg"></div>

      <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800/60 shadow-2xl rounded-2xl p-8 md:p-12 w-full max-w-lg relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Buat Akun Outfitly
          </h1>
          <p className="text-gray-400 text-sm">
            Gabung dan temukan inspirasi gayamu!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <UserCircle className="text-gray-500 w-5 h-5" />
              </div>
              <input
                type="text"
                name="fullname"
                id="fullname"
                className="bg-gray-800/50 border border-gray-700/50 text-white text-sm rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent block w-full pl-12 pr-4 py-3 placeholder-gray-500 transition-all duration-200"
                placeholder="Nama Kamu"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="text-gray-500 w-5 h-5" />
              </div>
              <input
                type="email"
                name="email_signup"
                id="email_signup"
                className="bg-gray-800/50 border border-gray-700/50 text-white text-sm rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent block w-full pl-12 pr-4 py-3 placeholder-gray-500 transition-all duration-200"
                placeholder="kamu@contoh.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="text-gray-500 w-5 h-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password_signup"
                id="password_signup"
                className="bg-gray-800/50 border border-gray-700/50 text-white text-sm rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent block w-full pl-12 pr-4 py-3 placeholder-gray-500 transition-all duration-200"
                placeholder="Minimal 8 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-3 right-3"
              >
                {showPassword ? (
                  <Eye className="w-5 h-5 text-gray-500" />
                ) : (
                  <EyeOff className="w-5 h-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <CheckCircle className="text-gray-500 w-5 h-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="confirm_password"
                id="confirm_password"
                className="bg-gray-800/50 border border-gray-700/50 text-white text-sm rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent block w-full pl-12 pr-4 py-3 placeholder-gray-500 transition-all duration-200"
                placeholder="Ulangi password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-3 right-3"
              >
                {showPassword ? (
                  <Eye className="w-5 h-5 text-gray-500" />
                ) : (
                  <EyeOff className="w-5 h-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black font-medium rounded-xl py-3 px-6 hover:bg-gray-100 focus:ring-4 focus:ring-white/20 transition-all duration-200 transform hover:scale-105 mt-6"
          >
            SIGN UP
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900/60 text-gray-400">atau</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="w-full bg-gray-800/50 border border-gray-700/50 text-white font-medium rounded-xl py-3 px-6 hover:bg-gray-700/50 focus:ring-4 focus:ring-gray-600/20 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Daftar dengan Google</span>
          </button>

          <p className="text-sm text-gray-400 text-center mt-6">
            Sudah punya akun?{" "}
            <Link
              to="/signin"
              className="text-white hover:text-purple-300 font-medium transition-colors duration-200"
            >
              Sign In disini
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
