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
	let highestLeftValueIndex = 0;
	let highestLeftValue = -Infinity;
	for (let i = 0; i < bank.length - 1; i++) {
		const value = bank[i];
		if (value > highestLeftValue) {
			highestLeftValue = value;
			highestLeftValueIndex = i;
		}
	}

	let highestRightValue = -Infinity;
	for (let i = highestLeftValueIndex + 1; i < bank.length; i++) {
		const value = bank[i];
		if (value > highestRightValue) {
			highestRightValue = value;
		}
	}

	return highestLeftValue * 10 + highestRightValue;
}
