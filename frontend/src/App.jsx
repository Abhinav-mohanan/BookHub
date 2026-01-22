import RegistrationPage from "./pages/shared/RegistrationPage"
import { Routes,Route } from "react-router-dom"
import UserDashboard from "./pages/user/UserDashboard"

function App() {

  return (
    <>
    <Routes>
      <Route path="/signup" element={<RegistrationPage />}  />
      <Route path="/" element={<UserDashboard />}  />
    </Routes>
    </>
  )
}

export default App
