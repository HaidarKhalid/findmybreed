// HaidarKhalid

// make the popup of level diffculity chooser unvisable
document.querySelector(".levelDiffcultyPopUp").style = `
  display:none;
`;

// if theres no save game then do one, the number means the highest level the player got to
if (!localStorage.getItem("saveGameLevel")) {
  localStorage.setItem("saveGameLevel", 1);
}

// i need it to search for level options when i want to know for an example how much time until the level 3 hard diffculity to flip
let cardsOptions = [
  [6, 3, 2, 1, 1, 1],
  [8, 4, 3, 2, 2, 2],
  [12, 9, 7, 5, 3, 3],
  [18, 17, 13, 10, 6, 4],
  [24, 20, 18, 14, 9, 5],
  [30, 26, 20, 18, 11, 6],
  [38, 30, 25, 20, 13, 7],
  [44, 38, 32, 28, 15, 8],
  [50, 44, 40, 36, 19, 9],
  [54, 48, 42, 39, 23, 10],
  [56, 50, 47, 43, 26, 11],
  ["cardsQuantity", "easy", "Medium", "Hard", "Hearts", "level"],
];

// html vars
// has the hearts and level number exc...
let topDiv = document.querySelector(".topDiv");
// sfxs
let correctCardSfx;
let winSfx;
let flipCardSfx;
let clockSfx;

// main container to put cards and buttons
let containerEl = document.getElementById("container");

// normal vars
// when its false, that means the cards is visible and you have to wait until its not to play and start flipping
let saveTimeEnd = false;
// if i clicked on a card then it would be flipped, when i click again i dont want it to be flipped
let clicked = false;
// key for twins cards
let firstCardInfo = "";
// all cards that flipped in a round
let cardsChecked = [];
// in this var all the cards in the html would store here
let cards;
// interval for the clock sound that will be repeated every second
let clockSound;
// number of lives remaining before losing
let heartsRemaning;
//   delay time to not flip the cards while the time didnt end
let flipCardsDelay;
// sfx on = true, off = false
let sfxMode = true;

// save cards parameter for "putCards" function
let saveCardsQuantity;
let saveWaitTime;
let saveHearts;
let saveCurrentLevelPlaying;
let saveDifficulty;

