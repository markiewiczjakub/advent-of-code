import { readByLine } from 'src/helpers/readByLine';

const dirs = [
	[0, -1],
	[1, 0],
	[0, 1],
	[-1, 0],
];

async function part2() {
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

	function isOutOfBounds(position: [number, number]) {
		const [x, y] = position;
		return x < 0 || x > width || y < 0 || y > height;
	}

	function simulate(
		grid: string[],
		startPos: [number, number],
		obstruction: [number, number]
	) {
		let currentPosition = [...startPos];
		let dirIndex = 0;

		const visited = new Set<string>();

		const [ox, oy] = obstruction;
		grid[oy] = grid[oy].substring(0, ox) + '#' + grid[oy].substring(ox + 1);

		while (!isOutOfBounds(currentPosition as [number, number])) {
			const [x, y] = currentPosition;
			const key = `${x}.${y}.${dirIndex}`;

			if (visited.has(key)) return true; // loop detected

			visited.add(key);

			const [dx, dy] = dirs[dirIndex];
			const [nx, ny] = [x + dx, y + dy];

			if (grid[ny]?.[nx] === '#') {
				dirIndex = (dirIndex + 1) % dirs.length;
				continue;
			}

			currentPosition = [nx, ny];
		}

		return false;
	}

	let sum = 0;
	for (let y = 0; y <= height; y++) {
		for (let x = 0; x <= width; x++) {
			if (grid[y][x] !== '.') continue;
			if (x === currentPosition[0] && y === currentPosition[1]) continue;

			if (!simulate([...grid], currentPosition, [x, y])) continue;

			sum++;
		}
	}

	return sum;
}

part2().then(console.log);
