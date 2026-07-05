const formFinanceiro = document.getElementById('formFinanceiro');
const listaTransacoes = document.getElementById('listaTransacoes');
const filtroTipo = document.getElementById('filtroTipo');

let transacoes = [];
try {
    const dadosLocais = localStorage.getItem('financeiro');
    transacoes = dadosLocais ? JSON.parse(dadosLocais) : [];
    if (!Array.isArray(transacoes)) transacoes = [];
} catch (e) {
    transacoes = [];
}

function renderizarTransacoes() {
    if (!listaTransacoes) return;
    listaTransacoes.innerHTML = '';
    
    const filtroAtual = filtroTipo ? filtroTipo.value : 'todos';
    
    transacoes.forEach((t, index) => {
        if (filtroAtual !== 'todos' && t.tipo !== filtroAtual) {
            return;
        }

        const tr = document.createElement('tr');
        
        let badgeStyle = "background: rgba(156, 163, 175, 0.15); color: #9ca3af;"; 
        let tipoTexto = "NÃO DEFINIDO";

        if (t.tipo === 'entrada') {
            badgeStyle = "background: rgba(16, 185, 129, 0.15); color: #10b981;"; 
            tipoTexto = "ENTRADA";
        } else if (t.tipo === 'saida') {
            badgeStyle = "background: rgba(239, 68, 68, 0.15); color: #f43f5e;";
            tipoTexto = "SAÍDA";
        } else if (t.tipo === 'renda_mensal') {
            badgeStyle = "background: rgba(56, 189, 248, 0.15); color: #38bdf8;"; 
            tipoTexto = "MENSALMENTE";
        }
        
        tr.innerHTML = `
            <td style="color: #fff; font-weight: bold;">${t.descricao || 'Sem Descrição'}</td>
            <td style="font-family: monospace; color: #cbd5e1;">R$ ${parseFloat(t.valor || 0).toFixed(2)}</td>
            <td><span style="padding: 0.3rem 0.6rem; border-radius: 4px; font-size: 0.75rem; font-weight: bold; display: inline-block; ${badgeStyle}">${tipoTexto}</span></td>
            <td style="text-align: center;">
                <button style="background: none; border: none; color: #f43f5e; cursor: pointer; font-size: 1rem;" onclick="deletarTransacao(${index})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        listaTransacoes.appendChild(tr);
    });
}


if (filtroTipo) {
    filtroTipo.addEventListener('change', renderizarTransacoes);
}

if (formFinanceiro) {
    formFinanceiro.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const descTransacao = document.getElementById('descTransacao').value;
        const valorTransacao = document.getElementById('valorTransacao').value;
        const tipoTransacao = document.getElementById('tipoTransacao').value;

        const novaTransacao = {
            descricao: descTransacao,
            valor: parseFloat(valorTransacao) || 0, 
            tipo: tipoTransacao || ""
        };
        
        transacoes.push(novaTransacao);
        localStorage.setItem('financeiro', JSON.stringify(transacoes));
        
        formFinanceiro.reset();
        
        // Retorna o filtro para 'todos' para exibir o novo item lançado automaticamente
        if (filtroTipo) filtroTipo.value = 'todos';
        
        renderizarTransacoes();
    });
}

window.deletarTransacao = function(index) {
    transacoes.splice(index, 1);
    localStorage.setItem('financeiro', JSON.stringify(transacoes));
    renderizarTransacoes();
};

renderizarTransacoes();