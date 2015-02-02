 //canvas stuf
     var canvas = document.getElementById('visualizer');
     var ctx = canvas.getContext('2d');
     var width = canvas.width;
     var height = canvas.height;
     //data
     var x, h;                 //x=position of sample h=hight of sample in %
     var runing = false ;      //main loop boolean
     var sample_w=15;           //sample width
     var gap=5;                 //gap betwean samples
     var samples=Math.floor(width/(sample_w+gap));   //number ("int") of samples+gaps could fit in canvas
     var d_time=16;              //delay betwean iteration of main loop in miliseconds(ms)
     var color=0; //color

     //audio magic don't tauch :P
     var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
     var myAudio = document.querySelector('audio');//audio
     //var myAudio = document.getElementById('audio');//stream
     var pre = document.querySelector('pre');
     var myScript = document.querySelector('script');
     var source = audioCtx.createMediaElementSource(myAudio);    //audio
     //var source = audioCtx.createMediaStreamSource(myAudio);     //stream



     var analyser = audioCtx.createAnalyser();
     /*
     //audio smufer
     analyser.minDecibels = -90;
     analyser.maxDecibels = -10;
     analyser.smoothingTimeConstant = 0.85;*/

     analyser.fftSize = 256;
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
         for(var i = 0; i < bufferLength; i++) {
           //console.log(dataArray[i]);
           test();
           setTimeout(loop, 16);
           }
         }
       }

     function test(){
       reset_();
       ctx.fillStyle = "grey";
       ctx.fillRect(0, 0, width, height);
       for(var i=0;i<samples;i++){
         rec_chroma(i*(sample_w+gap),Math.floor(dataArray[i]/255*100));
       }
     }

/*function rec(x,h){
  ctx.fillStyle = ("hsl("+color.toString()+", 100%, 50%)");
  ctx.fillRect(x, height/2, sample_w, -height/2*h/100);
  ctx.fillRect(x, height/2, sample_w, height/2*h/100);
  color=color_rec(color);
  //console.log(color.toString());
}*/

     function rec_chroma(x,h){
       ctx.fillStyle = ("hsl("+color.toString()+", 100%, 50%)");
       ctx.fillRect(x, height, sample_w, -height*h/100);
       color=color_rec(color);
     }

     function reset_(){
       ctx.clearRect(0, 0, width, height);
     }
     function color_rec(a){
       if(a<360){
         a+=5;
       } else {
         a=0;
       }
       return a;
     }

     /*context.rect(15, 300, 10, -100);
     context.fillStyle = 'red';
     context.fill();*/