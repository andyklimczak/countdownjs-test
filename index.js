var countdown = require('countdown');

function update() {
  var ts = countdown(new Date(2000, 0, 1));
  countElement = document.getElementById("count");
  countElement.innerHTML = ts.toString();

  setTimeout(function() {
    requestAnimationFrame(update);
  }, 1000); //delay
}
update();
