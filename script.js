var santa = document.getElementById("santa");
var GAME_TIME = 100; //ms
var check_dead = true;
var game_over = false;
var health = 100;
var level = 1;
var target_score = 400;
var OBJECT_GROUND = 800;
var nirtos = 300;

var theme_music = new Audio("src/audio/game-theme.mp3");
theme_music.loop = true;
theme_music.volume = 0.1;
theme_music.play();

var h_score_panel = document.getElementById("high-score-title");
var h_score_val = document.getElementById("high-score");
const load_data = Load();
if(load_data.key2 > 0){
  h_score_panel.style.marginTop = "3vh";
  h_score_val.innerHTML = load_data.key1 + ": "+load_data.key2;
}

if (s_w_id == 0) {
  s_w_id = setInterval(updateScore, GAME_TIME);
}
check_dead = true;

var started = false;
function OnStart() {

  setInterval(spawn_energy, 1000 * 5);
  setInterval(move_energy, GAME_TIME);
}
var n2 = document.getElementById("nitros");
function OnUpdate() {
    n2.innerHTML = ":"+nirtos;

  if (new_score >= target_score && lvl_updated == false) {
    update_LVL();
    target_score = target_score * 2;
  }
  requestAnimationFrame(OnUpdate);
}

OnUpdate();
function KeyCheck(event) {
  if(!disable_keys){
  if (started == false) {
    OnStart();
    started = true;
  }
  if (event.which == 27) {
    home();
  }
  if (event.which == 13) {
    if (run_w_id == 0) {
      run_sound.play();
      run_w_id = setInterval(run, GAME_TIME);
    }
  }
  if(event.which == 32 && nos_playing){
    clearInterval(n_w_id);
    jump();
    santa.style.marginLeft = "0px";
        nos_playing = false;
        obsticle_speed = 20;
        n_sound.pause();
        n_sound.currentTime = 0;
        jump_w_id = 0;
        jump_w_id = setInterval(jump, GAME_TIME);
        if(g_n_w_id == 0 && nirtos < 300){
            g_n_w_id = setInterval(gain_nitros, gain_delay);
        }
        if(nitro_g_w_id == 0){
            nitro_g_w_id = setInterval(createNitro, GAME_TIME);
        }
        if(nitro_m_w_id == 0){
            nitro_m_w_id = setInterval(moveNitro, GAME_TIME);
        }
        clearInterval(n_w_id);
        n_w_id = 0;

    setTimeout(function(){
        n_w_id = 0;
    }, 100);
  }
  if (event.which == 13 && game_over) {
    location.replace("index.html");
  }
  if (event.which == 32 && !game_over && !nos_playing) {
    clearInterval(run_w_id);
    run_w_id = 0;
    if (jump_w_id == 0) {
      jump_w_id = setInterval(jump, GAME_TIME);
      jump_sound.play();
    }
  }
  if (event.which == 32 && game_over) {
    re();
  }
  if (event.which == 13 && on_continue) {
    Continue();
    on_continue = false;
  }
}else{
  if(event.which == 13){
   SubmitScore();
  }
}

}
//#######################RUN_ANIM####################
var run_sound = new Audio("src/audio/run.mp3");
run_sound.loop = true;

var run_w_id = 0;
var run_anim_index = 1;
function run() {
  if (s_w_id == 0) {
    s_w_id = setInterval(updateScore, GAME_TIME);
  }
  if (block_g_w_id == 0) {
    block_g_w_id = setInterval(createBlock, GAME_TIME);
  }
  if (block_m_w_id == 0) {
    //Move Block
    block_m_w_id = setInterval(moveBlock, GAME_TIME);
  }
  if (bg_w_id == 0) {
    bg_w_id = setInterval(moveBG, GAME_TIME);
  }

  if (run_anim_index == 12) {
    run_anim_index = 1;
  }
  santa.src = "src/run/Run (" + run_anim_index + ").png";
  run_anim_index++;
}

//#######################JUMP_ANIM####################
var jump_sound = new Audio("src/audio/jump.mp3");

