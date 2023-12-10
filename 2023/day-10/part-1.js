import { readFileSync } from 'fs';
import { join } from 'path';

const ENTRY_DIR = '2023/day-10';
const DATA_FILE_NAMES = [
	'example-1-part-1.txt',
	'example-2-part-1.txt',
	'input.txt',
];

const file = readFileSync(join(ENTRY_DIR, '.', DATA_FILE_NAMES[2])).toString();

const DIRS = {
	N: [0, 1],
	E: [1, 0],
	S: [0, -1],
	W: [-1, 0],
};
const OPPOSITE_DIRS = {
	N: 'S',
	S: 'N',
	E: 'W',
	W: 'E',
};
const LINKS = {
	'|': {
		N: ['|', '7', 'F', 'S'],
		E: [],
		S: ['|', 'L', 'J'],
		W: [],
	},
	'-': {
		N: [],
		E: ['-', 'J', '7'],
		S: [],
		W: ['-', 'L', 'F', 'S'],
	},
	L: {
		N: ['|', '7', 'F', 'S'],
		E: ['-', 'J', '7'],
		S: [],
		W: [],
	},
	J: {
		N: ['|', '7', 'F', 'S'],
		E: [],
		S: [],
		W: ['-', 'L', 'F', 'S'],
	},
	7: {
		N: [],
		E: [],
		S: ['|', 'L', 'J'],
		W: ['-', 'L', 'F', 'S'],
	},
	F: {
		N: [],
		E: ['-', 'J', '7'],
		S: ['|', 'L', 'J'],
		W: [],
	},
};
function isValidPipe(pipe) {
	return LINKS[pipe] !== undefined;
}
function isValidEdgePipe(pipe, dir, edge) {
	return isValidPipe(pipe) && LINKS[pipe][dir].includes(edge);
}
const nodes = {};

const pipes = file.split(/\r?\n/);
let startNode = null;
for (let y = 0; y < pipes.length; y++) {
	for (let x = 0; x < pipes[y].length; x++) {
		let pipe = pipes[y][x];

		// check which pipe S is
		if (pipe === 'S') {
			const openDirections = [];
			for (const direction in DIRS) {
				const [dx, dy] = DIRS[direction];
				const [nx, ny] = [x + dx, y - dy];
				const edge = pipes[ny]?.[nx];
				if (!isValidPipe(edge)) continue;

				const oppositeDir = OPPOSITE_DIRS[direction];
				if (LINKS[edge][oppositeDir].length)
					openDirections.push(direction);
			}

			const startPipe = Object.keys(LINKS).filter(
				(link) =>
					LINKS[link][openDirections[0]].length &&
					LINKS[link][openDirections[1]].length
			);
			pipe = startPipe;
			startNode = `${x}.${y}`;
		}
		if (!isValidPipe(pipe)) continue;

		const edges = [];
		for (const direction in DIRS) {
			const [dx, dy] = DIRS[direction];
			const [nx, ny] = [x + dx, y - dy];
			const edge = pipes[ny]?.[nx];

			if (isValidEdgePipe(pipe, direction, edge)) {
				edges.push(`${nx}.${ny}`);
			}
		}

		nodes[`${x}.${y}`] = { pipe, edges };
	}
}

const stack = [startNode];
const visited = {};
const distances = { [startNode]: 0 };

while (stack.length) {
	const node = stack.shift();
	visited[node] = true;

	for (const edgeNode of nodes[node].edges) {
		if (visited[edgeNode]) continue;

		distances[edgeNode] = distances[node] + 1;
		stack.push(edgeNode);
	}
}

console.log(Math.max(...Object.values(distances)));
