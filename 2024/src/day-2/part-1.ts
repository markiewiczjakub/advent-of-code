import { readByLine } from '../helpers/readByLine';

function isStepSafe(step: number) {
	const positiveStep = Math.abs(step);
	return positiveStep >= 1 && positiveStep <= 3;
}

function isReportSafe(levels: number[]) {
	let lastSign: number | undefined;

	for (let i = 1; i < levels.length; i++) {
		const step = levels[i - 1] - levels[i];
		if (!isStepSafe(step)) return false;

		const sign = Math.sign(step);
		if (lastSign !== undefined && lastSign !== sign) return false;

		lastSign = sign;
	}

	return true;
}

async function part1() {
	let safeSum = 0;

	await new Promise<void>((resolve) =>
		readByLine({
			scope: import.meta.url,
			name: 'input.txt',
			onLine(line) {
				const report = line.split(/\s+/).map(Number);
				if (isReportSafe(report)) safeSum++;
			},
			onClose: resolve,
		})
	);

	return safeSum;
}

part1().then(console.log);
