import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [clientes, setClientes] = useState([]);
    const [novoCliente, setNovoCliente] = useState({ nome: '', email: '', telefone: '' });

    useEffect(() => {
        // Buscar clientes ao carregar o componente
        axios.get('http://localhost:3001/clientes')
            .then(response => setClientes(response.data))
            .catch(error => console.error(error));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNovoCliente({ ...novoCliente, [name]: value });
    };

    const cadastrarCliente = () => {
        axios.post('http://localhost:3001/clientes', novoCliente)
            .then(response => setClientes([...clientes, response.data]))
            .catch(error => console.error(error));
    };

    return (
        <div>
            <h1>Gerenciamento de Clientes</h1>

            {/* Lista de Clientes */}
            <ul>
                {clientes.map(cliente => (
                    <li key={cliente.id}>{cliente.nome} - {cliente.email} - {cliente.telefone}</li>
                ))}
            </ul>

            {/* Formulário para Cadastrar Novo Cliente */}
            <div>
                <h2>Cadastrar Novo Cliente</h2>
                <input type="text" name="nome" placeholder="Nome" onChange={handleInputChange} />
                <input type="text" name="email" placeholder="Email" onChange={handleInputChange} />
                <input type="text" name="telefone" placeholder="Telefone" onChange={handleInputChange} />
                <button onClick={cadastrarCliente}>Cadastrar</button>
            </div>
        </div>
    );
}

export default App;
