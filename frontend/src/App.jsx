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
import UserDashboard from "./pages/user/UserDashboard"
import MyTransactions from "./pages/user/MyTransactions"
import ProfilePage from "./pages/user/ProfilePage"
import BorrowTransactions from "./pages/admin/BorrowTransactions"
import ForgotPasswordEmail from "./pages/shared/ForgotPasswordEmail"
import ResetPassword from "./pages/shared/ResetPassword"
import ForgotPasswordOTP from "./pages/shared/ForgotPasswordOTP"

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
        <Route path="/admin/transactions" element={<BorrowTransactions />}  />
        <Route path="/user/dashboard" element={<UserDashboard />}  />
        <Route path="/user/transactions" element={<MyTransactions />}  />
        <Route path="/user/profile" element={<ProfilePage />}  />
        <Route path="/forgot-password-email" element={<ForgotPasswordEmail />}  />
        <Route path="/forgot-password-otp" element={<ForgotPasswordOTP />}  />
        <Route path="/reset-password" element={<ResetPassword />}  />

      </Routes>
    </div>
    </>
  )
}

export default App
