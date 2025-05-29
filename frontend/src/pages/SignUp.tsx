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
            {/* Tombol show/hide password untuk confirm password juga, jika diinginkan */}
            {/* <button
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
            </button> */}
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
              {" "}
              {/* SVG Google Icon */}{" "}
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
