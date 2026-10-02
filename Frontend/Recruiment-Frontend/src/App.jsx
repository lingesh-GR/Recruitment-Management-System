import './index.css'
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
function App() {
 
  return (
      
       <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path ="/register" element={<Register/>}/>
        <Route path='/' element={<Login/>}/>
        <Route path='/forgot-password' element={<ForgotPassword/>}/>
        <Route path='/reset-password' element ={<ResetPassword/>}/>
        <Route path = "*" element={<h1>Page is Not found 401</h1>}/>
       </Routes>
     
  )
}

export default App
