import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const baseURL = process.env.REACT_APP_API_URL;

const Register = () => {
    const [name, setName] = useState()
    const [gender, setGender] = useState('')
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()

    const validate = () => {
      const errors = {}

      if (!name || name.length < 5 || name.length > 20) {
        errors.name = 'Name must be between 5 and 20 characters'
      }

      if (!gender) {
        errors.gender = 'Gender is required'
      }

      if (!email) {
        errors.email = 'Email is required'
      }

      if (!password || password.length < 8 || password.length > 15 ||
        !/[A-Z]/.test(password) || !/[a-z]/.test(password) ||
        !/[0-9]/.test(password) || !/[!@#$%^&*]/.test(password)) {
        errors.password = 'Password must be 8-15 characters long, include at least one uppercase letter, one lowercase letter, one digit, and one special character'
      }

      return errors
    }

    const handleSubmit = (e) => {
      e.preventDefault()
      const errors = validate()
      if (Object.keys(errors).length === 0) {
        axios.post(baseURL+'/register', { name, gender, email, password })
          .then(res => {
            console.log(res)
            navigate('/login')
          })
          .catch(error => console.log(error))
      } else {
        setErrors(errors)
      }
    }

  return (
<div className="bg-light p-3 p-md-4 p-xl-5 justify-content-center ">
  <div className="container mt-3 ">
    <div className="row ">
    <div className='col '>
      <div style={{ width: '100%', height: '100%' }} className='justify-content-center'>
    <lottie-player src="https://lottie.host/aee0b40d-f12e-48ed-8d13-58ce14728efa/KH4brsfhDF.json" background="##ffffff" speed="2" loop  autoplay direction="1" mode="normal"></lottie-player>
      </div><br /> <br /></div>
      <div className="col-12 col-md-9 col-lg-7 col-xl-6 col-xxl-5 ">
        <div className="card border-0 shadow-lg rounded-4">
          <div className="card-body p-3 p-md-4 p-xl-5">
          <div className="row">
            <div className="col-12">
              <div className="mb-3">
                <center><h2 className="h3">Sign Up</h2></center>
                
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="row gy-3 gy-4 overflow-hidden">
              <div className="col-12">
                <div className='form-floating mb-2'>          
                <input type="text" className={`form-control ${errors.name ? 'is-invalid' : ''}`} name='name' autoComplete='off' placeholder=" " onChange={(e)=>setName(e.target.value)} />
                <label className="form-label">Name</label>
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
              </div>
              <div className="col-12">
                <div className='form-floating mb-2'>          
                <input type="text" className={`form-control ${errors.email ? 'is-invalid' : ''}`} name='email' autoComplete='off' placeholder=" " onChange={(e)=>setEmail(e.target.value)} />
                <label className="form-label">Email</label>
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
              </div>
              <div className="col-12">
                <div className='form-floating mb-2'>          
                <input type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} name='password' autoComplete='off' placeholder=" " onChange={(e)=>setPassword(e.target.value)} />
                <label className="form-label">Password</label>
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>
              </div>             
              <div className="col-12">
                <label className="form-label">Gender</label><br/>
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="gender" id="genderMale" value="Male" onChange={(e) => setGender(e.target.value)} />
                    <label className="form-check-label" htmlFor="genderMale">
                      Male
                    </label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="gender" id="genderFemale" value="Female" onChange={(e) => setGender(e.target.value)} />
                    <label className="form-check-label" htmlFor="genderFemale">
                      Female
                    </label>
                  </div>                  
                  {errors.gender && <div className="invalid-feedback d-block">{errors.gender}</div>}
              </div>
              <div className="col-12 d-flex justify-content-between">
                      <button className="btn bsb-btn-xl btn-success" type="submit">Sign Up</button>
                      <Link className="btn bsb-btn-2xl btn-danger" to={'/login'}>Sign In</Link>
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

export default Register
