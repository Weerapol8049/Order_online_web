// Define some global vars for our idle timer
var idleTime = 0;
var countdown = 10;
var idlemin = 30;
var idlemax = 60;

//
//
// you need to define your own HTML and css styles for the warning message and fade layer.
// the warning message goes in a div with the ID #idlewarn
// the css should style for a fade layer with the id #fade
//
//


// N.B. using jQuery - easily adapted for other *.js library.
$(document).ready(function(){
  
  // every N sec this example goes every 1 sec BUT that's a bit much in practice.
  var idleInterval = setInterval("timerIncrement()", 3000); 

    // Zero the idle timer on mouse movement.
    $(this).mousemove(function (e) {
        // hide warning + countdown
        countdown = 10;
         $('#fade').remove();  // remove the lightbox fade layer
        $('#idlewarn').fadeOut('fast'); // hide our warning message
        idleTime = 0;
    });
    // Also Zero the timer on keypress
    $(this).keypress(function (e) {
        // hide warning + countdown
        countdown = 10;
         $('#fade').remove();  // remove the lightbox fade layer
        $('#idlewarn').fadeOut('fast'); // hide the warning message
        idleTime = 0;
    });

}); // end document.ready block


// The function that gets called every second.
function timerIncrement() {
    idleTime = idleTime + 1; 

    // if user has been idle for the idlemin time do this - show warning message.
    if (idleTime >= idlemin && idleTime < idlemax) { 

      countdown = (idlemax - idleTime) ; //use a countdown to show user how long they have 
      $('#countdown').html(countdown);

      // Show the warning along with a countdown timer
      if ($('#idlewarn').css('display') != 'block') {

        // Fade in the Popup and add close button
        $('#idlewarn').fadeIn() 

        //Fade in Background
        $('body').append('<div id="fade"></div>'); //Add the fade layer to bottom of the body tag.
        $('#fade').fadeIn(); // Fade in the fade layer 
        return false;
      }

    } else if (idleTime >= idlemax) {
      // User has been idle too long - they've exceeded idlemax time.
      // so take another action
      // in this example we simply send them back to the homepage with a logout flag
      localStorage.clear();
      sessionStorage.clear();
      window.location = '/index.html';
    }

}//end timer increment