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

document.querySelectorAll('.barbeiro').forEach(barbeiro => {
  barbeiro.addEventListener('click', () => {
    const servicos = document.getElementById('servicos');
    const calendarioContainer = document.getElementById('calendario-container');
    const isSelecionado = barbeiro.classList.contains('selecionado');
    const todosBarbeiros = document.querySelectorAll('.barbeiro');

    todosBarbeiros.forEach(b => {
      b.classList.remove('selecionado', 'desfocado');
    });

    if (!isSelecionado) {
      barbeiro.classList.add('selecionado');
      todosBarbeiros.forEach(b => {
        if (b !== barbeiro) b.classList.add('desfocado');
      });
      if (servicos) {
        servicos.style.display = 'block';
        servicos.classList.add('visivel');
        servicos.scrollIntoView({ behavior: 'smooth' });
      }
      if (calendarioContainer) {
        calendarioContainer.style.display = 'block';
        criarCalendario(mesAtual, anoAtual);
      }
    } else {
      barbeiro.classList.remove('selecionado');
      if (servicos) {
        servicos.style.display = 'none';
        servicos.classList.remove('visivel');
      }
      if (calendarioContainer) {
        calendarioContainer.style.display = 'none';
      }
    }
  });
});

let mesAtual = new Date().getMonth();
let anoAtual = new Date().getFullYear();

function criarCalendario(mes, ano) {
  const calendarioContainer = document.getElementById('calendario-container');
  const calendarioSection = document.getElementById('calendario');
  const checkboxes = document.querySelectorAll('input[name="servico"]');

  const algumSelecionado = Array.from(checkboxes).some(cb => cb.checked);
  if (!algumSelecionado) {
    calendarioSection.style.display = 'none';
    return;
  } else {
    calendarioSection.style.display = 'block';
  }

  calendarioContainer.innerHTML = '';

  const primeiroDiaDoMes = new Date(ano, mes, 1);
  const ultimoDiaDoMes = new Date(ano, mes + 1, 0);
  const diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Título do mês com navegação futura
  const tituloWrapper = document.createElement('div');
  tituloWrapper.classList.add('titulo-mes-navegacao');

  const tituloMes = document.createElement('div');
  tituloMes.classList.add('titulo-mes');
  tituloMes.textContent = `${primeiroDiaDoMes.toLocaleString('default', { month: 'long' })} ${ano}`;
  tituloWrapper.appendChild(tituloMes);

  // Botão para mês seguinte
  const botaoProximo = document.createElement('button');
  botaoProximo.classList.add('seta-mes');
  botaoProximo.innerHTML = '→';
  botaoProximo.onclick = () => {
    const hoje = new Date();
    const novoMes = mes + 1;
    const novaData = new Date(ano, novoMes, 1);
    if (novaData >= new Date(hoje.getFullYear(), hoje.getMonth(), 1)) {
      mesAtual = novoMes;
      anoAtual = novaData.getFullYear();
      criarCalendario(mesAtual, anoAtual);
    }
  };
  tituloWrapper.appendChild(botaoProximo);
  calendarioContainer.appendChild(tituloWrapper);

  // Cabeçalho dos dias da semana
  const semanaHeader = document.createElement('div');
  semanaHeader.classList.add('semana');
  diasDaSemana.forEach(dia => {
    const diaSemana = document.createElement('div');
    diaSemana.classList.add('dia-semana');
    diaSemana.textContent = dia;
    semanaHeader.appendChild(diaSemana);
  });
  calendarioContainer.appendChild(semanaHeader);

  // Corpo do calendário
  let semanaAtual = document.createElement('div');
  semanaAtual.classList.add('semana');

  for (let i = 0; i < primeiroDiaDoMes.getDay(); i++) {
    const vazio = document.createElement('div');
    vazio.classList.add('dia-vazio');
    semanaAtual.appendChild(vazio);
  }

  for (let dia = 1; dia <= ultimoDiaDoMes.getDate(); dia++) {
    const botaoDia = document.createElement('button');
    botaoDia.classList.add('dia');
    botaoDia.textContent = dia;
    botaoDia.onclick = () => alert(`Dia selecionado: ${dia}`);

    semanaAtual.appendChild(botaoDia);

    if (semanaAtual.children.length === 7) {
      calendarioContainer.appendChild(semanaAtual);
      semanaAtual = document.createElement('div');
      semanaAtual.classList.add('semana');
    }
  }

  if (semanaAtual.children.length > 0) {
    calendarioContainer.appendChild(semanaAtual);
  }
}

const hoje = new Date();
criarCalendario(mesAtual, anoAtual);

document.querySelectorAll('input[name="servico"]').forEach(cb => {
  cb.addEventListener('change', () => {
    criarCalendario(mesAtual, anoAtual);
  });
});
