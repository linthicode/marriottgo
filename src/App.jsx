import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Onboarding from "./pages/Onboarding.jsx";
import ModalBook from "./components/ModalBook.jsx";
import ProtectedRoute from "./auth/ProtectedRoute";

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ModalBook"
          element={
            <ProtectedRoute>
              <ModalBook />
            </ProtectedRoute>
          }
        />
      </Routes>
  );
}
