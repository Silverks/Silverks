//Help functions
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function randomNumber(min, max)
{
    return Math.floor((Math.random() * max) + min);
}
var SliderParameters = [];
function generateVariableSlider(parameter, parameterName, min, current, max)
{
    parameter = current;
    
    $(".sidePanel").append('<p class="range-field">'+
        '&nbsp&nbsp&nbsp' + parameterName+
        '<br>&nbsp<input type="range" id="parameterSlider'+SliderParameters.length+'" min="'+min+'" value="'+current+'" max="'+max+'" onchange="changeSliderParameterValue('+SliderParameters.length+', \''+parameterName+'\')" style="width:80%;"/>'+
        '<span id="slider'+parameterName+'">'+current+'</span>' +
        '</p>');
        
    SliderParameters.push(parameter);
}
function changeSliderParameterValue(parameterID, parameterName)
{
    //Update the javaScript variable
    window[parameterName] = $('#parameterSlider' + parameterID).val();
    
    //Display the current value besides the slider
    $('#slider' + parameterName).html($('#parameterSlider' + parameterID).val());
}
function transformArrayToImage(planetImage)
{
    temporaryCanvas.width = planetImage.width;
    temporaryCanvas.height = planetImage.width;
    tcx.putImageData(planetImage, 0, 0);
    
    var img = temporaryCanvas.toDataURL("image/png");
    
    $("#planetImage").remove();
    $("body").append('<img id="planetImage" class="outsideWindow" src="'+img+'"/>');

    var img=document.getElementById("planetImage");
    return img;
}