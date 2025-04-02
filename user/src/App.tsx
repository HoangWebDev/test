import { useState } from 'react';
import './App.css'
import UsersTable from './components/UsersTable';
import { FaMoon, FaSun } from 'react-icons/fa';

function App() {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <header>
        <h1>Quản lý người dùng</h1>
        <button onClick={toggleDarkMode} className="toggle-button">
          {darkMode
            ? <FaSun className="sun-icon" />
            : <FaMoon className='moon-icon' />
          }
        </button>
      </header>
      <main>
        <UsersTable darkMode={darkMode} />
      </main>
    </div>
  );
}

export default App
