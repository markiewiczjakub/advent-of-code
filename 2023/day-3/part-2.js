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
const digitRegEx = /\d+/g;
const rows = file.split(/\r?\n/);

const numberPositions = [];
for (let y = 0; y < rows.length; y++) {
	let match;
	while ((match = digitRegEx.exec(rows[y])) != null) {
		numberPositions.push({
			value: Number(match[0]),
			y,
			startX: Number(match.index),
			endX: Number(match.index + match[0].length),
		});
	}
}

let powersSum = 0;
for (let y = 0; y < rows.length; y++) {
	for (let x = 0; x < rows[y].length; x++) {
		if (rows[y][x] !== '*') continue;

		const matches = {};
		for (const [dx, dy] of dirs) {
			const [nx, ny] = [x + dx, y + dy];

			const value = rows[ny]?.[nx];
			if (value === undefined) continue;

			const isNumber = !isNaN(Number(value));
			if (isNumber) {
				// find number at found index
				const {
					value: num,
					startX,
					endX,
				} = numberPositions.find(
					(entry) =>
						entry.startX <= nx && nx <= entry.endX && ny === entry.y
				);

				// prevent same number duplicates on different indexes
				if (
					!Object.values(matches).some(
						([x1, x2, y]) => x1 <= nx && nx <= x2 && ny === y
					)
				) {
					matches[num] = [startX, endX, ny];
				}
			}
		}

		const numbers = Object.keys(matches).map(Number);
		if (numbers.length === 2) {
			const power = numbers.reduce((p, num) => p * num, 1);
			powersSum += power;
		}
	}
}

console.log(powersSum);
