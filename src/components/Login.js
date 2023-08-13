import React, { useState } from 'react';
import AuthForm from './AuthForm';
import Input from './Input';
import *as authentication from '../utils/authentication.js';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [data, setData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = (evt) => {
    evt.preventDefault();
    const { email, password } = data;
    if (!email || !password) {
      setMessage('Необходимо заполнить все поля!');
      return;
    }
    setLoading(true);
    authentication.authorize(email, password)
      .then((data) => {
        if (data && data.token) {
          authentication.setToken(data.token);
          onLogin(data.token);
          navigate('/');
        } else if (data && data.statusCode === 401) {
          setMessage('Неверные email или пароль');
        } else {
          setMessage('Что-то пошло не так!');
        }
      })
      .catch(err => console.log(err))
      .finally(() => {
        setLoading(false);
      })
  };
  const buttonLabelText = isLoading ? "Вход" : "Войти";
  return (
    <AuthForm
      title="Вход"
      name="login"
      isLoading={isLoading}
      buttonLabel={buttonLabelText}
      onSubmit={handleSubmit}
    >
      <Input
        id='email'
        name='email'
        className='popup__text popup__text_type_email'
        type='email'
        placeholder='Email'
        required
        value={data.email}
        onChange={handleChange}
      />
      <Input
        id='password'
        className='popup__text popup__text_type_password'
        type='password'
        name='password'
        minlength='8'
        maxlength='20'
        placeholder='Пароль'
        required
        value={data.password}
        onChange={handleChange}
      />
    </AuthForm>
  )
}
export default Login;