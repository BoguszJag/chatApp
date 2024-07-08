import React, { useState, ChangeEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import '../style.css';
import useAuth from '../hooks/useAuthContext';


function LoginForm() {
  const [input, setInput] = useState<loginCredentials>({email: "", password: ""});
  const [credentialsError, setCredentialsError] = useState<credsError>();
  const { setAuth, setAuthStorage } = useAuth();
  const navigate = useNavigate();

  type credsError = string | null;

  type loginCredentials = {
    email: string,
    password: string
  };

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value;

    setInput(prev => {
      return {...prev, [name]: value}
    });
  };

  async function handleSubmit() {
    if(input.email.length === 0 || input.password.length === 0) {
      setCredentialsError('Please fill out the form')

  } else {
      setCredentialsError(null)

      const data = {username: input.email, password: input.password}

      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type':'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(data)
        })
        .then(res => res.json());

        if(response.message) {
          setCredentialsError(response.message);
        } else {
          localStorage.setItem('user', JSON.stringify(response));
          setAuth(response);
          setAuthStorage(localStorage.getItem('user'));
          navigate('/');
        }

      } catch(err) {
        console.log(err);
      }
  }
}

  return (
    <div className='wrapper bg-[#1e2124]'>
      <div className='formContainer bg-[#2f3136] rounded-md shadow-lg h-fit caret-transparent text-gray-400 oswald-300'>
        <h1 className='text-3xl font-bold my-5 '>Login</h1>
        <FormInput inputName={'email'} inputType={'text'} inputValue={input.email} placeholder='Email' onChange={handleChange} />
        <FormInput inputName={'password'} inputType={'password'} inputValue={input.password} placeholder='Password' onChange={handleChange} />
        {credentialsError && <p className='px-5 pb-5 mx-5 text-red-600'>{credentialsError}</p>}
        <FormButton buttonText='Sign in' action='/login' onClick={handleSubmit}/>
        <div className='mt-auto mb-5 mx-5'>
          <p>Don't have an account?</p>
          <Link to={`/register`} className='font-bold flex justify-center'>Register!</Link>
        </div>
      </div>
    </div>
  )
}

export default LoginForm