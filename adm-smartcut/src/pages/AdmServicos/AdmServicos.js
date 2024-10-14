import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './admServicos.css';
import axios from 'axios';

Modal.setAppElement('#root');

const AdmServicos = () => {
    const [servicos, setServicos] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [newService, setNewService] = useState({ nome: '', preco: '', duracao: '' });
    const [isUpdating, setIsUpdating] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState(null);

    const fetchServicos = async () => {
        try {
            const response = await axios.get('https://api-smartcut-production.up.railway.app/servicos/');
            setServicos(response.data);
        } catch (error) {
            console.error('Erro ao buscar serviços:', error);
        }
    };

    useEffect(() => {
        fetchServicos();
    }, []);

    const openModalForNew = () => {
        setNewService({ nome: '', preco: '', duracao: '' });
        setIsUpdating(false);
        setModalIsOpen(true);
    };

    const openModalForUpdate = (service) => {
        setNewService({
            nome: service.nome,
            preco: service.preco,
            duracao: service.duracao,
        });
        setSelectedServiceId(service.id);
        setIsUpdating(true);
        setModalIsOpen(true);
    };

    const handleAddOrUpdateService = async () => {
        if (Object.values(newService).some(field => field === '')) {
            alert("Todos os campos são obrigatórios.");
            return;
        }

        try {
            if (isUpdating) {
                // Atualiza o serviço existente
                await axios.put(`https://api-smartcut-production.up.railway.app/servicos/${selectedServiceId}`, newService);
                setServicos(servicos.map(s => (s.id === selectedServiceId ? { ...s, ...newService } : s)));
                setSelectedServiceId(null);
            } else {
                // Adiciona um novo serviço
                const response = await axios.post('https://api-smartcut-production.up.railway.app/servicos', newService);
                setServicos([...servicos, response.data]);
            }
        } catch (error) {
            console.error('Erro ao adicionar ou atualizar serviço:', error);
        }

        setNewService({ nome: '', preco: '', duracao: '' });
        setModalIsOpen(false);
    };

    const handleDeleteService = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir este serviço?")) {
            try {
                await axios.delete(`https://api-smartcut-production.up.railway.app/servicos/${id}`);
                setServicos(servicos.filter(service => service.id !== id));
            } catch (error) {
                console.error('Erro ao excluir serviço:', error);
            }
        }
    };

    return (
        <div className="adm-servicos-container">
            <h1>Gerenciar Serviços</h1>
            <button className="adm-servicos-add-btn" onClick={openModalForNew}>Adicionar Serviço</button>
            <Modal className="adm-servicos-modal" isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
                <h2>{isUpdating ? "Atualizar Serviço" : "Adicionar Serviço"}</h2>
                <input
                    type="text"
                    placeholder="Nome"
                    value={newService.nome}
                    onChange={(e) => setNewService({ ...newService, nome: e.target.value })}
                    className="adm-servicos-input"
                />
                <input
                    type="text"
                    placeholder="Preço"
                    value={newService.preco}
                    onChange={(e) => setNewService({ ...newService, preco: e.target.value })}
                    className="adm-servicos-input"
                />
                <input
                    type="text"
                    placeholder="Duração"
                    value={newService.duracao}
                    onChange={(e) => setNewService({ ...newService, duracao: e.target.value })}
                    className="adm-servicos-input"
                />

                <button className="adm-servicos-save-btn" onClick={handleAddOrUpdateService}>
                    {isUpdating ? "Atualizar" : "Adicionar"}
                </button>
                <button className="adm-servicos-close-btn" onClick={() => setModalIsOpen(false)}>Fechar</button>
            </Modal>
            <ul className="adm-servicos-list">
                {servicos.map(service => (
                    <li key={service.id} className="adm-servicos-item">
                        <div className='adm-servicos-item-info'>
                            <div>
                                {`ID: ${service.id} - Serviço: ${service.nome}`}
                            </div>
                            <div>
                                {`Preço: ${service.preco} - Duração: ${service.duracao} min`}
                            </div>
                        </div>
                        <div className="adm-servicos-item-buttons">
                            <button className="adm-servicos-delete-btn" onClick={() => handleDeleteService(service.id)}>Excluir</button>
                            <button className="adm-servicos-update-btn" onClick={() => openModalForUpdate(service)}>Atualizar</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdmServicos;
