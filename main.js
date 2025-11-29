// --- 1) Canvas e Contexto ---
const canvas = document.getElementById('gameCanvas');
canvas.width  = 800;
canvas.height = 600;
const ctx = canvas.getContext('2d');

// --- 2) Imagens Globais (USADAS POR VÁRIOS NÍVEIS) ---
const fundoPingPong = new Image(); fundoPingPong.src = 'Imagens/pingpong.png';
const jogadorImg    = new Image(); jogadorImg.src    = 'Imagens/forrestmilitar1.png';
const botImg        = new Image(); botImg.src        = 'Imagens/forrestmilitar2.png';

// --- 3) Estado e Áudio ---
let estadoAtual   = 'menu';
let estadoAnterior = 'menu';
let somAtivo      = true;
let musicaAtiva   = true;
let musicaIniciada = false;
const musicaFundo = new Audio('Sons/música.mp3');
musicaFundo.loop  = true;

function arrancarMusicaNoPrimeiroToque() {
  if (!musicaIniciada && musicaAtiva) {
    musicaFundo.play().catch(()=>{});
    musicaIniciada = true;
  }
}
['click','keydown','touchstart'].forEach(evt => {
  document.addEventListener(evt, arrancarMusicaNoPrimeiroToque, { once: true });
});

function iniciarMusica() {
  if (musicaAtiva && !musicaIniciada) {
    musicaFundo.play().catch(_=>{});
    musicaIniciada = true;
  }
}

// --- 4) Botões do menu ---
const botaoJogar    = { x: 290, y: 330, largura: 100, altura: 40, texto: 'JOGAR' };
const botaoHistoria = { x: 410, y: 330, largura: 100, altura: 40, texto: 'HISTÓRIA' };
const botaoCreditos = { x: 290, y: 390, largura: 100, altura: 40, texto: 'CRÉDITOS' };
const botaoAjuda    = { x: 410, y: 390, largura: 100, altura: 40, texto: 'AJUDA' };
const botaoConfig   = { x: 720, y: 20,  largura: 60,  altura: 30, texto: '⚙' };

// --- 5) Configurações ---
const configOptions = [
  { texto: 'Música: ',         key: 'musica' },
  { texto: 'Efeitos Sonoros: ', key: 'som'    },
];
let configSelecionado = 0;

// --- 6) Carregar Imagem do Menu Inicial ---
const imgMenu = new Image(); imgMenu.src = 'Imagens/menuinicial.png';

// --- 7) Loop Principal ---
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (estadoAtual === 'menu') {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (imgMenu.complete) ctx.drawImage(imgMenu, 0, 0, canvas.width, canvas.height);
    desenharBotao(botaoJogar);
    desenharBotao(botaoHistoria);
    desenharBotao(botaoCreditos);
    desenharBotao(botaoAjuda);
  }
  else if (estadoAtual === 'historia') {
    desenharEcrãHistoria();
  }
  else if (estadoAtual === 'creditos') {
    desenharEcrãCreditos();
  }
  else if (estadoAtual === 'ajuda') {
    desenharEcrãAjuda();
}
else if (estadoAtual === 'config') {
  desenharConfiguracoes();
}
else if (estadoAtual === 'nivel1') {
  if (typeof atualizarNivel1 === 'function') atualizarNivel1();
  if (typeof desenharNivel1 === 'function') desenharNivel1();
}
  else if (estadoAtual === 'nivel2') {
  atualizarNivel2();
  desenharNivel2();
}

  else if (estadoAtual === 'nivel3') {
    if (typeof atualizarNivel3 === 'function') atualizarNivel3();
    if (typeof desenharNivel3 === 'function') desenharNivel3();
  }
else if (estadoAtual === 'menufinal') {
    if (menuFinalImg.complete) {
      ctx.drawImage(menuFinalImg, 0, 0, canvas.width, canvas.height);
    }
    // mostra os dois botões
    document.getElementById('btn-play-again')    .style.display = 'block';
    document.getElementById('btn-creditos-final').style.display = 'block';
  }

  desenharBotao(botaoConfig);
  requestAnimationFrame(loop);
}
// “Jogar Novamente” → volta ao menu e esconde todos os botões de final
document.getElementById('btn-play-again')
  .addEventListener('click', () => {
    estadoAtual = 'menu';
    ['btn-play-again','btn-creditos-final','btn-gameover']
      .forEach(id=> document.getElementById(id).style.display='none');
});

