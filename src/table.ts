export enum Color {
	Red = 'red',
	Yellow = 'yellow',
	Blue = 'blue',
}
const generateRandomColor = (): Color => {
	const colors = Object.entries(Color)
	const length = colors.length
	const random = Math.round(Math.random() * (length - 1))
	return colors[random][1]
}

interface Pos {
	x: number
	y: number
}
export interface ICell extends Pos {
	color?: Color
}
export class Cell implements ICell {
	x: number
	y: number
	color: Color

	constructor({ x, y, color }: ICell) {
		this.y = y
		this.x = x
		this.color = color || generateRandomColor()
	}
}
export const cloneCell = (cell: Cell) => new Cell(cell)

export type Table = Cell[][]
export const generate = (size = 6): Table => {
	const table = Array(size)
		.fill(null)
		.map((_, y) => {
			if (y === 0) {
				const playerFirstColumn = [
					new Cell({ x: 0, y: 0, color: Color.Red }),
					...Array(size - 1)
						.fill(null)
						.map((_, x) => new Cell({ x: x + 1, y })),
				]
				return playerFirstColumn
			}
			const columns = Array(size)
				.fill(null)
				.map((_, x) => new Cell({ x, y }))
			return columns
		})
	return table
}

export const cellComparator = (cell1: Cell, cell2: Cell) =>
	cell1.x === cell2.x && cell1.y === cell2.y

type CellDirection = 'top' | 'right' | 'bottom' | 'left'
const tryGetNeighbourCell = (
	cell: Pos,
	direction: CellDirection,
	table: Table
) => {
	const [xModifier, yModifier] = [
		direction === 'right' ? 1 : direction === 'left' ? -1 : 0,
		direction === 'top' ? 1 : direction === 'bottom' ? -1 : 0,
	]
	const neighbourCell = (table[cell.y + yModifier] || [])[cell.x + xModifier]
	if (!neighbourCell) {
		return null
	}
	return neighbourCell
}

export const getNeighbours = (cell: Pos, table: Table) => {
	const [top, right, bottom, left] = [
		tryGetNeighbourCell(cell, 'top', table),
		tryGetNeighbourCell(cell, 'right', table),
		tryGetNeighbourCell(cell, 'bottom', table),
		tryGetNeighbourCell(cell, 'left', table),
	]
	return [top, right, bottom, left]
}

export const copyTable = (table: Table): Table => {
	return table.map((row) => row.map(cloneCell))
}
