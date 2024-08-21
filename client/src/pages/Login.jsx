import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const baseURL = import.meta.env.VITE_BASE_URL;

const Login = () => {
    const [email,setEmail]=useState()
    const [password,setPassword]=useState()
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const navigate=useNavigate()
    axios.defaults.withCredentials=true;
    const validate = () => {
      const errors = {};
      if (!email) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = 'Email address is invalid';
      }
      if (!password) {
        errors.password = 'Password is required';
      }
      return errors;
    };
    const handleSubmit = async (e) => {
      e.preventDefault();
      const errors = validate();
      if (Object.keys(errors).length === 0) {
          try {
              const response = await axios.post(baseURL+'/login', { email, password });
              if (response.data.Login) {
                  navigate(response.data.user.isAdmin ? '/admin-dashboard' : '/dashboard');
              } else {
                  setServerError(response.data.message);
              }
          } catch (err) {
              console.error('Login error:', err);
              setServerError('An error occurred. Please try again.');
          }
      } else {
          setErrors(errors);
      }
  };
  
  return (
<div className="bg-light p-3 p-md-4 p-xl-5">
  <div className="container">
    <div className="row ">
    <div className="col">
  <div style={{ width: '100%', height: '100%' }}className='justify-content-center'>
    <lottie-player src="https://lottie.host/488a2be1-dcbb-4af0-addd-e06a2c6ef006/6BIY1C4bBD.json" 
    background="##fff" speed="1" loop autoplay direction="1" mode="normal"></lottie-player>
  </div>
</div>
      <div className="col-12 col-md-9 col-lg-7 col-xl-6 col-xxl-5">
        <div className="card border-0 shadow-lg rounded-4 justify-content-center">
          <div className="card-body p-3 p-md-4 p-xl-5">
            <div className="row">
              <div className="col-12">
                <div className="mb-5">
                  <center><h3>Sign in</h3></center>
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="row gy-3 overflow-hidden">
              {serverError && (
                      <div className="col-12">
                        <div className="alert alert-danger">
                          {serverError}
                        </div>
                      </div>
                    )}
                <div className="col-12">
                  <div className="form-floating mb-3">
                    <input type="text" className={`form-control ${errors.email ? 'is-invalid' : ''}`} name="email" id="email" placeholder="name@example.com"  onChange={(e)=>setEmail(e.target.value)} />
                    <label htmlFor="email" className="form-label">Email</label>
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-floating mb-3">
                    <input type="password"   className={`form-control ${errors.password ? 'is-invalid' : ''}`} name="password" id="password"  placeholder="Password"  onChange={(e)=>setPassword(e.target.value)} />
                    <label htmlFor="password" className="form-label">Password</label>
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                  </div>
                </div>
                <div className="col-12 d-flex justify-content-between">
                      <button className="btn bsb-btn-xl btn-success" type="submit">Sign In</button>
                      <Link className="btn bsb-btn-2xl btn-danger" to={'/register'}>Sign Up</Link>
                </div>
              </div>
            </form>            
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

  )
}

export default Login