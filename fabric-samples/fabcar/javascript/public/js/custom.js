$(function(){
    $('#jtimeline-demo').jTimeline();
  });

  $('#jtimeline-demo').jTimeline({

    // pixels per second
    resolution: 50000, 
  
    // minimum spacing between events
    minimumSpacing: 200, 
  
    // scrolling (translateX) step size
    step: 200, 
  
    // character for left arrow
    leftArrow: "&larr;", 
  
    // character for right arrow
    rightArrow: "&rarr;", 
    
  });