
const financeiro = JSON.parse(localStorage.getItem('financeiro')) || [];
const clientes = JSON.parse(localStorage.getItem('clientes')) || [];

function compilarRelatorios() {
    let entradas = 0;
    let saidas = 0;

    financeiro.forEach(t => {
        if (t.tipo === 'entrada') {
            entradas += t.valor;
        } else {
            saidas += t.valor;
        }
    });

    const saldoLiquido = entradas - saidas;

    document.getElementById('repEntradas').innerText = entradas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('repSaidas').innerText = saidas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
    const elementSaldo = document.getElementById('repSaldoLiquido');
    elementSaldo.innerText = saldoLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    elementSaldo.className = saldoLiquido < 0 ? "red" : "green";


    const totalClientes = clientes.length;
    let somaNotas = 0;
    
    clientes.forEach(c => {
        somaNotas += parseInt(c.avaliacao) || 5;
    });

    const mediaEstrelas = totalClientes > 0 ? (somaNotas / totalClientes).toFixed(1) : "0.0";
    
    document.getElementById('repTotalClientes').innerText = totalClientes;
    document.getElementById('repMediaEstrelas').innerText = `${mediaEstrelas} ★`;
}

compilarRelatorios();