let baseClientes = JSON.parse(localStorage.getItem('clientes')) || [
    { id: "CLI-1024", nome: "Linus Torvalds", empresa: "Linux Foundation", contato: "linus@kernel.org", avaliacao: "5" },
    { id: "CLI-4401", nome: "Ada Lovelace", empresa: "Analytical Engine Corp", contato: "(11) 98888-7777", avaliacao: "4" },
    { id: "CLI-7892", nome: "Neo Anderson", empresa: "Matrix Code Inc.", contato: "@neo_nebula", avaliacao: "3" }
];

const modal = document.getElementById('modalCliente');
const btnAbrir = document.getElementById('btnAbrirModal');
const btnFechar = document.getElementById('btnFecharModal');
const form = document.getElementById('formNovoCliente');
const inputBusca = document.getElementById('buscaId');

const modalTitle = document.getElementById('modalTitle');
const inputEditandoIndex = document.getElementById('editandoIndex');

btnAbrir.addEventListener('click', () => {
    modalTitle.innerText = "// REGISTRAR NOVO CLIENTE";
    inputEditandoIndex.value = ""; 
    form.reset();
    document.getElementById('cliId').disabled = false; 
    modal.classList.remove('hidden');
});

btnFechar.addEventListener('click', () => modal.classList.add('hidden'));

function renderizarClientes(filtro = "") {
    const tabelaBody = document.getElementById('listaClientes');
    tabelaBody.innerHTML = "";

    baseClientes.forEach((cliente, index) => {
        if (filtro && !cliente.id.toLowerCase().includes(filtro.toLowerCase())) {
            return;
        }

        const estrelas = "⭐".repeat(parseInt(cliente.avaliacao || 5));

        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td style="color: #a78bfa; font-weight: bold;">${cliente.id}</td>
            <td style="color: #fff; font-weight: bold;"><i class="fa-solid fa-user-astronaut" style="margin-right: 8px; color: rgba(167, 139, 250, 0.6)"></i>${cliente.nome}</td>
            <td>${cliente.empresa}</td>
            <td style="color: #cbd5e1; font-family: monospace;">${cliente.contato}</td>
            <td><span class="stars-badge">${starsHTML(cliente.avaliacao)}</span></td>
            <td style="text-align: center;">
                <!-- NOVO: Botão Editar passa o index do elemento -->
                <button class="btn-edit" onclick="prepararEdicao(${index})">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="btn-delete" onclick="removerCliente('${cliente.id}')">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </td>
        `;
        tabelaBody.appendChild(linha);
    });
}

function starsHTML(nota) {
    if (nota === 'andamento') {
        return "⏳  Em Andamento";
    }
    return "⭐".repeat(parseInt(nota || 5));
}

inputBusca.addEventListener('input', function() {
    renderizarClientes(this.value);
});

window.removerCliente = function(id) {
    baseClientes = baseClientes.filter(cliente => cliente.id !== id);
    localStorage.setItem('clientes', JSON.stringify(baseClientes));
    renderizarClientes(inputBusca.value);
}

window.prepararEdicao = function(index) {
    const cliente = baseClientes[index];
    
    modalTitle.innerText = "// EDITAR_DADOS_CLIENTE";
    inputEditandoIndex.value = index; 

    // Preenche o formulário
    document.getElementById('cliId').value = cliente.id;
    document.getElementById('cliId').disabled = true; 
    document.getElementById('cliNome').value = cliente.nome;
    document.getElementById('cliEmpresa').value = cliente.empresa;
    document.getElementById('cliContato').value = cliente.contato;
    document.getElementById('cliAvaliacao').value = cliente.avaliacao;

    modal.classList.remove('hidden');
}

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const id = document.getElementById('cliId').value;
    const nome = document.getElementById('cliNome').value;
    const empresa = document.getElementById('cliEmpresa').value;
    const contato = document.getElementById('cliContato').value;
    const avaliacao = document.getElementById('cliAvaliacao').value;
    const indexEdicao = inputEditandoIndex.value;

    const dadosCliente = { id, nome, empresa, contato, avaliacao };

    if (indexEdicao !== "") {
        baseClientes[indexEdicao] = dadosCliente;
    } else {
        const idExiste = baseClientes.some(c => c.id.toLowerCase() === id.toLowerCase());
        if (idExiste) {
            alert("Atenção: Este CLIENT_ID já existe no banco de dados.");
            return;
        }
        baseClientes.push(dadosCliente);
    }

    localStorage.setItem('clientes', JSON.stringify(baseClientes));

    renderizarClientes(inputBusca.value);
    form.reset();
    modal.classList.add('hidden');
});

renderizarClientes();