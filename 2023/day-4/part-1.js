import { readFileSync } from 'fs';
import { join } from 'path';

const ENTRY_DIR = '2023/day-4';
const DATA_FILE_NAMES = ['example.txt', 'input.txt'];

const file = readFileSync(join(ENTRY_DIR, '.', DATA_FILE_NAMES[1])).toString();

let pointsSum = 0;
const splitRegEx = /\s+/g;
const rows = file.split(/\r?\n/);
for (const row of rows) {
	const [, numbers] = row.split(':');

	const [winningNums, nums] = numbers.split('|');
	const winningNumsMap = winningNums
		.trim()
		.split(splitRegEx)
		.reduce((acc, value) => {
			acc[value] = true;
			return acc;
		}, {});

	const matchingNums = nums
		.trim()
		.split(splitRegEx)
		.filter((value) => winningNumsMap[value]);

	if (matchingNums.length > 0) pointsSum += 2 ** (matchingNums.length - 1);
}

console.log(pointsSum);
