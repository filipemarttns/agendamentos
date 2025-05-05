const nomeInput = document.getElementById('nome');
const botao = document.getElementById('entrar');
const telaInicial = document.getElementById('tela-inicial');
const telaProxima = document.getElementById('tela-proxima');
const tituloBemVindo = document.getElementById('titulo-bem-vindo');

nomeInput.addEventListener('input', () => {
  if (nomeInput.value.trim() !== "") {
    botao.style.display = 'inline-block';
  } else {
    botao.style.display = 'none';
  }
});

botao.addEventListener('click', () => {
  const nome = nomeInput.value.trim();
  tituloBemVindo.textContent = `Bem-vindo, ${nome}!`;

  telaInicial.style.opacity = '0';
  telaInicial.style.filter = 'blur(10px)';
  setTimeout(() => {
    telaInicial.style.display = 'none';
    telaProxima.classList.add('active');
  }, 1000);
});

// Alternância das frases
const frases = document.querySelectorAll('.frase');
let fraseIndex = 0;

setInterval(() => {
  frases[fraseIndex].classList.remove('ativo');
  fraseIndex = (fraseIndex + 1) % frases.length;
  frases[fraseIndex].classList.add('ativo');
}, 4000);
