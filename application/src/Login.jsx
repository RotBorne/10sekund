import React, { useState } from 'react';
import './Login.css';

function Login({ onLoginSuccess }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [groupName, setGroupName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !accessCode) {
      setError('Wypełnij imię oraz kod PIN!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          name,
          access_code: accessCode,
          group_name: mode === 'register' ? groupName : undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Błąd autoryzacji');

      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('group', JSON.stringify(data.group));
      onLoginSuccess(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-header">
        {mode === 'login' ? 'Dołącz do grupy' : 'Stwórz nową grupę'}
      </h2>

      {error && <div className="login-error">{error}</div>}

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label>Twoje Imię:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="np. Jan"
          />
        </div>

        <div className="form-group">
          <label>Kod PIN grupy:</label>
          <input
            type="password"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            placeholder="np. 1234"
          />
        </div>

        {mode === 'register' && (
          <div className="form-group">
            <label>Nazwa grupy (opcjonalnie):</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="np. Moje Mieszkanie"
            />
          </div>
        )}

        <button type="submit" className="login-submit-btn">
          {mode === 'login' ? 'Zaloguj się' : 'Utwórz grupę'}
        </button>
      </form>

      <div className="login-toggle-mode">
        {mode === 'login' ? (
          <span>
            Nie masz jeszcze grupy?{' '}
            <button
              onClick={() => { setMode('register'); setError(''); }}
              className="login-toggle-btn"
            >
              Załóż nową
            </button>
          </span>
        ) : (
          <span>
            Masz już kod PIN?{' '}
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className="login-toggle-btn"
            >
              Dołącz
            </button>
          </span>
        )}
      </div>
    </div>
  );
}

export default Login;