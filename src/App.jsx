import { Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from "./pages/DashboardPage";
import ProtectedRoute from "./auth/routes/ProtectedRoute";
import Navbar from "./components/Navbar";
import PublicRoute from "./auth/routes/PublicRoute";

function App() {
  return (
    <>
      <Navbar/> 
      <Routes>
        <Route path="/login" element=
        {
          <PublicRoute>
            <Login />
          </PublicRoute>
          } />
        <Route path="/register" element=
        {
          <PublicRoute>
            <Register />
          </PublicRoute>  
        } />
        <Route path="/dashboard" element=
        {
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

export default App;