const formProduto = document.getElementById('formProduto');
const listaProdutos = document.getElementById('listaProdutos');
const formTitle = document.getElementById('formTitle');
const btnSubmit = document.getElementById('btnSubmitForm');
const btnCancelar = document.getElementById('btnCancelarEdicao');
const inputEditandoIndex = document.getElementById('editandoIndex');

let produtos = JSON.parse(localStorage.getItem('produtos')) || [
    { codigo: "PRD-9011", nome: "Licença Right Core Alpha", categoria: "Software", preco: "2500.00" },
    { codigo: "PRD-4022", nome: "Módulo Terminal Holográfico", categoria: "Hardware", preco: "8400.00" },
    { codigo: "PRD-1089", nome: "Banco de Dados Quantum Base", categoria: "Infraestrutura", preco: "15700.00" },
    { codigo: "PRD-3351", nome: "Firewall Criptográfico v4", categoria: "Segurança", preco: "1200.00" }
];

function renderizarProdutos() {
    listaProdutos.innerHTML = '';
    
    produtos.forEach((produto, index) => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td style="color: #a78bfa; font-weight: bold; font-family: monospace;">${produto.codigo}</td>
            <td style="color: #fff; font-weight: bold;">${produto.nome}</td>
            <td>${produto.categoria}</td>
            <td style="font-family: monospace;">R$ ${parseFloat(produto.preco).toFixed(2)}</td>
            <td style="text-align: center;">
                <button class="btn-edit" onclick="prepararEdicao(${index})">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="btn-delete" onclick="deletarProduto(${index})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        listaProdutos.appendChild(tr);
    });
}

window.prepararEdicao = function(index) {
    const prod = produtos[index];
    
    formTitle.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> MODIFICAR PRODUTO`;
    btnSubmit.innerText = "SALVAR ALTERAÇÕES";
    inputEditandoIndex.value = index; 
    btnCancelar.classList.remove('hidden');

    document.getElementById('prodCodigo').value = prod.codigo;
    document.getElementById('prodNome').value = prod.nome;
    document.getElementById('prodCategoria').value = prod.categoria;
    document.getElementById('prodPreco').value = prod.preco;
}

window.cancelarEdicao = function() {
    formTitle.innerHTML = `<i class="fa-solid fa-plus"></i> REGISTRAR PRODUTO`;
    btnSubmit.innerText = "CADASTRAR PRODUTO";
    inputEditandoIndex.value = "";
    btnCancelar.classList.add('hidden');
    formProduto.reset();
}

formProduto.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const indexEdicao = inputEditandoIndex.value;
    const dadosProduto = {
        codigo: document.getElementById('prodCodigo').value,
        nome: document.getElementById('prodNome').value,
        categoria: document.getElementById('prodCategoria').value,
        preco: document.getElementById('prodPreco').value
    };
    
    if (indexEdicao !== "") {
        produtos[indexEdicao] = dadosProduto;
    } else {
        const codigoExiste = produtos.some(p => p.codigo.toLowerCase() === dadosProduto.codigo.toLowerCase());
        if (codigoExiste) {
            alert("Aviso: Esse código de produto já está registrado.");
            return;
        }
        produtos.push(dadosProduto);
    }
    
    localStorage.setItem('produtos', JSON.stringify(produtos));
    cancelarEdicao();
    renderizarProdutos();
});

window.deletarProduto = function(index) {
    produtos.splice(index, 1);
    localStorage.setItem('produtos', JSON.stringify(produtos));
    if(inputEditandoIndex.value == index) {
        cancelarEdicao();
    }
    renderizarProdutos();
};

renderizarProdutos();