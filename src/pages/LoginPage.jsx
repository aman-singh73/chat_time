import React,{useEffect, useState} from 'react'
import AuthContext, { useAuth } from '../utils/AuthContext'
import { useNavigate,Link } from 'react-router-dom'

const LoginPage = () => {
  const {user,handleUserLogin}=useAuth()
  const Navigate=useNavigate()

  const [credentials,setCredentials]=useState({
    email:'',
    password:''
  })

  useEffect(()=>{
   if(user){
    Navigate('/')
   }
  },[]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
   // console.log("change",name, value)
    setCredentials({...credentials,[name]: value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //console.log("submitted",credentials)
    handleUserLogin(e, credentials);
};
  
  return (
    <div className='auth--container'>
      <div className='form--wrapper'>
        <form onSubmit={handleSubmit}>
          <div className='field--wrapper'>
            <label>Email</label>
            <input  
              required 
              type='email'
              name='email'
              placeholder='Your Email..' 
              value={credentials.email} 
              //defaultValue="email"
              onChange= {handleInputChange}
              /> 
          </div>

          <div className='field--wrapper'>
            <label>Password</label>
            <input type='password' 
              required 
              name='password'
              placeholder='Your password..' 
              //defaultValue="password"
              value={credentials.password} 
              onChange= {handleInputChange}
              /> 
          </div>

           <div className='field--wrapper'>
            <input className='btn btn--lg btn--main'
            type='Submit'
            value='login'/>
           </div>
        </form>
        <p>Don't have an account ? Register <Link to='/register'>Here</Link>  </p>
      </div>
       
        </div>
  )
  }
export default LoginPage