import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [clientes, setClientes] = useState([]);
    const [clientesFiltrados, setClientesFiltrados] = useState([]);
    const [novoCliente, setNovoCliente] = useState({ nome: '', email: '', telefone: '' });
    const [filtro, setFiltro] = useState({ nome: '', email: '', telefone: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNovoCliente({ ...novoCliente, [name]: value });
    };

    const cadastrarCliente = async () => {
        try {
            const response = await axios.post('http://localhost:3001/clientes', novoCliente);
            setClientes([...clientes, response.data]);
        } catch (error) {
            console.error(error);
        }
    };

    const listarClientes = async () => {
        try {
            const response = await axios.get('http://localhost:3001/clientes');
            setClientes(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const filtrarClientes = () => {
        const clientesFiltrados = clientes.filter(cliente => {
            const { nome, email, telefone } = filtro;
            return (
                cliente.nome.toLowerCase().includes(nome.toLowerCase()) &&
                cliente.email.toLowerCase().includes(email.toLowerCase()) &&
                cliente.telefone.toLowerCase().includes(telefone.toLowerCase())
            );
        });

        setClientesFiltrados(clientesFiltrados);
    };

    const limparFiltro = () => {
        setFiltro({ nome: '', email: '', telefone: '' });
        // Limpa a lista de clientes filtrados
        setClientesFiltrados([]);
    };

    useEffect(() => {
        listarClientes();
    }, []);

    useEffect(() => {
        // Quando o filtro é limpo, reexibe todos os clientes
        if (filtro.nome === '' && filtro.email === '' && filtro.telefone === '') {
            setClientesFiltrados([]);
        } else {
            filtrarClientes();
        }
    }, [filtro, clientes, filtrarClientes]);

    return (
        <div>
            <div>
                <h2>Cadastrar Novo Cliente</h2>
                <input type="text" name="nome" placeholder="Nome" onChange={handleInputChange} />
                <input type="text" name="email" placeholder="Email" onChange={handleInputChange} />
                <input type="text" name="telefone" placeholder="Telefone" onChange={handleInputChange} />
                <button onClick={cadastrarCliente}>Cadastrar</button>
            </div>

            <div>
                <h2>Filtrar Clientes</h2>
                <input type="text" placeholder="Filtrar por Nome" value={filtro.nome} onChange={(e) => setFiltro({ ...filtro, nome: e.target.value })} />
                <input type="text" placeholder="Filtrar por Email" value={filtro.email} onChange={(e) => setFiltro({ ...filtro, email: e.target.value })} />
                <input type="text" placeholder="Filtrar por Telefone" value={filtro.telefone} onChange={(e) => setFiltro({ ...filtro, telefone: e.target.value })} />
                <button onClick={limparFiltro}>Limpar Filtro</button>
            </div>
            <div>
                <h2>Lista de Clientes Filtrados</h2>
                <ul>
                    {clientesFiltrados.map(cliente => (
                        <li key={cliente.id}>{cliente.nome} - {cliente.email} - {cliente.telefone}</li>
                    ))}
                </ul>
            </div>

            <div>
                <h2>Lista Completa de Clientes</h2>
                <ul>
                    {clientes.map(cliente => (
                        <li key={cliente.id}>{cliente.nome} - {cliente.email} - {cliente.telefone}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;
