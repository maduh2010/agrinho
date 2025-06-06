// Variáveis globais para o estado do jogo
let currentGameState = 'quiz'; // 'quiz', 'quizCompleted', 'runnerGame', 'runnerGameOver'

// --- Variáveis do Jogo de Perguntas e Respostas ---
let perguntas = [
  {
    pergunta: "Qual é a principal fonte de energia renovável mais utilizada no campo para irrigação?",
    opcoes: ["Petróleo", "Carvão", "Energia solar", "Gás natural"],
    respostaCorreta: 2, // Energia solar
    dica: "A energia do sol é limpa e abundante em áreas rurais."
  },
  {
    pergunta: "Nas grandes cidades, qual é a maior preocupação com a qualidade do ar?",
    opcoes: ["Poeira do campo", "Emissões de veículos e indústrias", "Cheiro de flores", "Umidade excessiva"],
    respostaCorreta: 1, // Emissões de veículos e indústrias
    dica: "O tráfego e as fábricas contribuem significativamente para a poluição urbana."
  },
  {
    pergunta: "O que é um 'cinturão verde' em torno de uma cidade?",
    opcoes: ["Uma área de floresta densa", "Um tipo de rodovia", "Uma área de terras agrícolas ou parques que limita a expansão urbana", "Um bairro industrial"],
    respostaCorreta: 2, // Uma área de terras agrícolas ou parques que limita a expansão urbana
    dica: "Ajuda a preservar a natureza e a controlar o crescimento das cidades."
  },
  {
    pergunta: "Qual é um dos maiores desafios de morar em áreas rurais isoladas?",
    opcoes: ["Excesso de transporte público", "Falta de acesso a serviços de saúde e internet", "Muitos shoppings", "Poluição sonora"],
    respostaCorreta: 1, // Falta de acesso a serviços de saúde e internet
    dica: "A distância dos centros urbanos pode dificultar o acesso a algumas comodidades."
  },
  {
    pergunta: "O que o 'agronegócio' representa no Brasil?",
    opcoes: ["Apenas a venda de carros", "A produção de software", "Um setor econômico que envolve a agricultura e pecuária em larga escala", "O comércio de roupas"],
    respostaCorreta: 2, // Um setor econômico que envolve a agricultura e pecuária em larga escala
    dica: "É uma parte muito importante da economia brasileira, ligada ao campo."
  },
  {
    pergunta: "Qual é a principal causa do aumento das 'ilhas de calor' nas cidades?",
    opcoes: ["Grandes áreas verdes", "Excesso de concreto e asfalto que absorvem calor", "Rios e lagos", "Ventos fortes"],
    respostaCorreta: 1, // Excesso de concreto e asfalto que absorvem calor
    dica: "Superfícies escuras e a falta de vegetação contribuem para temperaturas mais altas."
  },
  {
    pergunta: "No campo, qual é o principal uso da terra?",
    opcoes: ["Construção de arranha-céus", "Agricultura e criação de animais", "Grandes estacionamentos", "Parques de diversão"],
    respostaCorreta: 1, // Agricultura e criação de animais
    dica: "A terra é a base para a produção de alimentos e para a pecuária."
  },
  {
    pergunta: "O que é 'gentrificação' nas cidades?",
    opcoes: ["Aumento de áreas verdes", "Processo de valorização de bairros que leva à saída de moradores de baixa renda", "Construção de novas estradas", "Diminuição do trânsito"],
    respostaCorreta: 1, // Processo de valorização de bairros que leva à saída de moradores de baixa renda
    dica: "É uma mudança social e econômica que afeta a composição dos bairros urbanos."
  },
  {
    pergunta: "Qual é o papel das cooperativas agrícolas no campo?",
    opcoes: ["Vender produtos importados", "Ajudar pequenos produtores a comercializar seus produtos e obter recursos", "Organizar shows de música", "Construir prédios comerciais"],
    respostaCorreta: 1, // Ajudar pequenos produtores a comercializar seus produtos e obter recursos
    dica: "Elas fortalecem a economia local e o trabalho em conjunto dos agricultores."
  },
  {
    pergunta: "O que significa 'mobilidade urbana'?",
    opcoes: ["A capacidade de se mover livremente no campo", "A facilidade de deslocamento de pessoas e bens dentro da cidade", "A velocidade dos carros", "A construção de pontes"],
    respostaCorreta: 1, // A facilidade de deslocamento de pessoas e bens dentro da cidade
    dica: "Envolve transporte público, ciclovias e planejamento para facilitar o ir e vir nas cidades."
  }
];

