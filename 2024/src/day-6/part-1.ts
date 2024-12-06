import { readByLine } from '../helpers/readByLine';

const dirs = [
	[0, -1],
	[1, 0],
	[0, 1],
	[-1, 0],
];

async function part1() {
	const grid: string[] = [];
	let currentPosition: [number, number] = [0, 0];

	await new Promise<void>((resolve) => {
		let lineIndex = -1;
		readByLine({
			scope: import.meta.url,
			name: 'input.txt',
			onLine: (line) => {
				grid.push(line);
				lineIndex++;

				const startingPosIndex = line.indexOf('^');
				if (line.indexOf('^') !== -1)
					currentPosition = [startingPosIndex, lineIndex];
			},
			onClose: resolve,
		});
	});

	const width = grid[0].length - 1;
	const height = grid.length - 1;

	let dirIndex = 0;
	function rotate() {
		dirIndex = (dirIndex + 1) % dirs.length;
	}

	function isOutOfBounds(position: [number, number]) {
		const [x, y] = position;
		return x < 0 || x > width || y < 0 || y > height;
	}

	const distinctPositions = new Set<string>();
	while (!isOutOfBounds(currentPosition)) {
		const [x, y] = currentPosition;
		distinctPositions.add(`${x}.${y}`);
		const [dx, dy] = dirs[dirIndex];
		const [nx, ny] = [x + dx, y + dy];

		if (grid[ny]?.[nx] === '#') {
			rotate();
			continue;
		}

		currentPosition = [nx, ny];
	}

	return distinctPositions.size;
}

part1().then(console.log);
