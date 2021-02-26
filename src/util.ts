
export const filterNotInArray = <T>(
	array: T[],
	comparator = (a: T, b: T) => a === b
) => (item: T, _: number, arr: T[]): boolean =>
	array.findIndex((existingItem) => comparator(item, existingItem)) === -1
