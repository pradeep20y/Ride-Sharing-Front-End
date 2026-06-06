import { Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from "./auth/routes/ProtectedRoute";
import Navbar from "./components/Navbar";
import PublicRoute from "./auth/routes/PublicRoute";
import PassengerPage from "./pages/PassengerPage";
import DriverPage from "./pages/DriverPage";

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
        <Route path="/passengerPage" element=
        {
          <ProtectedRoute>
            <PassengerPage/>
          </ProtectedRoute>
        } />
        <Route path="/driverPage" element=
        {
          <ProtectedRoute>
            <DriverPage/>
          </ProtectedRoute>
        } />
      </Routes>
      
    </>
  );
}

export default App;