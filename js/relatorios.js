const SUPABASE_URL = "https://fqzvdjvktaqlvfncfyhs.supabase.co"; 
const SUPABASE_KEY = "sb_publishable_KCwZY0jEeqoHIwrRP6-z3g_iGK0v2C2"; 
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function compilarRelatorios() {
    try {
        const { data: dadosFinanceiro, error: erroFinanceiro } = await supabaseClient
            .from('financeiro')
            .select('*');

        if (erroFinanceiro) throw erroFinanceiro;
        const financeiro = dadosFinanceiro || [];

        const { data: dadosClientes, error: erroClientes } = await supabaseClient
            .from('clientes')
            .select('*');

        if (erroClientes) throw erroClientes;
        const clientes = dadosClientes || [];

        let entradas = 0;
        let saidas = 0;

        financeiro.forEach(t => {
            const valorNum = parseFloat(t.valor) || 0;
            if (t.tipo === 'entrada') {
                entradas += valorNum;
            } else if (t.tipo === 'saida') {
                saidas += valorNum;
            }
        });

        const saldoLiquido = entradas - saidas;

        if (document.getElementById('repEntradas')) {
            document.getElementById('repEntradas').innerText = entradas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }
        if (document.getElementById('repSaidas')) {
            document.getElementById('repSaidas').innerText = saidas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }
        
        const elementSaldo = document.getElementById('repSaldoLiquido');
        if (elementSaldo) {
            elementSaldo.innerText = saldoLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            elementSaldo.className = saldoLiquido < 0 ? "red" : "green";
        }

        const totalClientes = clientes.length;
        let somaNotas = 0;
        
        clientes.forEach(c => {
            somaNotas += parseInt(c.avaliacao) || 5;
        });

        const mediaEstrelas = totalClientes > 0 ? (somaNotas / totalClientes).toFixed(1) : "0.0";
        
        if (document.getElementById('repTotalClientes')) {
            document.getElementById('repTotalClientes').innerText = totalClientes;
        }
        if (document.getElementById('repMediaEstrelas')) {
            document.getElementById('repMediaEstrelas').innerText = `${mediaEstrelas} ★`;
        }
    } catch (error) {
        console.error(error.message);
    }
}

compilarRelatorios();