let perguntaAtual = 0;
let respostaSelecionada = -1;
let feedback = "";
let mostrarBotaoProxima = false; // Flag para mostrar o botão "Próxima Pergunta"
let quizScore = 0; // Nova variável para a pontuação do quiz

// --- Variáveis do Jogo Campo a Cidade ---
let player;
let obstacles = [];
let runnerGameScore = 0; // Renomeado para evitar conflito com quizScore
let runnerGameSpeed = 5;
let gameRunning = false; // Estado para controlar se o jogo de corrida está ativo
let currentEnvironment = 'campo'; // 'campo' ou 'cidade'
let groundY; // Altura do chão para o jogador

// Variáveis para os elementos de fundo (árvores e prédios)
let campoTrees = [];
let cidadeBuildings = [];
let backgroundScrollSpeed = 2; // Velocidade de rolagem para os elementos de fundo (parallax)

// Classe para o jogador (cavalo ou carro)
class Player {
  constructor() {
    this.x = 100;
    this.y = groundY; // Começa no chão
    this.width = 50;
    this.height = 50;
    this.vy = 0; // Velocidade vertical
    this.gravity = 0.8; // Gravidade
    this.isJumping = false;
  }

  jump() {
    if (!this.isJumping) {
      this.vy = -15; // Força do pulo
      this.isJumping = true;
    }
  }

  update() {
    this.y += this.vy;
    this.vy += this.gravity;

    // Garante que o jogador não caia abaixo do chão
    if (this.y >= groundY) {
      this.y = groundY;
      this.vy = 0;
      this.isJumping = false;
    }
  }

  draw() {
    // Desenha o jogador dependendo do ambiente
    if (currentEnvironment === 'campo') {
      // Cavalo (simples)
      fill(139, 69, 19); // Cor marrom
      rect(this.x, this.y - this.height, this.width, this.height, 5); // Corpo
      rect(this.x + this.width * 0.7, this.y - this.height - 10, this.width * 0.3, 10, 3); // Cabeça
      fill(255);
      ellipse(this.x + this.width * 0.85, this.y - this.height - 5, 5, 5); // Olho
    } else {
      // Carro (simples)
      fill(0, 0, 255); // Cor azul
      rect(this.x, this.y - this.height * 0.8, this.width, this.height * 0.8, 8); // Corpo do carro
      fill(50);
      ellipse(this.x + this.width * 0.2, this.y - this.height * 0.8 + this.height * 0.8, 15, 15); // Roda traseira
      ellipse(this.x + this.width * 0.8, this.y - this.height * 0.8 + this.height * 0.8, 15, 15); // Roda dianteira
      fill(173, 216, 230); // Azul claro para a janela
      rect(this.x + this.width * 0.1, this.y - this.height * 0.8 + 5, this.width * 0.4, this.height * 0.3, 3);
    }
  }

  // Verifica colisão com um obstáculo
  collides(obstacle) {
    return (
      this.x < obstacle.x + obstacle.width &&
      this.x + this.width > obstacle.x &&
      this.y - this.height < obstacle.y + obstacle.height &&
      this.y > obstacle.y
    );
  }
}

// Classe para os obstáculos
class Obstacle {
  constructor(x, type) {
    this.x = x;
    this.width = random(30, 60);
    this.height = random(30, 80);
    this.y = groundY - this.height; // Obstáculo no chão
    this.type = type; // 'campo' ou 'cidade'
  }

  update() {
    this.x -= runnerGameSpeed;
  }

  draw() {
    fill(100); // Cor cinza para obstáculos
    if (this.type === 'campo') {
      // Obstáculo do campo (cerca ou pedra)
      if (random() < 0.5) { // Cerca
        rect(this.x, this.y, this.width, this.height, 5);
        line(this.x, this.y + this.height / 3, this.x + this.width, this.y + this.height / 3);
        line(this.x, this.y + this.height * 2 / 3, this.x + this.width, this.y + this.height * 2 / 3);
      } else { // Pedra
        ellipse(this.x + this.width / 2, this.y + this.height / 2, this.width, this.height);
      }
    } else {
      // Obstáculo da cidade (cone ou hidrante)
      if (random() < 0.5) { // Cone
        triangle(this.x, this.y + this.height, this.x + this.width, this.y + this.height, this.x + this.width / 2, this.y);
        fill(255, 165, 0); // Laranja para o topo do cone
        rect(this.x + this.width / 4, this.y + this.height * 0.8, this.width / 2, this.height * 0.2);
      } else { // Hidrante
        rect(this.x, this.y + this.height * 0.6, this.width, this.height * 0.4, 5);
        rect(this.x + this.width * 0.2, this.y, this.width * 0.6, this.height * 0.6, 5);
      }
    }
  }
}

