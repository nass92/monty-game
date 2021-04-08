const fs = require('fs')
const chalk = require('chalk')
const readlineSync = require('readline-sync')
const { randomInt } = require('crypto')


// initialisation du jeu: 
do {
  // 3 chèvres par défaut derrière chacune des portes
  const gates = [['Door 1', 'Door 2', 'Door 3'], ['gates', 'gates', 'gates']]
  // inserer une voiture aleatoirement dans l'une des 3 portes
  const n = randomInt(0, 3)
  gates[1][n] = 'car'
  console.log(gates)

  // id du joeur et integration du score:
  let objScore = []
  try {
    objScore = fs.readFileSync('./highScore.json', 'utf-8')
  } catch (e) {
    console.error(e.message)
    process.exit(1)
  }
  objScore = JSON.parse(objScore)


  let player = readlineSync.question('votre nom : ')
  console.log(`Welcome ${player}. The rules are simple.\n You have 3 door, and in one of them, you have a car.\n You must to have a choose 1 at the beguining.\n After, the computer will choose one.\n After him, you can keep your door and open it, or change for the last of them.\n Have a good luck!`)

  // debut du jeu: 

  // 1er choix du joeur 
  let playerChoice = readlineSync.keyInSelect(gates[0], 'Your Choice: ')
  const doorOpen = (gates, playerChoice) => {
    for (let i = 0; i < gates[0].length; i++)
      if (gates[1][i] !== 'car' && i !== playerChoice) {
        return [i]
      }
  }

  console.log(`You have choose ${gates[0][playerChoice]}`)
  // ouvrir une porte non choisit ET détenant une chevre:
  console.log(`You must to know  at the ${gates[0][doorOpen(gates, playerChoice)]} there is ${gates[1][doorOpen(gates, playerChoice)]}\n You can change your door if you want... `)

  // deuxieme choix pour le joeur: garder ou changer la porte
  let choiceChange = readlineSync.keyInYN('Do you want change your choice ?: ')

  if (choiceChange === true) {
    let playerChoice2 = readlineSync.keyInSelect(gates[0], 'Your new Choice: ')
    if (gates[1][playerChoice2] !== 'car') {
      console.log('Im sorry, you take a bad decision... you should not change your choice')
    } else {
      console.log('You are strong. Congratualition you win the car')
    }
  }
  if (choiceChange === false) {
    if (gates[1][playerChoice] === 'car') {
      console.log('YES SIR. Its your day, the car is for you  ')
    } else {
      console.log('Im so sorry, its was not this door... the next time inchallah')
    }
  }


  // sauvegarde d'une high socre et elimination du dernier du tableau de resultat. et envoie dans le tableau JSON
  objScore.score.push([player, gates[1][playerChoice]])
  objScore = JSON.stringify(objScore)
  fs.writeFileSync('./highScore.json', objScore)

} while (readlineSync.keyInYN('replay ?: '))
