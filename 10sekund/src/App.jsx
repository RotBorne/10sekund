import React, { useState } from 'react';
import Login from './Login';
import Kalendarz from './kalendarz'; // Importujemy Twój plik kalendarza[cite: 7]

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function handleLogin() {
    setIsLoggedIn(true);
  }

  return (
    <div className="app">
      {isLoggedIn ? (
        <Kalendarz />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;