import RegistrationPage from "./pages/shared/RegistrationPage"
import { Routes,Route } from "react-router-dom"
import VerifyOTPPage from "./pages/shared/VerifyOTPPage "
import LoginPage from "./pages/shared/LoginPage"
import { ToastContainer } from "react-toastify"

function App() {

  return (
    <>
    <div>
      <ToastContainer position="top-right" />
      <Routes>
        <Route path="/signup" element={<RegistrationPage />}  />
        <Route path="/verify-otp" element={<VerifyOTPPage />}  />
        <Route path="/" element={<LoginPage />}  />
      </Routes>
    </div>
    </>
  )
}

export default App
