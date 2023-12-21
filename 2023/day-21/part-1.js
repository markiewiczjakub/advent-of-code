import { readFileSync } from 'fs';
import { join } from 'path';

const ENTRY_DIR = '2023/day-21';
const DATA_FILE_NAMES = ['example.txt', 'input.txt'];

const file = readFileSync(join(ENTRY_DIR, '.', DATA_FILE_NAMES[1])).toString();

const map = file.split(/\r?\n/);
const DIRS = [
	[0, 1],
	[0, -1],
	[1, 0],
	[-1, 0],
];
let stack = [];

function step([x, y]) {
	const newStack = [];

	for (const [dx, dy] of DIRS) {
		const [nx, ny] = [x + dx, y + dy];
		if (map[ny][nx] === '#') continue;

		newStack.push([nx, ny]);
	}

	return newStack;
}

const startPosition = map.reduce((acc, value, y) => {
	const sIndex = value.indexOf('S');
	if (sIndex === -1) return acc;

	return [y, sIndex];
});
stack.push([startPosition[0], startPosition[1]]);

for (let i = 0; i < 64; i++) {
	const newStack = [];
	while (stack.length) {
		const partStack = step(stack.shift());
		for (const [x, y] of partStack) {
			if (!newStack.some((pos) => pos[0] === x && pos[1] === y))
				newStack.push([x, y]);
		}
	}
	stack = newStack;
}

console.log(stack.length);
