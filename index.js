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
const logOutBtn = document.querySelector("#log-out-btn")
let loggedInUser;
let keySequenceArray = []
// *****************************************
// end of delcaration
// *****************************************

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
    hiScoreTbl.classList.value.includes('hidden') ? hiScoreTbl.classList.remove("hidden") : hiScoreTbl.classList.add("hidden");

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
document.addEventListener('keydown', e => {
    if (e.keyCode === keySequenceArray[0]) {
        console.log('correct')
        keySequenceArray.shift()
    } else {
        console.log('smh')
        keySequenceArray = []
        rando(4)
    }

    // console.log(rando(4), keySequenceArray)
})