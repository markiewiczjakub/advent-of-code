import { readByLine } from '../helpers/readByLine';

async function part1() {
	let sum = 0;

	await new Promise<void>((resolve) =>
		readByLine({
			scope: import.meta.url,
			name: 'input.txt',
			onLine(line) {
				sum += findLargestJoltage(line.split('').map(Number));
			},
			onClose: resolve,
		})
	);

	return sum;
}

part1().then(console.log);

function findLargestJoltage(bank: number[]) {
	const n: number[] = [];

	let currentHighestIndex = 0;
	for (let i = 12; i > 0; i--) {
		let highestValue = -Infinity;
		let highestIndex = currentHighestIndex;

		for (let j = currentHighestIndex; j <= bank.length - i; j++) {
			const value = bank[j];
			if (value > highestValue) {
				highestValue = value;
				highestIndex = j;
			}
		}

		n.push(highestValue);
		currentHighestIndex = highestIndex + 1;
	}

	return buildNumber(n);
}

// [1, 2, 3] -> 123
function buildNumber(bank: number[]): number {
	let n = 0;
	for (let i = 0; i < bank.length; i++) {
		n += bank[i] * 10 ** (bank.length - i - 1);
	}
	return n;
}
