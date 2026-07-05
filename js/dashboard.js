
const transacoes = JSON.parse(localStorage.getItem('financeiro')) || [];
const servicos = JSON.parse(localStorage.getItem('servicos')) || [];


let totalEntradas = 0;
let totalSaidas = 0;
let totalRendaMensal = 0; 

transacoes.forEach(t => {
    if (t.tipo === 'entrada') {
        totalEntradas += parseFloat(t.valor);
    } else if (t.tipo === 'saida') {
        totalSaidas += parseFloat(t.valor);
    } else if (t.tipo === 'renda_mensal') {
        totalRendaMensal += parseFloat(t.valor); 
    }
});

const receitaLiquida = totalEntradas - totalSaidas;


document.getElementById('dashReceita').innerText = receitaLiquida.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
document.getElementById('dashCusto').innerText = totalSaidas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
document.getElementById('dashRendaMensal').innerText = totalRendaMensal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
document.getElementById('dashServicos').innerText = servicos.length;

let emAndamento = 0;
let concluido = 0;

servicos.forEach(s => {
    if (s.status === 'Concluído') concluido++;
    else emAndamento++;
});

const ctxRosca = document.getElementById('graficoRosca').getContext('2d');
new Chart(ctxRosca, {
    type: 'doughnut',
    data: {
        labels: ['EM ANDAMENTO', 'CONCLUÍDO'],
        datasets: [{
            data: [emAndamento, concluido],
            backgroundColor: ['#f59e0b', '#10b981'],
            borderColor: '#140a23',
            borderWidth: 2
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { labels: { color: '#cbd5e1', font: { family: 'monospace' } } }
        }
    }
});

const ctxLinha = document.getElementById('graficoLinha').getContext('2d');
new Chart(ctxLinha, {
    type: 'bar',
    data: {
        labels: ['FATURAMENTO TOTAL'],
        datasets: [
            {
                label: 'Entradas',
                data: [totalEntradas],
                backgroundColor: '#10b981'
            },
            {
                label: 'Saídas (Custos)',
                data: [totalSaidas],
                backgroundColor: '#f43f5e'
            }
        ]
    },
    options: {
        responsive: true,
        scales: {
            y: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(139, 92, 246, 0.1)' } },
            x: { ticks: { color: '#cbd5e1' } }
        },
        plugins: {
            legend: { labels: { color: '#cbd5e1', font: { family: 'monospace' } } }
        }
    }
});