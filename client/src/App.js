import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Logo from "./img/condominio.jpg"
import './styles.css';

function App() {
    const [clientes, setClientes] = useState([]);
    const [clientesFiltrados, setClientesFiltrados] = useState([]);
    const [novoCliente, setNovoCliente] = useState({ nome: '', email: '', telefone: '', casa: 0, x: 0, y: 0 });
    const [filtro, setFiltro] = useState({ nome: '', email: '', telefone: '' });
    const [modalAberta, setModalAberta] = useState(false);
    const [ordemDeVisita, setOrdemDeVisita] = useState([]);
    const [casasSelecionadas, setCasasSelecionadas] = useState([]); // Novo estado para armazenar as casas selecionadas

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
        setClientesFiltrados([]);
    };

    const calcularRota = () => {
        const casasArray = casasSelecionadas.split(',').map(Number);
        
        axios.post('http://localhost:3001/calcula-rota', { casas: casasArray })
            .then(response => {
                setOrdemDeVisita(response.data);
                setModalAberta(true);
            })
            .catch(error => {
                console.error('Erro ao calcular rota:', error);
            });
      };
  

    useEffect(() => {
        listarClientes();
    }, []);

    useEffect(() => {
        if (filtro.nome === '' && filtro.email === '' && filtro.telefone === '') {
            setClientesFiltrados([]);
        } else {
            filtrarClientes();
        }
    }, [filtro, clientes, filtrarClientes]);

    const handleModalClose = () => {
        setModalAberta(false);
    };

    return (
        <div>
            <div>
                <h2>Cadastrar Novo Cliente</h2>
                <input type="text" name="nome" placeholder="Nome" onChange={handleInputChange} />
                <input type="text" name="email" placeholder="Email" onChange={handleInputChange} />
                <input type="text" name="telefone" placeholder="Telefone" onChange={handleInputChange} />
                <input type="number" name="casa" placeholder="Casa" onChange={handleInputChange} />
                <input type="number" name="x" placeholder="Coordenada X" onChange={handleInputChange} />
                <input type="number" name="y" placeholder="Coordenada Y" onChange={handleInputChange} />
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
                        <li key={cliente.id}>
                            Nome: {cliente.nome} -Email: {cliente.email} -Tel: {cliente.telefone} - Casa: {cliente.casa} - ({cliente.x}, {cliente.y})
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h2>Lista Completa de Clientes</h2>
                <ul>
                    {clientes.map(cliente => (
                        <li key={cliente.id}>
                            Nome: {cliente.nome} -Email: {cliente.email} -Tel: {cliente.telefone} - Casa: {cliente.casa} - ({cliente.x}, {cliente.y})
                        </li>
                    ))}
                </ul>
                <div>
                  {/* Novo campo para inserir casas selecionadas */}
                  <h2>Selecionar Casas para Rota</h2>
                  <input
                      type="text"
                      placeholder="Insira as casas (separadas por vírgula)"
                      value={casasSelecionadas}
                      onChange={(e) => setCasasSelecionadas(e.target.value)}
                  />
                  <button onClick={() => calcularRota()}>Calcular Rota</button>
              </div>
            </div>
            {modalAberta && (
                <div className="modal">
                    <div className="modal-content">
                    <span className="close" onClick={handleModalClose}>&times;</span>
                    <h2>Ordem de Visita</h2>
                    <ul>
                        {ordemDeVisita.map((clienteId, index) => {
                        const clienteSelecionado = clientes.find(cliente => cliente.id === clienteId);
                        return (
                            clienteSelecionado && (
                            <li key={index}>
                                {`Casa ${clienteSelecionado.casa}`}
                            </li>
                            )
                        );
                        })}
                    </ul>
                    </div>
                </div>
                )}
                <h2></h2>
                    <img style={{ width: 450, height: 300 }}S src={Logo} alt='Condomino da parte 2' title='Condomino da parte 2' />
                <h2></h2>
        </div>
        
    );
}

export default App;
