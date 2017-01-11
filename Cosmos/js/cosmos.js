//////////////////////////////////////////////////////
//                                                  //
//                                                  //
//            Space image generator v0.2            //
//                  Kaspars Cinis                   //
//                                                  //
//                                                  //
//////////////////////////////////////////////////////
var canvas = document.getElementById('canvas'),
    tempCanvas = document.getElementById('temporaryCanvas')
    cw = canvas.width,
    ch = canvas.height,
    cx = null, tcx = null;
    
//////////////////////////////////////////////////////
//                    SETTINGS                      //
//////////////////////////////////////////////////////
var fps = 30,
    maxPlanetWidth = 200,
    planetTextureSize = 10,
    numberOfStars = 100,
    numberOfPlanets = 1,
    chanceForMoons = 100;


    
//Generate sliders for each of the project settings
generateVariableSlider(fps, "fps", 10, 30, 60);   
generateVariableSlider(maxPlanetWidth, "maxPlanetWidth", 30, 200, 400); 
generateVariableSlider(planetTextureSize, "planetTextureSize", 1, 10, 100); 
generateVariableSlider(numberOfStars, "numberOfStars", 1, 100, 4000); 
generateVariableSlider(numberOfPlanets, "numberOfPlanets", 0, 1, 20); 
generateVariableSlider(chanceForMoons, "chanceForMoons", 0, 50, 100); 

//Maximize canvas size
canvas.width = window.innerWidth - 200;   // equal to window dimension
canvas.height = window.innerHeight;
console.log(canvas.width);

cw = canvas.width;
ch = canvas.height;
console.log(cw);
var backgroundImage;

var starArray = [];
var planetArray = [];


initialize();


function initialize()
{
    cx = canvas.getContext('2d');
    tcx = tempCanvas.getContext('2d');
    
    backgroundImage = cx.createImageData(cw, ch);
    cx.fillStyle = "rgb(100,20,200);"
    cx.fillRect(0,0,cw,ch);
    
    
    setTimeout(gameLoop, 1000 / fps);

    noise.seed(Math.random());
    
    regenerate();
}

