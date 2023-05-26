const crypto = require('crypto');
const Table = require('ascii-table');
const readline = require('readline');

class TableGenerator {
  static generateTable(moves) {
    const table = new Table();
    const headerRow = ['', ...moves];
    table.setHeading(...headerRow);

    for (let i = 0; i < moves.length; i++) {
      const row = [moves[i]];
      for (let j = 0; j < moves.length; j++) {
        if (i === j) {
          row.push('Draw');
        } else {
          const result = GameRules.getResult(i, j, moves.length);
          row.push(result);
        }
      }
      table.addRow(...row);
    }
    return table.toString();
  }
}

class GameRules {
  static getResult(userChoice, computerChoice, numMoves) {
    const result = (userChoice - computerChoice + numMoves) % numMoves;
    if (result === 0) {
      return 'Draw';
    } else if (result <= numMoves / 2) {
      return 'Win';
    } else {
      return 'Lose';
    }
  }
}

class KeyGenerator {
  static generateKey() {
    const key = crypto.randomBytes(32);
    return key.toString('hex');
  }
}

class MoveEvaluator {
  static computeMove(key, moves) {
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(String(Date.now()));
    const moveIndex = parseInt(hmac.digest('hex'), 16) % moves.length;
    return moves[moveIndex];
  }
}

function getUserChoice() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question('Enter your move:\n', choice => {
      rl.close();
      resolve(choice.trim());
    });
  });
}

async function playGame(moves) {
  let userChoice = '';

  console.log(`HMAC: ${KeyGenerator.generateKey()}\n`);

  function displayMoves() {
    console.log('Available moves:');
    for (let i = 0; i < moves.length; i++) {
      console.log(`${i + 1} - ${moves[i]}`);
    }
    console.log('0 - Exit');
    console.log('? - Help\n');
  }
  displayMoves()

  while (userChoice !== '0') {
    userChoice = await getUserChoice();

    if (userChoice === '0') {
      break;
    } else if (userChoice === '?') {
      const helpTable = TableGenerator.generateTable(moves);
      console.log('\n' + helpTable + '\n');
      displayMoves()
    } else if (Number(userChoice) >= 1 && Number(userChoice) <= moves.length) {
      const key = KeyGenerator.generateKey();
      const computerChoice = MoveEvaluator.computeMove(key, moves);
      const userMove = moves[Number(userChoice) - 1];
      const result = GameRules.getResult(Number(userChoice) - 1, moves.indexOf(computerChoice), moves.length);

      console.log(`\nYour move: ${userMove}`);
      console.log(`Computer move: ${computerChoice}`);
      console.log(`Result: ${result}`);
      console.log(`HMAC key: ${key}\n`);
      displayMoves()
      console.log(`HMAC: ${KeyGenerator.generateKey()}\n`);

    } else {
      console.log('Invalid choice. Please choose a valid option.\n');
      displayMoves()
    }
  }

  console.log('Thank you for playing!');
}
const moves = process.argv.slice(2);

if (moves.length < 3 || moves.length % 2 !== 1 || new Set(moves).size !== moves.length) {
  console.log('Error: Invalid input!');
  console.log('Please provide an odd number (>=3) of non-repeating strings as moves.');
  console.log('Example: node game.js Rock Paper Scissors');
} else {
  playGame(moves);
}