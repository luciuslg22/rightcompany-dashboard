const SUPABASE_URL = "https://fqzvdjvktaqlvfncfyhs.supabase.co"; 
const SUPABASE_KEY = "sb_publishable_KCwZY0jEeqoHIwrRP6-z3g_iGK0v2C2"; 
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let transacoes = [];
let servicos = [];

let graficoRoscaInstancia = null;
let graficoLinhaInstancia = null;

async function carregarDashboard() {
    try {
        const { data: dadosServicos, error: erroServicos } = await supabaseClient
            .from('servicos')
            .select('*');

        if (erroServicos) throw erroServicos;
        servicos = dadosServicos || [];

        const { data: dadosFinanceiro, error: erroFinanceiro } = await supabaseClient
            .from('financeiro')
            .select('*');

        if (erroFinanceiro) throw erroFinanceiro;
        transacoes = dadosFinanceiro || [];

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
            if (s.status === 'Concluído' || s.status === 'concluido') {
                concluido++;
            } else {
                emAndamento++;
            }
        });

        if (graficoRoscaInstancia) graficoRoscaInstancia.destroy();
        if (graficoLinhaInstancia) graficoLinhaInstancia.destroy();

        const ctxRosca = document.getElementById('graficoRosca').getContext('2d');
        graficoRoscaInstancia = new Chart(ctxRosca, {
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
        graficoLinhaInstancia = new Chart(ctxLinha, {
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

    } catch (err) {
        console.error(err.message);
    }
}

carregarDashboard();