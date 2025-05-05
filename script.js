const nomeInput = document.getElementById('nome');
const botao = document.getElementById('entrar');
const telaInicial = document.getElementById('tela-inicial');
const telaProxima = document.getElementById('tela-proxima');
const tituloBemVindo = document.getElementById('titulo-bem-vindo');

let isDragging = false;
let startY = 0;
let dragAmount = 0;
let scrollTop = 0;

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
    document.body.style.overflow = 'auto'; 
  }, 300);
});

const frases = document.querySelectorAll('.frase');
let fraseIndex = 0;

setInterval(() => {
  frases[fraseIndex].classList.remove('ativo');
  fraseIndex = (fraseIndex + 1) % frases.length;
  frases[fraseIndex].classList.add('ativo');
}, 4000);

telaProxima.addEventListener('mousedown', (e) => {
  isDragging = true;
  startY = e.clientY;
  scrollTop = window.scrollY;
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const delta = e.clientY - startY;
  window.scrollTo(0, scrollTop - delta);
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  if (dragAmount > 100) {
    // lógica futura se necessário
  } else {
    telaProxima.style.transform = 'translateY(0)';
  }
});

// MOSTRAR SERVIÇOS AO CLICAR EM QUALQUER BARBEIRO
document.querySelectorAll('.barbeiro').forEach(barbeiro => {
  barbeiro.addEventListener('click', () => {
    const servicos = document.getElementById('servicos');
    if (servicos) {
      servicos.style.display = 'block';
    }
  });
});
