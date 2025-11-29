window.alert = function() {};
// Sprites do jogo
const forrestImg = new Image();
forrestImg.src = 'Imagens/forrest_barba_frame2.png';

const fundoImg = new Image();
fundoImg.src = 'Imagens/deserto.jpg';

// --- Imagens de vitória/derrota ---
const vencedor3Img = new Image();
vencedor3Img.src = 'Imagens/vencedor3.png';

const perdedor3Img = new Image();
perdedor3Img.src = 'Imagens/perdedor3.png';

// --- Imagem do menu final ---
const menuFinalImg = new Image();
menuFinalImg.src = 'Imagens/menufinal.png';
const somBooNivel3 = new Audio('Sons/booo.mp3');


// --- Flags de controle devem começar em false ---
let exibirvencedor3 = false;
let exibirperdedor3 = false;


// --- Som do salto ---
const somSalto = new Audio('Sons/boing.mp3');

// Obstáculos do runner (adapta à vontade)
const obstaculos = [
  { x: 500, y: 530, w: 50, h: 70 },
  { x: 800, y: 500, w: 60, h: 100 },
  { x: 1100, y: 530, w: 40, h: 60 },
  { x: 1300, y: 480, w: 50, h: 120 },
  { x: 1500, y: 530, w: 70, h: 70 },
  { x: 1700, y: 530, w: 60, h: 90 },
  { x: 1900, y: 530, w: 50, h: 80 },
  { x: 2100, y: 500, w: 70, h: 110 },
  { x: 2300, y: 530, w: 50, h: 60 },
  { x: 2500, y: 530, w: 90, h: 60 },
  { x: 2700, y: 500, w: 60, h: 100 },
  { x: 2900, y: 530, w: 50, h: 70 },
  { x: 3100, y: 500, w: 70, h: 120 },
  { x: 3300, y: 530, w: 60, h: 80 },
  { x: 3500, y: 500, w: 50, h: 100 },
  { x: 3700, y: 530, w: 70, h: 70 },
  { x: 3900, y: 500, w: 60, h: 90 },
  { x: 4100, y: 530, w: 50, h: 80 },
  { x: 4300, y: 500, w: 70, h: 110 },
  { x: 4500, y: 530, w: 50, h: 60 },
  { x: 4700, y: 530, w: 90, h: 60 },
  { x: 4900, y: 500, w: 60, h: 100 },
  { x: 5100, y: 530, w: 50, h: 70 },
  { x: 5300, y: 500, w: 70, h: 120 },
  { x: 5500, y: 530, w: 60, h: 80 },
  { x: 5700, y: 500, w: 50, h: 100 },
  { x: 5900, y: 530, w: 70, h: 70 },
];

// Meta
const meta = { x: 6100, y: 480, w: 40, h: 120 };

let cenarioX = 0;

// Forrest runner
const forrest = {
  x: 100,
  y: 450,
  w: 64,
  h: 96,
  vx: 0,
  vy: 0,
  noChao: false
};

// Físicas
const GRAVIDADE = 1.3;
const FORCA_SALTO = -20;
const VELOCIDADE = 7;

// Tempo
let tempoRestante = 30; // segundos
let intervaloTempo = null;
let corridaTerminou = false;
let nivel3Ativo = false;

// ====== INPUT ======
window.addEventListener('keydown', e => {
  if (!nivel3Ativo || corridaTerminou) return;
  if (e.key === 'ArrowRight') forrest.vx = VELOCIDADE;
  if (e.key === 'ArrowLeft') forrest.vx = -VELOCIDADE;
  if ((e.key === ' ' || e.key === 'Spacebar') && forrest.noChao) {
    forrest.vy = FORCA_SALTO;
    forrest.noChao = false;
    somSalto.currentTime = 0;
    somSalto.play();
  }
});
window.addEventListener('keyup', e => {
  if (!nivel3Ativo || corridaTerminou) return;
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') forrest.vx = 0;
});

// ===== TEMPORIZADOR =====
function iniciarTemporizadorNivel3() {
  if (intervaloTempo) clearInterval(intervaloTempo);
  tempoRestante = 30;
  corridaTerminou = false;
  intervaloTempo = setInterval(() => {
    tempoRestante--;
    if (tempoRestante <= 0) {
      corridaTerminou = true;
      nivel3Ativo = false;
      clearInterval(intervaloTempo);
      exibirperdedor3 = true;
      exibirvencedor3 = false;
      document.getElementById('btn-recomecar3').style.display = 'block';
      desenharNivel3();
    }
  }, 1000);
}

