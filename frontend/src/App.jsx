import RegistrationPage from "./pages/shared/RegistrationPage"
import { Routes,Route } from "react-router-dom"
import UserDashboard from "./pages/user/UserDashboard"
import VerifyOTPPage from "./pages/shared/VerifyOTPPage "
import LoginPage from "./pages/shared/LoginPage"

function App() {

  return (
    <>
    <Routes>
      <Route path="/signup" element={<RegistrationPage />}  />
      <Route path="/verify-otp" element={<VerifyOTPPage />}  />
      <Route path="/login" element={<LoginPage />}  />
      <Route path="/" element={<UserDashboard />}  />
    </Routes>
    </>
  )
}

export default App
