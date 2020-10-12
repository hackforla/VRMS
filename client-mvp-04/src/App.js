import React from 'react';
import logo from './logo.svg';
import './App.scss';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <img src={logo} className="app-logo" alt="logo" />
        <h1>VRMS</h1>
      </header>
    </div>
  );
}

export default App;
