import { readByLine } from '../helpers/readByLine';

async function part2() {
	const leftList: number[] = [];
	const rightMap = new Map<number, number>();

	await new Promise<void>((resolve) =>
		readByLine({
			scope: import.meta.url,
			name: 'input.txt',
			onLine(line) {
				const [left, right] = line.split(/\s+/).map(Number);
				leftList.push(left);

				const count = rightMap.get(right) ?? 0;
				rightMap.set(right, count + 1);
			},
			onClose: resolve,
		})
	);

	let scoreSum = 0;

	for (let i = 0; i < leftList.length; i++) {
		const num = leftList[i];
		scoreSum += num * (rightMap.get(num) ?? 0);
	}

	return scoreSum;
}

part2().then(console.log);
