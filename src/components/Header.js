import '../index.css';
import logo from '../images/Vector.svg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import *as authentication from '../utils/authentication.js';
function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const isLoginPage = location.pathname === '/sign-in';
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  useEffect(() => {
    setLoading(true)
    const token = authentication.getToken();
    if (token) {
      authentication.checkinValidityToken(token)
        .then((data) => {
          setIsLoggedIn(true);
          setUserEmail(data);
        })
        .catch(error => {
          console.log(error);
          setIsLoggedIn(false);
          setUserEmail('');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setIsLoggedIn(false);
      setLoading(false);
    }
  }, []);
  const handleLogout = () => {
    authentication.removeToken();
    setIsLoggedIn(false);
    setUserEmail('');
    navigate('/sign-in');
  };
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="логотип"/>
      {isLoggedIn ? (
        <div className="header__loggedIn">
          <p className="header__email">{userEmail}</p>
          <button onClick={handleLogout} className="header__link">Выйти</button>
        </div>
      ) : (
        <div className="header__notLoggedIn">
          {isLoginPage ? (
            <Link to='/sign-up' className='header__link'>Регистрация</Link>
          ) : (
            <Link to='/sign-in' className='header__link'>Войти</Link>
          )}
        </div>
      )}
    </header>
  )
}
export default Header;