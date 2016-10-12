var canvas = document.getElementById('canvas'),
    cw = canvas.width,
    ch = canvas.height,
    cx = null,
    fps = 15,
    cubeSize = 30,
    botMode = false,
    lost = false,
    score = 0,
    eventsReset = true;
    
//Maximize canvas size
canvas.width = window.innerWidth;   // equal to window dimension
canvas.height = window.innerHeight;

cw = canvas.width;
ch = canvas.height;

var map = {
    sizeX:Math.ceil(cw / cubeSize),
    sizeY:Math.ceil(ch / cubeSize),
    cells:[]
};

initialize();

function initialize()
{
    cx = canvas.getContext('2d');
    window.addEventListener("keydown", keyDownEvent, false);

    //Initialize double array
    for (var i = 0; i < map.sizeX; i++)
    {
        map.cells.push([]);
        map.cells[i].push([]);
    }
    
    for (var i = 0; i < map.sizeX; i++)
    {
        for (var i2 = 0; i2 < map.sizeY; i2++)
        {
            var cellObject = {isWall:false};
            map.cells[i][i2] = cellObject;
        }   
    }
    
    generateMap();
    drawMap();
    
    setTimeout(gameLoop, 1000 / fps);
}

function gameLoop() {
    

    
  
    eventsReset = true;
    setTimeout(gameLoop, 1000 / fps);
}
function generateMap()
{
    //Generate random vertical lines
    for (var i = 0; i < map.sizeX / 2; i++)
    {
        for (var i2 = 0; i2 < map.sizeY; i2++)
        {
            
        }
    }
    recursiveGenerator(30, 4, 4, 0);
}
function recursiveGenerator(index, posX, posY, isReal)
{
    var startX = posX;
    var startY = posY;
    console.log(index);
    //Try to place the path
    var pLength = randomNumber(1,8);
    var speedX = randomNumber(0,2) - 1;
    var speedY = 0;
    if (speedX == 0)
        speedY = randomNumber(0,2) - 1;
    if (speedX == 0 && speedY == 0)
        speedY = 1;
    
    var generated = true;
    for (var i = 0; i < pLength; i++)
    {
        map.cells[posX][posY].isWall = true;
        //Check if next position exists
        if ((posX + speedX) > 0 && (posX + speedX < map.sizeX))
            posX += speedX;
        else
        {
            if (i == 0)
                generated = false;
            break;
        }  
        if ((posY + speedY) > 0 && (posY + speedY < map.sizeY))
            posY += speedY;
        else
        {
            if (i == 0)
                generated = false;
            break;
        }
    }
    
    if (index > 0)
    {
        if (generated == true)
        {
            index--;
            recursiveGenerator(index, posX, startY, 0);
        }
        
    }
    if (isReal == 0)
    {
        if (index > 0)
        {
            index--;
            recursiveGenerator(index, startX, posY, 1);
        }
    }
}
function mirrorMap()
{
    //Mirror the first half of the map
    for (var i = 0; i < map.sizeX / 2; i++)
    {
        for (var i2 = 0; i2 < map.sizeY; i2++)
        {
            if (map.cells[i][i2].isWall == true)
            {
                map.cells[map.sizeX - i - 1][i2].isWall = true;
            }
        }   
    }
}
function drawMap()
{
    for (var i = 0; i < map.sizeX; i++)
    {
        for (var i2 = 0; i2 < map.sizeY; i2++)
        {
            if (map.cells[i][i2].isWall == true)
            {
                cx.fillStyle = "rgb(40,10,40)";
                cx.fillRect(cubeSize*i,cubeSize*i2,cubeSize,cubeSize);
            }
        }   
    }
}
function keyDownEvent(e)
{
    if (eventsReset == true)
    {
        if ( e.key == "w") {

        }
        if ( e.key == "a") {

        }
        if ( e.key == "s") {

        }
        if ( e.key == "d") {

        }
        if ( e.key == "ArrowUp") {

        }
        if ( e.key == "ArrowLeft") {

        }
        if ( e.key == "ArrowDown") {

        }
        if ( e.key == "ArrowRight") {

        }
        eventsReset = false;
    }
}
function randomNumber(min, max)
{
    return Math.floor((Math.random() * max) + min);
}
function startPlaying()
{
    if (botMode == true)
    {
        botMode = false;
        $(".mainPanel").animate({"top" : "-425px"}, 1500); 
        $(".controlPanel").animate({"top" : "-180px"}, 1500); 
        $(".play").html("Back"); 
        map.sizeY -= 3;
    }
    else
    {
        botMode = true;
        $(".mainPanel").animate({"top" : window.innerHeight/2 - 225 + "px"}, 1500); 
        $(".controlPanel").animate({"top" : "-90px"}, 1500); 
        $(".play").html("Play"); 
        map.sizeY += 3;

    }
}
function changeSpeed()
{
    fps = document.getElementById("speedSlider").value;
}
