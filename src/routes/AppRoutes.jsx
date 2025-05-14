import { Routes, Route } from "react-router-dom";
import SignUp from "../pages/Auth/SignUp";
import Login from "../pages/Auth/Login";
import ProductList from "../pages/Products/ProductList";
import EditProfile from "../pages/Profile/EditProfile";
import ChangePassword from "../pages/Profile/ChangePassword";
import PrivateRoute from "../components/common/PrivateRoute";
import ProductDetails from "../pages/Products/ProductDetails";

export default function AppRoutes() {
  return (
    <Routes>
        <Route path='/signup' element={<SignUp />} />
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Login />} />

        {/* Protected Routes/Pages */}
        <Route path='/products' element={ <PrivateRoute> <ProductList /> </PrivateRoute> }/>
        <Route path='/edit-profile' element={<PrivateRoute> <EditProfile /> </PrivateRoute>} />
        <Route path='/change-password' element={<PrivateRoute> <ChangePassword /> </PrivateRoute>} />
        <Route path="/products/:id" element={<PrivateRoute> <ProductDetails /> </PrivateRoute>} />
    </Routes>
    );
}
    