// Classe para as árvores no campo
class Tree {
  constructor(x) {
    this.x = x;
    this.width = random(30, 50);
    this.height = random(60, 100);
    this.trunkWidth = this.width * 0.3;
    this.trunkHeight = this.height * 0.4;
    this.canopyRadius = this.width * 0.6;
  }

  draw() {
    // Tronco
    fill(139, 69, 19); // Marrom
    rect(this.x + (this.width - this.trunkWidth) / 2, groundY - this.trunkHeight, this.trunkWidth, this.trunkHeight, 5);
    // Copa
    fill(34, 139, 34); // Verde
    ellipse(this.x + this.width / 2, groundY - this.trunkHeight - this.canopyRadius * 0.7, this.canopyRadius * 2, this.canopyRadius * 2);
  }
}

// Classe para os prédios na cidade
class Building {
  constructor(x) {
    this.x = x;
    this.width = random(60, 120);
    this.height = random(80, 200);
    this.y = groundY - this.height;
  }

  draw() {
    fill(100); // Prédio cinza
    rect(this.x, this.y, this.width, this.height);

    // Janelas (retângulos simples)
    fill(173, 216, 230); // Azul claro para janelas
    let windowSize = 15;
    let padding = 10;
    for (let row = this.y + padding; row < this.y + this.height - padding - windowSize; row += windowSize + padding) {
      for (let col = this.x + padding; col < this.x + this.width - padding - windowSize; col += windowSize + padding) {
        rect(col, row, windowSize, windowSize);
      }
    }
  }
}


function setup() {
  createCanvas(800, 450);
  textSize(18);
  textAlign(CENTER);
  groundY = height - 100; // Define a altura do chão
  player = new Player(); // Inicializa o jogador
  resetQuizGame(); // Garante que o quiz comece do zero
  resetRunnerGame(); // Reseta o jogo de corrida para o estado inicial
}

function draw() {
  if (currentGameState === 'quiz') {
    drawQuizGame();
  } else if (currentGameState === 'quizCompleted') {
    drawQuizCompletedScreen();
  } else if (currentGameState === 'runnerGame') {
    drawRunnerGame();
  } else if (currentGameState === 'runnerGameOver') {
    drawRunnerGameOverScreen();
  }

  // Informação do autor sempre visível
  fill(255, 0, 0); // Cor vermelha
  textSize(12); // Tamanho da fonte menor
  textAlign(LEFT, BOTTOM); // Alinha o texto à esquerda e na parte inferior
  text("FEITO POR MARIA EDUARDA 1B", 10, height - 25);
  text("COLÉGIO ESTADUAL IDALIA ROCHA", 10, height - 10);
  textAlign(CENTER, TOP); // Restaura o alinhamento para o restante do quiz
}

function mousePressed() {
  if (currentGameState === 'quiz') {
    handleQuizMousePressed();
  } else if (currentGameState === 'quizCompleted') {
    // Botão "Jogar Campo a Cidade"
    if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 && mouseY > height / 2 + 30 && mouseY < height / 2 + 70) {
      currentGameState = 'runnerGame';
      gameRunning = true;
      resetRunnerGame();
    }
  } else if (currentGameState === 'runnerGameOver') {
    // Botão "Reiniciar Jogo" agora volta para o quiz
    if (mouseX > width / 2 - 80 && mouseX < width / 2 + 80 && mouseY > height / 2 + 30 && mouseY < height / 2 + 70) {
      currentGameState = 'quiz';
      resetQuizGame(); // Reseta o quiz para o início
    }
  }
}

function keyPressed() {
  if (currentGameState === 'runnerGame' && keyCode === 32 && gameRunning) { // Tecla espaço
    player.jump();
  }
}

