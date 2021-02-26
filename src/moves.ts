import { filterNotInArray } from './util'
import {
	Cell,
	Color,
	Table,
	cloneCell,
	copyTable,
	getNeighbours,
	cellComparator,
} from './table'
import { Game, Player } from './game'

const collectEnclousure = (
	from: Cell,
	base: Cell,
	table: Table,
	currentEnclosure: Cell[]
): Cell[] => {
	const color = base.color
	let updatedEnclosure = currentEnclosure.map(cloneCell)
	const applicableNeighbours = getNeighbours(from, table)
		.filter(
			(neighbour: Cell | null): neighbour is Cell =>
				!!neighbour && neighbour.color === color
		)
		.filter(filterNotInArray(updatedEnclosure, cellComparator))

	updatedEnclosure = updatedEnclosure.concat(applicableNeighbours)

	for (const neighbour of applicableNeighbours) {
		const neighbourEnclosure = collectEnclousure(
			neighbour,
			base,
			table,
			updatedEnclosure
		)
		updatedEnclosure = neighbourEnclosure
	}
	return updatedEnclosure
}

interface Move {
	length: number
	weight: number
	color: Color
	enclosure: Cell[]
}
export const findMoves = (cell: Cell, table: Table): Move[] => {
	const cellEnclosure = collectEnclousure(cell, cell, table, [cell])
	const neighbours = cellEnclosure
		.map((baseCell) => {
			return getNeighbours(baseCell, table).filter(
				(neighbour: Cell | null): neighbour is Cell =>
					!!neighbour && neighbour.color !== baseCell.color
			)
		})
		.reduce((all, chunk) => all.concat(chunk), [] as Cell[])

	const enclosures = neighbours.map((neighbour) =>
		collectEnclousure(neighbour, neighbour, table, [neighbour])
	)

	// TODO add weighing
	// const colorWeight = table.reduce

	return enclosures.map((enclosure) => ({
		length: enclosure.length,
		weight: 1,
		color: enclosure[0].color,
		enclosure,
	}))
}

const doMove = (board: Game, move: Move): Game => {
	let newTable = copyTable(board.table)
	let newPlayer = new Player(
		new Cell({ ...board.player.cells[0], color: move.color }),
		board.player.cells
			.map((cell) => new Cell({ ...cell, color: move.color }))
			.concat(move.enclosure)
	)

	// Mutation of a copy
	newPlayer.cells.forEach((cell) => (newTable[cell.y][cell.x] = cell))
	return { player: newPlayer, table: newTable }
}
export const makeMove = ({ player, table }: Game): Game => {
	const moves = player.cells
		.map((cell) => {
			return findMoves(cell, table)
		})
		.reduce((allMoves, moveset) => allMoves.concat(moveset), [] as Move[])
		.sort(
			(moveA, moveB) =>
				moveB.length * moveA.weight - moveA.length * moveA.weight
		)

	if (moves.length === 0) {
		return { player, table, finished: true }
	}
	return doMove({ player, table }, moves[0])
}
