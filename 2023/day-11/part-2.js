import { readFileSync } from 'fs';
import { join } from 'path';

const ENTRY_DIR = '2023/day-11';
const DATA_FILE_NAMES = ['example.txt', 'input.txt'];

const file = readFileSync(join(ENTRY_DIR, '.', DATA_FILE_NAMES[1])).toString();

const rows = file.split(/\r?\n/);
const scale = 1000000;
let rowExpansions = 0;
const columnExpansions = {};
const galaxies = [];

for (let i = 0; i < rows.length; i++) {
	const line = rows[i];
	const matches = [...line.matchAll(/#/g)];
	if (matches.length == 0) {
		rowExpansions++;
	} else {
		for (const match of matches) {
			columnExpansions[match.index] = 0;
			galaxies.push({
				row: i + rowExpansions * (scale - 1),
				col: match.index,
			});
		}
	}
}

let counter = 0;
const numberOfColumns = rows[0].length;
for (let i = 0; i < numberOfColumns; i++) {
	if (columnExpansions[i] === undefined) {
		counter += scale - 1;
	} else {
		columnExpansions[i] = counter;
	}
}
for (const galaxy of galaxies) {
	galaxy.col += columnExpansions[galaxy.col];
}

const distance = (p1, p2) => {
	return Math.abs(p1.row - p2.row) + Math.abs(p1.col - p2.col);
};

let sum = 0;

for (let i = 0; i < galaxies.length - 1; i++) {
	for (let j = i; j < galaxies.length; j++) {
		sum += distance(galaxies[i], galaxies[j]);
	}
}

console.log(sum);
