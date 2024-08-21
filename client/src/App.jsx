import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import DashBoard from './pages/DashBoard'
import ChartPage from './pages/ChartPage';

function App() {
  return (
    <>
      <div>
        <BrowserRouter>
        <Routes>
        <Route path='/' element={<Login/>} />
          <Route path='/register'element={<Register/>} />
          <Route path='/login'element={<Login/>} />
          <Route path='/dashboard' element={<DashBoard/>} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          {/* <Route path="/search"  element={ <AdminDashboard />}/> */}
          <Route path="/chart" element={<ChartPage />} />
        </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
