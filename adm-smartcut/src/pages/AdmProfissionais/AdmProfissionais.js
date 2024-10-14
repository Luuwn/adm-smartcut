// src/pages/Administrador/Adm-Profissionais.js
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import './admProfissionais.css'; // Importe o CSS para estilização
import axios from 'axios'; // Para fazer requisições à API

Modal.setAppElement('#root'); // Define o elemento root para acessibilidade

const AdmProfissionais = () => {
    const [profissionais, setProfissionais] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [selectedProfissionalId, setSelectedProfissionalId] = useState(null);
    const [newProfissional, setNewProfissional] = useState({
        nome: '',
        telefone: '',
        email: '',
        especialidade: ''
    });

    const fetchProfissionais = async () => {
        try {
            const response = await axios.get('https://api-smartcut-production.up.railway.app/profissionais');
            setProfissionais(response.data);
        } catch (error) {
            console.error('Erro ao buscar profissionais:', error);
        }
    };

    useEffect(() => {
        fetchProfissionais();
    }, []);

    const openModalForNew = () => {
        setNewProfissional({ nome: '', telefone: '', email: '', especialidade: '' });
        setIsUpdating(false);
        setModalIsOpen(true);
    };

    const openModalForUpdate = (profissional) => {
        setNewProfissional({
            nome: profissional.nome,
            telefone: profissional.telefone,
            email: profissional.email,
            especialidade: profissional.especialidade
        });
        setSelectedProfissionalId(profissional.id);
        setIsUpdating(true);
        setModalIsOpen(true);
    };

    const handleAddOrUpdateProfissional = async () => {
        if (Object.values(newProfissional).some(field => field === '')) {
            alert("Todos os campos são obrigatórios.");
            return;
        }

        try {
            if (isUpdating) {
                // Atualiza o profissional existente
                await axios.put(`https://api-smartcut-production.up.railway.app/profissionais/${selectedProfissionalId}`, newProfissional);
                setProfissionais(profissionais.map(p => (p.id === selectedProfissionalId ? { ...p, ...newProfissional } : p)));
                setSelectedProfissionalId(null);
            } else {
                // Adiciona um novo profissional
                const response = await axios.post('https://api-smartcut-production.up.railway.app/profissionais', newProfissional);
                setProfissionais([...profissionais, response.data]);
            }
        } catch (error) {
            console.error('Erro ao adicionar ou atualizar profissional:', error);
        }

        setNewProfissional({ nome: '', telefone: '', email: '', especialidade: '' });
        setModalIsOpen(false);
    };

    const handleDeleteProfissional = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir este profissional?")) {
            try {
                await axios.delete(`https://api-smartcut-production.up.railway.app/profissionais/${id}`);
                setProfissionais(profissionais.filter(profissional => profissional.id !== id));
            } catch (error) {
                console.error('Erro ao excluir profissional:', error);
            }
        }
    };

    return (
        <div className="adm-profissionais-container">
            <h1>Gerenciar Profissionais</h1>
            <button className="adm-profissionais-add-btn" onClick={openModalForNew}>Adicionar Profissional</button>
            <Modal className="adm-profissionais-modal" isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
                <h2>{isUpdating ? "Atualizar Profissional" : "Adicionar Profissional"}</h2>
                <input
                    type="text"
                    placeholder="Nome"
                    value={newProfissional.nome}
                    onChange={(e) => setNewProfissional({ ...newProfissional, nome: e.target.value })}
                    className="adm-profissionais-input"
                />
                <input
                    type="text"
                    placeholder="Telefone"
                    value={newProfissional.telefone}
                    onChange={(e) => setNewProfissional({ ...newProfissional, telefone: e.target.value })}
                    className="adm-profissionais-input"
                />
                <input
                    type="text"
                    placeholder="Email"
                    value={newProfissional.email}
                    onChange={(e) => setNewProfissional({ ...newProfissional, email: e.target.value })}
                    className="adm-profissionais-input"
                />
                <input
                    type="text"
                    placeholder="Especialidade"
                    value={newProfissional.especialidade}
                    onChange={(e) => setNewProfissional({ ...newProfissional, especialidade: e.target.value })}
                    className="adm-profissionais-input"
                />
                <button className="adm-profissionais-save-btn" onClick={handleAddOrUpdateProfissional}>
                    {isUpdating ? "Atualizar" : "Adicionar"}
                </button>
                <button className="adm-profissionais-close-btn" onClick={() => setModalIsOpen(false)}>Fechar</button>
            </Modal>
            <ul className="adm-profissionais-list">
                {profissionais.map(profissional => (
                    <li key={profissional.id} className="adm-profissionais-item">
                        <div className='adm-profissionais-item-info'>
                            <span>{`ID: ${profissional.id} - ${profissional.nome}`}</span>
                            <span>{`Telefone: ${profissional.telefone}`}</span>
                        </div>
                        <div className='adm-profissionais-item-info'>
                            <span>{`E-mail: ${profissional.email} `}</span>
                            <span>{`Especialidade: ${profissional.especialidade}`}</span>
                        </div>
                        <div>
                            <button className="adm-profissionais-delete-btn" onClick={() => handleDeleteProfissional(profissional.id)}>Excluir</button>
                            <button className="adm-profissionais-update-btn" onClick={() => openModalForUpdate(profissional)}>Atualizar</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdmProfissionais;
