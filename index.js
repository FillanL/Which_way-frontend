// ***************************************
// declare constants needed
// ***************************************
const gameContainer = document.querySelector('#game-container')
const hiScoreBtn = document.querySelector('#hi-score-btn')
const hiScoreTbl = document.querySelector('#hi-score-table')
const newUserForm = document.querySelector('#create-username')
const scoresBody = document.querySelector('#hi-score-body')
const newUser = document.querySelector('#user')
const userDiffcultySelect = document.querySelector('#user-diffculty')
const currentPlayer = document.querySelector('#current-player')
const logOutBtn = document.querySelector('#log-out-btn')
const startGameBtn = document.querySelector('#game-start-btn')

let active = false
let loggedInUser;
let keySequenceArray = []
let currentScore = 0
// *****************************************
// end of delcaration
// ******************************************
// Start of all declared function that will be called
// *****************************************

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
    active = false
    renderSequence()
    setTimeout(() => {
        const letterTiles = document.querySelectorAll('.letter-tile')
        // debugger
        letterTiles.forEach(
            kid => {
                // debugger
                kid.children[0].classList.remove('fa-arrow-alt-circle-left', 'fa-arrow-alt-circle-right',
                    'fa-arrow-alt-circle-up', 'fa-arrow-alt-circle-down', 'far')

                kid.children[0].classList.add('fas', 'fa-question')
                active = true
            }
        )

    }, 3000);
}

//user input conditions
const checkUserInput = () => {
    // listening for user input
    let consecIndex = 0
    document.addEventListener('keydown', e => {
        if (active === true) {
            if (e.keyCode === keySequenceArray[0]) {
                // debugger
                console.log('correct', e.key.slice(5).toLowerCase())

                gameContainer.children[consecIndex].children[0].classList.remove(`fa-arrow-alt-circle-${e.key.slice(5).toLowerCase()}`, 'far', 'fas', 'fa-question')

                gameContainer.children[consecIndex].children[0].classList.add('fa-check', 'fas', 'green')

                consecIndex++;
                keySequenceArray.shift()

                // try to have last check mark display
                // setTimeout(() => {}, 5000)
                if (keySequenceArray.length === 0) {
                    currentScore += 100
                    consecIndex = 0
                    rando(4)
                    gameContainer.innerHTML = ''
                    displaySequence()
                    console.log(currentScore)
                }
            } else {
                console.log('smh')
                keySequenceArray = []
                gameContainer.innerHTML = ''
                rando(4)
                displaySequence()
                consecIndex = 0
                console.log(currentScore)
            }
            // console.log(rando(4), keySequenceArray)
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
    // console.log(userDiffcultySelect.value);
    fetch('http://localhost:3000/api/v1/games', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({

                username: newUser.value,
                difficulty: userDiffcultySelect.value
            }),
        })
        .then(res => res.json())
        .then(player => {
            // console.log(player)

            loggedInUser = player.username
            newUserForm.classList.add('hidden');

            currentPlayer.innerHTML = `
            <p> current player is ${loggedInUser}</p>

            <h3>${userDiffcultySelect.value} MODE</h3>
            `
        })
    newUserForm.reset()
    logOutBtn.classList.remove("hidden")
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
    //starts clock

    // have countdown
    startGameBtn.classList.add('hidden')
    rando(4)
    console.log(keySequenceArray)

    // load sequence 
    displaySequence()
    checkUserInput()
})