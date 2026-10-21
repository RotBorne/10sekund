import React, { useState } from 'react';

function Login({ onLogin }) {

  const [mode, setMode] = useState('welcome'); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  // Asynchroniczna obsługa wysyłania formularza
  async function handleSubmit(event) {
    event.preventDefault();

    if (mode === 'login') {
      try {
        // Wysyłamy zapytanie do serwera Node.js o logowanie
        const response = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
          alert(data.message);
          onLogin(); // Zalogowano pomyślnie
        } else {
          alert(data.message || 'Błąd logowania');
        }
      } catch (error) {
        alert('Błąd połączenia z serwerem. Upewnij się, że node src/server.js działa!');
      }

    } else if (mode === 'register') {
      try {
        // Wysyłamy dane nowego użytkownika do rejestracji i zapisu w PostgreSQL
        const response = await fetch('http://localhost:3000/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
          alert('Konto zostało utworzone w bazie danych!');
          setMode('login'); // Przełączamy na ekran logowania
        } else {
          alert(data.message || 'Błąd rejestracji');
        }
      } catch (error) {
        alert('Błąd połączenia z serwerem. Upewnij się, że node src/server.js działa!');
      }
    }
  }

  if (mode === 'welcome') {
    return (
      <div className="welcome-container">
        <h2>Witaj na stronie! Wybierz opcję:</h2>
        <div className="welcome-buttons">
          <button className="main-btn" onClick={function() { setMode('login'); }}>
            Zaloguj się
          </button>
          <button className="main-btn" onClick={function() { setMode('register'); }}>
            Stwórz konto
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-form">
        
        <h2>{mode === 'login' ? 'Panel logowania' : 'Rejestracja nowego konta'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Login:</label>
            <input 
              type="text" 
              value={username} 
              onChange={function(e) { setUsername(e.target.value); }} 
              placeholder="Twój login"
              required 
            />
          </div>

          {mode === 'register' && (
            <div className="input-group">
              <label>E-mail:</label>
              <input 
                type="email" 
                value={email} 
                onChange={function(e) { setEmail(e.target.value); }} 
                placeholder="twój@email.com"
                required 
              />
            </div>
          )}

          <div className="input-group">
            <label>Hasło:</label>
            <input 
              type="password" 
              value={password} 
              onChange={function(e) { setPassword(e.target.value); }} 
              placeholder="Twoje hasło"
              required 
            />
          </div>

          <button type="submit" className="login-btn">
            {mode === 'login' ? 'Dalej (Zaloguj)' : 'Dalej (Utwórz konto)'}
          </button>
        </form>

        <button className="back-btn" onClick={function() { setMode('welcome'); }}>
          ← Wróć
        </button>

      </div>
    </div>
  );
}

export default Login;