//function to put the cards in the container and for the sfx
function putCards(cardsQuantity, waitTime, hearts, thisLevel, difficulty) {
  // if the popups is visiable then hide them
  try {
    document.querySelector(".winOrLosePopUp").style = "display: none;";
  } catch {
    (err) => console.log(err);
  }
  try {
    document.querySelector(".levelDiffcultyPopUp").style = "display: none;";
  } catch {
    (err) => console.log(err);
  }

  // save parameters in the variables to use them outside this function
  saveCardsQuantity = cardsQuantity;
  saveWaitTime = waitTime;
  saveHearts = hearts;
  saveCurrentLevelPlaying = thisLevel;
  saveDifficulty = difficulty;
  heartsRemaning = hearts;
  //put cards in container
  // delete every thing in container first
  containerEl.innerHTML = ``;
  //make the cards in a rows
  containerEl.style = "flex-direction: row;";
  // Put the cards divs on the half length of cardsQuantity parameter to make twins
  for (
    let i = 0;
    i < (cardsQuantity % 2 == 1 ? cardsQuantity + 1 : cardsQuantity);
    i++
  ) {
    containerEl.innerHTML += `<div onclick="check(this)" class="card"></div>`;
  }

  // get all of the cards after putting them in html
  cards = document.querySelectorAll(".card");

  // put the info in the topDiv, like hearts and level number exc...
  topDiv.innerHTML = `
    <h1 class="topH1">Hearts : ${hearts}</h1>
    <h1 onclick="showMainMenu()" class="topName">Find my breed</h1>
    <h3 class='topLevelH3'>Level ${thisLevel}</h3>
    <h2 class='timeRemaining'></h2>
    `;

  // cards that we put a class and img in it
  let cardsUsed = [];
  // unique charecter for wach two cards to make a twins
  let uniqueChar = "a";
  // unique num for each card to know if we clicked that card or not
  let uniqueNum = 0;

  //  put the uniqueNum and uniqueChar in a classes and put the images
  function putTwinsInfo() {
    // get a random cards numbers to get random card from "cards" array
    let randomCardFirst = Math.floor(Math.random() * cards.length);
    let randomCardSecond = Math.floor(Math.random() * cards.length);

    if (
      randomCardFirst == randomCardSecond &&
      cardsUsed.length < cards.length
    ) {
      // if randomCardFirst = randomCardSecond (we need two diffrent guys)
      putTwinsInfo();
    } else if (
      // if the randomCardFirst and secound didnt been used
      cardsUsed.indexOf(randomCardFirst) == -1 &&
      cardsUsed.indexOf(randomCardSecond) == -1 &&
      cardsUsed.length < cards.length
    ) {
      // add the uniqueChar to the two cards to make a twins
      cards[randomCardFirst].classList.add(uniqueChar);
      cards[randomCardSecond].classList.add(uniqueChar);

      // add the image inside the card div to know the twins
      // first card
      cards[
        randomCardFirst
      ].innerHTML = `<img class="catImg" src="media/images/types/${
        uniqueNum + 1
      }.png" alt="cat${uniqueNum + 1}">`;
      // secound card
      cards[
        randomCardSecond
      ].innerHTML = `<img class="catImg" src="media/images/types/${
        uniqueNum + 1
      }.png" alt="cat${uniqueNum + 1}">`;

      // put the cards number inside this array to know we have already used them
      cardsUsed.push(randomCardFirst, randomCardSecond);

      // get a new uniqueChar and new uniqueNum to use them in the next two random cards
      uniqueChar = String.fromCharCode(uniqueChar.charCodeAt() + 1);
      uniqueNum++;

      // repeat until we fill all the info in all the cards
      putTwinsInfo();
    } else if (
      // if any of randomCardFirst or secound have been used then repeat the function to get new ones
      (cardsUsed.indexOf(randomCardFirst) >= 0 ||
        cardsUsed.indexOf(randomCardSecond) >= 0) &&
      cardsUsed.length < cards.length
    ) {
      putTwinsInfo();
    } else if (cardsUsed.length >= cards.length) {
      /*
      if we put all of the info in all of the cards then just put one more class to the cards divs,
      to know that each cards have a unique number, we cant use "uniqueNum" because its for twins only,
      that means if we have 10 cards then the highest "uniqueNum" would be 5
      */
      for (let i in cardsUsed) {
        cards[i].classList.add(i);
      }
    }
  }

  // run the function to put the info once we enter the level
  putTwinsInfo();

  // make it false again in case that we have change it to true and we have started another level
  saveTimeEnd = false;
  clicked = false;
  firstCardInfo = "";
  cardsChecked = [];
  
  // get the html of the sfx (i have put it inside the function because we cant call it without touching anything in the page)
  flipCardSfx = document.querySelector(".flipCardSfx");
  correctCardSfx = document.querySelector(".correctCardSfx");
  winSfx = document.querySelector(".winSfx");
  clockSfx = document.querySelector(".clockSfx");

  // put the reamining time inside the page
  document.querySelector(".timeRemaining").textContent = waitTime + "s";
  
  // Intereval for the clock sound (run every 1 second and change the time in the '.timeRemaining' element)
  clockSound = setInterval(() => {
    // if the sfxMode is true (the sfx in enabled) then show the voice
    if (sfxMode) {
      clockSfx.play();
    }
    document.querySelector(".timeRemaining").textContent = --waitTime + "s";
  }, 1000);


  //delay time to not flip the cards while the time didnt end
  flipCardsDelay = setTimeout(() => {
    // put for each card after the time ends "unflipped" class
    cards.forEach((card) => {
      card.classList.add("unflipped");
      // to know that the time is done
      saveTimeEnd = true;
      // if the sfxMode is true (the sfx in enabled) then show the voice
      if (sfxMode) {
        flipCardSfx.play();
      }
    });
    // stop the clock sfx intereval
    clearInterval(clockSound);
  }, Number(waitTime + "000")); // to convert the secounds to ms
}




