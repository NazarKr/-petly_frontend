import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
// import { getCurrentUser } from 'redux/user/userOperations';
import { toast } from 'react-toastify';

axios.defaults.baseURL = 'https://your-pet-backend-jfrs.onrender.com/';

export const token = {
  set(token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  },
  unset() {
    axios.defaults.headers.common.Authorization = '';
  },
};

export const register = createAsyncThunk(
  'users/register',
  async (credentials, { rejectWithValue, dispatch }) => {
    try {
      await axios.post('users/register', credentials);
      const { email, password } = credentials;
      await dispatch(
        login({
          email,
          password,
        })
      );
      console.log(credentials);
    } catch (error) {
      toast.error('Email is invalid or it is used');
      console.log(error.response.data);
      return rejectWithValue(error.message);
    }
  }
);

export const login = createAsyncThunk(
  'users/login',
  async (credentials, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.post('users/login', credentials);
      console.log(data);
      token.set(data.token);
      dispatch(getCurrentUser());
      return data;
    } catch (error) {
      console.log(error.response.data);
      toast.error('Email or password is wrong');
      return rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk(
  'users/logout',
  async (_, { rejectWithValue, getState }) => {
    try {
      const value = getState().auth.token;
      token.set(value);
      await axios.post('users/logout');
      token.unset();
    } catch (error) {
      toast.error(error.response.data);
      console.log(error.response.data);
      return rejectWithValue(error.message);
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'users/getCurrentUser',
  async (_, { rejectWithValue, getState }) => {
    const value = getState().auth.token;
    if (value) {
      token.set(value);
    }
    try {
      const { data } = await axios.get('users/current');
      return data;
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.message);
    }
  }
);

// export const refreshThunk = createAsyncThunk(
//   'users/refresh',
//   async (credentials, { rejectWithValue }) => {
//     try {
//       const { data } = await axios.get('users/', credentials);
//       token.set(data.data.user.token);
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

export const updateCurrentUser = createAsyncThunk(
  'auth/updateCurrentUser',
  async (_, { rejectWithValue, getState }) => {
    try {
      const value = getState().auth.token;
      if (value) {
        token.set(value);
      }
      const { data } = await axios.patch('users/update');
      console.log(data);
      return data;
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);
