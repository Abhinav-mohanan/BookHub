import RegistrationPage from "./pages/shared/RegistrationPage"
import { Routes,Route } from "react-router-dom"
import VerifyOTPPage from "./pages/shared/VerifyOTPPage "
import LoginPage from "./pages/shared/LoginPage"
import { ToastContainer } from "react-toastify"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AddBookPage from "./pages/admin/AddBookPage"
import UserManagementPage from "./pages/admin/UserManagementPage"
import AdminVerificationPage from "./pages/admin/AdminVerificationPage"
import BookListPage from "./pages/admin/BookListPage"
import EditBookPage from "./pages/admin/EditBookPage"
import CategoryManagementPage from "./pages/admin/CategoryManagementPage"

function App() {

  return (
    <>
    <div>
      <ToastContainer position="top-right" />
      <Routes>
        <Route path="/signup" element={<RegistrationPage />}  />
        <Route path="/verify-otp" element={<VerifyOTPPage />}  />
        <Route path="/" element={<LoginPage />}  />
        <Route path="/admin/dashboard" element={<AdminDashboard />}  />
        <Route path="/admin/category" element={<CategoryManagementPage />}  />
        <Route path="/admin/books" element={<BookListPage />}  />
        <Route path="/add/book" element={<AddBookPage />}  />
        <Route path="/admin/books/edit/:slug" element={<EditBookPage />}  />
        <Route path="/admin/user/management" element={<UserManagementPage />}  />
        <Route path="/admin/staff/management" element={<AdminVerificationPage />}  />

      </Routes>
    </div>
    </>
  )
}

export default App
