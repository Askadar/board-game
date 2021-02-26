import { Cell, generate } from './table'
import { makeMove } from './moves'
import { Game, Player, printBoard } from './game'

const initialTable = generate(8)
// const initialTable: Cell[][] = require('./table.json')
const initialPlayer = new Player(initialTable[0][0])

let moves = 0
let board = new Game(initialPlayer, initialTable);

console.log('init')
console.log(printBoard(board))
for(; moves < 100; moves++) {
	board = makeMove(board)
	console.log(printBoard(board))
	if (board.finished) {
		break;
	}
}

if (board.finished) {
	console.log(`Game is finished in ${moves} move${moves > 1 ? 's' : ''}`)
} else {
	console.log(`Game couldn't be finished in ${moves} move${moves > 1 ? 's' : ''}. Stopping`)
}
