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

  // Verificar se algum serviço está selecionado
  const algumSelecionado = Array.from(checkboxes).some(cb => cb.checked);
  if (!algumSelecionado) {
    calendarioSection.style.display = 'none';
    return;
  } else {
    calendarioSection.style.display = 'block';
  }

  calendarioContainer.innerHTML = ''; // Limpar o conteúdo do calendário ao criar novamente

  // Definindo o primeiro dia do mês
  const primeiroDiaDoMes = new Date(ano, mes, 1);
  const ultimoDiaDoMes = new Date(ano, mes + 1, 0);
  const diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Adicionando a frase "Escolha o dia" centralizada
  const fraseEscolha = document.createElement('div');
  fraseEscolha.classList.add('frase-escolha');
  fraseEscolha.textContent = "Escolha o dia";
  calendarioContainer.appendChild(fraseEscolha);

  // Adicionando o título do mês
  const tituloMes = document.createElement('div');
  tituloMes.classList.add('titulo-mes');
  tituloMes.textContent = `${primeiroDiaDoMes.toLocaleString('default', { month: 'long' })} ${ano}`;
  calendarioContainer.appendChild(tituloMes);

  // Botões para navegar entre os meses
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

  // Exibir os dias da semana
  const semanaContainer = document.createElement('div');
  semanaContainer.classList.add('semana');
  diasDaSemana.forEach(dia => {
    const diaSemana = document.createElement('div');
    diaSemana.classList.add('dia-semana');
    diaSemana.textContent = dia;
    semanaContainer.appendChild(diaSemana);
  });
  calendarioContainer.appendChild(semanaContainer);

  // Criando a grade dos dias
  let contagemDeDias = 0;
  let semanaAtual = document.createElement('div');
  semanaAtual.classList.add('semana');
  calendarioContainer.appendChild(semanaAtual);

  // Preenche com espaços vazios antes do primeiro dia do mês
  for (let i = 0; i < primeiroDiaDoMes.getDay(); i++) {
    const vazio = document.createElement('div');
    vazio.classList.add('dia-vazio');
    semanaAtual.appendChild(vazio);
    contagemDeDias++;
  }

  // Criando os botões de dia
  for (let i = 1; i <= ultimoDiaDoMes.getDate(); i++) {
    const button = document.createElement('button');
    button.classList.add('dia');
    button.textContent = i;
    button.onclick = () => {
      alert(`Dia selecionado: ${i}`);
    };
    semanaAtual.appendChild(button);
    contagemDeDias++;

    // Quando a linha estiver cheia, vai para a próxima linha
    if (contagemDeDias % 7 === 0) {
      semanaAtual = document.createElement('div');
      semanaAtual.classList.add('semana');
      calendarioContainer.appendChild(semanaAtual);
    }
  }
}

// Inicia o calendário com o mês atual, mas só se houver serviço selecionado
const hoje = new Date();
criarCalendario(hoje.getMonth(), hoje.getFullYear());

// Verificação dinâmica ao marcar/desmarcar serviços
document.querySelectorAll('input[name="servico"]').forEach(cb => {
  cb.addEventListener('change', () => {
    criarCalendario(hoje.getMonth(), hoje.getFullYear());
  });
});