// “Créditos” → abre o vídeo
document.getElementById('btn-creditos-final')
  .addEventListener('click', () => {
    // redireciona diretamente para o ficheiro .mp4:
    window.location.href = 'Videos/creditos.mp4';
    
    // ou, se preferires, pop-up de <video> embutido:
    // const v = document.createElement('video');
    // v.src = 'Videos/creditos.mp4';
    // v.controls = true; v.autoplay = true;
    // document.getElementById('game-container').append(v);
});

// --- 8) Funções Auxiliares de Desenho ---
function desenharBotao(botao) {
  ctx.fillStyle = 'white';
  ctx.fillRect(botao.x, botao.y, botao.largura, botao.altura);
  ctx.strokeStyle = '#333';
  ctx.strokeRect(botao.x, botao.y, botao.largura, botao.altura);
  ctx.fillStyle = 'black';
  ctx.font = 'bold 20px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(botao.texto, botao.x + botao.largura/2, botao.y + botao.altura/2);
}

function desenharEcrãHistoria() {
  ctx.fillStyle = '#355c7d';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = 'bold 38px monospace';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.fillText('HISTÓRIA', canvas.width/2, 90);
  ctx.font = '20px Arial';
  ctx.fillText('Forrest Gump é um homem simples que vive grandes aventuras sem querer. ', canvas.width/2, 180);
  ctx.fillText('Ele serve no exército, onde aprende tudo sobre camarões com o seu amigo Bubba', canvas.width/2, 210);
  ctx.fillText('e mais tarde fica rico com o negócio de camarões.', canvas.width/2, 240);
  ctx.fillText('Mais tarde, corre pelos Estados Unidos durante anos, tornando-se famoso sem perceber.', canvas.width/2, 270);
  desenharBotao({ x: 30, y: 520, largura: 110, altura: 40, texto: '← VOLTAR' });
}

function desenharEcrãCreditos() {
  ctx.fillStyle = '#6c5b7b';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = 'bold 38px monospace';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.fillText('CRÉDITOS', canvas.width/2, 90);
  ctx.font = '20px Arial';
  ctx.fillText('Desenvolvimento de Aplicações Multimédia', canvas.width/2, 180);
  ctx.fillText('Realizado por: Beatriz Carvalho e Eva Barbeitos', canvas.width/2, 220);
  ctx.fillText('Orientado por: Ricardo Rodrigues', canvas.width/2, 260);
  desenharBotao({ x: 30, y: 520, largura: 110, altura: 40, texto: '← VOLTAR' });
}

function desenharEcrãAjuda() {
  ctx.fillStyle = '#355c7d';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = 'bold 38px monospace';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.fillText('TUTORIAL', canvas.width/2, 90);
  ctx.font = '20px Arial';
  ctx.fillText('No Nível 1, o jogador controla Forrest para rebater uma bola de ping-pong contra um', canvas.width/2, 180);
  ctx.fillText('adversário bot, alcançando 15 rebatidas antes que a bola ultrapasse os limites do ecrã.', canvas.width/2, 210);
  ctx.fillText('No Nível 2, assume o comando de um barco para pescar 15 camarões gerados', canvas.width/2, 240);
  ctx.fillText('aleatoriamente em 60 segundos, pressionando Espaço para cada recolha', canvas.width/2, 270);
  ctx.fillText('No Nível 3, conduz Forrest através de um cenário desértico, correndo', canvas.width/2, 300);
  ctx.fillText('e saltando sobre obstáculos para atingir a meta situada em X = 6100', canvas.width/2, 330);
  ctx.fillText('antes que o cronômetro regressivo de 30 segundos se esgote.', canvas.width/2, 360);
  ctx.fillText('← → para mover. Espaço para apanhar os camarões e para saltar.', canvas.width/2, 400);
  desenharBotao({ x: 30, y: 520, largura: 110, altura: 40, texto: '← VOLTAR' });
}

