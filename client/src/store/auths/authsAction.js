import { REGISTER_SUCCESS, REGISTER_FAIL, CLEAR_ERRORS, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from './types'
import setAuthToken from "../../utils/setAuthToken";
import axios from 'axios'

// Register User
// TODO find a way to utilize https connections instead of http
export const register = formData => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  try {
    const res = await axios.post("/api/vs/users", formData, config);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: REGISTER_FAIL,
      payload: err.message
    });
  }
};
// Login User
export const login = formData => async dispatch => {
  if (sessionStorage.token) {
    authenticate()
    setAuthToken(sessionStorage.token);
  }
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  try {
    const res = await axios.post("/api/v1/auths", formData, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });
    setAuthToken(sessionStorage.token);
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL,
      payload: err.message
    });
  }
};

// Logout
export const logout = () => dispatch =>
  dispatch({
    type: LOGOUT
  });
  
// Clear Errors
export const clearErrors = () => dispatch => {
  dispatch({
    type: CLEAR_ERRORS
  });
};