var jump_w_id = 0;
var jump_anim_index = 1;
var ground_level = 650;
function jump() {
  clearInterval(s_w_id);
  s_w_id = 0;
  run_sound.pause();
  if (jump_anim_index == 17) {
    clearInterval(jump_w_id);
    if (run_w_id == 0) {
      run_w_id = setInterval(run, GAME_TIME);
      run_sound.play();
    }
    if (s_w_id == 0) {
      s_w_id = setInterval(updateScore, GAME_TIME);
    }
    jump_w_id = 0;

    jump_anim_index = 1;
    check_dead = true;
  }
  santa.src = "src/jump/Jump (" + jump_anim_index + ").png";
  if (jump_anim_index <= 7) {
    check_dead = true;
    ground_level -= 40;
    santa.style.marginTop = ground_level + "px";
  }
  if (jump_anim_index == 16) {
    check_dead = false;
    ground_level = OBJECT_GROUND + 40;
    santa.style.marginTop = ground_level + "px";
  }

  jump_anim_index++;
}
//#######################BACKGROUND_MOVE####################
var bg_w_id = 0;
var bg_x = 0;
var bg = document.getElementById("background");
function moveBG() {
  bg_x -= 20;
  bg.style.backgroundPositionX = bg_x + "px";
}

//#######################BLOCK_GENERATE####################
var block_g_w_id = 0;
var block_count = 0;
var block_margin_left = 1900;
function createBlock() {
  var new_block = document.createElement("div");
  new_block.id = "block" + block_count;
  new_block.className = "block";
  block_count++;

  var gap = Math.random() * (500 - 100) + 100;

  block_margin_left += gap;
  var block_index = Math.floor(Math.random() * (4 - 1 + 1) + 1);
  new_block.style.backgroundImage =
    "url('src/blocks/block" + block_index + ".png')";
  if (block_index == 2 || block_index == 4) {
    new_block.style.width = "120px";
  }
  new_block.style.marginLeft = block_margin_left + "px";
  //Set parent
  document.getElementById("background").appendChild(new_block);
}

//#######################BLOCK_MOVE####################
var block_m_w_id = 0;
var give_damage = 5;
var damage_multiply = 1;
var hurt = new Audio("src/audio/hurt.mp3");
var can_give_damage = true;
var obsticle_speed = 20;
function moveBlock() {
  for (var i = 0; i <= block_count; i++) {
    var i_block = document.getElementById("block" + i);
    var i_block_margin_left = parseInt(i_block.style.marginLeft);
    var i_block_X = i_block_margin_left - obsticle_speed;
    i_block.style.marginLeft = i_block_X + "px";
    if (
      i_block_margin_left <= 75 &&
      i_block_margin_left >= 5 &&
      parseInt(santa.style.marginTop) > OBJECT_GROUND - 100 &&
      check_dead
    ) {
      //console.log(santa.style.marginTop);
      if (can_give_damage == true) {
        can_give_damage = false;
        health -= give_damage * damage_multiply;
        showHurt(give_damage * damage_multiply);
        document.getElementById("health").innerHTML = "❤️:  " + health;
        hurt.play();
        santa.src = "src/dead/Dead (9).png";
        setTimeout(function () {
          can_give_damage = true;
        }, 300);
      }
      if (health <= 0) {
        if (health < 0) {
          health = 0;
          document.getElementById("health").innerHTML = "❤️:  " + health;
        }
        ClearAllWorks();
        if (dead_w_id == 0) {
          dead_w_id = setInterval(Dead, 100);
        }
        Dead();
        dead_sound.play();
        //i_block.remove();
      }

      //i_block.style.visibility = "hidden";
    }
    if(i_block_margin_left <= 0){
      i_block.style.visibility = "hidden";
    }
  }
}
//#######################UPDATE-SCORE####################
var s_w_id = 0;
var score = document.getElementById("score");
var new_score = 0;
function updateScore() {
  new_score++;
  score.innerHTML = "🪙: " + new_score + "/" + target_score;
}

//#####################CLEAR-JOBS########################
function ClearAllWorks() {
  clearInterval(run_w_id); //run
  run_sound.pause();
  clearInterval(jump_w_id); //jump
  clearInterval(s_w_id); //score
  clearInterval(bg_w_id); //background
  clearInterval(block_g_w_id); //create block
  clearInterval(block_m_w_id); //move block
  clearInterval(move_energy);
  clearInterval(nitro_g_w_id);
  clearInterval(nitro_m_w_id);
  nitro_g_w_id = 0;
  nitro_m_w_id = 0;
  run_w_id = 0;
  jump_w_id = 0;
  s_w_id = 0;
  bg_w_id = 0;
  block_g_w_id = 0;
  block_m_w_id = 0;
  move_energy = 0;
}

//#####################DEAD########################

var dead_sound = new Audio("src/audio/death.wav");

