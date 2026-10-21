import React from 'react';
import './kalendarz_css.css'; 

function Kalendarz() {
  return (
    <div className="kalendarz-page">
      <nav className="top-nav">
        <div className="nav-item"><i className="fa-regular fa-user"></i> PROFIL</div>
        <div className="nav-item"><i className="fa-solid fa-house"></i> DOM</div>
        <div className="nav-item"><i className="fa-regular fa-calendar-days"></i> KALENDARZ</div>
        <div className="nav-item"><i className="fa-solid fa-chart-simple"></i> STATYSTYKI</div>
        <div className="nav-item"><i className="fa-solid fa-broom"></i> OBOWIĄZKI</div>
      </nav>

      <main className="board-container">
        <div className="week-picker">
          <i className="fa-solid fa-caret-left arrow-btn"></i>
          <span>TEN TYDZIEŃ (1.10–7.10)</span>
          <i className="fa-solid fa-caret-right arrow-btn"></i>
        </div>

        <div className="days-grid">
          {/* poniedziałek */}
          <div className="day-column">
            <div className="day-header">PON</div>
            <div className="tasks-list"></div>
            <div className="add-button-container">
              <button className="add-btn"><i className="fa-solid fa-plus"></i> DODAJ</button>
            </div>
          </div>

          {/* wtorek */}
          <div className="day-column">
            <div className="day-header">WT</div>
            <div className="tasks-list"></div>
            <div className="add-button-container">
              <button className="add-btn"><i className="fa-solid fa-plus"></i> DODAJ</button>
            </div>
          </div>

          {/* środa */}
          <div className="day-column">
            <div className="day-header">ŚR</div>
            <div className="tasks-list"></div>
            <div className="add-button-container">
              <button className="add-btn"><i className="fa-solid fa-plus"></i> DODAJ</button>
            </div>
          </div>

          {/* czwartek */}
          <div className="day-column">
            <div className="day-header">CZW</div>
            <div className="tasks-list"></div>
            <div className="add-button-container">
              <button className="add-btn"><i className="fa-solid fa-plus"></i> DODAJ</button>
            </div>
          </div>

          {/* piątek */}
          <div className="day-column">
            <div className="day-header">PT</div>
            <div className="tasks-list"></div>
            <div className="add-button-container">
              <button className="add-btn"><i className="fa-solid fa-plus"></i> DODAJ</button>
            </div>
          </div>

          {/* sobota */}
          <div className="day-column">
            <div className="day-header">SOB</div>
            <div className="tasks-list"></div>
            <div className="add-button-container">
              <button className="add-btn"><i className="fa-solid fa-plus"></i> DODAJ</button>
            </div>
          </div>

          {/* niedziela */}
          <div className="day-column">
            <div className="day-header">ND</div>
            <div className="tasks-list"></div>
            <div className="add-button-container">
              <button className="add-btn"><i className="fa-solid fa-plus"></i> DODAJ</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Kalendarz;