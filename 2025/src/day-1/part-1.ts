import { readByLine } from '../helpers/readByLine';

async function part1() {
	let currentDelta = 50;
	let pointsAt0Count = 0;

	await new Promise<void>((resolve) =>
		readByLine({
			scope: import.meta.url,
			name: 'input.txt',
			onLine(line) {
				const [direction, ...deltaUnparsed] = line.split('') as [
					'L' | 'R',
					...string[]
				];
				const delta = parseInt(deltaUnparsed.join(''));
				const sign = direction === 'L' ? -1 : 1;
				currentDelta = (currentDelta + sign * delta) % 100;
				if (currentDelta === 0) pointsAt0Count++;
			},
			onClose: resolve,
		})
	);

	return pointsAt0Count;
}

part1().then(console.log);
