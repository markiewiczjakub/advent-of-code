import { readFileSync } from 'fs';
import { join } from 'path';

const ENTRY_DIR = '2023/day-9';
const DATA_FILE_NAMES = ['example.txt', 'input.txt'];

const file = readFileSync(join(ENTRY_DIR, '.', DATA_FILE_NAMES[1])).toString();

const sequences = file.split(/\r?\n/);

let productSum = 0;
for (const sequence of sequences) {
	const numbers = sequence.split(/\s+/).map(Number);

	const subSequences = [numbers];
	let currentSubSequence = numbers;

	while (!currentSubSequence.every((value) => value === 0)) {
		const newSubSequence = [];
		for (let i = 0; i < currentSubSequence.length - 1; i++) {
			const [a, b] = [currentSubSequence[i], currentSubSequence[i + 1]];
			newSubSequence.push(b - a);
		}
		subSequences.push(newSubSequence);
		currentSubSequence = newSubSequence;
	}

	let product = 0;
	for (let i = subSequences.length - 1; i >= 0; i--) {
		const lastItem = subSequences[i][0];
		product = lastItem - product;
	}

	productSum += product;
}

console.log(productSum);
