import apiClient from './apiClient';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.username - Username
 * @param {string} userData.email - Email
 * @param {string} userData.password - Password
 * @returns {Promise<Object>} Registration response
 */
export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post('/register/', {
      username: userData.username,
      email: userData.email,
      password: userData.password,
    });
    return response.data;
  } catch (error) {
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      if (error.response.status === 400) {
        const errorData = error.response.data;
        if (errorData.username) {
          throw new Error(`Username: ${errorData.username.join(' ')}`);
        } else if (errorData.email) {
          throw new Error(`Email: ${errorData.email.join(' ')}`);
        } else if (errorData.password) {
          throw new Error(`Password: ${errorData.password.join(' ')}`);
        } else if (errorData.detail) {
          throw new Error(errorData.detail);
        } else {
          throw new Error('Registration failed. Please check your input.');
        }
      } else if (error.response.status === 409) {
        throw new Error('User already exists with this username or email');
      } else if (error.response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(error.response.data.detail || error.response.data.error || 'Registration failed');
      }
    } else if (error.request) {
      // Network error
      throw new Error('Network error. Please check your connection and try again.');
    } else {
      // Other error
      throw new Error(error.message || 'Registration failed');
    }
  }
};

/**
 * Login user
 * @param {Object} credentials - User login credentials
 * @param {string} credentials.username - Username
 * @param {string} credentials.password - Password
 * @returns {Promise<Object>} Login response with token and user info
 */
export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post('/login/', {
      username: credentials.username,
      password: credentials.password,
    });

    const { token, user } = response.data;

    if (!token || !user) {
      throw new Error('Invalid response from server: missing token or user data');
    }

    // Store token and user info in localStorage
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));

    return response.data;
  } catch (error) {
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      if (error.response.status === 401) {
        throw new Error('Invalid username or password');
      } else if (error.response.status === 400) {
        const errorData = error.response.data;
        if (errorData.username) {
          throw new Error(`Username: ${errorData.username.join(' ')}`);
        } else if (errorData.password) {
          throw new Error(`Password: ${errorData.password.join(' ')}`);
        } else if (errorData.detail) {
          throw new Error(errorData.detail);
        } else {
          throw new Error('Invalid login credentials');
        }
      } else if (error.response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(error.response.data.detail || error.response.data.error || 'Login failed');
      }
    } else if (error.request) {
      // Network error
      throw new Error('Network error. Please check your connection and try again.');
    } else {
      // Other error
      throw new Error(error.message || 'Login failed');
    }
  }
};

/**
 * Logout user
 */
export const logoutUser = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

/**
 * Get stored auth token
 * @returns {string|null} Auth token or null
 */
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Get stored user info
 * @returns {Object|null} User info or null
 */
export const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};
