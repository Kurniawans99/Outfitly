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
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate(); // Hook untuk navigasi

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
        import.meta.env.VITE_API_BASE_URL + "/api/auth/sign-up",
        {
          name: fullName,
          email: email,
          password: password,
        }
      );

      setIsLoading(false);
      console.log("Sign up berhasil:", response.data);
      setSuccessMessage(
        response.data.message || "Registration successful! Please login."
      );

      // Kosongkan form setelah berhasil
      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Redirect ke halaman login setelah beberapa detik
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (err: any) {
      setIsLoading(false);
      console.error("Error saat sign up:", err);
      if (axios.isAxiosError(err) && err.response) {
        // Backend mengembalikan pesan error
        setError(
          err.response.data.error ||
            "Failed to register. Email may already be in use or input is invalid."
        );
      } else if (err.request) {
        // Request dibuat tapi tidak ada respons
        setError(
          "Unable to connect to server. Check your internet connection."
        );
      } else {
        // Error lainnya
        setError("An unknown error occurred. Please try again.");
      }
    }
  };

  const handleGoogleSignUp = () => {
    // TODO: Tambahkan logika sign up Google di sini
    // Mirip dengan login Google, arahkan ke endpoint backend
    // Contoh: window.location.href = 'http://localhost:5500/api/auth/google/signup'; (jika ada endpoint terpisah)
    // atau window.location.href = 'http://localhost:5500/api/auth/google'; (jika endpointnya sama)
    console.log("Sign up with Google");
    setError("The list with Google feature has not been implemented yet.");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #2F4156 0%, #567C8D 50%, #C8D9E6 100%)",
      }}
    >
      {/* Background decorative elements (tetap sama) */}
      <div
        className="absolute top-16 left-16 w-40 h-40 rounded-full opacity-10 blur-2xl"
        style={{ backgroundColor: "#567C8D" }}
      />
      <div
        className="absolute bottom-16 right-16 w-48 h-48 rounded-full opacity-10 blur-2xl"
        style={{ backgroundColor: "#2F4156" }}
      />
      <div
        className="absolute top-1/3 left-1/3 w-32 h-32 rounded-full opacity-8 blur-xl"
        style={{ backgroundColor: "#F5EFEB" }}
      />
      <div
        className="absolute bottom-1/3 right-1/3 w-24 h-24 rounded-full opacity-8 blur-lg"
        style={{ backgroundColor: "#567C8D" }}
      />

      <div
        className="backdrop-blur-xl border shadow-2xl rounded-2xl p-8 md:p-12 w-full max-w-lg relative z-10"
        style={{
          backgroundColor: "rgba(47, 65, 86, 0.85)",
          borderColor: "rgba(86, 124, 141, 0.3)",
        }}
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: "#F5EFEB" }}>
            Buat Akun Outfitly
          </h1>
          <p className="text-sm" style={{ color: "#C8D9E6" }}>
            Gabung dan temukan inspirasi gayamu!
          </p>
        </div>

        {/* === Area Pesan Error === */}
        {error && (
          <div
            className="mb-4 p-3 rounded-md flex items-center"
            style={{
              backgroundColor: "rgba(234, 67, 53, 0.2)",
              border: "1px solid rgba(234, 67, 53, 0.5)",
            }}
          >
            <AlertCircle
              className="w-5 h-5 mr-2"
              style={{ color: "#EA4335" }}
            />
            <span className="text-sm" style={{ color: "#F5EFEB" }}>
              {error}
            </span>
          </div>
        )}

        {/* === Area Pesan Sukses === */}
        {successMessage && (
          <div
            className="mb-4 p-3 rounded-md flex items-center"
            style={{
              backgroundColor: "rgba(52, 168, 83, 0.2)",
              border: "1px solid rgba(52, 168, 83, 0.5)",
            }}
          >
            <CheckCircle
              className="w-5 h-5 mr-2"
              style={{ color: "#34A853" }}
            />
            <span className="text-sm" style={{ color: "#F5EFEB" }}>
              {successMessage}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <UserCircle className="w-5 h-5" style={{ color: "#C8D9E6" }} />
            </div>
            <input
              type="text"
              name="fullname"
              id="fullname"
              className="border text-sm rounded-xl focus:ring-2 focus:ring-[#567C8D] focus:border-transparent block w-full pl-12 pr-4 py-3 transition-all duration-200"
              style={{
                backgroundColor: "rgba(86, 124, 141, 0.2)",
                borderColor: "rgba(200, 217, 230, 0.3)",
                color: "#F5EFEB",
              }}
              placeholder="Nama Kamu"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {/* Email Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="w-5 h-5" style={{ color: "#C8D9E6" }} />
            </div>
            <input
              type="email"
              name="email_signup"
              id="email_signup"
              className="border text-sm rounded-xl focus:ring-2 focus:ring-[#567C8D] focus:border-transparent block w-full pl-12 pr-4 py-3 transition-all duration-200"
              style={{
                backgroundColor: "rgba(86, 124, 141, 0.2)",
                borderColor: "rgba(200, 217, 230, 0.3)",
                color: "#F5EFEB",
              }}
              placeholder="kamu@contoh.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="w-5 h-5" style={{ color: "#C8D9E6" }} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password_signup"
              id="password_signup"
              className="border text-sm rounded-xl focus:ring-2 focus:ring-[#567C8D] focus:border-transparent block w-full pl-12 pr-4 py-3 transition-all duration-200"
              style={{
                backgroundColor: "rgba(86, 124, 141, 0.2)",
                borderColor: "rgba(200, 217, 230, 0.3)",
                color: "#F5EFEB",
              }}
              placeholder="Minimal 8 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-3 right-3 hover:opacity-80 transition-opacity"
              disabled={isLoading}
            >
              {showPassword ? (
                <Eye className="w-5 h-5" style={{ color: "#C8D9E6" }} />
              ) : (
                <EyeOff className="w-5 h-5" style={{ color: "#C8D9E6" }} />
              )}
            </button>
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <CheckCircle className="w-5 h-5" style={{ color: "#C8D9E6" }} />
            </div>
            <input
              type={showPassword ? "text" : "password"} // Toggle type based on showPassword
              name="confirm_password"
              id="confirm_password"
              className="border text-sm rounded-xl focus:ring-2 focus:ring-[#567C8D] focus:border-transparent block w-full pl-12 pr-4 py-3 transition-all duration-200"
              style={{
                backgroundColor: "rgba(86, 124, 141, 0.2)",
                borderColor: "rgba(200, 217, 230, 0.3)",
                color: "#F5EFEB",
              }}
              placeholder="Ulangi password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full font-medium rounded-xl py-3 px-6 focus:ring-4 transition-all duration-200 transform hover:scale-105 mt-6 flex justify-center items-center"
            style={{
              backgroundColor: isLoading ? "#C8D9E6" : "#F5EFEB",
              color: "#2F4156",
              boxShadow: "0 4px 12px rgba(245, 239, 235, 0.2)",
            }}
            onMouseEnter={(e) =>
              !isLoading && changeBackgroundColor(e, "#FFFFFF")
            }
            onMouseLeave={(e) =>
              !isLoading && changeBackgroundColor(e, "#F5EFEB")
            }
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
            ) : (
              "SIGN UP"
            )}
          </button>

          {/* Divider (tetap sama) */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div
                className="w-full border-t"
                style={{ borderColor: "rgba(86, 124, 141, 0.4)" }}
              />
            </div>
            <div className="relative flex justify-center text-sm">
              <span
                className="px-2"
                style={{
                  backgroundColor: "rgba(47, 65, 86, 0.85)",
                  color: "#C8D9E6",
                }}
              >
                atau
              </span>
            </div>
          </div>

          {/* Google Sign Up (Tombol didisable saat loading) */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="w-full border font-medium rounded-xl py-3 px-6 focus:ring-4 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-3"
            style={{
              backgroundColor: isLoading
                ? "rgba(86, 124, 141, 0.1)"
                : "rgba(86, 124, 141, 0.3)",
              borderColor: "rgba(200, 217, 230, 0.3)",
              color: "#F5EFEB",
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) =>
              !isLoading && changeBackgroundColor(e, "rgba(86, 124, 141, 0.5)")
            }
            onMouseLeave={(e) =>
              !isLoading && changeBackgroundColor(e, "rgba(86, 124, 141, 0.3)")
            }
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

          <p className="text-sm text-center mt-6" style={{ color: "#C8D9E6" }}>
            Sudah punya akun?{" "}
            <Link
              to={"/signin"}
              className="font-medium transition-colors duration-200"
              style={{ color: "#F5EFEB" }}
              onMouseEnter={(e) => changeTextColor(e, "#567C8D")}
              onMouseLeave={(e) => changeTextColor(e, "#F5EFEB")}
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
