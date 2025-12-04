import { read } from '../helpers/read';

async function part1() {
	const content = await read({ scope: import.meta.url, name: 'input.txt' });
	const grid = content.split('\n').map((r) => r.split(''));

	let n = 0;
	for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid[y].length; x++) {
			if (grid[y][x] !== '@') continue;
			if (countAdjacentRollPapers(grid, x, y) < 4) n++;
		}
	}

	return n;
}

part1().then(console.log);

const dirs = [
	[-1, -1],
	[1, 1],
	[-1, 0],
	[0, -1],
	[-1, 1],
	[1, -1],
	[0, 1],
	[1, 0],
];
function countAdjacentRollPapers(grid: string[][], x: number, y: number) {
	let n = 0;
	for (const [dx, dy] of dirs) {
		const nx = x + dx;
		const ny = y + dy;
		if (nx < 0 || nx > grid[0].length - 1 || ny < 0 || ny > grid.length - 1)
			continue;

		if (grid[ny][nx] === '@') n++;
	}
	return n;
}
