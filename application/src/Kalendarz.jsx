import React, { useState, useEffect } from 'react';
import './Kalendarz.css';

function Kalendarz({ user, group, onLogout }) {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const [title, setTitle] = useState('');
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [assignedTo, setAssignedTo] = useState('');

  // Pomocnicza funkcja formatująca datę w czasie lokalnym do YYYY-MM-DD
  const formatYMD = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Obliczanie dat tygodnia (Pon-Ndz)
  const getWeekRange = (date) => {
    const tempDate = new Date(date);
    const dayOfWeek = tempDate.getDay();
    const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const monday = new Date(tempDate);
    monday.setDate(tempDate.getDate() + distanceToMonday);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return {
      startStr: formatYMD(monday),
      endStr: formatYMD(sunday),
      monday,
    };
  };

  const weekRange = getWeekRange(currentDate);

  const dniNazwy = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'];
  const weekDays = dniNazwy.map((name, index) => {
    const d = new Date(weekRange.monday);
    d.setDate(weekRange.monday.getDate() + index);
    return { name, dateStr: formatYMD(d) };
  });

  // Pobieranie mieszkańców
  useEffect(() => {
    if (group && group.id) {
      fetch(`http://localhost:5000/api/users/${group.id}`)
        .then((res) => res.json())
        .then((data) => {
          setUsers(data);
          if (data.length > 0) setAssignedTo(data[0].id);
        })
        .catch((err) => console.error(err));
    }
  }, [group]);

  // Pobieranie zadań
  const fetchTasks = () => {
    if (group && group.id) {
      fetch(`http://localhost:5000/api/tasks?group_id=${group.id}&start=${weekRange.startStr}&end=${weekRange.endStr}`)
        .then((res) => res.json())
        .then((data) => setTasks(data))
        .catch((err) => console.error(err));
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [group, currentDate]);

  const changeWeek = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + days);
    setCurrentDate(newDate);
  };

  // Dodawanie zadania
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title) return;

    const chosenDay = weekDays[selectedDayIndex];

    await fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        group_id: group.id,
        title: title,
        day: chosenDay.name,
        task_date: chosenDay.dateStr,
        assigned_to: assignedTo || null,
      }),
    });

    setTitle('');
    fetchTasks();
  };

  return (
    <div className="kalendarz-container" style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* NAGŁÓWEK */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <div>
          <h2>Grupa: {group.name} (PIN: {group.access_code})</h2>
          <p style={{ margin: 0 }}>Zalogowany: <b>{user.name}</b></p>
        </div>
        <button onClick={onLogout} style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Wyloguj
        </button>
      </div>

      {/* PASEK NAWIGACJI */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#e9ecef', padding: '10px 20px', borderRadius: '6px', marginBottom: '20px' }}>
        <button onClick={() => changeWeek(-7)} style={{ padding: '8px 12px', cursor: 'pointer' }}>
          ← Poprzedni tydzień
        </button>
        <h3 style={{ margin: 0 }}>
          Tydzień: {weekRange.startStr} do {weekRange.endStr}
        </h3>
        <button onClick={() => changeWeek(7)} style={{ padding: '8px 12px', cursor: 'pointer' }}>
          Następny tydzień →
        </button>
      </div>

      {/* KAFELKI DNI TYGODNIA */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', marginBottom: '30px' }}>
        {weekDays.map((dayObj) => (
          <div key={dayObj.dateStr} style={{ background: '#f8f9fa', border: '1px solid #dee2e6', padding: '10px', borderRadius: '6px', minHeight: '220px' }}>
            <h4 style={{ margin: '0 0 2px 0', textAlign: 'center' }}>{dayObj.name}</h4>
            <div style={{ fontSize: '11px', color: '#6c757d', textAlign: 'center', marginBottom: '10px', borderBottom: '1px solid #ddd', paddingBottom: '4px' }}>
              {dayObj.dateStr}
            </div>

            {/* LISTA ZADAŃ POD KAFELKIEM */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {tasks
                .filter((t) => String(t.task_date).substring(0, 10) === dayObj.dateStr)
                .map((t) => (
                  <div key={t.id} style={{ background: '#ffffff', padding: '8px', borderRadius: '4px', borderLeft: '4px solid #007bff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#000' }}>{t.title}</div>
                    <small style={{ color: '#28a745', fontSize: '11px', display: 'block', marginTop: '2px' }}>
                      👤 {t.assigned_name || 'Brak'}
                    </small>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* FORMULARZ NA DOLE */}
      <div style={{ background: '#fff', border: '1px solid #ccc', padding: '20px', borderRadius: '6px' }}>
        <h3 style={{ marginTop: 0 }}>Dodaj nowe zadanie do kalendarza</h3>
        <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Nazwa obowiązkowego zadania..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ flex: '2', padding: '10px', minWidth: '200px' }}
          />

          <select value={selectedDayIndex} onChange={(e) => setSelectedDayIndex(Number(e.target.value))} style={{ padding: '10px' }}>
            {weekDays.map((d, idx) => (
              <option key={d.dateStr} value={idx}>
                {d.name} ({d.dateStr})
              </option>
            ))}
          </select>

          <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} style={{ padding: '10px' }}>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                Przypisz do: {u.name}
              </option>
            ))}
          </select>

          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            + Dodaj zadanie
          </button>
        </form>
      </div>
    </div>
  );
}

export default Kalendarz;