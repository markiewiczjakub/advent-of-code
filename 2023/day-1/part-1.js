import { readFileSync } from 'fs';
import { join } from 'path';

const ENTRY_DIR = '2023/day-1';
const DATA_FILE_NAMES = ['part-1-example.txt', 'input.txt'];

const file = readFileSync(join(ENTRY_DIR, '.', DATA_FILE_NAMES[1])).toString();

const result = file
	.split(/\r?\n/)
	.map((row) => {
		const digits = row.match(/\d/g);
		const joinedDigits =
			digits.length > 1
				? `${digits[0]}${digits[digits.length - 1]}`
				: `${digits[0]}${digits[0]}`;

		return Number(joinedDigits);
	})
	.reduce((sum, value) => sum + value, 0);

console.log(result);
