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
import NotFound from "./pages/shared/NotFound"
import { ProtectedRoute } from "./Api/ProtectedRoute"

function App() {

  return (
    <>
      <ToastContainer position="top-right" />
      <Routes>
        <Route path="/signup" element={<RegistrationPage />} />
        <Route path="/verify-otp" element={<VerifyOTPPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/forgot-password-email" element={<ForgotPasswordEmail />} />
        <Route path="/forgot-password-otp" element={<ForgotPasswordOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<NotFound />} />


        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/category" element={<ProtectedRoute allowedRoles={['admin']}><CategoryManagementPage /></ProtectedRoute>} />
        <Route path="/admin/books" element={<ProtectedRoute allowedRoles={['admin']}><BookListPage /></ProtectedRoute>} />
        <Route path="/add/book" element={<ProtectedRoute allowedRoles={['admin']}><AddBookPage /></ProtectedRoute>} />
        <Route path="/admin/books/edit/:slug" element={<ProtectedRoute allowedRoles={['admin']}><EditBookPage /></ProtectedRoute>} />
        <Route path="/admin/user/management" element={<ProtectedRoute allowedRoles={['admin']}><UserManagementPage /></ProtectedRoute>} />
        <Route path="/admin/transactions" element={<ProtectedRoute allowedRoles={['admin']}><BorrowTransactions /></ProtectedRoute>} />
        <Route path="/admin/staff/management" element={<ProtectedRoute allowedRoles={['admin']}><AdminVerificationPage /></ProtectedRoute>} />

        <Route path="/user/dashboard" element={<ProtectedRoute allowedRoles={['user']}><UserDashboard /></ProtectedRoute>} />
        <Route path="/user/transactions" element={<ProtectedRoute allowedRoles={['user']}><MyTransactions /></ProtectedRoute>} />
        <Route path="/user/profile" element={<ProtectedRoute allowedRoles={['user']}><ProfilePage /></ProtectedRoute>} />

      </Routes>
    </>
  );
}

export default App;
