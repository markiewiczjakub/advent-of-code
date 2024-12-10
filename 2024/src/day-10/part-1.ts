import { readByLine } from 'src/helpers/readByLine';

type Vec = [number, number];

const dirs: Vec[] = [
	[0, -1],
	[1, 0],
	[0, 1],
	[-1, 0],
];

async function part1() {
	const grid: number[][] = [];
	const entryPoints: Vec[] = [];

	await new Promise<void>((resolve) => {
		let lineIndex = 0;
		readByLine({
			scope: import.meta.url,
			name: 'input.txt',
			onLine: (line) => {
				const parsedLine = line.split('').map(Number);
				grid.push(parsedLine);

				for (let x = 0; x < parsedLine.length; x++) {
					if (parsedLine[x] === 0) entryPoints.push([x, lineIndex]);
				}

				lineIndex++;
			},
			onClose: resolve,
		});
	});

	const trails = new Set<string>();

	function traverse([x, y]: Vec, height = 0, entryPoint = [x, y]) {
		if (grid[y]?.[x] === 9) {
			trails.add(`${entryPoint[0]}.${entryPoint[1]}.${x}.${y}`);
			return;
		}

		for (let i = 0; i < dirs.length; i++) {
			const [dx, dy] = dirs[i];
			const [nx, ny] = [x + dx, y + dy];

			if (grid[ny]?.[nx] === height + 1) {
				traverse([nx, ny], height + 1, entryPoint);
			}
		}
	}

	for (let i = 0; i < entryPoints.length; i++) {
		traverse(entryPoints[i]);
	}

	return trails.size;
}

part1().then(console.log);
