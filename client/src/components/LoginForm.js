import React, { useState } from 'react';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState(''); // To store the JWT

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setToken('');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
        if (response.ok) {
  setMessage('Login successful!');
  setToken(data.token);
  localStorage.setItem('authToken', data.token); // Store the token
  setUsername('');
  setPassword('');
  console.log('JWT Token:', data.token);
  // Optionally, redirect the user to a logged-in area
}
      if (response.ok) {
        setMessage('Login successful!');
        setToken(data.token); // Store the received token
        // Optionally, redirect the user to a logged-in area
        setUsername('');
        setPassword('');
        console.log('JWT Token:', data.token); // For now, log the token
      } else {
        setMessage(data.message || 'Login failed.');
      }
    } catch (error) {
      setMessage('Failed to connect to the server.');
      console.error('Login error:', error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {message && <p>{message}</p>}
      {token && <p>JWT Token: {token}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;