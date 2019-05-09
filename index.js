// ***************************************
// declare constants needed
// ***************************************
const gameContainer = document.querySelector('#game-container')
const hiScoreBtn = document.querySelector('#hi-score-btn')
const hiScoreTbl = document.querySelector('#hi-score-table')
const newUserForm = document.querySelector('#create-username')
const scoresBody = document.querySelector('#hi-score-body')
const newUser = document.querySelector('#user')
const userDifficultySelect = document.querySelector('#user-diffculty')
const currentPlayer = document.querySelector('#current-player')
const logOutBtn = document.querySelector('#log-out-btn')
const startGameBtn = document.querySelector('#game-start-btn')
const gameScore = document.querySelector('#game-score')
const restartGameBtn = document.querySelector('#game-restart-btn')
const myStatsBtn = document.querySelector('#my-stats-btn')

let gameActive = false;
let allowKeyPress = false;
let loggedInUser;
let keySequenceArray = [];
let currentScore = 0
let usersDifficulty;

let currentPlayerId;
let time = document.getElementById('time')
let seconds
let minutes = 0;
let numOfCards
let correctLine = 0;
let delaySeconds;
let consecIndex

// let t;
// *****************************************
// end of delcaration
// ******************************************
// Start of all declared function that will be called
// *****************************************

let postGameScore = () => {
    fetch('http://localhost:3000/api/v1/newgame', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            difficulty: difficulty,
            user_id: currentPlayerId,
            score: currentScore
        })
    })
}

//changes delaySeconds based on user input, and starting cards
function gameSettings(){
  switch (userDifficultySelect.value) {
      case "Easy":
          numOfCards = 2
          delaySeconds = 2000
          break;

      case "Intermediate":
          numOfCards = 3
          delaySeconds = 2000
          break;

      case "Hard":
          numOfCards = 4
          delaySeconds = 2000
          break;

      default:
          numOfCards = 2
          delaySeconds = 1000
          break;

  }
}

function subtract() {
    // seconds--;
    if (seconds > 0) {
        seconds--;
        // return

        time.innerHTML = (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "0") + ":" + (seconds > 9 ? seconds : "0" + seconds);
        timer();
    }
    else if (seconds === 0) {
        allowKeyPress = false
        gameActive = false
        time.innerHTML = ""
        time.innerText = "Game Over!!"
        postGameScore();
    }
}

function timer() {
    t = setTimeout(subtract, 1000);
}

//function to render random sequence
const renderSequence = function () {
    // keySequenceArray.forEach(num => {

    for (p = 0; p < keySequenceArray.length; p++) {
        let arrow;
        switch (keySequenceArray[p]) {
            case 37:
                arrow = "fa-arrow-alt-circle-left"

                break;
            case 38:
                arrow = "fa-arrow-alt-circle-up"

                break;

            case 39:
                arrow = "fa-arrow-alt-circle-right"

                break;

            case 40:
                arrow = "fa-arrow-alt-circle-down"

                break;

            default:

                break;
        }
        gameContainer.innerHTML += `
            <div id='${p}' class="letter-tile">
            <i class="far ${arrow} fa-lg "></i>
            </div>
            `
    }
}

const startGame = () =>{
  seconds = 12
  gameScore.classList.remove('hidden')
  time.classList.remove('hidden')
  startGameBtn.classList.add('hidden')
  rando(numOfCards)
  console.log(keySequenceArray)
  // load sequence
  displaySequence()
  // checkUserInput()
  timer()
}

// call hi-score from database
const getHiScores = () => {
    fetch('http://localhost:3000/api/v1/games')
        .then(res => res.json())
        .then(allGames => {
            // console.log(allGames)

            // all game objects from database
            allGames.forEach(game => {
                // for each player that played create a table row
                const playerHiscorreRow = document.createElement('tr')
                playerHiscorreRow.innerHTML = ``
                // add inform wihtin that table row
                scoresBody.innerHTML += `
               <td> ${game.user.username}</td>
               <td> ${game.difficulty}</td>
               <td> ${game.high_score}</td>
            `
                // hiScoreTbl.appendChild(playerHiscorreRow)
            });
        })
}


//random arrow generator
const rando = (x) => {
    for (let index = 0; index < x; index++) {
        keySequenceArray.push(Math.floor(Math.random() * 4) + 37)
    }
}

