import { readFileSync } from 'fs';
import { join } from 'path';

const ENTRY_DIR = '2023/day-3';
const DATA_FILE_NAMES = ['example.txt', 'input.txt'];

const file = readFileSync(join(ENTRY_DIR, '.', DATA_FILE_NAMES[1])).toString();

const dirs = [
	[0, 1],
	[1, 1],
	[1, 0],
	[1, -1],
	[0, -1],
	[-1, -1],
	[-1, 0],
	[-1, 1],
];
let numbersSum = 0;
const digitRegEx = /\d+/g;
const rows = file.split(/\r?\n/);
for (let y = 0; y < rows.length; y++) {
	const row = rows[y];

	let match;
	while ((match = digitRegEx.exec(row)) != null) {
		let isAdjacentToSymbol = false;
		for (let x = match.index; x < match.index + match[0].length; x++) {
			for (const [dx, dy] of dirs) {
				const [nx, ny] = [x + dx, y + dy];

				const value = rows[ny]?.[nx];
				if (value === undefined) continue;

				const isSymbol = isNaN(Number(value)) && value !== '.';
				if (isSymbol) {
					isAdjacentToSymbol = true;
					break;
				}
			}
		}

		if (isAdjacentToSymbol) {
			numbersSum += Number(match[0]);
		}
	}
}

console.log(numbersSum);
