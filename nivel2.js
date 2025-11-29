// === VARIÁVEIS E IMAGENS ===
const fundoMar       = new Image();        fundoMar.src       = 'Imagens/mar.jpg';
const barcoImg       = new Image();        barcoImg.src       = 'Imagens/barco.png';
const ALTURA_MAX_BARCO = 260;
const camaraoImg     = new Image();        camaraoImg.src     = 'Imagens/camaroes.png';
const vencedor2Img   = new Image();        vencedor2Img.src   = 'Imagens/vencedor2.png';
const perdedor2Img   = new Image();        perdedor2Img.src   = 'Imagens/perdedor2.png';

// 🔊 Áudios
const somAplausos    = new Audio('Sons/aplausos.mp3');
const somBooNivel2         = new Audio('Sons/booo.mp3');

// Flags de controlo
let exibirVencedor2  = false;
let exibirPerdedor2  = false;

// Estado do jogo
let barcoX           = 450;
let barcoY           = 400;
let camaroes         = [];
let pontuacao        = 0;
let tempoDecorrido   = 0;    // cronómetro ascendente
let nivel2Ativo      = false;
let temporizador     = null;

// Dimensões dos camarões
const CAMARAO_W      = 48;
const CAMARAO_H      = 48;
const CAMARAO_Y_MIN  = ALTURA_MAX_BARCO;
const CAMARAO_Y_MAX  = 500;

// Assim que o DOM estiver pronto, escondemos e estilizamos os botões
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-nivel2').style.display    = 'none';
  document.getElementById('btn-recomecar2').style.display = 'none';
  document.getElementById('btn-nivel3').style.display    = 'none';

  const btn3 = document.getElementById('btn-nivel3');
  btn3.style.position  = 'absolute';
  btn3.style.bottom    = '20px';
  btn3.style.left      = '50%';
  btn3.style.transform = 'translateX(-50%)';

  const btnRecomecar2 = document.getElementById('btn-recomecar2');
  btnRecomecar2.addEventListener('click', () => {
    btnRecomecar2.style.display = 'none';
    iniciarNivel2();
  });
});

// === INICIAR NÍVEL 2 ===
function iniciarNivel2() {
  estadoAtual      = 'nivel2';
  clearInterval(temporizador);

  exibirVencedor2  = false;
  exibirPerdedor2  = false;
  document.getElementById('btn-recomecar2').style.display = 'none';
  document.getElementById('btn-nivel3')   .style.display = 'none';

  nivel2Ativo      = true;
  barcoX           = 450;
  barcoY           = 400;
  pontuacao        = 0;
  tempoDecorrido   = 0;
  camaroes         = [];
  gerarCamarao();

  temporizador = setInterval(() => {
    if (!nivel2Ativo) return;
    tempoDecorrido++;
    if (tempoDecorrido >= 60) {
      nivel2Ativo     = false;
      clearInterval(temporizador);
      exibirPerdedor2 = true;
      document.getElementById('btn-recomecar2').style.display = 'block';
    }
  }, 1000);
}

// === ATUALIZAR NÍVEL 2 ===
function atualizarNivel2() {
  // Todo: a lógica de geração/remoção de camarões já corre em setInterval,
  // por isso aqui pode ficar vazio ou incluir checks adicionais se quiseres.
}

// === GERAR CAMARÃO ===
function gerarCamarao() {
  if (!nivel2Ativo) return;
  const x  = Math.random() * (800 - CAMARAO_W);
  const y  = Math.random() * (CAMARAO_Y_MAX - CAMARAO_Y_MIN) + CAMARAO_Y_MIN;
  const id = Date.now() + Math.random();
  camaroes.push({ x, y, id });

  setTimeout(() => {
    camaroes = camaroes.filter(c => c.id !== id);
  }, 3000);

  setTimeout(gerarCamarao, 1000);
}

// === DESENHAR NÍVEL 2 ===
function desenharNivel2() {
  // Vitória “fixa”
  if (exibirVencedor2 && vencedor2Img.complete) {
    ctx.drawImage(vencedor2Img, 0, 0, 800, 600);
    return;
  }
  // Derrota “fixa”
  if (exibirPerdedor2 && perdedor2Img.complete) {
    ctx.drawImage(perdedor2Img, 0, 0, 800, 600);
    return;
  }

  // Desenho normal
  ctx.drawImage(fundoMar, 0, 0, 800, 600);
  ctx.drawImage(barcoImg, barcoX, barcoY, 200, 140);
  camaroes.forEach(c => {
    ctx.drawImage(camaraoImg, c.x, c.y, CAMARAO_W, CAMARAO_H);
  });

  ctx.fillStyle = 'black';
  ctx.font      = '20px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(`Pontuação: ${pontuacao}`, 30, 30);
  ctx.fillText(`Tempo: ${tempoDecorrido}s`, 30, 60);
}

// === CONTROLO DO BARCO E COLETA COM SPACE ===
window.addEventListener('keydown', e => {
  if (estadoAtual !== 'nivel2') return;

  if (e.key === 'ArrowUp')    barcoY = Math.max(ALTURA_MAX_BARCO, barcoY - 20);
  if (e.key === 'ArrowDown')  barcoY = Math.min(500, barcoY + 20);
  if (e.key === 'ArrowLeft')  barcoX = Math.max(0,   barcoX - 20);
  if (e.key === 'ArrowRight') barcoX = Math.min(650, barcoX + 20);

  if (e.code === 'Space') {
    camaroes.slice().forEach(c => {
      const collide =
        c.x < barcoX + 200 &&
        c.x + CAMARAO_W > barcoX &&
        c.y < barcoY + 140 &&
        c.y + CAMARAO_H > barcoY;

      if (collide) {
        camaroes = camaroes.filter(s => s.id !== c.id);
        pontuacao++;
        if (somAtivo) new Audio('Sons/plop.mp3').play();
        if (pontuacao >= 15) vencerNivel2();
      }
    });
  }
});

// === VENCER NÍVEL 2 ===
function vencerNivel2() {
  nivel2Ativo     = false;
  clearInterval(temporizador);

  somAplausos.currentTime = 0;
  somAplausos.play().catch(()=>{});

  exibirVencedor2  = true;
  exibirPerdedor2  = false;
  ctx.drawImage(vencedor2Img, 0, 0, 800, 600);

  // Mostrar botão “Nível 3”
  const btn3 = document.getElementById('btn-nivel3');
  btn3.style.display = 'block';
}

// === DERROTA NÍVEL 2 ===
function perderNivel2() {
 
  nivel2Ativo     = false;
  clearInterval(temporizador);

if (tempoDecorrido >= 60) {
  somBooNivel2.currentTime = 0;
  somBooNivel2.play().catch(()=>{});
}

  exibirVencedor2  = false;
  exibirPerdedor2  = true;
  ctx.drawImage(perdedor2Img, 0, 0, 800, 600);

  document.getElementById('btn-recomecar2').style.display = 'block';
}
