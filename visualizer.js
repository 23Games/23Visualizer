//canvas stuf
var canvas = document.getElementById('visualizer');
var ctx = canvas.getContext('2d');
var width = canvas.width;
var height = canvas.height;
//data
var x, h;                 //x=position of sample h=hight of sample in %
var runing = false ;      //main loop boolean
var sample_w=7;           //sample width
var gap=2;                 //gap betwean samples
var samples=Math.floor(width/(sample_w+gap));   //number ("int") of samples+gaps could fit in canvas
var d_time=16;              //delay betwean iteration of main loop in miliseconds(ms)
var color=0;               //color
var color_setp=Math.floor(360/samples);

//audio magic don't tauch :P
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
//var myAudio = document.querySelector('audio');//audio
var myAudio = document.getElementById('audio');//stream
var pre = document.querySelector('pre');
var myScript = document.querySelector('script');
var source = audioCtx.createMediaElementSource(myAudio);    //audio
//var source = audioCtx.createMediaStreamSource(myAudio);     //stream



var analyser = audioCtx.createAnalyser();
/*analyser.minDecibels = -90;
analyser.maxDecibels = -10;
analyser.smoothingTimeConstant = 0.85;*/

analyser.fftSize = 512;
var bufferLength = analyser.frequencyBinCount;
  console.log(bufferLength);
var dataArray = new Uint8Array(bufferLength);
source.connect(analyser);
analyser.connect(audioCtx.destination);




function play_pause(){
  if(runing){
    runing=false;
    myAudio.pause()
  } else{
    runing=true;
    myAudio.play()
  }
  loop();
}

function loop(){
  if(runing){
    analyser.getByteFrequencyData(dataArray);
    //for(var i = 0; i < bufferLength; i++) {
      //console.log(dataArray[i]);
      test();
      setTimeout(loop, d_time);
    //  }
    }
  }

function test(){
  reset_();
  ctx.fillStyle = "grey";
  ctx.fillRect(0, 0, width, height);
  for(var i=0;i<samples;i++){
    rec_chroma(i*(sample_w+gap),Math.floor(dataArray[i]/255*100),i);
  }
}

function rec(x,h){
  ctx.fillStyle = "white";
  ctx.fillRect(x, height/2, sample_w, -height/2*h/100);
  ctx.fillRect(x, height/2, sample_w, height/2*h/100);
}

function reset_(){
  ctx.clearRect(0, 0, width, height);
}
function rec_chroma(x,h,i){
  ctx.fillStyle = ("hsl("+i.toString()+", 100%, 50%)");
  ctx.fillRect(x, height/2, sample_w, -height/2*h/100);
  ctx.fillStyle = ("hsl("+i.toString()+", 100%, 25%)");
  ctx.fillRect(x, height/2, sample_w, height/2*h/100);
  //color=color_rec(color);
}
function color_rec(a){
  if(a<samples){

    a+=color_setp;
  } else {
    a=0;
  }
  return a;
}