//shows the key sequence
const displaySequence = () => {
    allowKeyPress = false
    renderSequence()
    if (seconds > (delaySeconds/1000))
        setTimeout(() => {
            const letterTiles = document.querySelectorAll('.letter-tile')
            // debugge
            letterTiles.forEach(
                kid => {

                    kid.children[0].classList.remove('fa-arrow-alt-circle-left', 'fa-arrow-alt-circle-right',
                        'fa-arrow-alt-circle-up', 'fa-arrow-alt-circle-down', 'far')

                    kid.children[0].classList.add('fas', 'fa-question')
                    allowKeyPress = true
                }
            )

        }, delaySeconds);
}

//user input conditions
const checkUserInput = () => {
    // listening for user input
    consecIndex = 0
    document.addEventListener('keydown', e => {
        if (allowKeyPress === true) {
            if (e.keyCode === keySequenceArray[0]) {
                console.log('correct', e.key.slice(5).toLowerCase())

                gameContainer.children[consecIndex].children[0].classList.remove(`fa-arrow-alt-circle-${e.key.slice(5).toLowerCase()}`, 'far', 'fas', 'fa-question')

                gameContainer.children[consecIndex].children[0].classList.add('fa-check', 'fas', 'green')
                console.log("wtf")
                ++consecIndex;
                keySequenceArray.shift()
                // try to have last check mark display
                // setTimeout(() => {}, 5000)
                if (keySequenceArray.length === 0 && seconds !== 0) {
                    currentScore += 100
                    gameScore.innerText = currentScore
                    consecIndex = 0
                    rando(numOfCards)
                    gameContainer.innerHTML = ''
                    displaySequence()
                    ++correctLine
                    if ((correctLine%4) === 0) {
                        ++numOfCards
                    }

                }
            } else {
                console.log('smh first',keySequenceArray[0])
                console.log('my keyyyyy', e.keyCode)
                console.log("whole thing",keySequenceArray)
                keySequenceArray = []
                consecIndex = 0
                rando(numOfCards)
                gameContainer.innerHTML = ''
                displaySequence()
                console.log(currentScore, keySequenceArray)
            }
        }
    })
}

// function gameTimer()
// *****************************************
// end of delcaration
// ******************************************

// trying to create username and a game instance at the same time....
newUserForm.addEventListener('submit', (e) => {
    e.preventDefault()

    difficulty = userDifficultySelect.value

    fetch('http://localhost:3000/api/v1/games', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({

                username: newUser.value.toUpperCase(),
                // difficulty: userDifficultySelect.value
            }),
        })
        .then(res => res.json())
        .then(player => {
            // console.log(player)

            loggedInUser = player.username
            newUserForm.classList.add('hidden');

            currentPlayer.innerHTML = `
            <p> current player is ${loggedInUser}</p>

            <h3>${difficulty} MODE</h3>
            `
            currentPlayerId = player.id
        })
    gameSettings()
    newUserForm.reset()
    logOutBtn.classList.remove("hidden")
    startGameBtn.classList.remove("hidden")
    myStatsBtn.classList.remove("hidden")
})

// refactor for post request to db
// const addUser = () =>{
// }

// logout and clear current user
logOutBtn.addEventListener('click', (e) => {
    newUserForm.classList.remove('hidden');
    loggedInUser = "";
    currentPlayer.innerHTML = ""
    logOutBtn.classList.add("hidden")
    startGameBtn.classList.add("hidden")
    myStatsBtn.classList.add("hidden")
})

// toggle hiscore menu when hiscore btn is clicked
hiScoreBtn.addEventListener('click', (e) => {
    // ternary -- add/remove hidden class to table
    hiScoreTbl.classList.value.includes('hidden') ? hiScoreTbl.classList.remove('hidden') : hiScoreTbl.classList.add('hidden');

    if (hiScoreTbl.classList.value.includes('hidden') === false) {
        scoresBody.innerHTML = ``
        getHiScores()
    }
})

//User must be logged in

startGameBtn.addEventListener('click', e => {
    startGame()
    checkUserInput()
    // startGame()
    restartGameBtn.classList.remove("hidden")
})

restartGameBtn.addEventListener('click', e =>{
    consecIndex = 0
    correctLine = 0
    currentScore = 0
    gameContainer.innerHTML = ""
    keySequenceArray = []
    gameScore.innerText = 0
    gameSettings()
    startGame()
})

myStatsBtn.addEventListener('click', e => {
    fetch('http://localhost:3000/api/v1/games')
        .then(res => res.json())
        .then(stats => {
            let counteee = 0;

            stats.forEach(stat => {
                if (stat.user.username === loggedInUser) {
                    counteee++
                }

            })
            console.log(counteee)
        })
})
