import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const RegisterPage = () => {
    const { handleUserRegister } = useAuth();
    const [credentials, setCredentials] = useState({
        name: '',
        email: '',
        password1: '',
        password2: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
        //console.log(credentials)
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleUserRegister(e, credentials);
    };

    return (
        <div className='auth--container'>
            <div className='form--wrapper'>
                <form onSubmit={handleSubmit}>
                    <div className='field--wrapper'>
                        <label>Name</label>
                        <input
                            required
                            type='text'
                            name='name'
                            placeholder='Your name..'
                            value={credentials.name}
                            //defaultValue="email"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className='field--wrapper'>
                        <label>Email</label>
                        <input
                            required
                            type='email'
                            name='email'
                            placeholder='Your Email..'
                            value={credentials.email}
                            //defaultValue="email"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className='field--wrapper'>
                        <label>Password</label>
                        <input
                            type='password'
                            required
                            name='password1'
                            placeholder='Your password..'
                            //defaultValue="password"
                            value={credentials.password1}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className='field--wrapper'>
                        <label>Confirm Password</label>
                        <input
                            type='password'
                            required
                            name='password2'
                            placeholder='Confirm password..'
                            //defaultValue="password"
                            value={credentials.password2}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className='field--wrapper'>
                        <input
                            className='btn btn--lg btn--main'
                            type='submit'
                            value='Register'
                        />
                    </div>
                </form>
                <p>
                    Already have an account? Login <Link to='/login'>Here</Link>{' '}
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