function desenharConfiguracoes() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  ctx.font = '26px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('Configurações', 300, 80);

  ctx.font = '20px Arial';
  configOptions.forEach((opt, idx) => {
    const ativo = (opt.key === 'musica' && musicaAtiva) || (opt.key === 'som' && somAtivo);
    ctx.fillStyle = idx === configSelecionado ? 'yellow' : 'white';
    ctx.fillText(`${opt.texto}${ativo ? 'Ligado' : 'Desligado'}`, 280, 150 + idx*40);
  });

  ctx.fillStyle = 'gray';
  ctx.font = '16px Arial';
  ctx.fillText('Pressiona Enter para alternar. Esc para voltar.', 240, 300);

  // círculo “Voltar”
  const cx=40, cy=40, r=20;
  ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI*2);
    ctx.fillStyle='white';
    ctx.fill();
  ctx.closePath();
  ctx.beginPath();
    ctx.moveTo(cx+5, cy-10);
    ctx.lineTo(cx-5, cy);
    ctx.lineTo(cx+5, cy+10);
    ctx.fillStyle='black';
    ctx.fill();
  ctx.closePath();
}

// --- 9) Eventos de Click e Teclado ---
canvas.addEventListener('click', e => {
  const { offsetX, offsetY } = e;

  // Menu principal
  if (estadoAtual === 'menu') {
    if (offsetX >= botaoJogar.x && offsetX <= botaoJogar.x + botaoJogar.largura &&
        offsetY >= botaoJogar.y && offsetY <= botaoJogar.y + botaoJogar.altura) {
      iniciarNivel1();
      iniciarMusica();
    }
    if (offsetX >= botaoHistoria.x && offsetX <= botaoHistoria.x + botaoHistoria.largura &&
        offsetY >= botaoHistoria.y && offsetY <= botaoHistoria.y + botaoHistoria.altura) {
      estadoAtual = 'historia';
    }
    if (offsetX >= botaoCreditos.x && offsetX <= botaoCreditos.x + botaoCreditos.largura &&
        offsetY >= botaoCreditos.y && offsetY <= botaoCreditos.y + botaoCreditos.altura) {
      estadoAtual = 'creditos';
    }
    if (offsetX >= botaoAjuda.x && offsetX <= botaoAjuda.x + botaoAjuda.largura &&
        offsetY >= botaoAjuda.y && offsetY <= botaoAjuda.y + botaoAjuda.altura) {
      estadoAtual = 'ajuda';
    }
  }

  // Botão voltar nos ecrãs extra
  if (['historia','creditos','ajuda'].includes(estadoAtual)) {
    if (offsetX >= 30 && offsetX <= 140 && offsetY >= 520 && offsetY <= 560) {
      estadoAtual = 'menu';
    }
  }

  // Botão de config (sempre visível)
 // Botão de config (sempre visível)
if (
  offsetX >= botaoConfig.x &&
  offsetX <= botaoConfig.x + botaoConfig.largura &&
  offsetY >= botaoConfig.y &&
  offsetY <= botaoConfig.y + botaoConfig.altura
) {
  estadoAnterior = estadoAtual;  // ← guarda aqui de onde vieste
  estadoAtual   = 'config';
}


 // Voltar do config (círculo)
if (estadoAtual === 'config') {
  const dx = offsetX - 40, dy = offsetY - 40;
  if (dx*dx + dy*dy <= 20*20) {
    estadoAtual = estadoAnterior;  // ← volta ao ecrã nível/jogo anterior
  }
}

});

// Tecla Enter no menu/configurações
window.addEventListener('keydown', e => {
  if (estadoAtual === 'menu' && e.key === 'Enter') {
    iniciarNivel1();
    iniciarMusica();
  }
  else if (estadoAtual === 'config') {
    if (e.key === 'ArrowUp')   configSelecionado = (configSelecionado-1+configOptions.length)%configOptions.length;
    if (e.key === 'ArrowDown') configSelecionado = (configSelecionado+1)%configOptions.length;
    if (e.key === 'Enter') {
      const opt = configOptions[configSelecionado];
      if (opt.key === 'musica') {
        musicaAtiva = !musicaAtiva;
        if (musicaAtiva) musicaFundo.play();
        else            musicaFundo.pause();
      } else {
        somAtivo = !somAtivo;
      }
    }
    if (e.key === 'Escape') estadoAtual = estadoAnterior;

  }
});

// --- 10) Arranca o Loop IMEDIATAMENTE ---
loop();