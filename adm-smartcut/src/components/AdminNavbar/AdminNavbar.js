// src/components/AdminNavbar/AdminNavbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './adminNavbar.css'; // Certifique-se de que o nome do arquivo está correto

const AdminNavbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        navigate('/adm-smartcut/login'); // Redireciona para o login após logout
    };

    return (
        <nav className="admin-navbar">
            <div className="admin-navbar-logo">
                <h2>Smart Cut - Admin</h2>
            </div>
            <ul>
                <li><Link to="/adm-smartcut/dashboard">Dashboard</Link></li>
                <li><Link to="/adm-smartcut/servicos">Serviços</Link></li>
                <li><Link to="/adm-smartcut/agendamentos">Agendamentos</Link></li>
                <li><Link to="/adm-smartcut/profissionais">Profissionais</Link></li>
                <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
        </nav>
    );
};

export default AdminNavbar;