var dead_w_id = 0;
var dead_ainm_index = 1;
var disable_keys = false;
function Dead() {
  if (dead_ainm_index == 17) {
    dead_ainm_index = 16;
    santa.style.marginTop = OBJECT_GROUND + "px";
    clearInterval(dead_w_id);
    dead_w_id = -1;
    document.getElementById("game-over").style.visibility = "visible";
    document.getElementById("end-score").innerHTML = score.innerHTML;
    if(Load().key2 < new_score){
      var score_panel = document.getElementById("h-s-p");
      score_panel.style.height = "250px";
      score_panel.style.opacity = "1";
      disable_keys= true;
    }
    game_over = true;
  }

  santa.src = "src/dead/Dead (" + dead_ainm_index + ").png";
  dead_ainm_index++;
}
  function removeSpaces(inputString) {
    const stringWithoutSpaces = inputString.replace(/\s/g, "");
    return stringWithoutSpaces.toUpperCase();
  }
var name_in = document.getElementById("name-input").value;
document.getElementById("name-input").addEventListener("input", function() {
  this.value = this.value.toUpperCase();
  name_in = this.value.toUpperCase();
});
function SubmitScore(){
  
  if(name_in == null || removeSpaces(name_in) == null || removeSpaces(name_in) == ""){
    var error_panel = document.getElementById("error-msg");
    error_panel.innerHTML = "Error: Name input is Empty!";
    error_panel.style.opacity = 1;
    setTimeout(function(){
      error_panel.style.opacity = 0;
    }, 400);
  }
  else {
    Save(name_in, new_score);
    re();
    }
}

//#####################RELOAD########################
function re() {
  location.reload();
}

//#####################HEALTH-UP########################
var energy_up_count = 0;
function spawn_energy() {
  if (health < 100) {
    var new_energy_up = document.createElement("div");
    new_energy_up.id = "energy" + energy_up_count;
    new_energy_up.className = "energy";
    energy_up_count++;

    var gap = Math.floor(Math.random() * (5000 - 3000 + 3000) + 3000) + 2000;

    new_energy_up.style.marginLeft = gap + "px";
    //Set parent
    document.getElementById("background").appendChild(new_energy_up);
  }
}

//#####################HEALTH-MOVE########################
var give_energy = 10;
var can_give_energy = true;
function move_energy() {
  for (i = 0; i <= energy_up_count; i++) {
    var moving_energy = document.getElementById("energy" + i);
    var energy_margin_left = parseInt(moving_energy.style.marginLeft);
    energy_margin_left -= 20;
    moving_energy.style.marginLeft = energy_margin_left + "px";

    if (
      energy_margin_left <= 75 &&
      energy_margin_left >= 5 &&
      parseInt(santa.style.marginTop) < OBJECT_GROUND - 100
    ) {
      //console.log(santa.style.marginTop);
      if (can_give_energy) {
        can_give_energy = false;
        if (health < 100) {
          health += give_energy;
          document.getElementById("health").innerHTML = "❤️:  " + health;
        }
        if (health > 100) {
          health = 100;
        }
        showHeal(give_energy);
        setTimeout(() => {
          can_give_energy = true;
        }, 300);
      }
      moving_energy.style.visibility = "hidden";
    }
  }
}

function showHurt(hurt_val) {
  var hurt_panel = document.getElementById("hurt");
  hurt_panel.style.opacity = "0.45";
  hurt_panel.innerHTML = "-" + hurt_val + "❤️";
  setTimeout(function () {
    hurt_panel.style.opacity = "0";
  }, 1000);
}
var power_up_sound = new Audio("src/audio/power-up.mp3");

function showHeal(heal_val) {
  power_up_sound.play();
  var heal_panel = document.getElementById("heal");
  heal_panel.style.opacity = "0.4";
  heal_panel.innerHTML = "+" + heal_val + "❤️";
  setTimeout(function () {
    heal_panel.style.opacity = "0";
  }, 1000);
}
var level_indicator = document.getElementById("level");
var lvl_text = document.getElementById("panel-lvl");
var panel_lvl = document.getElementById("lvl-panel");
var lvl_updated = false;
 function update_LVL() {
  level++;
  give_damage += 5;
  level_indicator.innerHTML = "LVL: " + level;

  //ClearAllWorks();
  panel_lvl.style.opacity = 1;
  lvl_text.innerHTML = "LVL: " + level;
  lvl_updated = true;
  GAME_TIME -= 5;
  on_continue = true;
  ClearAndRegenerateBlocks(); 
  ClearAllWorks();
}
var on_continue = false;
function Continue() {
  document.getElementById("lvl-panel").style.opacity = 0;
  

  lvl_updated = false;
  //lvl_updated=false;
  on_continue = false;
}

