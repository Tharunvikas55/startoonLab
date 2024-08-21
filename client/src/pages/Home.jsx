import React, { useEffect } from 'react'
import {  Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Home = () => {
    // const navigate=useNavigate()
    // axios.defaults.withCredentials=true;
    // useEffect(()=>{
    //     axios.get('http://localhost:3001/home')
    //     .then(res=>{
    //         if (res.data !== 'Success') {
    //             navigate('/login');
    //           } else {
    //             navigate('/');
    //           }
    //     })
    //     .catch(err=>console.log(err))
    // }, [navigate])
  return (
    <div>
      Home
      <Link to={'/login'}>Login</Link>
    </div>
  )
}

export default Home
