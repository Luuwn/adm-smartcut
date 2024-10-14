// src/pages/Administrador/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css'; // Importe o arquivo de CSS para estilização

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Validação simples (pode ser substituída por uma autenticação real)
        if (username === "admin" && password === "senha123") {
            localStorage.setItem("isAuthenticated", true);
            navigate("/adm-smartcut/dashboard");
        } else {
            alert("Credenciais inválidas");
        }
    };

    return (
        <div className="login-container">
            {/* Área da mensagem de boas-vindas */}
            <div className="login-welcome">
                <h2>Bem-vindo ao Painel Administrativo</h2>
                <p>Gerencie os serviços, profissionais e agendamentos da Smart Cut com facilidade. Faça login para continuar.</p>
            </div>

            {/* Área do formulário de login */}
            <div className="login-form-container">
                <h1>Login</h1>
                <form onSubmit={handleLogin} className="login-form">
                    <label>
                        Usuário:
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </label>
                    <label>
                        Senha:
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </label>
                    <button type="submit">Entrar</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