// --- Funções do Jogo de Perguntas e Respostas ---
function drawQuizGame() {
  // Fundo com gradiente que mistura verde e azul
  drawGradientBackground();

  // Exibe a pergunta
  fill(0);
  textSize(24);
  text(perguntas[perguntaAtual].pergunta, width / 2, 50);

  // Exibe as opções de resposta com fonte menor
  for (let i = 0; i < perguntas[perguntaAtual].opcoes.length; i++) {
    if (i === respostaSelecionada) {
      fill(180, 255, 180); // Cor para a opção selecionada
    } else {
      fill(255);
    }
    rect(150, 100 + i * 60, 500, 50, 10);
    fill(0);
    textSize(18); // Tamanho da fonte para as opções de resposta
    text(perguntas[perguntaAtual].opcoes[i], width / 2, 130 + i * 60);
  }

  // Exibe o feedback após selecionar uma resposta
  if (feedback !== "") {
    fill(255, 0, 0); // Cor vermelha para destacar
    textSize(16); // Tamanho da fonte menor para feedback
    text(feedback, width / 2, height - 120); // Ajustei a posição para subir o feedback mais para cima
  }

  // Exibe as dicas com a fonte reduzida para 14px
  if (feedback !== "" && feedback !== "Resposta correta!" && feedback !== "Resposta errada.") { // Só mostra a dica se não for apenas "Correta/Errada"
    fill(0); // Cor preta para a dica
    textSize(14); // Tamanho da fonte menor para as dicas
    text(perguntas[perguntaAtual].dica, width / 2, height - 90); // Ajustei a posição para o espaço da dica
  }

  // Exibe o botão "Próxima Pergunta" no canto inferior esquerdo, com fundo claro
  if (mostrarBotaoProxima) {
    fill(255, 255, 204); // Fundo claro para o botão
    rect(20, height - 60, 160, 40, 10); // Posição no canto inferior esquerdo
    fill(0);
    textSize(16);
    text("Próxima Pergunta", 100, height - 40); // Texto do botão
  }
}

function drawGradientBackground() {
  // Cria o gradiente de fundo que vai de azul (cima) para verde (baixo)
  for (let i = 0; i <= height; i++) {
    let inter = map(i, 0, height, 0, 1);
    let c = lerpColor(color(0, 102, 204), color(34, 139, 34), inter); // Azul para Verde
    stroke(c);
    line(0, i, width, i);
  }
}

function handleQuizMousePressed() {
  // Verifica se o clique foi em alguma das opções
  for (let i = 0; i < perguntas[perguntaAtual].opcoes.length; i++) {
    if (mouseX > 150 && mouseX < 650 && mouseY > 100 + i * 60 && mouseY < 150 + i * 60) {
      respostaSelecionada = i;
      verificarResposta();
    }
  }

  // Verifica se o clique foi no botão "Próxima Pergunta" no canto inferior esquerdo
  if (mostrarBotaoProxima && mouseX > 20 && mouseX < 180 && mouseY > height - 60 && mouseY < height - 20) {
    proximaPergunta();
  }
}

function verificarResposta() {
  if (respostaSelecionada === perguntas[perguntaAtual].respostaCorreta) {
    feedback = "Resposta correta!";
    quizScore++; // Incrementa a pontuação do quiz
  } else {
    feedback = "Resposta errada.";
  }

  // Exibe o botão "Próxima Pergunta" após exibir a resposta
  mostrarBotaoProxima = true;
}

function proximaPergunta() {
  // Avança para a próxima pergunta
  perguntaAtual++;
  if (perguntaAtual >= perguntas.length) {
    // Quiz completo, transiciona para a tela de finalização do quiz
    currentGameState = 'quizCompleted';
  }
  respostaSelecionada = -1;
  feedback = "";
  mostrarBotaoProxima = false;
}

function resetQuizGame() {
  perguntaAtual = 0;
  respostaSelecionada = -1;
  feedback = "";
  mostrarBotaoProxima = false;
  quizScore = 0; // Reseta a pontuação do quiz
}

// --- Tela de Quiz Concluído ---
function drawQuizCompletedScreen() {
  background(173, 216, 230); // Azul claro
  fill(0);
  textSize(32);
  text("Parabéns! Você completou o quiz!", width / 2, height / 2 - 80);
  textSize(24);
  text("Sua pontuação no quiz: " + quizScore + "/" + perguntas.length, width / 2, height / 2 - 40);
  textSize(20);
  text("Agora, prepare-se para o jogo Campo a Cidade!", width / 2, height / 2);

  // Botão para iniciar o jogo de corrida
  fill(144, 238, 144); // Verde claro
  rect(width / 2 - 100, height / 2 + 30, 200, 40, 10);
  fill(0);
  textSize(18);
  text("Jogar Campo a Cidade", width / 2, height / 2 + 55);
}

