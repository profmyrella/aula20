var trex, trexCorrendo,trexColidido, solo, soloImg, soloInvisivel, nuvemImg;
var obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6
var pontos;
var grupoObstaculos, grupoNuvens;
var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo = JOGAR;
var gameOver, gameOverImg, reiniciar, reiniciarImg;
var somMorte, somPontos, somSalto;

function preload(){

  trexCorrendo = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  soloImg = loadImage("ground2.png");
  nuvemImg = loadImage("cloud.png");
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");
  gameOverImg = loadImage("gameOver.png");
  reiniciarImg = loadImage("restart.png");
  trexColidido = loadAnimation("trex_collided.png");
  somMorte = loadSound("die.mp3");
  somPontos = loadSound("checkpoint.mp3");
  somSalto = loadSound("jump.mp3");
}

function setup(){

  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50,height-70, 20,50);
  trex.addAnimation("correndo", trexCorrendo);
  trex.addAnimation("colidido", trexColidido);
  trex.scale = 0.5;
  //trex.debug = true;
  trex.setCollider("circle", 0,0,40);

  solo = createSprite(width/2,height-20,width,20);
  solo.addImage(soloImg);
  solo.velocityX = -3;

  soloInvisivel = createSprite(width/2,height-10,width,10);
  soloInvisivel.visible = false;

  gameOver = createSprite(width/2,height/2+50);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  gameOver.visible = false;

  reiniciar = createSprite(width/2, height/2);
  reiniciar.addImage(reiniciarImg);
  reiniciar.scale = 0.5;
  reiniciar.visible = false;

  pontos = 0;

  grupoNuvens = new Group();
  grupoObstaculos = new Group();
}

function draw(){
  background("white");
  text("Pontuação: "+pontos, width/2, height-400);

  if(estadoJogo == JOGAR){

    pontos = pontos + Math.round((frameRate()/60));

    if(pontos > 0 && pontos %100 === 0){
      somPontos.play();
    }

    if(keyDown("space") && trex.y >= 150){
      trex.velocityY = -10;
       somSalto.play();
    }
    trex.velocityY += 0.5;

    if(solo.x <0){
      solo.x = width/2;
    }
    gerarNuvens();
    gerarObstaculos();

    if(grupoObstaculos.isTouching(trex)){
      estadoJogo = ENCERRAR;
      somMorte.play();
      //Para habilitar a IA no trex comente as duas linhas acima e descomente as linhas abaixo
      //trex.velocityY = -10;
      //somSalto.play();
    }

  }
  else if(estadoJogo == ENCERRAR){
    solo.velocityX = 0;
    trex.velocityY = 0;

    grupoObstaculos.setVelocityXEach(0);
    grupoNuvens.setVelocityXEach(0);

    grupoObstaculos.setLifetimeEach(-1);
    grupoNuvens.setLifetimeEach(-1);

    gameOver.visible = true;
    reiniciar.visible = true;

    trex.changeAnimation("colidido");

    if(mousePressedOver(reiniciar)){
    //console.log("Reiniciar o jogo");
   reset();
  }
  }
  trex.collide(soloInvisivel);

  drawSprites();

}

function gerarNuvens(){
  if(frameCount % 60 == 0){ 
    var nuvem = createSprite(width, 100, 40, 10);
    nuvem.velocityX = -3;
    nuvem.y = Math.round(random(height-400,height-150));
    nuvem.addImage(nuvemImg);
    //nuvem.scale = 0.5;
    nuvem.lifetime = 500;
    trex.depth = nuvem.depth;
    trex.depth++;

    reiniciar.depth = nuvem.depth;
    reiniciar.depth++;

    gameOver.depth = nuvem.depth;
    gameOver.depth++;

    grupoNuvens.add(nuvem);
}
}

function gerarObstaculos(){
  if(frameCount % 60 == 0){
    var obstaculo = createSprite(width, height-35, 10, 40);
    obstaculo.velocityX = -3;

    var aleatoria = Math.round(random(1,6));
    switch (aleatoria) {
      case 1: obstaculo.addImage(obstaculo1);
        break;

      case 2: obstaculo.addImage(obstaculo2);
      break;

      case 3: obstaculo.addImage(obstaculo3);
      break;
    
      case 4: obstaculo.addImage(obstaculo4);
      break;

      case 5: obstaculo.addImage(obstaculo5);
      break;

      case 6: obstaculo.addImage(obstaculo6);
      break;

      default:
        break;
    }
    obstaculo.scale = 0.5;
    obstaculo.lifetime = 500;
    grupoObstaculos.add(obstaculo);
  }
}

function reset(){
  estadoJogo = JOGAR;

  gameOver.visible = false;
  reiniciar.visible = false;
  
  grupoObstaculos.destroyEach();
  grupoNuvens.destroyEach();
  
  trex.changeAnimation("correndo");
  
  pontos = 0;
}