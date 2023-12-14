import { readFileSync } from 'fs';
import { join } from 'path';

const ENTRY_DIR = '2023/day-14';
const DATA_FILE_NAMES = ['example.txt', 'input.txt'];

const file = readFileSync(join(ENTRY_DIR, '.', DATA_FILE_NAMES[1])).toString();

const map = file.split(/\r?\n/).map((row) => row.trim().split(''));

const dirs = {
	n: [0, 1],
	e: [-1, 0],
	s: [0, -1],
	w: [1, 0],
};

function roll(dir) {
	let moved = true;
	while (moved) {
		moved = false;

		for (let y = 0; y < map.length; y++) {
			for (let x = 0; x < map[0].length; x++) {
				if (map[y][x] !== 'O') continue;

				const [newX, newY] = [x - dirs[dir][0], y - dirs[dir][1]];
				if (map[newY]?.[newX] === '.') {
					map[newY][newX] = 'O';
					map[y][x] = '.';
					moved = true;
				}
			}
		}
	}
}

let result = 0;
const N = 1_000_000_000;
const sums = [];
for (let i = 0; i < N; i++) {
	roll('n');
	roll('w');
	roll('s');
	roll('e');

	const sum = map
		.map((row) => row.filter((item) => item === 'O').length)
		.reduce((acc, row, i) => {
			acc += row * (map.length - i);
			return acc;
		}, 0);
	sums.push(sum);

	if (sums.filter((s) => s === sum).length > 2) {
		const index = sums.indexOf(sum);

		// element before is the same
		if (index !== -1 && sums[sums.length - 2] === sums[index - 1]) {
			const step = sums.length - index - 1;
			result = sums[index + ((N - index - 1) % step)];
			break;
		}
	}
}

console.log(result);
