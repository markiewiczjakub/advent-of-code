import { readFileSync } from 'fs';
import { join } from 'path';

const ENTRY_DIR = '2023/day-15';
const DATA_FILE_NAMES = ['example.txt', 'input.txt'];

const file = readFileSync(join(ENTRY_DIR, '.', DATA_FILE_NAMES[1])).toString();

const words = file
	.trim()
	.split(',')
	.map((s) => s.trim());

const hashMap = Array(256)
	.fill(null)
	.reduce((acc, _, index) => {
		acc[index] = {
			values: {},
			order: [],
		};
		return acc;
	}, {});

for (const word of words) {
	if (word.endsWith('-')) {
		const label = word.replace('-', '');
		const boxId = String(hashAlg(label));

		delete hashMap[boxId].values[label];
		const labelIndex = hashMap[boxId].order.indexOf(label);
		if (labelIndex !== -1) hashMap[boxId].order.splice(labelIndex, 1);
	} else {
		const [label, value] = word.split('=');
		const boxId = String(hashAlg(label));

		hashMap[boxId].values[label] = Number(value);
		const labelIndex = hashMap[boxId].order.indexOf(label);
		if (labelIndex === -1) hashMap[boxId].order.push(label);
	}
}

let sum = 0;
for (const boxId in hashMap) {
	if (!hashMap[boxId].order.length) continue;

	let boxSum = 0;
	for (let i = 0; i < hashMap[boxId].order.length; i++) {
		const label = hashMap[boxId].order[i];
		const value = hashMap[boxId].values[label];
		sum += (1 + Number(boxId)) * (i + 1) * value;
	}
	sum += boxSum;
}

console.log(sum);

function hashAlg(word) {
	let currentValue = 0;

	for (let i = 0; i < word.length; i++) {
		currentValue += word.charCodeAt(i);
		currentValue *= 17;
		currentValue %= 256;
	}

	return currentValue;
}
