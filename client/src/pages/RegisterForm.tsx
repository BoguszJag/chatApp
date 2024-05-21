import React, { useState, ChangeEvent } from 'react'
import FormButton from '../components/FormButton'
import FormInput from '../components/FormInput'
import { Link, useNavigate } from 'react-router-dom'
import '../style.css';

function RegisterForm() {
  const [input, setInput] = useState<registerCredentials>({email: "", username: "", password: "", confirmPassword: ""})
  const [credentialsError, setCredentialsError] = useState<credsError>()
  const navigate = useNavigate();

  type credsError = string | null;

  type registerCredentials = {
    email: string,
    username: string,
    password: string,
    confirmPassword: string
  };

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value;

    setInput(prev => {
      return {...prev, [name]: value}
    });
  }

  async function handleSubmit() {
    if(input.email.length === 0 || input.password.length === 0 || input.confirmPassword.length === 0) {

      setCredentialsError('Please fill out the form')

    } else if(input.password === input.confirmPassword) {

      setCredentialsError(null);

      const data = {email: input.email, username:input.username, password: input.password};

      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type':'application/json',
          },
          body: JSON.stringify(data)
        })
        .then(res => res.json());

        console.log(response);

        if(response.err) {
          setCredentialsError(response.err);
        } else if(response.success) {
          navigate('/login');
        };

      } catch (err) {
        console.log(err);
      };

    } else {
      setCredentialsError('Password mismatch');
    };
  };

  return (
    <div className='wrapper'>
      <div className='formContainer bg-white rounded-md shadow-lg h-fit caret-transparent'>
        <h1 className='text-3xl font-bold my-5 '>Register</h1>
        <FormInput inputName={'email'} inputType={'text'} inputValue={input.email} placeholder='Email' onChange={handleChange} />
        <FormInput inputName={'username'} inputType={'text'} inputValue={input.username} placeholder='Username' onChange={handleChange} />
        <FormInput inputName={'password'} inputType={'password'} inputValue={input.password} placeholder='Password' onChange={handleChange} />
        <FormInput inputName={'confirmPassword'} inputType={'password'} inputValue={input.confirmPassword} placeholder='Confirm Password' onChange={handleChange} />
        {credentialsError && <p className='px-5 mx-5 text-red-600'>{credentialsError}</p>}
        <FormButton buttonText='Register' action='/register' onClick={handleSubmit}/>
        <div className='mt-auto mb-5 mx-5'>
          <p>Already have an account?</p>
          <Link to={`/login`} className='font-bold flex justify-center'>Login!</Link>
        </div>
      </div>
    </div>
  )
}

export default RegisterForm