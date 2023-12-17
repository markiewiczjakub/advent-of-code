import { readFileSync } from 'fs';
import { join } from 'path';

const ENTRY_DIR = '2023/day-17';
const DATA_FILE_NAMES = ['example.txt', 'input.txt'];

const file = readFileSync(join(ENTRY_DIR, '.', DATA_FILE_NAMES[1])).toString();

const DIRS = {
	['0.1']: [
		[0, 1],
		[-1, 0],
		[1, 0],
	],
	['0.-1']: [
		[0, -1],
		[-1, 0],
		[1, 0],
	],
	['1.0']: [
		[1, 0],
		[0, -1],
		[0, 1],
	],
	['-1.0']: [
		[-1, 0],
		[0, -1],
		[0, 1],
	],
};
const map = file.split(/\r?\n/).map((row) => row.split('').map(Number));

const seen = new Set();
const queue = {
	0: [{ x: 0, y: 0, dx: 1, dy: 0, count: 0 }],
};
let completed = false;
let queueIndex = 0;

while (!completed) {
	if (!queue[queueIndex]) {
		queueIndex++;
		continue;
	}

	for (const path of queue[queueIndex]) {
		if (path.x === map[0].length - 1 && path.y === map.length - 1) {
			completed = true;
			break;
		}

		for (const [dx, dy] of DIRS[key(path.dx, path.dy)]) {
			move(path, dx, dy);
		}
	}

	queueIndex++;
}

function move(path, dx, dy) {
	const newCount = path.dx === dx && path.dy === dy ? path.count + 1 : 1;
	if (
		newCount > 3 ||
		path.x < 0 ||
		path.x >= map.length[0] ||
		path.y < 0 ||
		path.y >= map.length
	)
		return;

	const moveKey = key(path.x, path.y, dx, dy, newCount);
	if (seen.has(moveKey)) return;
	seen.add(moveKey);

	const heatLoss = queueIndex + map[path.y][path.x];
	if (!queue[heatLoss]) queue[heatLoss] = [];

	queue[heatLoss].push({
		x: path.x + dx,
		y: path.y + dy,
		dx,
		dy,
		count: newCount,
	});
}

console.log(queueIndex);

function key() {
	return [...arguments].join('.');
}
