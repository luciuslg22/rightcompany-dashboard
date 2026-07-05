const SUPABASE_URL = "https://fqzvdjvktaqlvfncfyhs.supabase.co"; 
const SUPABASE_KEY = "sb_publishable_KCwZY0jEeqoHIwrRP6-z3g_iGK0v2C2"; 
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const formProduto = document.getElementById('formProduto');
const listaProdutos = document.getElementById('listaProdutos');
const formTitle = document.getElementById('formTitle');
const btnSubmit = document.getElementById('btnSubmitForm');
const btnCancelar = document.getElementById('btnCancelarEdicao');
const inputEditandoIndex = document.getElementById('editandoIndex');

let produtos = [];

async function renderizarProdutos() {
    if (!listaProdutos) return;

    try {
        const { data, error } = await supabaseClient
            .from('produtos')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        produtos = data || [];

        listaProdutos.innerHTML = '';
        
        produtos.forEach((produto) => {
            const codigoTexto = produto.codigo || `PRD-${String(produto.id).padStart(4, '0')}`;
            const tr = document.createElement('tr');
            
            tr.innerHTML = `
                <td style="color: #a78bfa; font-weight: bold; font-family: monospace;">${codigoTexto}</td>
                <td style="color: #fff; font-weight: bold;">${produto.nome || ''}</td>
                <td>${produto.categoria || ''}</td>
                <td style="font-family: monospace;">R$ ${parseFloat(produto.preco || 0).toFixed(2)}</td>
                <td style="text-align: center;">
                    <button class="btn-edit" onclick="prepararEdicao(${produto.id})">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn-delete" onclick="deletarProduto(${produto.id})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            `;
            listaProdutos.appendChild(tr);
        });
    } catch (error) {
        console.error(error.message);
    }
}

window.prepararEdicao = function(id) {
    const prod = produtos.find(p => p.id === id);
    if (!prod) return;
    
    formTitle.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> MODIFICAR PRODUTO`;
    btnSubmit.innerText = "SALVAR ALTERAÇÕES";
    inputEditandoIndex.value = id; 
    if (btnCancelar) btnCancelar.classList.remove('hidden');

    document.getElementById('prodCodigo').value = prod.codigo || '';
    document.getElementById('prodNome').value = prod.nome || '';
    document.getElementById('prodCategoria').value = prod.categoria || '';
    document.getElementById('prodPreco').value = prod.preco || '';
}

window.cancelarEdicao = function() {
    formTitle.innerHTML = `<i class="fa-solid fa-plus"></i> REGISTRAR PRODUTO`;
    btnSubmit.innerText = "CADASTRAR PRODUTO";
    inputEditandoIndex.value = "";
    if (btnCancelar) btnCancelar.classList.add('hidden');
    formProduto.reset();
}

if (btnCancelar) {
    btnCancelar.addEventListener('click', cancelarEdicao);
}

if (formProduto) {
    formProduto.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const idEdicao = inputEditandoIndex.value;
        const dadosProduto = {
            codigo: document.getElementById('prodCodigo').value,
            nome: document.getElementById('prodNome').value,
            categoria: document.getElementById('prodCategoria').value,
            preco: document.getElementById('prodPreco').value
        };
        
        try {
            if (idEdicao !== "") {
                const { error } = await supabaseClient
                    .from('produtos')
                    .update(dadosProduto)
                    .eq('id', idEdicao);

                if (error) throw error;
            } else {
                const codigoExiste = produtos.some(p => String(p.codigo).toLowerCase() === String(dadosProduto.codigo).toLowerCase());
                if (codigoExiste) {
                    alert("Aviso: Esse código de produto já está registrado.");
                    return;
                }

                const { error } = await supabaseClient
                    .from('produtos')
                    .insert([dadosProduto]);

                if (error) throw error;
            }
            
            cancelarEdicao();
            await renderizarProdutos();
        } catch (error) {
            console.error(error.message);
        }
    });
}

window.deletarProduto = async function(id) {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
        const { error } = await supabaseClient
            .from('produtos')
            .delete()
            .eq('id', id);

        if (error) throw error;

        if (inputEditandoIndex.value == id) {
            cancelarEdicao();
        }
        await renderizarProdutos();
    } catch (error) {
        console.error(error.message);
    }
};

renderizarProdutos();