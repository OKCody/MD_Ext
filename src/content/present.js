// Call with, toSlides(resize);

console.log("slides");

function toSlides(callback){
  current = 0;
  number = 0;
  // Select all elements whose parent is body
  elements = document.querySelectorAll('body > *');
  deck = document.createElement('BODY');
  slide = document.createElement('DIV');
  for(i=0; i < elements.length; i++){
    if(elements[i].tagName == 'HR'){
      assembleDeck(createSlide);
    }
    else{
      slide.appendChild(elements[i].cloneNode(true));
    }
  }
  window.addEventListener('resize', resize);
  document.addEventListener('keydown', function(event){advance(event)});
  callback();
}

function assembleDeck(callback){
  if(i == (elements.length-1)){
    document.getElementsByTagName('body')[0].replaceWith(deck);
  }
  slide.setAttribute('class', 'slide');
  slide.setAttribute('id', number++);
  deck.setAttribute('style', "height: 100%; overflow: hidden;");
  deck.appendChild(slide);
  callback();
}

function createSlide(){
  if(i != (elements.length-1)){
    slide = document.createElement('DIV');
  }
}

function resize(){
  ratio = 16/9;
  width = window.innerWidth;
  height = width / ratio;
  var slides = document.getElementsByClassName('slide');
  for(i=0; i < slides.length; i++){
	  slides[i].setAttribute('style',
      'height:'+height+';' +
      'width: '+width+';'
    );
  }
  scroll();
}

function advance(event){
  event.preventDefault();
  if(event.code == "ArrowUp" || event.code == "ArrowLeft" || event.code == "Backspace"){
    current--;
    if(current < 0){
      current = (document.getElementsByClassName('slide').length - 1);
    }
    scroll();
  }
  if(event.code == "ArrowDown" || event.code == "ArrowRight" || event.code == "Space"){
    current++;
    if(current > (document.getElementsByClassName('slide').length - 1)){
      current = 0;
    }
    scroll();
  }
}

function scroll(){
  console.log(current);
  document.getElementById(current.toString()).scrollIntoView({block: "start", inline: "nearest"});
}