function gameLoop() 
{
    cx.putImageData(backgroundImage, 0, 0, 0, 0, cw, ch);

    updateStars();
    drawStars();
    drawPlanets();
    
    setTimeout(gameLoop, 1000 / fps);
}
function updateStars()
{
    
}
function drawStars()
{
    var colorSpeed = 2;
    var haloLength = 1;
    
    for (var i = 0; i < starArray.length; i++)
    {
        //var newStarParticle = {x: x, y:y, size: randomNumber(3, 6), color:newColor, currentLength:0, currentSpeed:1};
        //var haloScale = 4;
        
        //Update this star
        if (starArray[i].currentSpeed == 1)
        {
            starArray[i].currentLength += 1;
            starArray[i].color.R += colorSpeed;
            starArray[i].color.G += colorSpeed;
            starArray[i].color.B += colorSpeed;
            
            if (starArray[i].currentLength >=  starArray[i].size*haloLength)
            {
                starArray[i].currentSpeed = -1;
            }
        }
        else
        {
            starArray[i].currentLength -= 1;
            starArray[i].color.R -= colorSpeed;
            starArray[i].color.G -= colorSpeed;
            starArray[i].color.B -= colorSpeed;
            
            if (starArray[i].currentLength <=  0)
            {
                starArray[i].currentSpeed = 1;
            }
        } 
        
        //console.log(starArray[i].color.B);
        //Draw the star
        cx.fillStyle = "rgb("+starArray[i].color.R+","+starArray[i].color.G+","+starArray[i].color.B+")";
        var Divider = 20;
        var haloScale = 2;
        var newSize = starArray[i].size*starArray[i].currentLength/Divider;
        cx.fillRect(starArray[i].x,starArray[i].y,starArray[i].size*starArray[i].currentLength/Divider,starArray[i].size*starArray[i].currentLength/Divider);
        
        //Draw the halo
        cx.fillRect(starArray[i].x + newSize - newSize/2,starArray[i].y - (starArray[i].currentLength*haloScale)/2 + (newSize)/2,1,starArray[i].currentLength*haloScale);
        cx.fillRect(starArray[i].x - (starArray[i].currentLength*haloScale)/2 + (newSize)/2,starArray[i].y + newSize - newSize/2,starArray[i].currentLength*haloScale,1);
    }
}
function drawPixel(x, y, pixelColor)
{
    var pixelNumber = (y*cw+x)*4;
    backgroundImage.data[pixelNumber+0] = pixelColor.R;
    backgroundImage.data[pixelNumber+1] = pixelColor.G;
    backgroundImage.data[pixelNumber+2] = pixelColor.B;
    backgroundImage.data[pixelNumber+3] = 255 * pixelColor.A;
}
function drawPixelOnImage(image, x, y, pixelColor)
{
    var pixelNumber = (y*image.width+x)*4;
    image.data[pixelNumber+0] = pixelColor.R;
    image.data[pixelNumber+1] = pixelColor.G;
    image.data[pixelNumber+2] = pixelColor.B;
    image.data[pixelNumber+3] = 255 * pixelColor.A;
}
function drawStar(x, y, color, size)
{
    var randomColor = randomNumber(0,5);
    var intensity = 1;//randomNumber(0,10)/10;
    
    if (randomColor == 1)
        color = {R:(255+color.R)/2, G:(253+color.G)/2, B:(202+color.B)/2, A:intensity}
    if (randomColor == 2)
        color = {R:(106+color.R)/2, G:(31+color.G)/2, B:(2+color.B)/2, A:intensity}
    if (randomColor == 3)
        color = {R:(60+color.R)/2, G:(74+color.G)/2, B:(111+color.B)/2, A:intensity}
    if (randomColor == 4)
        color = {R:(228+color.R)/2, G:(221+color.G)/2, B:(203+color.B)/2, A:intensity}
    
    color = {R:(255+color.R)/2, G:(255+color.G)/2, B:(255+color.B)/2, A:intensity}
    
    for (var i = 0; i < size; i++)
    {
        for (var i2 = 0; i2 < size; i2++)
        {
            drawPixel(x+i,y+i2,color);
        }
    }
}
function generatePlanet(parentPlanet)
{
    var planetWidth = randomNumber(40, maxPlanetWidth);
    
    //If it's a moon, it has to be smaller
    if (parentPlanet != null)
        planetWidth = randomNumber(10, parentPlanet.size/2);
    
    
    planetImage = cx.createImageData(planetWidth, planetWidth);

    topFloor = 200;
    minFloor = 60;
    var starColor1 = {R:randomNumber(minFloor,topFloor),G:randomNumber(minFloor,topFloor),B:randomNumber(minFloor,topFloor)};
    var starColor2 = {R:randomNumber(minFloor,topFloor),G:randomNumber(minFloor,topFloor),B:randomNumber(minFloor,topFloor)};
    
    var centerX = planetWidth/2;
    var centerShadowX = planetWidth*0.3;
    var centerShadowY = planetWidth*0.3;
    var lightingLength = planetWidth*0.7;
    
    for (var i = 0; i < planetWidth; i++)
    {
        for (var i2 = 0; i2 < planetWidth; i2++)
        {
            var scale = planetTextureSize;
            var value1 = noise.perlin2(i / scale, i2 / scale);
            var value2 = 1 - value1;

            var R = Math.floor((starColor1.R*value1+starColor2.R*value2)/2);
            var G = Math.floor((starColor1.G*value1+starColor2.G*value2)/2);
            var B = Math.floor((starColor1.B*value1+starColor2.B*value2)/2);
            var thisColor = {R: R, G: G, B: B, A:1};
         
            
            
            if (Math.sqrt((i-centerX)*(i-centerX) + (i2-centerX)*(i2-centerX)) < centerX)
            {
                //Check if it's in the shadow
                var distanceFromLight = Math.sqrt((i-centerShadowX)*(i-centerShadowX) + (i2-centerShadowY)*(i2-centerShadowY)) / lightingLength;
                var shadowChance = distanceFromLight * 100;
                
                if (randomNumber(0, 100) <= shadowChance)
                {
                    if (shadowChance <= 100)
                    {
                        thisColor = {R: Math.floor(R*0.6), G: Math.floor(G*0.6), B: Math.floor(B*0.6), A:1};
                    }
                    else
                    {
                        var shadowScale = 5;
                        var deeperShadows = 0.6 - (shadowChance/100 - 1)*shadowScale;
                        thisColor = {R: Math.floor(R*deeperShadows), G: Math.floor(G*deeperShadows), B: Math.floor(B*deeperShadows), A:1};
                    }
                }

                drawPixelOnImage(planetImage, i, i2, thisColor);
            }
            else
            {
                thisColor = {R: 0, G: 0, B:0, A:0};
                drawPixelOnImage(planetImage, i, i2, thisColor);
            }
        }  
    }
    
    var image = transformArrayToImage(planetImage);
     
    var newPlanet = {
        posX: randomNumber(0, cw),
        posY: randomNumber(0, ch),
        size: planetWidth,
        image : image
    }
    
    if (parentPlanet != null)
    {
        newPlanet.distanceX = parentPlanet.size + planetWidth/2;
        newPlanet.speedY = randomNumber(1, 10) / 10;
        newPlanet.speedX = 1 - newPlanet.speedY;
        newPlanet.posX = 0;
        newPlanet.posY = 0;
        newPlanet.dpos = parentPlanet.size/3;
        newPlanet.frame = 0;
        newPlanet.animationSpeed = 0.01;
        newPlanet.currentSpeed = 1;
        
        parentPlanet.moon = newPlanet;
    }
    else
    {
        planetArray.push(newPlanet);
        
        if (randomNumber(0,100) <= chanceForMoons && parentPlanet == null)
        {
            //Add a moon to this planet that rotates around it
            generatePlanet(newPlanet);
        }
    }
}
function drawPlanets()
{
    for (var i = 0; i < planetArray.length; i++)
    {
        //If it's a moon, update it's logic
        if (planetArray[i].moon != null)
        {
            //Update the logic
            var currentMoonSpeed = Math.sin(planetArray[i].moon.frame);
            
            //Check if it's now gone behind or in front of the planet
            if (planetArray[i].moon.currentMoonSpeed - currentMoonSpeed > 0)
            {
                
                //Draw the moon
                cx.drawImage(planetArray[i].moon.image,planetArray[i].posX + planetArray[i].moon.posX + planetArray[i].moon.dpos,planetArray[i].posY + planetArray[i].moon.posY + planetArray[i].moon.dpos);
                //Draw the planet
                cx.drawImage(planetArray[i].image,planetArray[i].posX,planetArray[i].posY);
            }
            else
            {
                
                //Draw the planet
                cx.drawImage(planetArray[i].image,planetArray[i].posX,planetArray[i].posY);
                //Draw the moon
                cx.drawImage(planetArray[i].moon.image,planetArray[i].posX + planetArray[i].moon.posX + planetArray[i].moon.dpos,planetArray[i].posY + planetArray[i].moon.posY + planetArray[i].moon.dpos);
            }
            
            planetArray[i].moon.frame += planetArray[i].moon.animationSpeed;
            planetArray[i].moon.posX = planetArray[i].moon.speedX * currentMoonSpeed * planetArray[i].moon.distanceX;
            planetArray[i].moon.posY = planetArray[i].moon.speedY * currentMoonSpeed * planetArray[i].moon.distanceX;
            planetArray[i].moon.currentMoonSpeed = currentMoonSpeed;
        }
        else
        {
            cx.drawImage(planetArray[i].image,planetArray[i].posX,planetArray[i].posY);
        }
    }
}
function regenerate()
{
    //Reset some variables
    planetArray = [];
    starArray = [];
    
    var topFloor = 200;
    var corner1 = {R:randomNumber(0,topFloor),G:randomNumber(0,topFloor),B:randomNumber(0,topFloor)};
    var corner2 = {R:randomNumber(0,topFloor),G:randomNumber(0,topFloor),B:randomNumber(0,topFloor)};
    var corner3 = {R:randomNumber(0,topFloor),G:randomNumber(0,topFloor),B:randomNumber(0,topFloor)};
    var corner4 = {R:randomNumber(0,topFloor),G:randomNumber(0,topFloor),B:randomNumber(0,topFloor)};
    
    topFloor = 255;
    minFloor = 100;
    var starColor1 = {R:randomNumber(minFloor,topFloor),G:randomNumber(minFloor,topFloor),B:randomNumber(minFloor,topFloor)};
    var starColor2 = {R:randomNumber(minFloor,topFloor),G:randomNumber(minFloor,topFloor),B:randomNumber(minFloor,topFloor)};
    
    //Apply background
    for (var x = 0; x < cw; x++) {
      for (var y = 0; y < ch; y++) {
        var scaleScale = 4;
        var cornerScale1 = (((cw-x)/cw) + ((ch-y)/ch))/scaleScale;
        var cornerScale2 = ((x/cw) + ((ch-y)/ch))/scaleScale;
        var cornerScale3 = (((cw-x)/cw) + (y/ch))/scaleScale;
        var cornerScale4 = ((x/cw) + (y/ch))/scaleScale;

        var newColor = {R:0,G:0,B:0,A:1};
        newColor.R = Math.floor((corner1.R * cornerScale1 + corner2.R * cornerScale2 + corner3.R * cornerScale3 + corner4.R * cornerScale4)/4);
        newColor.G = Math.floor((corner1.G * cornerScale1 + corner2.G * cornerScale2 + corner3.G * cornerScale3 + corner4.G * cornerScale4)/4);
        newColor.B = Math.floor((corner1.B * cornerScale1 + corner2.B * cornerScale2 + corner3.B * cornerScale3 + corner4.B * cornerScale4)/4);
        drawPixel(x, y, newColor);
      }
    }
    
    
    //Apply perlin stars
    var scale = 250;
    for (var x = 0; x < cw; x++) {
      for (var y = 0; y < ch; y++) {

        // noise.simplex2 and noise.perlin2 for 2d noise
        var value = noise.perlin2(x / scale, y / scale);
        
        var value1 = noise.perlin2(x / scale, y / scale);
        var value2 = 1 - value1;

        var R = Math.floor((starColor1.R*value1+starColor2.R*value2)/2);
        var G = Math.floor((starColor1.G*value1+starColor2.G*value2)/2);
        var B = Math.floor((starColor1.B*value1+starColor2.B*value2)/2);
        var thisColor = {R: R, G: G, B: B, A:1};
        
        var newColor = {R:starColor1.R - randomNumber(0,10),G:starColor1.G - randomNumber(0,10),B:starColor1.B - randomNumber(0,10),A:0.4};
        //if (value > 0.3)
        value = Math.abs(value);
        newColor = {R:Math.floor(starColor2.R * value),G:Math.floor(starColor2.G * value),B:Math.floor(starColor2.B * value),A:0.4};
       
        var starChance = (cw*ch)/numberOfStars;
        if (randomNumber(0,starChance - Math.floor(value*starChance*0.9)) <= 2)
        {
            var newStarParticle = {x: x, y:y, size: randomNumber(3, 6), color:thisColor, currentLength:randomNumber(0,12), currentSpeed:1};
            starArray.push(newStarParticle);
        }
      }
    }
    
    for (var i = 0; i < numberOfPlanets; i++)
    {
        generatePlanet();
    }
}