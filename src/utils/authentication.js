export const BASE_URL = 'https://auth.nomoreparties.co';
export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  })
    .then((res) => {
      try {
        if (res.status === 200) {
          return res.json();
        }
      } catch (e) {
        return (e)
      }
    })
    .then((res) => {
      return res;
    })
    .catch((err) => console.log(err));
};
export const getToken = () => {
  return localStorage.getItem('token');
};
export const setToken = (token) => {
  localStorage.setItem('token', token);
};
export const removeToken = () => {
  localStorage.removeItem('token');
};
export const authorize = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  })
    .then((res => res.json()))
    .then((data) => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        return data;
      }
    })
    .catch(err => console.log(err))
};
export const checkinValidityToken = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  })
    .then((res) => {
      if (!res.ok) {
        if (res.status === 400) {
          throw new Error("Токен не предоставлен или имеет неправильный формат");
        }
        if (res.status === 401) {
          throw new Error("Недействительный токен");
        }
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      return res.json();
    })
    .then((data) => {
      return data.data.email;
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
}