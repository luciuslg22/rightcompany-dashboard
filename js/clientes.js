const SUPABASE_URL = "https://fqzvdjvktaqlvfncfyhs.supabase.co"; 
const SUPABASE_KEY = "sb_publishable_KCwZY0jEeqoHIwrRP6-z3g_iGK0v2C2"; 
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const modal = document.getElementById('modalCliente');
const btnAbrir = document.getElementById('btnAbrirModal');
const btnFechar = document.getElementById('btnFecharModal');
const form = document.getElementById('formNovoCliente');
const inputBusca = document.getElementById('buscaId');

const modalTitle = document.getElementById('modalTitle');
const inputEditandoIndex = document.getElementById('editandoIndex');

let baseClientes = [];

if (btnAbrir) {
    btnAbrir.addEventListener('click', () => {
        modalTitle.innerText = "// REGISTRAR NOVO CLIENTE";
        inputEditandoIndex.value = ""; 
        form.reset();
        modal.classList.remove('hidden');
    });
}

if (btnFechar) {
    btnFechar.addEventListener('click', () => modal.classList.add('hidden'));
}

async function renderizarClientes(filtro = "") {
    const tabelaBody = document.getElementById('listaClientes');
    if (!tabelaBody) return;

    try {
        const { data, error } = await supabaseClient
            .from('clientes')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        baseClientes = data || [];

        tabelaBody.innerHTML = "";

        baseClientes.forEach((cliente) => {
            const codigoTexto = `CLI-${String(cliente.id).padStart(4, '0')}`;
            
            if (filtro && !codigoTexto.toLowerCase().includes(filtro.toLowerCase()) && !cliente.nome.toLowerCase().includes(filtro.toLowerCase())) {
                return;
            }

            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td style="color: #a78bfa; font-weight: bold;">${codigoTexto}</td>
                <td style="color: #fff; font-weight: bold;"><i class="fa-solid fa-user-astronaut" style="margin-right: 8px; color: rgba(167, 139, 250, 0.6)"></i>${cliente.nome || ''}</td>
                <td>${cliente.empresa || ''}</td>
                <td style="color: #cbd5e1; font-family: monospace;">${cliente.contato || ''}</td>
                <td><span class="stars-badge">${starsHTML(cliente.avaliacao)}</span></td>
                <td style="text-align: center;">
                    <button class="btn-edit" onclick="prepararEdicao(${cliente.id})">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn-delete" onclick="removerCliente(${cliente.id})">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            `;
            tabelaBody.appendChild(linha);
        });
    } catch (error) {
        console.error(error.message);
    }
}

function starsHTML(nota) {
    if (nota === 'andamento') {
        return "⏳   Em Andamento";
    }
    return "⭐".repeat(parseInt(nota || 5));
}

if (inputBusca) {
    inputBusca.addEventListener('input', function() {
        renderizarClientes(this.value);
    });
}

window.removerCliente = async function(id) {
    if (!confirm("Tem certeza que deseja remover este cliente?")) return;

    try {
        const { error } = await supabaseClient
            .from('clientes')
            .delete()
            .eq('id', id);

        if (error) throw error;
        await renderizarClientes(inputBusca ? inputBusca.value : "");
    } catch (error) {
        console.error(error.message);
    }
}

window.prepararEdicao = function(id) {
    const cliente = baseClientes.find(c => c.id === id);
    if (!cliente) return;
    
    modalTitle.innerText = "// EDITAR_DADOS_CLIENTE";
    inputEditandoIndex.value = id; 

    document.getElementById('cliNome').value = cliente.nome || '';
    document.getElementById('cliEmpresa').value = cliente.empresa || '';
    document.getElementById('cliContato').value = cliente.contato || '';
    document.getElementById('cliAvaliacao').value = cliente.avaliacao || '5';

    modal.classList.remove('hidden');
}

if (form) {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const nome = document.getElementById('cliNome').value;
        const empresa = document.getElementById('cliEmpresa').value;
        const contato = document.getElementById('cliContato').value;
        const avaliacao = document.getElementById('cliAvaliacao').value;
        const idEdicao = inputEditandoIndex.value;

        const dadosCliente = { nome, empresa, contato, avaliacao };

        try {
            if (idEdicao !== "") {
                const { error } = await supabaseClient
                    .from('clientes')
                    .update(dadosCliente)
                    .eq('id', idEdicao);

                if (error) throw error;
            } else {
                const { error } = await supabaseClient
                    .from('clientes')
                    .insert([dadosCliente]);

                if (error) throw error;
            }

            form.reset();
            modal.classList.add('hidden');
            await renderizarClientes(inputBusca ? inputBusca.value : "");
        } catch (error) {
            console.error(error.message);
        }
    });
}

renderizarClientes();