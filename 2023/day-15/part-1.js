import { readFileSync } from 'fs';
import { join } from 'path';

const ENTRY_DIR = '2023/day-15';
const DATA_FILE_NAMES = ['example.txt', 'input.txt'];

const file = readFileSync(join(ENTRY_DIR, '.', DATA_FILE_NAMES[1])).toString();

const words = file
	.trim()
	.split(',')
	.map((s) => s.trim());

let sum = 0;
for (const word of words) {
	let currentValue = 0;

	for (let i = 0; i < word.length; i++) {
		currentValue += word.charCodeAt(i);
		currentValue *= 17;
		currentValue %= 256;
	}

	sum += currentValue;
}

console.log(sum);
