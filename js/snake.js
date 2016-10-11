var canvas = document.getElementById('canvas'),
    cw = canvas.width,
    ch = canvas.height,
    cx = null,
    fps = 15,
    cubeSize = 30,
    tilesToGrow = 20,
    snakeColor = "rgb(105,170,225)",
    backgroundColor = "rgb(30,5,30)",
    newBackgroundColor = "rgb(30,5,30)",
    newStrokeColor = "rgb(255,1,135)",
    strokeColor = "rgb(255,1,135)",
    oR = 30, oG = 5, oB = 30,
    changeColorNextWave = false,
    botMode = true,
    lost = false,
    score = 0,
    eventsReset = true;
    
//Maximize canvas size
canvas.width = window.innerWidth;   // equal to window dimension
canvas.height = window.innerHeight-90;
cw = canvas.width;
ch = canvas.height;
var fruits = [];
var map = {
    sizeX:Math.ceil(cw / cubeSize),
    sizeY:Math.ceil(ch / cubeSize)
};
var snake = {
    body:[],
    speedX:1,
    speedY:0,
    currentX:10,
    currentY:11
};
var screenWave = {
    posX:-5,
    colors:[]
};

initialize();

function initialize()
{
    cx = canvas.getContext('2d');
    window.addEventListener("keydown", keyDownEvent, false);

    screenWave.colors[0] = "rgb(50,10,50)";
    screenWave.colors[1] = "rgb(65,15,65)";
    screenWave.colors[2] = "rgb(80,20,80)";
    screenWave.colors[3] = "rgb(65,15,65)";
    screenWave.colors[4] = "rgb(50,10,50)";
    
    setupSnake();
    drawInitialState();
    spawnFruit();
    
    setTimeout(gameLoop, 1000 / fps);
}
function setupSnake()
{
    addNewSnakePart(snake.currentX,snake.currentY);
}
function drawInitialState()
{
    for (var i = 0; i < map.sizeX; i++)
    {
       for (var i2 = 0; i2 < map.sizeY; i2++)
       {
           cx.fillStyle = backgroundColor;
           cx.fillRect(cubeSize*i,cubeSize*i2,cubeSize,cubeSize);
           
           cx.strokeStyle = strokeColor;
           cx.strokeRect(cubeSize*i,cubeSize*i2,cubeSize,cubeSize);
       } 
    }
    drawSnake();
}
function drawSnake()
{
    for(var i = 0; i < snake.body.length; i++)
    {
        drawSnakePart(i);
    }
}



