import express from 'express';
import cors from 'cors';
import pkg from 'pg';

const app = express();
app.use(cors());
app.use(express.json());

const pool = new pkg.Pool({
  user: 'postgres',
  host: 'localhost',
  database: '10sekund',
  password: '10sekund',
  port: 5432,
});

// LOGOWANIE I REJESTRACJA
app.post('/api/auth', async (req, res) => {
  const { mode, name, access_code, group_name } = req.body;

  try {
    let group;

    if (mode === 'register') {
      const checkGroup = await pool.query('SELECT * FROM groups WHERE access_code = $1', [access_code]);
      if (checkGroup.rows.length > 0) {
        return res.status(400).json({ error: 'Ten kod PIN jest już zajęty!' });
      }

      const newGroup = await pool.query(
        'INSERT INTO groups (name, access_code) VALUES ($1, $2) RETURNING *',
        [group_name || 'Moje Mieszkanie', access_code]
      );
      group = newGroup.rows[0];
    } else {
      const checkGroup = await pool.query('SELECT * FROM groups WHERE access_code = $1', [access_code]);
      if (checkGroup.rows.length === 0) {
        return res.status(404).json({ error: 'Nie znaleziono grupy o takim PINie!' });
      }
      group = checkGroup.rows[0];
    }

    let uRes = await pool.query('SELECT * FROM users WHERE group_id = $1 AND name = $2', [group.id, name]);
    if (uRes.rows.length === 0) {
      uRes = await pool.query('INSERT INTO users (group_id, name) VALUES ($1, $2) RETURNING *', [group.id, name]);
    }
    const user = uRes.rows[0];

    res.json({ user, group });
  } catch (err) {
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

// POBIERANIE CZŁONKÓW GRUPY
app.get('/api/users/:groupId', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name FROM users WHERE group_id = $1',
      [parseInt(req.params.groupId)]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Błąd pobierania użytkowników' });
  }
});

// POBIERANIE ZADAŃ DLA TYGODNIA (Z KONWERSJĄ DATY DO YYYY-MM-DD)
app.get('/api/tasks', async (req, res) => {
  const { group_id, start, end } = req.query;
  try {
    const result = await pool.query(
      `SELECT tasks.id, tasks.group_id, tasks.title, tasks.day, 
              TO_CHAR(tasks.task_date, 'YYYY-MM-DD') AS task_date, 
              tasks.assigned_to, users.name AS assigned_name 
       FROM tasks 
       LEFT JOIN users ON tasks.assigned_to = users.id 
       WHERE tasks.group_id = $1 AND task_date >= $2 AND task_date <= $3 
       ORDER BY tasks.id ASC`,
      [parseInt(group_id), start, end]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Błąd pobierania zadań' });
  }
});

// DODAWANIE ZADANIA
app.post('/api/tasks', async (req, res) => {
  const { group_id, title, day, task_date, is_weekly, assigned_to } = req.body;

  try {
    const parsedGroupId = parseInt(group_id);
    const parsedAssignedTo = assigned_to ? parseInt(assigned_to) : null;

    try {
      const result = await pool.query(
        `INSERT INTO tasks (group_id, title, day, task_date, is_weekly, assigned_to) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [parsedGroupId, title, day, task_date, is_weekly || false, parsedAssignedTo]
      );
      return res.json(result.rows[0]);
    } catch (innerErr) {
      const resultFallback = await pool.query(
        `INSERT INTO tasks (group_id, title, day, task_date, assigned_to) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [parsedGroupId, title, day, task_date, parsedAssignedTo]
      );
      return res.json(resultFallback.rows[0]);
    }
  } catch (err) {
    res.status(500).json({ error: 'Błąd dodawania zadania' });
  }
});

app.listen(5000);