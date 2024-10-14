// src/pages/Administrador/Dashboard/Dashboard.js
import React, { useEffect, useState } from 'react';
import './dashboard.css';

const Dashboard = () => {
    // Estado para armazenar as estatísticas dos agendamentos
    const [stats, setStats] = useState({
        totalAgendamentos: 0,
        agendados: 0,
        concluidos: 0,
        cancelados: 0,
    });

    // Função para buscar dados da API
    const fetchAgendamentosStats = async () => {
        try {
            const response = await fetch('https://api-smartcut-production.up.railway.app/agendamentos'); // URL da API para buscar agendamentos
            const agendamentos = await response.json();

            // Contagem dos diferentes status de agendamentos
            const totalAgendamentos = agendamentos.length;
            const agendados = agendamentos.filter(a => a.status === 'aberto').length;
            const concluidos = agendamentos.filter(a => a.status === 'concluido').length;
            const cancelados = agendamentos.filter(a => a.status === 'cancelado').length;

            // Atualiza o estado com os dados recebidos
            setStats({
                totalAgendamentos,
                agendados,
                concluidos,
                cancelados,
            });
        } catch (error) {
            console.error('Erro ao buscar dados de agendamentos:', error);
        }
    };

    // useEffect para buscar dados assim que o componente for montado
    useEffect(() => {
        fetchAgendamentosStats();
    }, []);

    return (
        <div className="dashboard">
            <h1>Bem-vindo ao Painel de Controle</h1>
            <p>Aqui você pode gerenciar todas as operações do seu estabelecimento.</p>
            
            {/* Seção de Estatísticas */}
            <h2>Agendamentos</h2>
            <div className="stats">
                <div className="stat-item">
                    <h3>Total</h3>
                    <p>{stats.totalAgendamentos}</p>
                </div>
                <div className="stat-item stat-aberto">
                    <h3>Agendados</h3>
                    <p>{stats.agendados}</p>
                </div>
                <div className="stat-item stat-concluido">
                    <h3>Concluídos</h3>
                    <p>{stats.concluidos}</p>
                </div>
                <div className="stat-item stat-cancelado">
                    <h3>Cancelados</h3>
                    <p>{stats.cancelados}</p>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
