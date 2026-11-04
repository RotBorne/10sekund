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
      `SELECT l.*, u.id_uzytkownika 
       FROM logowanie l
       LEFT JOIN uzytkownicy u ON l.login = u.login
       WHERE l.login = $1 AND l.haslo = $2`,
      [login, haslo]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Nieprawidłowy login lub hasło!' });
    }

    let user = result.rows[0];

    // Zabezpieczenie: jeśli w tabeli uzytkownicy brak rekordu dla tego loginu, dodajemy go
    if (!user.id_uzytkownika) {
      try {
        const newUser = await pool.query(
          'INSERT INTO uzytkownicy (login, typ_mieszkanca, czy_na_wyjezdzie) VALUES ($1, $2, $3) RETURNING id_uzytkownika',
          [login, 'czlonek', false]
        );
        user.id_uzytkownika = newUser.rows[0].id_uzytkownika;
      } catch (insertErr) {
        console.error('Błąd tworzenia rekordu w uzytkownicy:', insertErr.message);
      }
    }

    res.json({ message: 'Zalogowano pomyślnie!', user });
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

//pobranie id użytkownika do zadania 
app.get('/api/zadania/:id_uzytkownika', async (req, res) => {
  const { id_uzytkownika } = req.params;
  try {
    const result = await pool.query(
      `SELECT id_zadania, nazwa_zadania, czas_powtarzania, id_uzytkownika, czy_wykonane, czy_w_kalendarzu, TO_CHAR(data_zadania, 'YYYY-MM-DD') AS data_zadania 
       FROM lista_obowiazkow 
       WHERE id_uzytkownika = $1 
       ORDER BY data_zadania ASC NULLS LAST, id_zadania ASC`,
      [id_uzytkownika]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Błąd pobierania zadań:', err.message);
    res.status(500).json({ error: 'Błąd serwera podczas pobierania zadań' });
  }
});

//nowe zadanie
app.post('/api/zadania', async (req, res) => {
  const { nazwa_zadania, data_zadania, czy_w_kalendarzu, id_uzytkownika } = req.body;

  if (!nazwa_zadania || !id_uzytkownika) {
    return res.status(400).json({ error: 'Nazwa zadania i użytkownik są wymagane!' });
  }

  const sformatowanaData = (data_zadania && String(data_zadania).trim() !== '') 
    ? String(data_zadania).trim() 
    : null;
  try {
    const result = await pool.query(
      `INSERT INTO lista_obowiazkow 
         (nazwa_zadania, data_zadania, czy_w_kalendarzu, id_uzytkownika, czy_wykonane) 
       VALUES ($1, $2, $3, $4, false) 
       RETURNING 
         id_zadania, 
         nazwa_zadania, 
         czas_powtarzania, 
         id_uzytkownika, 
         czy_wykonane, 
         czy_w_kalendarzu, 
         TO_CHAR(data_zadania, 'YYYY-MM-DD') AS data_zadania`,
      [nazwa_zadania.trim(), sformatowanaData, Boolean(czy_w_kalendarzu), id_uzytkownika]
    );

    res.json({ message: 'Dodano zadanie pomyślnie!', zadanie: result.rows[0] });
  } catch (err) {
    console.error('Błąd dodawania zadania:', err.message);
    res.status(500).json({ error: 'Błąd serwera podczas dodawania zadania' });
  }
});

//zmiana statusu zadania
app.patch('/api/zadania/:id_zadania', async (req, res) => {
  const { id_zadania } = req.params;
  const { czy_wykonane } = req.body;

  try {
    await pool.query(
      'UPDATE lista_obowiazkow SET czy_wykonane = $1 WHERE id_zadania = $2',
      [czy_wykonane, id_zadania]
    );
    res.json({ message: 'Zaktualizowano status zadania!' });
  } catch (err) {
    console.error('Błąd aktualizacji zadania:', err.message);
    res.status(500).json({ error: 'Błąd serwera podczas aktualizacji zadania' });
  }
});

// Pobieranie zadań do wspolnego kalendarza
app.get('/api/zadania-kalendarz', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
         l.id_zadania, 
         l.nazwa_zadania, 
         l.czas_powtarzania, 
         l.id_uzytkownika, 
         l.czy_wykonane, 
         l.czy_w_kalendarzu, 
         TO_CHAR(l.data_zadania, 'YYYY-MM-DD') AS data_zadania,
         u.login 
       FROM lista_obowiazkow l
       JOIN uzytkownicy u ON l.id_uzytkownika = u.id_uzytkownika
       WHERE l.czy_w_kalendarzu = true
       ORDER BY l.data_zadania ASC NULLS LAST, l.id_zadania ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Błąd pobierania zadań do kalendarza:', err.message);
    res.status(500).json({ error: 'Błąd serwera podczas pobierania zadań kalendarza' });
  }
});


const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});