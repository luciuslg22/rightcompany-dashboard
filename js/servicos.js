
const SUPABASE_URL = "https://fqzvdjvktaqlvfncfyhs.supabase.co"; 
const SUPABASE_KEY = "sb_publishable_KCwZY0jEeqoHIwrRP6-z3g_iGK0v2C2"; 
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const formServico = document.getElementById('formServico');
const listaServicos = document.getElementById('listaServicos');
const formTitle = document.getElementById('formTitle');
const btnSubmit = document.getElementById('btnSubmitForm');
const btnCancelar = document.getElementById('btnCancelarEdicao');
const inputEditandoIndex = document.getElementById('editandoIndex');


let servicos = [];

async function renderizarServicos() {
    try {
        const { data, error } = await supabaseClient
            .from('rightcompanydashboard')
            .select('*')
            .order('created_at', { ascending: false }); 

        if (error) throw error;
        servicos = data || [];

        listaServicos.innerHTML = '';
        
        servicos.forEach((servico) => {
            const tr = document.createElement('tr');
            const classeBadge = servico.status === 'Concluído' || servico.status === 'concluido' ? 'badge concluido' : 'badge andamento';
            
            tr.innerHTML = `
                <td style="color: #a78bfa; font-weight: bold; font-family: monospace;">${servico.os || ''}</td>
                <td style="color: #38bdf8; font-family: monospace;">${servico.cliente || ''}</td>
                <td style="color: #fff; font-weight: bold;">${servico.nome}</td>
                <td style="font-family: monospace;">R$ ${parseFloat(servico.preco || 0).toFixed(2)}</td>
                <td><span class="${classeBadge}">${servico.status.toUpperCase()}</span></td>
                <td style="text-align: center;">
                    <button class="btn-edit" style="background: none; border: none; color: #38bdf8; cursor: pointer; font-size: 1rem; margin-right: 10px;" onclick="prepararEdicao(${servico.id})">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn-delete" style="background: none; border: none; color: #f43f5e; cursor: pointer; font-size: 1rem;" onclick="deletarServico(${servico.id})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            `;
            listaServicos.appendChild(tr);
        });
    } catch (error) {
        console.error("Erro ao carregar serviços:", error.message);
    }
}

window.prepararEdicao = function(id) {
    const servico = servicos.find(s => s.id === id);
    if (!servico) return;
    
    formTitle.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> ALTERAR ORDEM`;
    btnSubmit.innerText = "SALVAR ALTERAÇÕES";
    inputEditandoIndex.value = id; 
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

formServico.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const idEdicao = inputEditandoIndex.value;
    const dadosServico = {
        os: document.getElementById('osCodigo').value,
        cliente: document.getElementById('osClienteId').value,
        nome: document.getElementById('nomeServico').value,
        preco: document.getElementById('precoServico').value,
        status: document.getElementById('statusServico').value
    };
    
    try {
        if (idEdicao !== "") {
            const { error } = await supabaseClient
                .from('rightcompanydashboard')
                .update(dadosServico)
                .eq('id', idEdicao);

            if (error) throw error;
        } else {
            const { error } = await supabaseClient
                .from('rightcompanydashboard')
                .insert([dadosServico]);

            if (error) throw error;
        }
        
        cancelarEdicao();
        await renderizarServicos(); 
    } catch (error) {
        alert("Erro ao salvar dados no Supabase.");
        console.error(error.message);
    }
});

window.deletarServico = async function(id) {
    if (!confirm("Tem certeza que deseja excluir este serviço?")) return;

    try {
        const { error } = await supabaseClient
            .from('rightcompanydashboard')
            .delete()
            .eq('id', id);

        if (error) throw error;

        if (inputEditandoIndex.value == id) {
            cancelarEdicao();
        }
        await renderizarServicos();
    } catch (error) {
        alert("Erro ao deletar o serviço do banco.");
        console.error(error.message);
    }
};

renderizarServicos();