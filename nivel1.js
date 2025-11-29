// --- liga os botões só depois de o DOM estar pronto ---

  const btnRecomecar1 = document.getElementById('btn-recomecar1');
  const btnNivel2     = document.getElementById('btn-nivel2');

  btnRecomecar1.addEventListener('click', () => {
    btnRecomecar1.style.display = 'none';
    iniciarNivel1();
  });

  btnNivel2.addEventListener('click', () => {
    btnNivel2.style.display = 'none';
    iniciarNivel2();  // assume que iniciarNivel2 está definido noutro ficheiro
  });


// --- 1) Variáveis e Constantes ---
const botBaseY      = 260;
let forrestY        = botBaseY;
let botY            = botBaseY;
let acertos         = 0;
let nivel1Ativo     = false;

const gravidade     = 0.2;
const amortecimento = 0.8;
const alturaMesa    = 420;
const alturaSalto   = -8;

const MIN_Y = 230;   // não sobem acima disto
const MAX_Y = 536;   // não descem abaixo disto

const pongSom     = new Audio('Sons/pong.mp3');
const erroSom     = new Audio('Sons/erro.mp3');
const aplausosSom = new Audio('Sons/aplausos.mp3');
const somBooNivel1      = new Audio('Sons/booo.mp3');

// imagens de vitória e derrota
const vencedorImg  = new Image(); vencedorImg.src  = 'Imagens/vencedor1.png';
const perdedorImg  = new Image(); perdedorImg.src  = 'Imagens/perdedor1.png';

// sprite do Forrest na vitória
const forrestVencedorImg = new Image();
forrestVencedorImg.src = 'Imagens/forrestvencedor.png';

let exibirVencedor = false;
let exibirPerdedor = false;

// bola
let bola = { x: 700, y: botY - 30, vx: -5, vy: 0 };

// --- 2) Iniciar Nível 1 ---
function iniciarNivel1() {
  estadoAtual      = 'nivel1';
  nivel1Ativo      = true;
  forrestY         = botBaseY;
  botY             = botBaseY;
  acertos          = 0;
  bola             = { x: 700, y: botY - 30, vx: -5, vy: 0 };
  exibirVencedor   = false;
  exibirPerdedor   = false;
  document.getElementById('btn-recomecar1').style.display = 'none';
  document.getElementById('btn-nivel2')   .style.display = 'none';
  // dá um impulso inicial
  setTimeout(() => bola.vy = -6, 200);
}

// --- 3) Desenhar Nível 1 ---
function desenharNivel1() {
  // 3.1 vitória
  if (exibirVencedor && vencedorImg.complete) {
    ctx.drawImage(vencedorImg, 0, 0, 800, 600);
    return;
  }
  // 3.2 derrota
  if (exibirPerdedor && perdedorImg.complete) {
    ctx.drawImage(perdedorImg, 0, 0, 800, 600);
    return;
  }

  // 3.3 fallback de fundo
  if (fundoPingPong && fundoPingPong.complete) {
    ctx.drawImage(fundoPingPong, 0, 0, 800, 600);
  } else {
    ctx.fillStyle = 'darkgreen';
    ctx.fillRect(0, 0, 800, 600);
  }

  // 3.4 Forrest e Bot
  if (jogadorImg.complete) ctx.drawImage(jogadorImg, 20,  forrestY, 200, 200);
  if (botImg    .complete) ctx.drawImage(botImg,     600, botY,     200, 200);

  // 3.5 bola
  ctx.beginPath();
  ctx.arc(bola.x, bola.y, 10, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();

  // 3.6 pontuação
  ctx.fillStyle = 'white';
  ctx.font      = '20px Arial';
  ctx.fillText(`Pontuação: ${acertos}`, 70, 30);
}

// --- 4) Atualizar Lógica e Física ---
function atualizarNivel1() {
  if (!nivel1Ativo) return;

  // 4.1 movimento
  bola.x += bola.vx;
  bola.vy += gravidade;
  bola.y += bola.vy;

  // 4.2 colisões
  if (bola.y + 10 >= alturaMesa) {
    bola.y  = alturaMesa - 10;
    bola.vy = alturaSalto;
  }
  if (bola.y - 10 <= 0) {
    bola.y  = 10;
    bola.vy = Math.abs(alturaSalto);
  }
  if (bola.y + 10 > 500) {
    bola.y  = 500 - 10;
    bola.vy *= -amortecimento;
  }
  if (bola.y - 10 < 0) {
    bola.y  = 10;
    bola.vy *= -amortecimento;
  }

  // 4.3 IA do Bot
  if (bola.x > 400) {
    botY += bola.y < botY + 32 ? -2 : +2;
  } else {
    botY += botY < botBaseY ? +2 : -2;
  }

  // 4.4 colisões Forrest/Bot
  if (bola.x <= 120 && bola.y >= forrestY && bola.y <= forrestY + 150) {
    bola.vx *= -1;
    bola.vy = Math.random() * 4 - 9;
    acertos++;
    if (somAtivo) pongSom.play();
  }
  if (bola.x + 10 >= 700 && bola.y >= botY && bola.y <= botY + 128) {
    bola.vx *= -1;
    bola.vy = Math.random() * 4 - 9;
    acertos++;
    if (somAtivo) pongSom.play();
  }

  // vitória
  if (acertos >= 15) {
    nivel1Ativo    = false;
    exibirVencedor = true;
    if (somAtivo) aplausosSom.play();
    setTimeout(() => {
      document.getElementById('btn-nivel2').style.display = 'block';
    }, 500);
  }

  // derrota
  if (bola.x < 0 || bola.x > 800) {
    nivel1Ativo    = false;
    exibirPerdedor = true;
    somBooNivel1.currentTime = 0;
    somBooNivel1.play().catch(() => {});
    if (somAtivo) erroSom.play();
    flashEcrã('red');
    setTimeout(() => {
      document.getElementById('btn-recomecar1').style.display = 'block';
    }, 500);
  }
}

// --- 6) Flash de cor de transição ---
function flashEcrã(cor) {
  ctx.fillStyle   = cor;
  ctx.globalAlpha = 0.3;
  ctx.fillRect(0, 0, 800, 600);
  ctx.globalAlpha = 1.0;
}

// --- 7) Teclado Forrest ---
window.addEventListener('keydown', e => {
  if (estadoAtual === 'nivel1' && nivel1Ativo) {
    if (e.key === 'ArrowUp')   forrestY = Math.max(MIN_Y, forrestY - 20);
    if (e.key === 'ArrowDown') forrestY = Math.min(MAX_Y, forrestY + 20);
  }
});
