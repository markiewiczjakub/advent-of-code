import { readByLine } from '../helpers/readByLine';

async function part1() {
	const leftList: number[] = [];
	const rightList: number[] = [];

	await new Promise<void>((resolve) =>
		readByLine({
			scope: import.meta.url,
			name: 'input.txt',
			onLine(line) {
				const [left, right] = line.split(/\s+/).map(Number);
				leftList.push(left);
				rightList.push(right);
			},
			onClose: resolve,
		})
	);

	if (leftList.length !== rightList.length) {
		throw new Error('Invalid length');
	}

	leftList.sort((a, b) => a - b);
	rightList.sort((a, b) => a - b);

	let sum = 0;
	for (let i = 0; i < leftList.length; i++) {
		sum += Math.abs(leftList[i] - rightList[i]);
	}
	return sum;
}

part1().then(console.log);
