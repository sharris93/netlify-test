const BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;

const tokenName = 'token'

const getUser = () => {
  const token = getToken();
  if (!token) return null;
  const user = JSON.parse(atob(token.split('.')[1]));
  return user;
};

const signup = async (formData) => {
  try {
    const res = await fetch(`${BACKEND_URL}/users/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const json = await res.json();
    if (json.error) {
      throw new Error(json.error);
    }
    setToken(json.token);
    return json;
  } catch (err) {
    throw new Error(err);
  }
};

const signin = async (user) => {
  try {
    const res = await fetch(`${BACKEND_URL}/users/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    const json = await res.json();
    if (json.error) {
      throw new Error(json.error);
    }
    if (json.token) {
      setToken(json.token);
      const user = JSON.parse(atob(json.token.split('.')[1]));
      return user;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const signout = () => {
  localStorage.removeItem(tokenName);
};

const getToken = () => {
  return localStorage.getItem(tokenName)
}

const setToken = (token) => {
  localStorage.setItem(tokenName, token)
}

export { signup, signin, getUser, signout, setToken, getToken };
