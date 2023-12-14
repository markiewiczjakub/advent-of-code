import { readFileSync } from 'fs';
import { join } from 'path';

const ENTRY_DIR = '2023/day-14';
const DATA_FILE_NAMES = ['example.txt', 'input.txt'];

const file = readFileSync(join(ENTRY_DIR, '.', DATA_FILE_NAMES[1])).toString();

const map = file.split(/\r?\n/).map((row) => row.trim().split(''));

let moved = true;
while (moved) {
	moved = false;

	for (let y = 1; y < map.length; y++) {
		for (let x = 0; x < map[0].length; x++) {
			if (map[y][x] !== 'O') continue;

			if (map[y - 1][x] === '.') {
				map[y - 1][x] = 'O';
				map[y][x] = '.';
				moved = true;
			}
		}
	}
}

const sum = map
	.map((row) => row.filter((item) => item === 'O').length)
	.reduce((acc, row, i) => {
		acc += row * (map.length - i);
		return acc;
	}, 0);

console.log(sum);
