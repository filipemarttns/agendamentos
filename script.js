const nomeInput = document.getElementById('nome');
const botao = document.getElementById('entrar');
const telaInicial = document.getElementById('tela-inicial');
const telaProxima = document.getElementById('tela-proxima');
const tituloBemVindo = document.getElementById('titulo-bem-vindo');


let isDragging = false;
let startY = 0;
let dragAmount = 0;
let scrollTop = 0;

// Impede rolagem inicialmente
document.body.style.overflow = 'hidden';

nomeInput.addEventListener('input', () => {
  if (nomeInput.value.trim() !== "") {
    botao.classList.add('mostrar');
  } else {
    botao.classList.remove('mostrar');
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
    
    // Libera a rolagem depois que a tela de boas-vindas aparecer
    document.body.style.overflow = 'auto'; 
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

// Função para detectar o arraste
telaProxima.addEventListener('mousedown', (e) => {
  isDragging = true;
  startY = e.clientY;
  scrollTop = window.scrollY;
  tesouraEsquerda.classList.add('mostrar');
  tesouraDireita.classList.add('mostrar');
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const delta = e.clientY - startY;
  window.scrollTo(0, scrollTop - delta); // simula o arraste vertical
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  // Se o movimento de arraste for grande o suficiente, mostramos os ícones de tesoura
  if (dragAmount > 100) {
    tesouraEsquerda.classList.add('ativo');
    tesouraDireita.classList.add('ativo');
  } else {
    telaProxima.style.transform = 'translateY(0)';
  }
});

// Esconder as tesouras quando a tela for resetada
tesouraEsquerda.classList.remove('ativo');
tesouraDireita.classList.remove('ativo');