// this function will run when clicking on a card (the parameter x will be the card infos)
function check(x) {
  // first if statement to check if the time to remember the cards is done or not
  if (saveTimeEnd) {
    // if there is no card checked before this card and this card didnt been used before then :
    if (!clicked && cardsChecked.indexOf(x.classList.item(1)) == -1) {
      // to save the first card informations
      firstCardInfo = x;

      // to know that there is a card now have been checked
      clicked = true;


      // if current card have i unflipped class then remove it and replace it with flipped
      x.classList.remove("unflipped");
      x.classList.add("flipped");

      // if the sfxMode is true (the sfx in enabled) then show the voice
      if (sfxMode) {
        flipCardSfx.play();
      }

    // if there is a card that have been checked before this card
    } else if (clicked) {
      // if the first card and the second is from the same twins and the player didnt click at the same first card 
      if (
        firstCardInfo.classList.item(1) == x.classList.item(1) &&
        firstCardInfo.classList.item(2) != x.classList.item(2)
      ) {
        // put the first card at the list of checkd cards because its true choise
        cardsChecked.push(firstCardInfo.classList.item(1));
        
        // delete the first card info because we dont have to use it any more
        firstCardInfo = "";
        
        // make the clicked var false to be ready to check another two cards
        clicked = false;
      
        // remove the unflipped and add flipped
        x.classList.remove("unflipped");
        x.classList.add("flipped");

        // if the sfxMode is true (the sfx in enabled) then show the voice
        if (sfxMode) {
          correctCardSfx.play();
        }

      // if they are not from the same twins 
      } else if (
        firstCardInfo.classList.item(1) != x.classList.item(1) &&
        firstCardInfo.classList.item(2) != x.classList.item(2)
      ) {

        // unflip the first card
        firstCardInfo.classList.remove("flipped");
        firstCardInfo.classList.add("unflipped");

        // if the sfxMode is true (the sfx in enabled) then show the voice
        if (sfxMode) {
          flipCardSfx.play();
        }
        
        
        // delete the first card info because we dont have to use it any more
        firstCardInfo = "";
        
        // make the clicked var false to be ready to check another two cards
        clicked = false;

        // if the secound card is not checked before that means he made a mistake then on heart will go
        if (cardsChecked.indexOf(x.classList.item(1)) == -1) {
          heartsRemaning--;
          // refresh the number of hearts
          document.querySelector(
            ".topH1"
          ).textContent = `Hearts : ${heartsRemaning}`;

          // if we have lost all the hearts
          if (heartsRemaning == 0) {
            // reshow the popup with the lose info
            document.querySelector(".winOrLosePopUp").style = "display: flex;";
            document.querySelector(".winOrLosePopUp").innerHTML = `
            <h1>You lost!</h1>
            <div class="winOrLosePopUpButtonsDiv">
              <button onclick="showMainMenu()">Main Manu</button>
              <button onclick='putCards(${saveCardsQuantity}, ${saveWaitTime}, ${saveHearts}, ${saveCurrentLevelPlaying}, "${saveDifficulty}")'>Restart</button>
            `;
          }
        }
      }
    }
  }
  // after finishing all of the cards we should view a popup and save the new level
  if (cardsChecked.length * 2 == cards.length && saveCurrentLevelPlaying < 11) {
    // a short cut for the new level info to make the code more easier
    let coclp = cardsOptions[saveCurrentLevelPlaying];

    // show the popup with the info
    document.querySelector(".winOrLosePopUp").style = "display: flex;";
    document.querySelector(".winOrLosePopUp").innerHTML = `
    <h1>Level completed!</h1>
    <div class="winOrLosePopUpButtonsDiv">
      <button onclick="showMainMenu()">Main Manu</button> 
      <button onclick="putCards(${coclp[0]}, ${
      saveDifficulty == "Easy"
        ? coclp[1]
        : saveDifficulty == "Medium"
        ? coclp[2]
        : saveDifficulty == "Hard"
            ? coclp[3]
            : coclp[1]
    }, ${
      coclp[4]
    }, ${++saveCurrentLevelPlaying},'${saveDifficulty}')">Next level [${saveDifficulty}]</button>
    `;

    if (localStorage.getItem('saveGameLevel') < saveCurrentLevelPlaying){
      localStorage.setItem('saveGameLevel', Number(localStorage.getItem('saveGameLevel')) + 1)
    }



    // you know that
    if (sfxMode) {
      winSfx.play();
    }
  } else if (cardsChecked.length * 2 == cards.length && saveCurrentLevelPlaying >= 11) {
        // show the popup with the info
        document.querySelector(".winOrLosePopUp").style = "display: flex;";
        document.querySelector(".winOrLosePopUp").innerHTML = `
        <h1>Level completed!</h1>
        <div class="winOrLosePopUpButtonsDiv">
          <button onclick="showMainMenu()">Main Manu</button> 
        </div>
        `;
    
        if (localStorage.getItem('saveGameLevel') < saveCurrentLevelPlaying){
          localStorage.setItem('saveGameLevel', Number(localStorage.getItem('saveGameLevel')) + 1)
        }
    
    
    
        // you know that
        if (sfxMode) {
          winSfx.play();
        }
  }
}

