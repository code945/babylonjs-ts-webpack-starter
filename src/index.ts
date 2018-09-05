import Game from './scripts/game'  
import './style/index.less';

window.addEventListener("DOMContentLoaded",()=>{
  let game = new Game('renderCanvas'); 
  // Create the scene.
  game.init();
 
})