import { readFileSync } from 'fs';
import { join } from 'path';

const ENTRY_DIR = '2023/day-23';
const DATA_FILE_NAMES = ['example.txt', 'input.txt'];

const file = readFileSync(join(ENTRY_DIR, '.', DATA_FILE_NAMES[1])).toString();

const map = file.split(/\r?\n/);
const startPoint = [map[0].indexOf('.'), 0];
const endPoint = [map[map.length - 1].indexOf('.'), map.length - 1];

const DIRS = [
	[-1, 0],
	[1, 0],
	[0, -1],
	[0, 1],
];

const SIGN_TO_DIR = {
	'>': [1, 0],
	'<': [-1, 0],
	'^': [0, -1],
	v: [0, 1],
};

const stack = [
	{
		point: startPoint,
		count: 0,
		seen: new Set(key(startPoint)),
	},
];
const done = [];

while (stack.length) {
	const { point, count, seen } = stack.shift();
	const [x, y] = point;
	if (key(point) === key(endPoint)) {
		done.push(count);
		continue;
	}

	if (map[y]?.[x] === undefined || map[y][x] === '#') {
		continue;
	}

	if (map[y][x] === '.') {
		for (const [dx, dy] of DIRS) {
			const newPoint = [x + dx, y + dy];

			if (seen.has(key(newPoint))) continue;

			stack.push({
				point: newPoint,
				count: count + 1,
				seen: new Set([...seen, key(newPoint)]),
			});
		}
		continue;
	}

	const [dx, dy] = SIGN_TO_DIR[map[y][x]];
	const newPoint = [x + dx, y + dy];
	if (seen.has(key(newPoint))) continue;

	stack.push({
		point: newPoint,
		count: count + 1,
		seen: new Set([...seen, key(newPoint)]),
	});
}

console.log(Math.max(...done));

function key() {
	return [...arguments].join('.');
}