/! main menu !/;

function lC(rule, elseStatment, levelNum) {
  return `${
    localStorage.getItem("saveGameLevel") >= levelNum ? rule : elseStatment
  }`;
}

function showLevels() {
  let currentSaveLevel = localStorage.getItem("saveGameLevel");
  containerEl.style = "flex-direction: row;";
  let enablebgcolor = "background: rgba(241, 241, 241, 0.911);";
  let disablebgcolor = "background: rgba(119, 119, 119, 0.662);";

  containerEl.innerHTML = `
  <button onclick="${lC(
    "showLevelDifficulties(6, 3, 2, 1, 1, 1)",
    "return",
    1
  )}" style="${lC(
    enablebgcolor,
    disablebgcolor,
    1
  )}" class="levelBtn">1</button>
  <button onclick="${lC(
    "showLevelDifficulties(8, 4, 3, 2, 2, 2)",
    "return",
    2
  )}"  style="${lC(
    enablebgcolor,
    disablebgcolor,
    2
  )}"  class="levelBtn">2</button>
  <button onclick="${lC(
    "showLevelDifficulties(12, 9, 7, 5, 3, 3)",
    "return",
    3
  )}"  style="${lC(
    enablebgcolor,
    disablebgcolor,
    3
  )}"  class="levelBtn">3</button>
  <button onclick="${lC(
    "showLevelDifficulties(18, 17, 13, 10, 6, 4)",
    "return",
    4
  )}"  style="${lC(
    enablebgcolor,
    disablebgcolor,
    4
  )}"  class="levelBtn">4</button>
  <button onclick="${lC(
    "showLevelDifficulties(24, 20, 18, 14, 9, 5)",
    "return",
    5
  )}"  style="${lC(
    enablebgcolor,
    disablebgcolor,
    5
  )}"  class="levelBtn">5</button>
  <button onclick="${lC(
    "showLevelDifficulties(30, 26, 20, 18, 11, 6)",
    "return",
    6
  )}"  style="${lC(
    enablebgcolor,
    disablebgcolor,
    6
  )}"  class="levelBtn">6</button>
  <button onclick="${lC(
    "showLevelDifficulties(38, 30, 25, 20, 13, 7)",
    "return",
    7
  )}"  style="${lC(
    enablebgcolor,
    disablebgcolor,
    7
  )}"  class="levelBtn">7</button>
  <button onclick="${lC(
    "showLevelDifficulties(44, 38, 32, 28, 15, 8)",
    "return",
    8
  )}"  style="${lC(
    enablebgcolor,
    disablebgcolor,
    8
  )}"  class="levelBtn">8</button>
  <button onclick="${lC(
    "showLevelDifficulties(50, 44, 40, 36, 19, 9)",
    "return",
    9
  )}"  style="${lC(
    enablebgcolor,
    disablebgcolor,
    9
  )}"  class="levelBtn">9</button>
  <button onclick="${lC(
    "showLevelDifficulties(54, 48, 42, 39, 23, 10)",
    "return",
    10
  )}"  style="${lC(
    enablebgcolor,
    disablebgcolor,
    10
  )}"  class="levelBtn">10</button>
  <button onclick="${lC(
    "showLevelDifficulties(56, 50, 47, 43, 26, 11)",
    "return",
    11
  )}"  style="${lC(
    enablebgcolor,
    disablebgcolor,
    11
  )}"  class="levelBtn">11</button>
  `;
}

