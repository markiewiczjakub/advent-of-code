import { readByLine } from '../helpers/readByLine';

async function part2() {
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

				const fullRotationCount = Math.floor(delta / 100);
				pointsAt0Count += fullRotationCount;
				const remainingClicks = delta % 100;

				if (currentDelta > 0) {
					if (sign === -1 && currentDelta - remainingClicks <= 0)
						pointsAt0Count++;
					if (sign === 1 && currentDelta + remainingClicks > 99)
						pointsAt0Count++;
				}

				currentDelta =
					(100 + currentDelta + sign * remainingClicks) % 100;
			},
			onClose: resolve,
		})
	);

	return pointsAt0Count;
}

part2().then(console.log);
