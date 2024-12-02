import { readByLine } from '../helpers/readByLine';

function isStepSafe(step: number) {
	const positiveStep = Math.abs(step);
	return positiveStep >= 1 && positiveStep <= 3;
}

function isReportSafe(levels: number[], doubleCheck = true) {
	let lastSign: number | undefined;
	let isSafe = true;

	for (let i = 1; i < levels.length; i++) {
		const step = levels[i - 1] - levels[i];
		if (!isStepSafe(step)) {
			isSafe = false;
			break;
		}

		const sign = Math.sign(step);
		if (lastSign !== undefined && lastSign !== sign) {
			isSafe = false;
			break;
		}

		lastSign = sign;
	}

	if (!doubleCheck) return isSafe;

	for (let i = 0; i < levels.length; i++) {
		const levelsCopy = [...levels];
		levelsCopy.splice(i, 1);
		if (isReportSafe(levelsCopy, false)) return true;
		else continue;
	}

	return false;
}

async function part2() {
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

part2().then(console.log);