function ClearAndRegenerateBlocks() {
  for (var i = 0; i < block_count; i++) {
    var block_del = document.getElementById("block" + i);
    if (block_del) {
      block_del.remove();
      console.log("Removed block", i);
    }
  }

  // Clear intervals related to blocks
  clearInterval(block_g_w_id);
  clearInterval(block_m_w_id);
  block_g_w_id = 0;
  block_m_w_id = 0;
  block_count = 0;
  block_margin_left = 2000;

  // Regenerate blocks
  block_g_w_id = setInterval(createBlock, GAME_TIME);
  block_m_w_id = setInterval(moveBlock, GAME_TIME);

  
}

function home() {
  document.getElementById("fade").className = "fade-in";
  setTimeout(function () {
    location.replace("index.html");
  }, 2000);
}

//########################NITROS###########################

document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && n_w_id ==0 ) {
        n_w_id = setInterval(Nitro);
    //clearInterval(n_w_id);
    }
});
var n_w_id = 0;
var n_sound = new Audio("src/audio/nitro.mp3");
var nos_playing = false;
var enable_nos = true;
function Nitro(){
    if(nirtos > 0 && enable_nos){
        n_sound.play();
        nos_playing = true;
        clearInterval(jump_w_id);
        santa.marginTop = OBJECT_GROUND -100+"px";
        obsticle_speed = 35;
        santa.src="src/slide/Slide (4).png";
        //santa.style.backgroundColor = "rgba(0, 0, 255, 0.179)";
        santa.style.marginLeft = "100px";
        nirtos--;
        //new_score += 0.5;
        //score.innerHTML = "🪙: "+new_score;
    }
    else if(nirtos <= 0){
        santa.style.marginLeft = "0px";
        nos_playing = false;
        obsticle_speed = 20;
        n_sound.pause();
        n_sound.currentTime = 0;
        jump_w_id = 0;
        jump_w_id = setInterval(jump, GAME_TIME);
        if(g_n_w_id == 0 && nirtos <300){
            g_n_w_id = setInterval(gain_nitros, gain_delay);
        }
        if(nitro_g_w_id == 0){
            nitro_g_w_id = setInterval(createNitro, GAME_TIME);
        }
        if(nitro_m_w_id == 0){
            nitro_m_w_id = setInterval(moveNitro, GAME_TIME);
        }
        clearInterval(n_w_id);
        n_w_id = 0;
    }

}

var g_n_w_id = 0;
var gain_per = 50;
var gain_delay = 10000;

function gain_nitros(){
    if(nirtos < 1000){
        nirtos+= gain_per;
        showNitro(gain_per,0.2);
    }
    if(nirtos == 1000){
        clearInterval(g_n_w_id);
        g_n_w_id= 0;
    }
}



var nitro_g_w_id = 0;
var nitro_count = 0;
var nitro_margin_left = 2000;
function createNitro() {
  var new_block = document.createElement("div");
  new_block.id = "nitro" + block_count;
  new_block.className = "nitro";
  nitro_count++;

  var gap = Math.random() * (2000 - 1000) + 1000;

  block_margin_left += gap;
  
  new_block.style.backgroundImage = "url('src/nitro-pickable.png')";
  
  new_block.style.marginLeft = block_margin_left + "px";
  //Set parent
  document.getElementById("background").appendChild(new_block);
}

//#######################BLOCK_MOVE####################
var nitro_m_w_id = 0;
var give_nitro = 100;
var can_give_nitro = true;
var nitro_up_sound = new Audio("src/audio/nitro-up.mp3");
function moveNitro() {
  for (var i = 0; i <= nitro_count; i++) {
    var i_block = document.getElementById("nitro" + i);
    var i_block_margin_left = parseInt(i_block.style.marginLeft);
    var i_block_X = i_block_margin_left - 20;
    i_block.style.marginLeft = i_block_X + "px";
    if (i_block_margin_left <= 75 && i_block_margin_left >= 5 &&parseInt(santa.style.marginTop) < OBJECT_GROUND - 100) {
      //console.log(santa.style.marginTop);
      if (can_give_nitro == true) {
        can_give_nitro = false;
        nirtos += give_nitro;
        showNitro(give_nitro, 0.4);
        setTimeout(function () {
          can_give_nitro = true;
        }, 300);
      }

      i_block.style.visibility = "hidden";
    }
  }
}

function showNitro(nitro_val, opacity){
    nitro_up_sound.play();
    var nos = document.getElementById("nos");
    nos.innerHTML = "+"+nitro_val+"🔥";
    nos.style.opacity = opacity;
    setTimeout(function(){
        nos.style.opacity=0;
    }, 1000);
}

