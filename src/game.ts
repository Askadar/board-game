import { Cell, Table, Color } from './table'

export const printBoard = ({ table, player }: Game) => {
	const outputBoard = table
		.map((row) => row.map((cell) => cell.color.substr(0, 1)).join(' | '))
		.join(`\n${'-'.repeat(table.length * 4 - 2)}\n`)
	return `Player: ${player.color} with ${player.cells.length} cell${
		player.cells.length > 1 ? 's' : ''
	}\n\n${outputBoard}\n`
}

export class Player {
	color: Color
	cells: Cell[]

	constructor(cell: Cell, cells?: Cell[]) {
		this.color = cell.color
		this.cells = cells || [cell]
	}
}

export class Game {
	player: Player
	table: Table
	finished?: boolean

	constructor(player: Player, table: Table, finished?: boolean) {
		this.player = player
		this.table = table
		this.finished = finished
	}
}
