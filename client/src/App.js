import React from 'react';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
// ... other imports

function App() {
  return (
    <div>
      <h1>My Business Site</h1>
      <RegistrationForm />
      <LoginForm />
      {/* ... other components or routing setup */}
    </div>
  );
}

export default App;