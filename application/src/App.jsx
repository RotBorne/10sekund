import React, { useState, useEffect } from 'react';
import Login from './Login';
import Kalendarz from './Kalendarz';

function App() {
  const [user, setUser] = useState(null);
  const [group, setGroup] = useState(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      const savedGroup = localStorage.getItem('group');

      if (savedUser && savedGroup) {
        setUser(JSON.parse(savedUser));
        setGroup(JSON.parse(savedGroup));
      }
    } catch (error) {
      console.error("Błąd odczytu z localStorage:", error);
      localStorage.removeItem('user');
      localStorage.removeItem('group');
    }
  }, []);

  const handleLoginSuccess = (data) => {
    setUser(data.user);
    setGroup(data.group);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('group');
    setUser(null);
    setGroup(null);
  };

  return (
    <div className="App">
      {user && group ? (
        <Kalendarz user={user} group={group} onLogout={handleLogout} />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;