function showLevelDifficulties(qc, et, mt, ht, h, l) {
  document.querySelector(".levelDiffcultyPopUp").style = `
    display: flex;
  `;

  document.querySelector(".levelDiffcultyPopUp").innerHTML = `
  <div class="topOfLDPU">
      <h1 class="topH1LevelNammer">Level ${l}</h1>
      <button class="hideLDPUBtn" onclick="hideLevelDiffcultyPopUp()">x</button>
  </div>
  <div class="bottomOfLPDU">
      <button onclick="putCards( ${qc} , ${et} , ${h}, ${l}, 'Easy' )" class="difficultyBtn" style="background-color: rgb(3, 216, 3);">Easy</button>
      <button onclick="putCards(  ${qc} , ${mt} , ${h}, ${l}, 'Medium' )" class="difficultyBtn" style="background-color: rgb(216, 141, 3);">Medium</button>
      <button onclick="putCards(  ${qc} , ${ht} , ${h}, ${l}, 'Hard' )" class="difficultyBtn" style="background-color: rgb(202, 0, 0);">Hard</button>
  </div>
  `;
}
function hideLevelDiffcultyPopUp() {
  document.querySelector(".levelDiffcultyPopUp").style = `
  display:flex;
  opacity: 0;
  `;
  setTimeout(() => {
    document.querySelector(".levelDiffcultyPopUp").style = `
  display:none;
  `;
  }, 500);
}

function showMainMenu() {
  try {
    document.querySelector(".winOrLosePopUp").style = "display: none;";
  } catch {
    (err) => console.log(err);
  }
  topDiv.innerHTML = `<h1 onclick="showMainMenu()" class="topName">Find my breed</h1>`;
  containerEl.style = "flex-direction: column;";
  containerEl.innerHTML = `
    <button onclick="showLevels()" class="mainMenuBtn playBtn">Play</button>
    <button onclick='showSettings()' class="mainMenuBtn">Settings</button>
    <a href="https://haidarkhalid.github.io/portfolio" target="_blank" class="mainMenuBtn">Developer</a> 
  `;
  clearInterval(clockSound);
  clearTimeout(flipCardsDelay);
}

let darkLightModeInputValue = 0;
let sfxModeInputValue = 1;
function showSettings() {
  topDiv.innerHTML = `<h1 onclick="showMainMenu()" class="topName">Find my breed</h1>`;
  containerEl.style = "flex-direction: column;";
  containerEl.innerHTML = `    
    <div class="settingDiv">
      <h2>Dark mode</h2>
      <input onchange="darkLightModeFun()" class="rangeInp darkLightModeInp" type="range" min="0" max="1" value="${darkLightModeInputValue}">
    </div>
    <div class="settingDiv">
      <h2>SFX</h2>
      <input onchange="changeSfxMode()" class="rangeInp sfxModeInp" type="range" min="0" max="1" value="${sfxModeInputValue}">
    </div>
    <div class="settingDiv">
      <button onclick="deleteSaveGameFn()" class="deleteSaveGameBtn">Delete save game</button>
    </div>`;
}

/* Dark/Light mode */
let root = document.querySelector(":root");
let rootStyles = getComputedStyle(root);
function darkLightModeFun() {
  if (document.querySelector(".darkLightModeInp").value == 1) {
    darkLightModeInputValue = 1;
    root.style.setProperty("--main", "#272625");
    root.style.setProperty("--secound", "#cbcbcb");
    root.style.setProperty("--textColorMain", "#fff");
    root.style.setProperty("--textColorMainRGBA", "rgba(0, 0, 0,0.5)");
    root.style.setProperty("--blendMode", "soft-light");
  } else {
    darkLightModeInputValue = 0;
    root.style.setProperty("--main", "#fcf3e8");
    root.style.setProperty("--secound", "#fff");
    root.style.setProperty("--textColorMain", "#000");
    root.style.setProperty("--textColorMainRGBA", "rgba(255, 255, 255,0.5)");
    root.style.setProperty("--blendMode", "normal");
  }
}

function changeSfxMode() {
  if (document.querySelector(".sfxModeInp").value == 0) {
    sfxMode = false;
    sfxModeInputValue = 0;
  } else {
    sfxMode = true;
    sfxModeInputValue = 1;
  }
}

function deleteSaveGameFn() {
  if (window.confirm("You are going to delete you'r save game!")) {
    localStorage.setItem("saveGameLevel", 1);
  }
}
