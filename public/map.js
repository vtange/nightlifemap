document.addEventListener("DOMContentLoaded", function() {
	
	//init map
  var map = L.map('map').setView([52.45,13.4], 9);

  //layer 1
  var toolserver = L.tileLayer('http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png').addTo(map);

  //layer 2
  var stamen = L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {attribution: 'Add some attributes here!'}).addTo(map);

  //layer control
  var baseLayers = {"stamen": stamen, "toolserver-mapnik":toolserver};
  L.control.layers(baseLayers).addTo(map);
	
});