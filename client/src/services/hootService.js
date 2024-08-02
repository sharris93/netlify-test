import { getToken } from './authService.js'

const BASE_URL = `${import.meta.env.VITE_EXPRESS_BACKEND_URL}/hoots`

export const index = async () => {
  try {
    const res = await fetch(BASE_URL, {
      headers: { 
        Authorization: `Bearer ${getToken()}` 
      },
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
}

export const show = async (hootId) => {
    try {
      const res = await fetch(`${BASE_URL}/${hootId}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      })
      return res.json();
    } catch (error) {
      console.log(error)
    }
}

export const create = async (formData) => {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    return res.json()
  } catch (error) {
    console.log(error)
  }
}

export const createComment = async (hootId, formData) => {
  try {
    const res = await fetch(`${BASE_URL}/${hootId}/comments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

export const deleteHoot = async (hootId) => {
  try {
    const res = await fetch(`${BASE_URL}/${hootId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    })
    return res.json()
  } catch (error) {
    console.log(error)
  }
}

export const update = async (hootId, formData) => {
  try {
    const res = await fetch(`${BASE_URL}/${hootId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    return res.json()
  } catch (error) {
    console.log(error)
  }
}