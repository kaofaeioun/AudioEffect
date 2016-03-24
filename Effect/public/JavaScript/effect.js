var context;
try {
  context = new (window.AudioContext || window.webkitAudioContext)();
} catch(e) {
    throw new Error('The Web Audio API is unavailable');
}


window.addEventListener('load',function() {
  var circle = document.getElementById('circle');

  // 加上audio元件
  var audio = new Audio();
  audio.src = 'testing.mp3';
  audio.controls = true;
  audio.preload = true;
  document.body.appendChild(audio);

  audio.addEventListener('canplaythrough',function() {
  var node = context.createMediaElementSource(audio);
  var processor = context.createScriptProcessor(2048,1,1);

  processor.onaudioprocess = processAudio;

  node.connect(processor);
  processor.connect(context.destination);
  });
});

  function processAudio(e) {
		var buffer = e.inputBuffer.getChannelData(0);
		var out = e.outputBuffer.getChannelData(0);
		var amp = 0;
		for (var i = 0; i < buffer.length; i++) {
		    var loud = Math.abs(buffer[i]);
		    if(loud > amp) {
				  amp = loud;
		      }
		    out[i] = buffer[i];
		}

		var color = Math.round(amp * 255);
		color = 'rgb(' + color + ',' + color + ',' + color + ')';
		d3.select("#circle").attr("r",20+(amp*50)).attr("fill",color);
  }
