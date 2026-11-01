import express from 'express';
import cors from 'cors';
import pkg from 'pg';

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

const pool = new pkg.Pool({
  user: 'postgres',
  host: 'localhost',
  database: '10sekund',
  password: '10sekund',
  port: 5432,
});

app.get('/', (req, res) => {
  res.send('Serwer aplikacji Co Kto? działa poprawnie!');
});

app.post('/api/rejestracja', async (req, res) => {
  const { login, haslo } = req.body;

  if (!login || !haslo) {
    return res.status(400).json({ error: 'Uzupełnij login i hasło!' });
  }

  try {
    const checkUser = await pool.query(
      'SELECT * FROM logowanie WHERE login = $1',
      [login]
    );

    if (checkUser.rows.length > 0) {
      return res.status(400).json({ error: 'Ten login jest już zajęty!' });
    }

    await pool.query(
      'INSERT INTO logowanie (login, haslo) VALUES ($1, $2)',
      [login, haslo]
    );

    try {
      await pool.query(
        'INSERT INTO uzytkownicy (login, typ_mieszkanca, czy_na_wyjezdzie) VALUES ($1, $2, $3)',
        [login, 'czlonek', false]
      );
    } catch (userErr) {
      console.error('Błąd w uzytkownicy:', userErr.message);
    }

    res.json({ message: 'Zarejestrowano pomyślnie!' });
  } catch (err) {
    console.error('BŁĄD REJESTRACJI:', err.message);
    res.status(500).json({ error: 'Błąd bazy danych podczas rejestracji' });
  }
});

app.post('/api/logowanie', async (req, res) => {
  const { login, haslo } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM logowanie WHERE login = $1 AND haslo = $2',
      [login, haslo]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Nieprawidłowy login lub hasło!' });
    }

    res.json({ message: 'Zalogowano pomyślnie!', user: result.rows[0] });
  } catch (err) {
    console.error('Błąd logowania:', err.message);
    res.status(500).json({ error: 'Błąd serwera podczas logowania' });
  }
});

app.post('/api/nowa-rodzina', async (req, res) => {
  const { login, nazwa_rodziny, kod_rodziny, rola } = req.body;

  if (!kod_rodziny) {
    return res.status(400).json({ error: 'Brak kodu rodziny!' });
  }

  try {
    const checkFamily = await pool.query(
      'SELECT * FROM rodzina WHERE kod_rodziny = $1',
      [String(kod_rodziny)]
    );

    if (checkFamily.rows.length > 0) {
      return res.status(400).json({ error: 'Ten kod rodziny jest już zajęty!' });
    }

    await pool.query(
      'INSERT INTO rodzina (kod_rodziny, nazwa_rodziny, typ_rodziny) VALUES ($1, $2, $3)',
      [String(kod_rodziny), nazwa_rodziny || 'Nowa Rodzina', nazwa_rodziny || 'Rodzina']
    );

    if (login && String(login).trim() !== '') {
      await pool.query(
        'UPDATE logowanie SET kod_rodziny = $1 WHERE login = $2',
        [String(kod_rodziny), login]
      );

      await pool.query(
        'UPDATE uzytkownicy SET typ_mieszkanca = $1 WHERE login = $2',
        [rola || 'czlonek', login]
      );
    }

    res.json({ message: 'Pomyślnie utworzono nową rodzinę!' });
  } catch (err) {
    console.error('SZCZEGÓŁOWY BŁĄD SQL TWORZENIA RODZINY:', err.message);
    res.status(500).json({ error: 'Błąd bazy danych przy tworzeniu rodziny' });
  }
});

app.post('/api/dolacz-rodzina', async (req, res) => {
  const { login, kod_rodziny, rola } = req.body;

  if (!kod_rodziny) {
    return res.status(400).json({ error: 'Podaj kod rodziny!' });
  }

  try {
    const checkFamily = await pool.query(
      'SELECT * FROM rodzina WHERE kod_rodziny = $1',
      [String(kod_rodziny)]
    );

    if (checkFamily.rows.length === 0) {
      return res.status(404).json({ error: 'Taka rodzina nie istnieje!' });
    }

    if (login && String(login).trim() !== '') {
      await pool.query(
        'UPDATE logowanie SET kod_rodziny = $1 WHERE login = $2',
        [String(kod_rodziny), login]
      );

      if (rola) {
        await pool.query(
          'UPDATE uzytkownicy SET typ_mieszkanca = $1 WHERE login = $2',
          [rola, login]
        );
      }
    }

    res.json({ message: 'Dołączono do rodziny!', rodzina: checkFamily.rows[0] });
  } catch (err) {
    console.error('Błąd dołączania:', err.message);
    res.status(500).json({ error: 'Błąd serwera podczas dołączania' });
  }
});

const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});