function gameLoop() {
    //Draw all the map rectangles
    drawWave();
    
    //update snake
    snake.currentX += snake.speedX;
    snake.currentY += snake.speedY;
    
    //Screen wrapping
    if (snake.currentX >= map.sizeX)
        snake.currentX = 0;
    if (snake.currentY >= map.sizeY)
        snake.currentY = 0;
    if (snake.currentX < 0)
        snake.currentX = map.sizeX;
    if (snake.currentY < 0)
        snake.currentY = map.sizeY;
    
    //Check collision for the new location
    if (checkSnakeCollision(snake.currentX, snake.currentY) == true)
    {
        snake.speedX = 0;
        snake.speedY = 0;
        lost = true;
    }
    else
    {
       addNewSnakePart(snake.currentX,snake.currentY); 
    }
    if (checkFruitCollision(snake.currentX, snake.currentY) == true)
    {
        tilesToGrow = 5;
        fruits.splice(0,1);
        spawnFruit();
        score += snake.body.length;
        var scoreText = "";
        //Convert score number to displayed string
        for (var i = 0; i < (6-score.toString().length); i++)
        {
            scoreText += "0";
        }
        scoreText += score.toString();
        document.getElementById("score").textContent = scoreText;
    }
    
    
    drawSnakePart(snake.body.length-1);
    
    //Draw fruits / Snake
    drawFruits();
    drawSnake();
    
    if (tilesToGrow == 0)
        removeSnakePart();      //Remove the last bit of the snake
    else
        tilesToGrow--;
    
    if (botMode == true && lost == false)
    {
        if (randomNumber(0,3) == 2)
        {
            var keyCode = randomNumber(1,4);
            var key = {};
            if (keyCode == 1)
                key.key = "w";
            if (keyCode == 2)
                key.key = "a";
            if (keyCode == 3)
                key.key = "s";
            if (keyCode == 4)
                key.key = "d";
            
            keyDownEvent(key);
        }
    }
    if (lost == true)
    {
        if (snake.body.length == 0)
        {
            //reset the snake
            snake.currentX = randomNumber(0, map.sizeX);
            snake.currentY = randomNumber(0, map.sizeY);
            snake.speedX = 1;
            snake.speedY = 0;
            tilesToGrow = 10;
            lost = false;
        }
    }
    
    eventsReset = true;
    setTimeout(gameLoop, 1000 / fps);
}
function drawSnakePart(i)
{
    if (lost == true && (snake.body.length % 3 == 0))
    {
        cx.fillStyle = "yellow";
    }
    else
    {
        cx.fillStyle = snakeColor;
    }   
    
    cx.fillRect(snake.body[i].posX * cubeSize, snake.body[i].posY * cubeSize, cubeSize, cubeSize);
}
function addNewSnakePart(pX, pY)
{
    var snakePart = {
        posX:pX,
        posY:pY
    }
    snake.body.push(snakePart);
}
function removeSnakePart()
{
    if (snake.body[0].posX > screenWave.posX)
    {
        cx.fillStyle = backgroundColor;
        cx.fillRect(cubeSize*snake.body[0].posX,cubeSize*snake.body[0].posY,cubeSize,cubeSize);
        
        cx.strokeStyle = strokeColor;
        cx.strokeRect(cubeSize*snake.body[0].posX,cubeSize*snake.body[0].posY,cubeSize,cubeSize);
    }
    else
    {
        cx.fillStyle = newBackgroundColor;
        cx.fillRect(cubeSize*snake.body[0].posX,cubeSize*snake.body[0].posY,cubeSize,cubeSize);
        
        cx.strokeStyle = newStrokeColor;
        cx.strokeRect(cubeSize*snake.body[0].posX,cubeSize*snake.body[0].posY,cubeSize,cubeSize);

    }
    
    snake.body.splice(0, 1);
}
function keyDownEvent(e)
{
    if (eventsReset == true)
    {
        if ( e.key == "w" && (snake.speedX != 0 && snake.speedY != -1)) {
            snake.speedX = 0;
            snake.speedY = -1;
        }
        if ( e.key == "a" && (snake.speedX != -1 && snake.speedY != 0)) {
            snake.speedX = -1;
            snake.speedY = 0;
        }
        if ( e.key == "s" && (snake.speedX != 0 && snake.speedY != 1)) {
            snake.speedX = 0;
            snake.speedY = 1;
        }
        if ( e.key == "d" && (snake.speedX != 1 && snake.speedY != 0)) {
            snake.speedX = 1;
            snake.speedY = 0;
        }
        eventsReset = false;
    }
}
function spawnFruit()
{
    var spawned = false;
    var pX = 0;
    var pY = 0;
    while (spawned == false)
    {
        pX = Math.floor((Math.random() * map.sizeX) + 0);
        pY = Math.floor((Math.random() * map.sizeY) + 0);
        if (checkSnakeCollision(pX, pY) == false)
        {
            spawned = true;
        }
    }
    
    var fruit = {
        posX:pX,
        posY:pY
    }
    fruits.push(fruit);  
}
function drawFruits()
{
    //Draw the fruit
    for (var i = 0; i < fruits.length; i++)
    {
        cx.fillStyle = 'red';
        cx.fillRect(cubeSize*fruits[i].posX,cubeSize*fruits[i].posY,cubeSize,cubeSize);
    }
}
function drawSnake()
{
    for (var i = 0; i < snake.body.length; i++)
    {
        //Check collision for every snake body part
        drawSnakePart(i);
    }
}
function checkSnakeCollision(posX, posY)
{
    var collided = false;
    for (var i = 0; i < snake.body.length; i++)
    {
        //Check collision for every snake body part
        if (snake.body[i].posX == posX && snake.body[i].posY == posY)
        {
            collided = true;
        }
    }
    return collided;
}
function checkFruitCollision(posX, posY)
{
    var collided = false;
    for (var i = 0; i < fruits.length; i++)
    {
        //Check collision for every snake body part
        if (fruits[i].posX == posX && fruits[i].posY == posY)
        {
            collided = true;
        }
    }
    return collided;
}
function generateNewColors()
{
    var randR = randomNumber(0,255);
    var randG = randomNumber(0,255);
    var randB = randomNumber(0,255);
    newBackgroundColor = "rgb("+randR+","+randG+","+randB+")";
    newStrokeColor = "rgb("+randomNumber(0,255)+","+randomNumber(0,255)+","+randomNumber(0,255)+")";
    
    //Calculate wave color differences
    var dR = Math.abs(Math.floor((oR - randR)/5));
    var dG = Math.abs(Math.floor((oG - randR)/5));
    var dB = Math.abs(Math.floor((oB - randR)/5));
    oR = randR;
    oG = randG;
    oB = randB;
    
    for (var i = 0; i < 5; i++)
        screenWave.colors[i] = "rgb("+(randR+dR*i)+","+(randG+dG*i)+","+(randB+dB*i)+")";
}
function randomNumber(min, max)
{
    return Math.floor((Math.random() * max) + min);
}
function drawWave()
{
        //Overdraw the previous tiles 
        for (var i2 = 0; i2 < 5; i2++)
        {
            for (var i = -1; i <= map.sizeY; i++)
            {
                cx.fillStyle = newBackgroundColor;
                cx.fillRect(cubeSize*(screenWave.posX+i2),cubeSize*i,cubeSize,cubeSize);
                cx.strokeStyle = newStrokeColor;
                cx.strokeRect(cubeSize*(screenWave.posX+i2),cubeSize*i,cubeSize,cubeSize);
            }
        }
        
        screenWave.posX += 1;
        
        //Draw the wave tiles
        for (var i2 = 0; i2 < 5; i2++)
        {
            for (var i = 0; i < map.sizeY; i++)
            {
                cx.fillStyle = screenWave.colors[i2];
                cx.fillRect(cubeSize*(screenWave.posX+i2),cubeSize*i,cubeSize,cubeSize);
                cx.strokeStyle = strokeColor;
                cx.strokeRect(cubeSize*(screenWave.posX+i2),cubeSize*i,cubeSize,cubeSize);
            }
        }
        

        if (screenWave.posX > (map.sizeX + 10))
        {
            screenWave.posX = -10;
            
            if(botMode == false && randomNumber(0,10) == 5)
            {
                /*backgroundColor = newBackgroundColor;
                strokeColor = newStrokeColor;
                
                generateNewColors();*/
            }
        }
}
function startPlaying()
{
    botMode = false;
    $(".mainPanel").animate({"top" : "-425px"}, 1500); 
}
function changeSpeed()
{
    fps = document.getElementById("speedSlider").value;
}
