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
let loggedInUser;
let keySequenceArray = []
// *****************************************
// end of delcaration
// ******************************************
// Start of all declared function that will be called
// *****************************************

//function to render random sequence
const renderSequence = function () {
    keySequenceArray.forEach(num => {
        switch (num) {
            case 37:
                gameContainer.innerHTML += `
        <div class="letter-tile">
        <i class="far fa-arrow-alt-circle-left fa-2x "></i>
        </div>
        `
                break;
            case 38:
                gameContainer.innerHTML += `
        <div class="letter-tile">
        <i class="far fa-arrow-alt-circle-up fa-2x "></i>
        </div>
        `
                break;

            case 39:
                gameContainer.innerHTML += `
        <div class="letter-tile">
        <i class="far fa-arrow-alt-circle-right fa-2x "></i>
        </div>
        `
                break;

            case 40:
                gameContainer.innerHTML += `
        <div class="letter-tile">
        <i class="far fa-arrow-alt-circle-down fa-2x "></i>
        </div>
        `
                break;

            default:
                break;
        }
    })
}
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

const rando = (x) => {
    for (let index = 0; index < x; index++) {
        keySequenceArray.push(Math.floor(Math.random() * 4) + 37)
    }
}
rando(4)
console.log(keySequenceArray)
//User must be logged in
startGameBtn.addEventListener('click', e => {
    // have countdown
    // load sequence

    renderSequence()
    // listening for user input
    document.addEventListener('keydown', e => {
        if (e.keyCode === keySequenceArray[0]) {
            // debugger
            console.log('correct')

            keySequenceArray.shift()

            if (keySequenceArray.length === 0) {
                rando(4)
                gameContainer.innerHTML = ''
                renderSequence()
            }
        } else {
            console.log('smh')
            keySequenceArray = []
            rando(4)
            gameContainer.innerHTML = ''
            renderSequence()
        }
        // console.log(rando(4), keySequenceArray)
    })
    // gameContainer.innerHTML
    // track score

})