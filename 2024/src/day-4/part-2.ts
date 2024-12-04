import { readByLine } from '../helpers/readByLine';

async function part2() {
	const grid: string[] = [];

	await new Promise<void>((resolve) =>
		readByLine({
			scope: import.meta.url,
			name: 'input.txt',
			onLine: (line) => grid.push(line),
			onClose: resolve,
		})
	);

	const width = grid[0].length - 1;
	const height = grid.length - 1;

	let sum = 0;

	function getLetter(x: number, y: number): string | null {
		if (x < 0 || x > width || y < 0 || y > height) return null;
		return grid[y][x];
	}

	for (let y = 0; y <= height; y++) {
		for (let x = 0; x <= width; x++) {
			const letter = getLetter(x, y);
			if (letter !== 'A') continue;

			/*
			 *	a	c
			 *	  o
			 *	d	b
			 * */
			const a = getLetter(x - 1, y - 1);
			const b = getLetter(x + 1, y + 1);
			const c = getLetter(x + 1, y - 1);
			const d = getLetter(x - 1, y + 1);

			if (
				((a === 'S' && b === 'M') || (a === 'M' && b === 'S')) &&
				((c === 'S' && d === 'M') || (c === 'M' && d === 'S'))
			) {
				sum++;
			}
		}
	}

	return sum;
}

part2().then(console.log);
