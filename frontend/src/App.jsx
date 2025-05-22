import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import SignIn from './components/auth/SignIn'; // Sesuaikan path
import SignUp from './components/auth/SignUp'; // Sesuaikan path


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}
        {/* <Route path="/" element={<HomePage />} /> */}
        {/* Tambahkan rute lain di sini */}
      </Routes>
    </Router>
  );
}

export default App;