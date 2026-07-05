const SUPABASE_URL = "https://fqzvdjvktaqlvfncfyhs.supabase.co"; 
const SUPABASE_KEY = "sb_publishable_KCwZY0jEeqoHIwrRP6-z3g_iGK0v2C2"; 
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const formFinanceiro = document.getElementById('formFinanceiro');
const listaTransacoes = document.getElementById('listaTransacoes');
const filtroTipo = document.getElementById('filtroTipo');

let transacoes = [];

async function renderizarTransacoes() {
    if (!listaTransacoes) return;
    
    try {
        const { data, error } = await supabaseClient
            .from('financeiro')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        transacoes = data || [];

        listaTransacoes.innerHTML = '';
        const filtroAtual = filtroTipo ? filtroTipo.value : 'todos';
        
        transacoes.forEach((t) => {
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
                    <button style="background: none; border: none; color: #f43f5e; cursor: pointer; font-size: 1rem;" onclick="deletarTransacao(${t.id})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            `;
            listaTransacoes.appendChild(tr);
        });
    } catch (error) {
        console.error(error.message);
    }
}

if (filtroTipo) {
    filtroTipo.addEventListener('change', renderizarTransacoes);
}

if (formFinanceiro) {
    formFinanceiro.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const descTransacao = document.getElementById('descTransacao').value;
        const valorTransacao = document.getElementById('valorTransacao').value;
        const tipoTransacao = document.getElementById('tipoTransacao').value;

        const novaTransacao = {
            descricao: descTransacao,
            valor: parseFloat(valorTransacao) || 0, 
            tipo: tipoTransacao || ""
        };
        
        try {
            const { error } = await supabaseClient
                .from('financeiro')
                .insert([novaTransacao]);

            if (error) throw error;
            
            formFinanceiro.reset();
            if (filtroTipo) filtroTipo.value = 'todos';
            await renderizarTransacoes();
        } catch (error) {
            console.error(error.message);
        }
    });
}

window.deletarTransacao = async function(id) {
    if (!confirm("Tem certeza que deseja excluir esta transação?")) return;

    try {
        const { error } = await supabaseClient
            .from('financeiro')
            .delete()
            .eq('id', id);

        if (error) throw error;
        await renderizarTransacoes();
    } catch (error) {
        console.error(error.message);
    }
};

renderizarTransacoes();