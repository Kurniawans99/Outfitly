import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Eye,
  EyeOff,
  UserCircle,
  Mail,
  Lock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const changeBackgroundColor = (
  e: React.MouseEvent<HTMLElement>,
  color: string
) => {
  e.currentTarget.style.backgroundColor = color;
};

const changeTextColor = (e: React.MouseEvent<HTMLElement>, color: string) => {
  e.currentTarget.style.color = color;
};

const SignUp: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError("Password and Confirm Password do not match!");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_BASE_URL + "/auth/sign-up",
        {
          username: username,
          email: email,
          password: password,
        }
      );

      setIsLoading(false);
      console.log("Sign up berhasil:", response.data);
      setSuccessMessage(
        response.data.message || "Registration successful! Please login."
      );

      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (err: any) {
      setIsLoading(false);
      console.error("Error saat sign up:", err);
      if (axios.isAxiosError(err) && err.response) {
        setError(
          err.response.data.message ||
            "Failed to register. Email may already be in use or input is invalid."
        );
      } else if (err.request) {
        setError(
          "Unable to connect to server. Check your internet connection."
        );
      } else {
        setError("An unknown error occurred. Please try again.");
      }
    }
  };

  const handleGoogleSignUp = () => {
    console.log("Sign up with Google");
    setError("The list with Google feature has not been implemented yet.");
  };

  return (
    // DIUBAH: Mengganti min-h-screen menjadi h-screen untuk memastikan tinggi pas dengan layar
    <div className="h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden ">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-16 w-72 h-72 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-16 w-80 h-80 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-32 left-32 w-64 h-64 bg-gradient-to-r from-indigo-200 to-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-400 rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-purple-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-indigo-400 rounded-full animate-bounce"></div>
        <div
          className="absolute inset-0 bg-white/20"
          style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, rgba(99, 102, 241, 0.05) 2px, transparent 2px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* DIUBAH: Mengurangi padding vertikal dari p-8 md:p-12 menjadi p-6 md:p-8 */}
      <div
        className="backdrop-blur-sm bg-white/95 border border-gray-200/50 rounded-3xl p-6 md:p-8 w-full max-w-md relative z-10 
             shadow-2xl 
             transition-all duration-300 ease-in-out 
             hover:shadow-2xl hover:shadow-blue-300 hover:-translate-y-1"
      >
        {/* DIUBAH: Mengurangi margin bawah dari mb-8 menjadi mb-6 */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r bg-gray-900 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <UserCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Buat Akun Outfitly
          </h1>
          <p className="text-gray-600">Gabung dan temukan inspirasi gayamu!</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center">
            <AlertCircle className="w-5 h-5 mr-3 text-red-500 flex-shrink-0" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 flex items-center">
            <CheckCircle className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" />
            <span className="text-sm text-green-700">{successMessage}</span>
          </div>
        )}

        {/* DIUBAH: Mengurangi jarak antar elemen form dari space-y-6 menjadi space-y-4 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <UserCircle className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              name="fullname"
              id="fullname"
              // DIUBAH: Mengurangi padding vertikal input dari py-4 menjadi py-3
              className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full pl-12 pr-4 py-3 transition-all duration-200 hover:bg-gray-100 focus:bg-white"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="email"
              name="email_signup"
              id="email_signup"
              // DIUBAH: Mengurangi padding vertikal input dari py-4 menjadi py-3
              className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full pl-12 pr-4 py-3 transition-all duration-200 hover:bg-gray-100 focus:bg-white"
              placeholder="Email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password_signup"
              id="password_signup"
              // DIUBAH: Mengurangi padding vertikal input dari py-4 menjadi py-3
              className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full pl-12 pr-12 py-3 transition-all duration-200 hover:bg-gray-100 focus:bg-white"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              // DIUBAH: Menyesuaikan posisi ikon mata
              className="absolute top-1/2 -translate-y-1/2 right-4 hover:opacity-80 transition-opacity"
              disabled={isLoading}
            >
              {showPassword ? (
                <Eye className="w-5 h-5 text-gray-400" />
              ) : (
                <EyeOff className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <CheckCircle className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="confirm_password"
              id="confirm_password"
              // DIUBAH: Mengurangi padding vertikal input dari py-4 menjadi py-3
              className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full pl-12 pr-4 py-3 transition-all duration-200 hover:bg-gray-100 focus:bg-white"
              placeholder="Ulangi password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            // DIUBAH: Menambah margin atas (pt-2) untuk memberi sedikit ruang ekstra setelah input terakhir
            className="w-full bg-gray-900 text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center pt-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            ) : (
              "SIGN UP"
            )}
          </button>

          {/* DIUBAH: Mengurangi margin vertikal divider dari my-8 menjadi my-4 */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/95 text-gray-500">atau</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignUp}
            // DIUBAH: Mengurangi padding vertikal tombol dari py-4 menjadi py-3
            className="w-full bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-xl py-3 px-6 focus:ring-4 focus:ring-gray-200 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
            disabled={isLoading}
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

          {/* DIUBAH: Mengurangi margin atas dari mt-8 menjadi mt-4 */}
          <p className="text-sm text-center text-gray-600 mt-4">
            Sudah punya akun?{" "}
            <Link
              to="/signin"
              className="font-semibold text-sky-600 hover:text-blue-700 hover:underline transition-colors duration-200"
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
