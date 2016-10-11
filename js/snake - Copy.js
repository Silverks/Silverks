var canvas = document.getElementById('canvas'),
    cw = canvas.width,
    ch = canvas.height,
    cx = null,
    fps = 10,
    cubeSize = 15;
//Maximize canvas size
canvas.width = window.innerWidth;   // equal to window dimension
canvas.height = window.innerHeight;
cw = canvas.width;
ch = canvas.height;

var map = {
    sizeX:Math.floor(cw / cubeSize),
    sizeY:Math.floor(ch / cubeSize)
};

var snake = {
    body:[],
    speedX:1,
    speedY:0,
    currentX:10,
    currentY:11
};

initialize();

function initialize()
{
    cx = canvas.getContext('2d');
    //window.addEventListener( "keypress", keyDownEvent, false );
    window.addEventListener("keydown", keyDownEvent, false);
    //canvas.addEventListener("keydown", keyDownEvent, true);
    setupSnake();
    drawInitialState();
    
    
    setInterval(gameLoop, 1000 / fps);
}
function setupSnake()
{
    //snake.body = [];
    addNewSnakePart(snake.currentX,snake.currentY);
    //addNewSnakePart(10,10);
    //addNewSnakePart(10,11);
    //snakePart.posX = 10;
    //snakePart.posY= 11;
    //snake.body.push(snakePart);
}
function drawInitialState()
{
    for (var i = 0; i < map.sizeX; i++)
    {
       for (var i2 = 0; i2 < map.sizeY; i2++)
       {
            cx.rect(cubeSize*i,cubeSize*i2,cubeSize,cubeSize);
       } 
    }
    drawSnake();
    cx.stroke();
}
function drawSnake()
{
    for(var i = 0; i < snake.body.length; i++)
    {
        drawSnakePart(i);
        //cx.fillStyle = 'yellow';
        //cx.fill();
    }
}



function gameLoop() {
    //Draw all the map rectangles
    //update snake
    snake.currentX += snake.speedX;
    snake.currentY += snake.speedY;
    addNewSnakePart(snake.currentX,snake.currentY);
    drawSnakePart(snake.body.length-1);
    removeSnakePart();      //Remove the last bit of the snake
    //console.log(snake.body.length);
}
function drawSnakePart(i)
{
    cx.fillStyle = 'yellow';
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
    cx.fillStyle = 'white';
    cx.fillRect(cubeSize*snake.body[0].posX,cubeSize*snake.body[0].posY,cubeSize,cubeSize);
    //console.log(snake.body[0].posX + "_" + snake.body[0].posY);
    snake.body.splice(0, 1);
}
function keyDownEvent(e)
{
    if ( e.key == "w") {
        snake.speedX = 0;
        snake.speedY = -1;
    }
    if ( e.key == "a") {
        snake.speedX = -1;
        snake.speedY = 0;
    }
    if ( e.key == "s") {
        snake.speedX = 0;
        snake.speedY = 1;
    }
    if ( e.key == "d") {
        snake.speedX = 1;
        snake.speedY = 0;
    }
}