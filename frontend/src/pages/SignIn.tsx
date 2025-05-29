import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff, User, Lock, AlertCircle } from "lucide-react";

const changeBackgroundColor = (
  e: React.MouseEvent<HTMLElement>,
  color: string
) => {
  e.currentTarget.style.backgroundColor = color;
};

const changeTextColor = (e: React.MouseEvent<HTMLElement>, color: string) => {
  e.currentTarget.style.color = color;
};

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_BASE_URL + "/api/auth/sign-in",
        {
          email: email,
          password: password,
        }
      );

      setIsLoading(false); // Set loading ke false setelah request selesai
      console.log("Login berhasil:", response.data);

      //Simpan token
      const token = response.data.token;
      localStorage.setItem("authToken", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      navigate("/dashboard");
    } catch (err: any) {
      setIsLoading(false); // Set loading ke false jika ada error
      console.error("Error saat login:", err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.error || "Incorrect email or password.");
      } else if (err.request) {
        // Request dibuat tapi tidak ada respons (masalah jaringan)
        setError(
          "Unable to connect to server. Check your internet connection."
        );
      } else {
        // Error lainnya
        setError("An unknown error occurred. Please try again.");
      }
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Tambahkan logika login Google di sini
    // Contoh: window.location.href = 'http://localhost:5500/api/auth/google';
    console.log("Login with Google");
    setError("Fitur login dengan Google belum diimplementasikan.");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #2F4156 0%, #567C8D 50%, #C8D9E6 100%)",
      }}
    >
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
        className="backdrop-blur-xl border shadow-2xl rounded-2xl p-8 md:p-12 w-full max-w-md relative z-10"
        style={{
          backgroundColor: "rgba(47, 65, 86, 0.85)",
          borderColor: "rgba(86, 124, 141, 0.3)",
        }}
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: "#F5EFEB" }}>
            Outfitly
          </h1>
          <p className="text-sm" style={{ color: "#C8D9E6" }}>
            Selamat datang kembali!
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input (tetap sama) */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="w-5 h-5" style={{ color: "#C8D9E6" }} />
            </div>
            <input
              type="email"
              name="email"
              id="email"
              className="border text-sm rounded-xl focus:ring-2 focus:ring-[#567C8D] focus:border-transparent block w-full pl-12 pr-4 py-3 transition-all duration-200"
              style={{
                backgroundColor: "rgba(86, 124, 141, 0.2)",
                borderColor: "rgba(200, 217, 230, 0.3)",
                color: "#F5EFEB",
              }}
              placeholder="hello@samuelmay.co"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading} // Disable input saat loading
            />
          </div>

          {/* Password Input (tetap sama) */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="w-5 h-5" style={{ color: "#C8D9E6" }} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              className="border text-sm rounded-xl focus:ring-2 focus:ring-[#567C8D] focus:border-transparent block w-full pl-12 pr-4 py-3 transition-all duration-200"
              style={{
                backgroundColor: "rgba(86, 124, 141, 0.2)",
                borderColor: "rgba(200, 217, 230, 0.3)",
                color: "#F5EFEB",
              }}
              placeholder="PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading} // Disable input saat loading
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

          {/* Login Button */}
          <button
            type="submit"
            className="w-full font-medium rounded-xl py-3 px-6 focus:ring-4 transition-all duration-200 transform hover:scale-105 flex justify-center items-center"
            style={{
              backgroundColor: isLoading ? "#C8D9E6" : "#F5EFEB", // Ubah warna saat loading
              color: "#2F4156",
              boxShadow: "0 4px 12px rgba(245, 239, 235, 0.2)",
            }}
            onMouseEnter={(e) =>
              !isLoading && changeBackgroundColor(e, "#FFFFFF")
            }
            onMouseLeave={(e) =>
              !isLoading && changeBackgroundColor(e, "#F5EFEB")
            }
            disabled={isLoading} // Disable tombol saat loading
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
            ) : (
              "LOG IN"
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

          {/* Google Login (Tombol didisable saat loading) */}
          <button
            type="button"
            onClick={handleGoogleLogin}
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
            <span>Login dengan Google</span>
          </button>

          {/* Forgot Password (tetap sama) */}
          <div className="text-center">
            <Link
              to="/forgot-password"
              className="text-sm transition-colors duration-200 underline hover:opacity-80"
              style={{ color: "#C8D9E6" }}
              onMouseEnter={(e) => changeTextColor(e, "#F5EFEB")}
              onMouseLeave={(e) => changeTextColor(e, "#C8D9E6")}
            >
              FORGOT YOUR PASSWORD?
            </Link>
          </div>

          {/* Sign Up (tetap sama) */}
          <p className="text-sm text-center mt-8" style={{ color: "#C8D9E6" }}>
            Belum punya akun?{" "}
            <Link
              to="/signup"
              className="font-medium transition-colors duration-200"
              style={{ color: "#F5EFEB" }}
              onMouseEnter={(e) => changeTextColor(e, "#567C8D")}
              onMouseLeave={(e) => changeTextColor(e, "#F5EFEB")}
            >
              Sign Up di sini
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