// --- Funções do Jogo Campo a Cidade ---
function drawRunnerGame() {
  // Fundo dinâmico para campo ou cidade
  if (currentEnvironment === 'campo') {
    background(135, 206, 235); // Céu azul
    fill(34, 139, 34); // Grama verde
    rect(0, groundY, width, height - groundY);

    // Desenha o sol
    fill(255, 255, 0); // Amarelo
    noStroke();
    ellipse(width - 80, 80, 60, 60); // Posição do sol

    // Atualiza e desenha as árvores
    for (let i = campoTrees.length - 1; i >= 0; i--) {
      campoTrees[i].x -= backgroundScrollSpeed;
      campoTrees[i].draw();
      if (campoTrees[i].x + campoTrees[i].width < 0) {
        campoTrees.splice(i, 1);
      }
    }
    // Gera novas árvores
    if (frameCount % 180 === 0 && gameRunning) { // Gera uma nova árvore a cada 3 segundos (aprox.)
      campoTrees.push(new Tree(width));
    }

  } else { // currentEnvironment === 'cidade'
    background(105, 105, 105); // Céu cinza (cidade)
    fill(80); // Asfalto
    rect(0, groundY, width, height - groundY);

    // Atualiza e desenha os prédios
    for (let i = cidadeBuildings.length - 1; i >= 0; i--) {
      cidadeBuildings[i].x -= backgroundScrollSpeed;
      cidadeBuildings[i].draw();
      if (cidadeBuildings[i].x + cidadeBuildings[i].width < 0) {
        cidadeBuildings.splice(i, 1);
      }
    }
    // Gera novos prédios
    if (frameCount % 150 === 0 && gameRunning) { // Gera um novo prédio a cada 2.5 segundos (aprox.)
      cidadeBuildings.push(new Building(width));
    }
  }

  // Atualiza e desenha o jogador
  player.update();
  player.draw();

  // Atualiza e desenha os obstáculos
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].update();
    obstacles[i].draw();

    // Remove obstáculos que saíram da tela
    if (obstacles[i].x + obstacles[i].width < 0) {
      obstacles.splice(i, 1);
      runnerGameScore++; // Aumenta a pontuação ao passar por um obstáculo
    }

    // Verifica colisão
    if (player.collides(obstacles[i])) {
      gameRunning = false;
      currentGameState = 'runnerGameOver';
    }
  }

  // Gera novos obstáculos
  if (frameCount % 90 === 0 && gameRunning) { // Gera um novo obstáculo a cada 90 frames
    obstacles.push(new Obstacle(width, currentEnvironment));
    // Alterna o ambiente a cada 5 obstáculos para simular a transição campo-cidade
    if (runnerGameScore > 0 && runnerGameScore % 5 === 0) {
      currentEnvironment = (currentEnvironment === 'campo' ? 'cidade' : 'campo');
    }
  }

  // Exibe a pontuação
  fill(0);
  textSize(24);
  text("Pontuação: " + runnerGameScore, width / 2, 30);
}

function resetRunnerGame() {
  player = new Player();
  obstacles = [];
  campoTrees = []; // Limpa as árvores ao reiniciar
  cidadeBuildings = []; // Limpa os prédios ao reiniciar
  runnerGameScore = 0;
  runnerGameSpeed = 5;
  gameRunning = true;
  currentEnvironment = 'campo'; // Começa sempre no campo
}

// --- Tela de Game Over do Jogo Campo a Cidade ---
function drawRunnerGameOverScreen() {
  background(255, 100, 100); // Vermelho claro para Game Over
  fill(0);
  textSize(40);
  text("GAME OVER!", width / 2, height / 2 - 50);
  textSize(24);
  text("Sua Pontuação: " + runnerGameScore, width / 2, height / 2);

  // Botão para reiniciar o jogo
  fill(144, 238, 144); // Verde claro
  rect(width / 2 - 80, height / 2 + 30, 160, 40, 10);
  fill(0);
  textSize(18);
  text("Reiniciar Jogo", width / 2, height / 2 + 55);
}
