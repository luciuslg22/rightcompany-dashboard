
const usuariosCadastrados = [
    {
        nome: "Lúcius Gomes",
        email: "lucius@rightcompany.com",
        senha: "022"
    },
    {
        nome: "Reserva",
        email: "reserva@rightcompany.com",
        senha: "055"
    },
    {
        nome: "Luiz Miguel",
        email: "gdzin@rightcompany.com",
        senha: "078"
    }
];


document.getElementById('formLogin').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const emailDigitado = document.getElementById('email').value.trim().toLowerCase();
    const senhaDigitada = document.getElementById('senha').value;
    const mensagemErro = document.getElementById('mensagemErro');


    const usuarioValido = usuariosCadastrados.find(user => 
        user.email === emailDigitado && user.senha === senhaDigitada
    );

    if (usuarioValido) {
        mensagemErro.classList.add('hidden');
        

        localStorage.setItem('usuarioLogado', usuarioValido.nome);
        

        window.location.href = "./home.html"; 
    } else {
        mensagemErro.classList.remove('hidden');
    }
});