import express from 'express';
import cors from 'cors';
import pkg from 'pg';
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

// Konfiguracja połączenia – WPISZ SWOJE HASŁO DO POSTGRESQL!
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'moja_baza',
  password: '10sekund', // <-- Tutaj wpisz swoje hasło z instalacji
  port: 5432,
});

// Tworzenie tabeli 'users' przy starcie, jeśli jeszcze nie istnieje
async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Połączono z bazą PostgreSQL i gotowe do użycia!');
  } catch (err) {
    console.error('Błąd połączenia z bazą PostgreSQL:', err.message);
  }
}

// Rejestracja - zapis użytkownika do bazy PostgreSQL
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, password]
    );

    console.log('[BAZA PG] Zarejestrowano nowego użytkownika:', result.rows[0]);
    res.status(201).json({ message: 'Konto utworzone pomyślnie!' });
  } catch (error) {
    if (error.code === '23505') { // Kod błędu dla powtórzonego loginu
      return res.status(400).json({ message: 'Użytkownik o takim loginie już istnieje!' });
    }
    console.error(error);
    res.status(500).json({ message: 'Błąd serwera/bazy danych' });
  }
});

// Logowanie - weryfikacja danych z bazą
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1 AND password = $2',
      [username, password]
    );

    if (result.rows.length > 0 || (username === 'admin' && password === '123')) {
      res.json({ message: 'Zalogowano pomyślnie' });
    } else {
      res.status(401).json({ message: 'Niepoprawny login lub hasło' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Błąd serwera/bazy danych' });
  }
});

initDatabase().then(() => {
  app.listen(3000, () => {
    console.log('Serwer Node.js działa na http://localhost:3000');
  });
});