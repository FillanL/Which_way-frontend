// ***************************************
// declare constants needed
// ***************************************
const container = document.querySelector('#game-container')
const hiScoreBtn = document.querySelector('#hi-score-btn')
const hiScoreTbl = document.querySelector('#hi-score-table')
const newUserForm = document.querySelector('#create-username')
const newUser = document.querySelector('#user')
const userDiffcultySelect = document.querySelector('#user-diffculty')

// *****************************************
// end of delcaration
// *****************************************

// trying to create username and a game instance at the same time....
newUserForm.addEventListener('submit', (e) => {
    e.preventDefault()
    console.log(userDiffcultySelect.value);

    fetch('http://localhost:3000/api/v1/games', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({

                username: newUser.value,
                difficulty: userDiffcultySelect.value,
                high_score: 0,
                level: 1
            }),
        })
        .then(res => res.json())
        .then(console.log)
})

// refactor for post request to db
// const addUser = () =>{
// }


// toggle hiscore menu when hiscore btn is clicked
hiScoreBtn.addEventListener('click', (e) => {
    // ternary -- add/remove hidden class to table
    hiScoreTbl.classList.value.includes('hidden') ? hiScoreTbl.classList.remove("hidden") : hiScoreTbl.classList.add("hidden");
})


// 
const getHiScores = () => {
    fetch('http://localhost:3000/api/v1/games')
        .then(res => res.json())
        .then(allGames => {
            // all game objects from database
            allGames.forEach(game => {
                // for each player that played create a table row 
                const playerHiscorreRow = document.createElement('tr')
                // add inform wihtin that table row
                playerHiscorreRow.innerHTML += `
               <td> ${game.id}</td>
               <td> ${game.score}</td>
            `
            });
        })
}