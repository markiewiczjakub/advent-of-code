import { readByLine } from '../helpers/readByLine';

const word = 'XMAS';

const dirs = [
	[0, 1],
	[0, -1],
	[1, 0],
	[-1, 0],
	[1, 1],
	[1, -1],
	[-1, 1],
	[-1, -1],
];

async function part1() {
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

	function findWord(
		[x, y]: [number, number],
		level: number,
		dir: [number, number] | undefined = undefined
	) {
		if (x < 0 || x > width || y < 0 || y > height) return;

		const letter = grid[y][x];
		if (letter !== word[level]) return;

		if (level === word.length - 1) {
			sum++;
			return;
		}

		if (dir === undefined) {
			for (let i = 0; i < dirs.length; i++) {
				const [dx, dy] = dirs[i];
				findWord([x + dx, y + dy], level + 1, [dx, dy]);
			}
		} else {
			const [dx, dy] = dir;
			findWord([x + dx, y + dy], level + 1, dir);
		}
	}

	for (let y = 0; y <= height; y++) {
		for (let x = 0; x <= width; x++) {
			findWord([x, y], 0);
		}
	}

	return sum;
}

part1().then(console.log);
