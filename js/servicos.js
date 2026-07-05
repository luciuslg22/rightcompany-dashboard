const formServico = document.getElementById('formServico');
const listaServicos = document.getElementById('listaServicos');
const formTitle = document.getElementById('formTitle');
const btnSubmit = document.getElementById('btnSubmitForm');
const btnCancelar = document.getElementById('btnCancelarEdicao');
const inputEditandoIndex = document.getElementById('editandoIndex');

let servicos = JSON.parse(localStorage.getItem('servicos')) || [
    { os: "OS-022", cliente: "CLI-1024", nome: "Manutenção de Servidor", preco: "333.00", status: "Concluído" }
];

function renderizarServicos() {
    listaServicos.innerHTML = '';
    
    servicos.forEach((servico, index) => {
        const tr = document.createElement('tr');
        const classeBadge = servico.status === 'Concluído' ? 'badge concluido' : 'badge andamento';
        
        tr.innerHTML = `
            <td style="color: #a78bfa; font-weight: bold; font-family: monospace;">${servico.os}</td>
            <td style="color: #38bdf8; font-family: monospace;">${servico.cliente}</td>
            <td style="color: #fff; font-weight: bold;">${servico.nome}</td>
            <td style="font-family: monospace;">R$ ${parseFloat(servico.preco).toFixed(2)}</td>
            <td><span class="${classeBadge}">${servico.status.toUpperCase()}</span></td>
            <td style="text-align: center;">
                <button class="btn-edit" style="background: none; border: none; color: #38bdf8; cursor: pointer; font-size: 1rem; margin-right: 10px;" onclick="prepararEdicao(${index})">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="btn-delete" style="background: none; border: none; color: #f43f5e; cursor: pointer; font-size: 1rem;" onclick="deletarServico(${index})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        listaServicos.appendChild(tr);
    });
}

window.prepararEdicao = function(index) {
    const servico = servicos[index];
    
    formTitle.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> ALTERAR ORDEM`;
    btnSubmit.innerText = "SALVAR ALTERAÇÕES";
    inputEditandoIndex.value = index;
    btnCancelar.classList.remove('hidden');

    document.getElementById('osCodigo').value = servico.os;
    document.getElementById('osClienteId').value = servico.cliente;
    document.getElementById('nomeServico').value = servico.nome;
    document.getElementById('precoServico').value = servico.preco;
    document.getElementById('statusServico').value = servico.status;
}

window.cancelarEdicao = function() {
    formTitle.innerHTML = `<i class="fa-solid fa-plus"></i> REGISTRAR SERVIÇO`;
    btnSubmit.innerText = "CADASTRAR SERVIÇO";
    inputEditandoIndex.value = "";
    btnCancelar.classList.add('hidden');
    formServico.reset();
}

formServico.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const indexEdicao = inputEditandoIndex.value;
    const dadosServico = {
        os: document.getElementById('osCodigo').value,
        cliente: document.getElementById('osClienteId').value,
        nome: document.getElementById('nomeServico').value,
        preco: document.getElementById('precoServico').value,
        status: document.getElementById('statusServico').value,
        data: new Date().toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'}) // Mantém salvamento para o gráfico
    };
    
    if (indexEdicao !== "") {
        servicos[indexEdicao] = dadosServico;
    } else {
        servicos.push(dadosServico);
    }
    
    localStorage.setItem('servicos', JSON.stringify(servicos));
    cancelarEdicao();
    renderizarServicos();
});

window.deletarServico = function(index) {
    servicos.splice(index, 1);
    localStorage.setItem('servicos', JSON.stringify(servicos));
    if(inputEditandoIndex.value == index) {
        cancelarEdicao();
    }
    renderizarServicos();
};

renderizarServicos();