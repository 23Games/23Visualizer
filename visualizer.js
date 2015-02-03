//canvas stuf
var canvas = document.getElementById('visualizer');
var ctx = canvas.getContext('2d');

//width & height
var width = window.innerWidth;
var height = Math.floor(window.innerHeight/1.7);//1.7 ratio aspect
canvas.width = width;                           //set canvas width
canvas.height = height;                         //set canvas height

//debug
/*console.log(width);
console.log(height);*/

//audio magic don't touch :P
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
//var myAudio = document.querySelector('audio');            //no idea
var myAudio = document.getElementById('audio');             //what is deffrence in these two lines funtioning
var pre = document.querySelector('pre');
var myScript = document.querySelector('script');
var source = audioCtx.createMediaElementSource(myAudio);    //audio and stream audio
var audiosrc=audio.src;
var analyser = audioCtx.createAnalyser();
//soffting curves
/*analyser.minDecibels = -90;
analyser.maxDecibels = -10;
analyser.smoothingTimeConstant = 0.85;*/
analyser.fftSize = 256;                        //analyser.fftSize/2==bufferLength
var bufferLength = analyser.frequencyBinCount; //bufferLength==analyser.fftSize()/2
  console.log(bufferLength);//debug
var dataArray = new Uint8Array(bufferLength);
source.connect(analyser);
analyser.connect(audioCtx.destination);
//end of audio magic

//data
var samples=bufferLength;   //number ("int") of samples+gaps could fit in canvas
var x, h;                                       //x=position of sample ;h=hight of sample in %
var runing = false ;                            //main loop boolean
var gap=2;                                      //gap betwean samples
var sample_w=Math.floor((width-((bufferLength-1)*gap))/bufferLength);                                 //sample width


var d_time=16;                                  //delay betwean iteration of main loop in miliseconds(ms)
var color_setp=20;//Math.floor(360/samples);    //steps color not in use now
var bgcolor="#15151C";                          //color of background canvas

function play_pause(){
  if(runing){
    runing=false;
    myAudio.pause();
	  myAudio.src='';          //stop buforing content usable in stream
  } else{
    runing=true;
	  myAudio.src=audiosrc;    //start buforing content usable in stream
    myAudio.play();
  }
  loop();
}

function loop(){
  if(runing){
    analyser.getByteFrequencyData(dataArray);
    frame();
    setTimeout(loop, d_time);   //shoud be done be request.draw.call
    }
  }

function frame(){
  reset_(); //clear scren
  /* //manual clear scren
  ctx.fillStyle = bgcolor;
  ctx.fillRect(0, 0, width, height);*/
  for(var i=0;i<samples;i++){
    rec_chroma(i*(sample_w+gap),Math.floor(dataArray[i]/255*100),i);
  }
}

function rec(x,h){              //draw rectangle; x-position on x axis; h-height of bar in %
  ctx.fillStyle = "white";      //bar color
  var rec_h=height/2*h/100;     //rec_h==minmal height of bar
  if(rec_h==0){
    rec_h=5;
  }
  ctx.fillRect(x, height/2, sample_w, -rec_h);
  ctx.fillRect(x, height/2, sample_w, rec_h);
}

function reset_(){              //clear scren
  ctx.clearRect(0, 0, width, height);
}
function rec_chroma(x,h,i){     //draw rectangle; x-position on x axis; h-height of bar in %; i bar indeks used to make chroma bars
  var rec_h=height/2*h/100;     //rec_h==minmal height of bar
  if(rec_h==0){
    rec_h=1;
  }
  ctx.fillStyle = ("hsl("+i.toString()+", 100%, 50%)");
  ctx.fillRect(x, height/2, sample_w, -rec_h);
  ctx.fillStyle = ("hsl("+i.toString()+", 100%, 25%)");
  ctx.fillRect(x, height/2, sample_w, rec_h);
}
