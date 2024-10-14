// src/pages/Administrador/AdmAgendamentos.js
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './admAgendamentos.css';

Modal.setAppElement('#root');

const AdmAgendamentos = () => {
    const [agendamentos, setAgendamentos] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [newAgendamento, setNewAgendamento] = useState({
        nomeCliente: '',
        data: '',
        horario: '',
        profissionalId: '',
        servicoId: '',
        status: 'aberto',
    });
    const [servicos, setServicos] = useState([]);
    const [profissionais, setProfissionais] = useState([]);

    const horarios = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

    useEffect(() => {
        fetchData('servicos', setServicos);
        fetchData('profissionais', setProfissionais);
        fetchAgendamentos();
    }, []);

    const fetchData = (endpoint, setData) => {
        fetch(`https://api-smartcut-production.up.railway.app/${endpoint}`)
            .then(response => response.json())
            .then(setData)
            .catch(err => console.error(err));
    };

    const fetchAgendamentos = () => {
        fetch('https://api-smartcut-production.up.railway.app/agendamentos')
            .then(response => response.json())
            .then(data => {
                // Ordena primeiro pelos status (abertos) e depois por data
                const agendamentosOrdenados = data.sort((a, b) => {
                    if (a.status === 'aberto' && b.status !== 'aberto') return -1;
                    if (a.status !== 'aberto' && b.status === 'aberto') return 1;
                    return new Date(`${a.data}T${a.horario}`) - new Date(`${b.data}T${b.horario}`);
                });
                setAgendamentos(agendamentosOrdenados);
            })
            .catch(err => console.error(err));
    };

    const formatarData = data => {
        const dataObj = new Date(data);
        return `${String(dataObj.getDate() + 1).padStart(2, '0')}/${String(dataObj.getMonth() + 1).padStart(2, '0')}/${dataObj.getFullYear()}`;
    };

    const openModal = () => {
        setNewAgendamento({
            nomeCliente: '',
            data: '',
            horario: '',
            profissionalId: '',
            servicoId: '',
            status: 'aberto',
        });
        setModalIsOpen(true);
    };

    const closeModal = () => setModalIsOpen(false);

    const handleAddAgendamento = () => {
        const { nomeCliente, data, horario, profissionalId, servicoId } = newAgendamento;

        if (!data || !horario || !profissionalId || !servicoId || !nomeCliente) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const body = {
            data,
            horario,
            servicoId: parseInt(servicoId),
            profissionalId: parseInt(profissionalId),
            status: 'aberto',
            nomeCliente,
        };

        fetch('https://api-smartcut-production.up.railway.app/agendamentos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })
            .then(() => {
                fetchAgendamentos();
                closeModal();
            })
            .catch(err => console.error(err));
    };

    const handleUpdateStatus = (id, newStatus) => {
        if (window.confirm(`Tem certeza que deseja ${newStatus === 'cancelado' ? 'cancelar' : 'concluir'} este agendamento?`)) {
            fetch(`https://api-smartcut-production.up.railway.app/agendamentos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            })
                .then(fetchAgendamentos)
                .catch(err => console.error(err));
        }
    };

    return (
        <div className="adm-agendamentos-container">
            <h1>Agendamentos</h1>
            <button onClick={openModal} className='adm-agendamentos-add-btn'>Adicionar Agendamento</button>

            <ul className="adm-agendamentos-list">
                {agendamentos.map(agendamento => (
                    <li key={agendamento.id} className={`adm-agendamentos-item ${agendamento.status !== 'aberto' ? 'agendamento-fechado' : ''}`}>
                        <div className="adm-agendamentos-list-info">
                            <span>
                                <strong>Cliente:</strong> {agendamento.nomeCliente || agendamento.Cliente.nome || ''}
                            </span>
                            <span>
                                <strong>Serviço:</strong> {agendamento.Servico?.nome || ''}
                            </span>
                            <span>
                                <strong>Profissional:</strong> {agendamento.Profissional?.nome || ''}
                            </span>
                        </div>
                        <div className="adm-agendamentos-list-info">
                            <span>
                                <strong>Status:</strong> {agendamento.status}
                            </span>
                            <span>
                                <strong>Data:</strong> {formatarData(agendamento.data)}
                            </span>
                            <span>
                                <strong>Hora:</strong> {agendamento.horario}
                            </span>
                        </div>
                        {agendamento.status === 'aberto' && (
                            <div className="adm-agendamentos-list-actions">
                                <button onClick={() => handleUpdateStatus(agendamento.id, 'concluido')} className='adm-agendamentos-concluir-btn'>Concluir</button>
                                <button onClick={() => handleUpdateStatus(agendamento.id, 'cancelado')} className='adm-agendamentos-cancelar-btn'>Cancelar</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            <Modal className="adm-agendamentos-modal" isOpen={modalIsOpen} onRequestClose={closeModal}>
                <h2>Adicionar Agendamento</h2>
                <input
                    type="text"
                    placeholder="Nome do Cliente"
                    value={newAgendamento.nomeCliente}
                    onChange={e => setNewAgendamento({ ...newAgendamento, nomeCliente: e.target.value })}
                />
                <div className='adm-agendamentos-model-selects'>

                    <input
                        type="date"
                        value={newAgendamento.data}
                        onChange={e => setNewAgendamento({ ...newAgendamento, data: e.target.value })}
                    />
                    <select
                        value={newAgendamento.horario}
                        onChange={e => setNewAgendamento({ ...newAgendamento, horario: e.target.value })}
                    >
                        <option value="">Selecione um Horário</option>
                        {horarios.map(horario => (
                            <option key={horario} value={horario}>{horario}</option>
                        ))}
                    </select>
                </div>

                <div className='adm-agendamentos-model-selects'>
                    <select
                        value={newAgendamento.profissionalId}
                        onChange={e => setNewAgendamento({ ...newAgendamento, profissionalId: e.target.value })}
                    >
                        <option value="">Selecione um Profissional</option>
                        {profissionais.map(({ id, nome }) => (
                            <option key={id} value={id}>{nome}</option>
                        ))}
                    </select>
                    <select
                        value={newAgendamento.servicoId}
                        onChange={e => setNewAgendamento({ ...newAgendamento, servicoId: e.target.value })}
                    >
                        <option value="">Selecione um Serviço</option>
                        {servicos.map(({ id, nome }) => (
                            <option key={id} value={id}>{nome}</option>
                        ))}
                    </select>

                </div>
                <div className='adm-agendamentos-model-selects'>
                    <button onClick={handleAddAgendamento} className="adm-agendamentos-save-btn">Adicionar</button>
                    <button onClick={closeModal} className="adm-agendamentos-close-btn">Fechar</button>
                </div>
            </Modal>
        </div>
    );
};

export default AdmAgendamentos;