// ===== CICLO PRINCIPAL RUNNER =====
function loopNivel3() {
  if (!nivel3Ativo) return;

  // Movimento Forrest
  forrest.x += forrest.vx;
  forrest.vy += GRAVIDADE;
  forrest.y += forrest.vy;

  // Chão (base)
  if (forrest.y + forrest.h > 600) {
    forrest.y = 600 - forrest.h;
    forrest.vy = 0;
    forrest.noChao = true;
  }

  // Obstáculos
  for (let o of obstaculos) {
    if (
      forrest.x + forrest.w > o.x - cenarioX &&
      forrest.x < o.x + o.w - cenarioX &&
      forrest.y + forrest.h > o.y &&
      forrest.y < o.y + o.h
    ) {
      // Em cima do obstáculo
      if (forrest.vy > 0 && forrest.y + forrest.h - forrest.vy <= o.y) {
        forrest.y = o.y - forrest.h;
        forrest.vy = 0;
        forrest.noChao = true;
      }
      // Bater de lado
      else if (forrest.vx > 0) {
        forrest.x = o.x - cenarioX - forrest.w;
      } else if (forrest.vx < 0) {
        forrest.x = o.x + o.w - cenarioX;
      }
    }
  }

  // SCROLL
  const margemScroll = 250;
  if (forrest.x > canvas.width - margemScroll) {
    let diff = forrest.x - (canvas.width - margemScroll);
    forrest.x -= diff;
    cenarioX += diff;
  }
  if (forrest.x < margemScroll && cenarioX > 0) {
    let diff = margemScroll - forrest.x;
    forrest.x += diff;
    cenarioX -= diff;
    if (cenarioX < 0) cenarioX = 0;
  }

  // --- CHEGADA À META ---
  if (
    forrest.x + cenarioX > meta.x &&
    forrest.x + cenarioX < meta.x + meta.w &&
    forrest.y + forrest.h > meta.y
  ) {
    corridaTerminou = true;
    nivel3Ativo = false;
    clearInterval(intervaloTempo);

    somAplausos.currentTime = 0;
 somAplausos.play().catch(()=>{});

    exibirvencedor3 = true;
    exibirperdedor3 = false;
    document.getElementById('btn-gameover').style.display = 'block';
    desenharNivel3();
    
    return;
  }

  // --- TEMPO ESGOTADO ---
  if (tempoRestante <= 0) {
   
  somBooNivel3.currentTime = 0;
  somBooNivel3.play().catch(()=>{});

    return;
  

  
}
  // DESENHAR
  desenharNivel3();
  requestAnimationFrame(loopNivel3);
}

// ===== DESENHAR RUNNER =====
function desenharNivel3() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Mostra vitória/derrota
  if (exibirvencedor3 && vencedor3Img.complete) {
  ctx.drawImage(vencedor3Img, 0, 0, canvas.width, canvas.height);
  return;
}

  if (exibirperdedor3 && perdedor3Img.complete) {
    ctx.drawImage(perdedor3Img, 0, 0, canvas.width, canvas.height);
    return;
  }

  // Fundo (repetido para scroll)
  for (let i = 0; i < 3; i++) {
    ctx.drawImage(fundoImg, i * fundoImg.width - (cenarioX % fundoImg.width), 0, fundoImg.width, canvas.height);
  }

  // Obstáculos
  ctx.fillStyle = "rgba(30,100,30,0.85)";
  for (let o of obstaculos) {
    ctx.fillRect(o.x - cenarioX, o.y, o.w, o.h);
  }

  // Meta
  ctx.fillStyle = "yellow";
  ctx.fillRect(meta.x - cenarioX, meta.y, meta.w, meta.h);

  // Forrest
  if (forrestImg.complete) {
    ctx.drawImage(forrestImg, forrest.x, forrest.y, forrest.w, forrest.h);
  } else {
    ctx.fillStyle = "red";
    ctx.fillRect(forrest.x, forrest.y, forrest.w, forrest.h);
  }

  // Tempo
    // Tempo no canto superior-esquerdo
  ctx.font = "bold 28px monospace";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "left";       // alinha o texto à esquerda
  ctx.textBaseline = "top";     // faz o y=0 ser o topo do texto
  ctx.fillText("Tempo: " + tempoRestante + "s", 20, 20);

  // Dicas
  ctx.font = "22px monospace";
  ctx.fillText("← → para andar. Espaço para saltar!", 20, 40);
  if (typeof desenharBotao === "function" && typeof botaoConfig !== "undefined") {
    desenharBotao(botaoConfig);
  }
}

// ===== RESET NÍVEL 3 =====
function resetNivel3() {
  estadoAtual     = 'nivel3';
  forrest.x = 100;
  forrest.y = 450;
  forrest.vx = 0;
  forrest.vy = 0;
  cenarioX = 0;
  corridaTerminou = false;
  nivel3Ativo = true;
  exibirvencedor3 = false;
  exibirperdedor3 = false;
  document.getElementById('btn-recomecar3').style.display = 'none';
  iniciarTemporizadorNivel3();
  loopNivel3();
}

// ===== INICIAR NÍVEL 3: chamada pelo botão =====
function iniciarNivel3Forrest() {
    // garante que o main loop passa a chamar desenharNivel3()
  estadoAtual     = 'nivel3';
  // limpa qualquer resíduo do nível2
  exibirVencedor2 = false;
  exibirPerdedor2 = false;
  nivel3Ativo = true;
  corridaTerminou = false;
  exibirvencedor3 = false;
  exibirperdedor3 = false;
  document.getElementById('btn-nivel3').style.display = 'none';
  document.getElementById('btn-recomecar3').style.display = 'none';
  forrest.x = 100;
  forrest.y = 450;
  forrest.vx = 0;
  forrest.vy = 0;
  cenarioX = 0;
  iniciarTemporizadorNivel3();
  loopNivel3();
}
const btnGameOver = document.getElementById('btn-gameover');
btnGameOver.addEventListener('click', () => {
  // esconde o botão
  btnGameOver.style.display = 'none';
  // muda para o estado final
  estadoAtual = 'menufinal';
});

// posicionamento (igual ao btn-nivel3)
btnGameOver.style.left      = '50%';
btnGameOver.style.bottom    = '20px';
btnGameOver.style.transform = 'translateX(-50%)';

// ao vencer o nível 3:
document.getElementById('btn-gameover').style.display = 'block';

// no clique:
btnGameOver.addEventListener('click', () => {
  btnGameOver.style.display = 'none';
  estadoAtual = 'menufinal';
});

// ====== BOTÃO "Nível 3" ======
document.getElementById('btn-nivel3').onclick = iniciarNivel3Forrest;

// ===== BOTÃO RECOMEÇAR NÍVEL 3 =====
document.getElementById('btn-recomecar3').onclick = resetNivel3;
document.getElementById('btn-recomecar3').style.display = 'none';
document.getElementById('btn-gameover').style.display = 'none';
