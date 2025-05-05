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
        servicos.style.display = 'block'; // Exibe a tabela de serviços
        servicos.classList.add('visivel');
        
        // Rolagem automática até a seção de serviços
        servicos.scrollIntoView({ behavior: 'smooth' });
      }
      // Exibe o calendário
      if (calendarioContainer) {
        calendarioContainer.style.display = 'block'; // Torna o calendário visível
        // Garante que o calendário seja recriado ao selecionar o serviço
        criarCalendario(new Date().getMonth(), new Date().getFullYear());
      }
    } else {
      barbeiro.classList.remove('selecionado');
      if (servicos) {
        servicos.style.display = 'none'; // Esconde a tabela de serviços
        servicos.classList.remove('visivel');
      }
      // Esconde o calendário
      if (calendarioContainer) {
        calendarioContainer.style.display = 'none'; // Esconde o calendário
      }
    }
  });
});

function criarCalendario(mes, ano) {
  const calendarioContainer = document.getElementById('calendario-container');
  const calendarioSection = document.getElementById('calendario');
  const checkboxes = document.querySelectorAll('input[name="servico"]');

  // Verifica se algum serviço está selecionado
  const algumSelecionado = Array.from(checkboxes).some(cb => cb.checked);
  if (!algumSelecionado) {
    calendarioSection.style.display = 'none';
    return;
  } else {
    calendarioSection.style.display = 'block';
  }

  calendarioContainer.innerHTML = ''; // Limpa o calendário atual

  const primeiroDiaDoMes = new Date(ano, mes, 1);
  const ultimoDiaDoMes = new Date(ano, mes + 1, 0);
  const diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Título do mês
  const tituloMes = document.createElement('div');
  tituloMes.classList.add('titulo-mes');
  tituloMes.textContent = `${primeiroDiaDoMes.toLocaleString('default', { month: 'long' })} ${ano}`;
  calendarioContainer.appendChild(tituloMes);

  // Navegação entre meses
  const navegacaoMes = document.createElement('div');
  navegacaoMes.classList.add('navegacao-mes');

  const botaoMesAnterior = document.createElement('button');
  botaoMesAnterior.textContent = 'Anterior';
  botaoMesAnterior.onclick = () => criarCalendario(mes - 1, ano);

  const botaoMesProximo = document.createElement('button');
  botaoMesProximo.textContent = 'Próximo';
  botaoMesProximo.onclick = () => criarCalendario(mes + 1, ano);

  navegacaoMes.appendChild(botaoMesAnterior);
  navegacaoMes.appendChild(botaoMesProximo);
  calendarioContainer.appendChild(navegacaoMes);

  // Dias da semana
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

  // Espaços vazios antes do 1º dia do mês
  for (let i = 0; i < primeiroDiaDoMes.getDay(); i++) {
    const vazio = document.createElement('div');
    vazio.classList.add('dia-vazio');
    semanaAtual.appendChild(vazio);
  }

  // Dias do mês
  for (let dia = 1; dia <= ultimoDiaDoMes.getDate(); dia++) {
    const botaoDia = document.createElement('button');
    botaoDia.classList.add('dia');
    botaoDia.textContent = dia;
    botaoDia.onclick = () => alert(`Dia selecionado: ${dia}`);

    semanaAtual.appendChild(botaoDia);

    // Se completou a semana, adiciona ao DOM e reinicia
    if (semanaAtual.children.length === 7) {
      calendarioContainer.appendChild(semanaAtual);
      semanaAtual = document.createElement('div');
      semanaAtual.classList.add('semana');
    }
  }

  // Adiciona a última semana se estiver incompleta
  if (semanaAtual.children.length > 0) {
    calendarioContainer.appendChild(semanaAtual);
  }
}

// Início automático
const hoje = new Date();
criarCalendario(hoje.getMonth(), hoje.getFullYear());

// Atualiza o calendário quando marcar/desmarcar serviços
document.querySelectorAll('input[name="servico"]').forEach(cb => {
  cb.addEventListener('change', () => {
    criarCalendario(hoje.getMonth(), hoje.getFullYear());
  });
});
