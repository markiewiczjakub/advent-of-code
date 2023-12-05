import { readFileSync } from 'fs';
import { join } from 'path';

const ENTRY_DIR = '2023/day-1';
const DATA_FILE_NAMES = ['part-2-example.txt', 'input.txt'];

const file = readFileSync(join(ENTRY_DIR, '.', DATA_FILE_NAMES[1])).toString();

const wordDigitMap = {
	one: 1,
	two: 2,
	three: 3,
	four: 4,
	five: 5,
	six: 6,
	seven: 7,
	eight: 8,
	nine: 9,
};

const result = file
	.split(/\r?\n/)
	.map((row) => {
		const digits = [];

		for (let i = 0; i < row.length; i++) {
			if (!isNaN(Number(row[i]))) {
				digits.push(row[i]);
				continue;
			}

			const partialString = row.substring(i);
			if (partialString.length < 3) continue;
			for (const wordDigit of Object.keys(wordDigitMap)) {
				if (!partialString.startsWith(wordDigit)) continue;

				digits.push(wordDigitMap[wordDigit]);
			}
		}

		const joinedDigits =
			digits.length > 1
				? `${digits[0]}${digits[digits.length - 1]}`
				: `${digits[0]}${digits[0]}`;

		return Number(joinedDigits);
	})
	.reduce((sum, value) => sum + value, 0);

console.log(result);
