import { readFileSync } from 'fs';
import { join } from 'path';

const ENTRY_DIR = '2023/day-13';
const DATA_FILE_NAMES = ['example.txt', 'input.txt'];

const file = readFileSync(join(ENTRY_DIR, '.', DATA_FILE_NAMES[1])).toString();

const areas = file.split(/\r?\n\r?\n/).map((area) => {
	area = area.trim().split(/\r?\n/);

	return {
		normal: area,
		swapped: swapColsWithRows(area),
	};
});

let sum = 0;
for (const area of areas) {
	const horizontal = findMirror(area.normal);
	const vertical = findMirror(area.swapped);

	if (horizontal !== null) sum += horizontal * 100;

	if (vertical !== null) sum += vertical;
}

console.log(sum);

function findMirror(area) {
	loop1: for (let i = 1; i < area.length; i++) {
		if (area[i] === area[i - 1]) {
			for (
				let up = i, down = i - 1;
				up < area.length, down >= 0;
				up++, down--
			) {
				if (area[up] === undefined || area[down] === undefined) break;
				if (area[up] !== area[down]) {
					continue loop1;
				}
			}

			return i;
		}
	}

	return null;
}

function swapColsWithRows(area) {
	const rotatedArea = [];

	for (let i = 0; i < area[0].length; i++) {
		let row = '';
		for (let j = 0; j < area.length; j++) row += area[j][i];

		rotatedArea.push(row);
	}

	return rotatedArea;
}
