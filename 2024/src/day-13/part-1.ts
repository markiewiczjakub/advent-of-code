import { read } from 'src/helpers/read';

const A_TOKENS = 3;
const B_TOKENS = 1;

async function part1() {
	const file = await read({
		scope: import.meta.url,
		name: 'input.txt',
	});

	function getLinearEquation(x1: number, y1: number, x2: number, y2: number) {
		const a = (y2 - y1) / (x2 - x1);
		return {
			a,
			b: y1 - x1 * a,
		};
	}

	function getCommonPoint(a1: number, b1: number, a2: number, b2: number) {
		const x = (b2 - b1) / (a1 - a2);
		if (isNaN(x) || !isFinite(x)) return null;
		const y = a2 * x + b2;
		if (isNaN(y) || !isFinite(y)) return null;

		return { x, y };
	}

	function round(n: number) {
		return Math.round(n * 1_000_000) / 1_000_000;
	}

	function getClicks(
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		x3: number,
		y3: number
	) {
		const { a: aA, b: bA } = getLinearEquation(0, 0, x1, y1);
		const { a: aB, b: bB } = getLinearEquation(x3 - x2, y3 - y2, x3, y3);

		const point = getCommonPoint(aA, bA, aB, bB);

		const clicksAByX = round(point.x / x1);
		const clicksAByY = round(point.y / y1);
		if (clicksAByX !== clicksAByY)
			throw new Error(
				`Should not happen ${clicksAByX} !== ${clicksAByY}`
			);
		const clicksA = clicksAByX;

		const clicksBByX = round((x3 - point.x) / x2);
		const clicksBByY = round((y3 - point.y) / y2);
		if (clicksBByX !== clicksBByY)
			throw new Error(
				`Should not happen ${clicksBByX} !== ${clicksBByY}`
			);
		const clicksB = clicksBByX;

		if (clicksA % 1 === 0 && clicksB % 1 === 0) {
			return [clicksA, clicksB];
		}

		return null;
	}

	return file.split('\n\n').reduce((sum, machine) => {
		const [buttonA, buttonB, prize] = machine.split('\n');

		// A
		const [_xa, _ya] = buttonA.split(':')[1].trim().split(',');
		const xa = Number(_xa.trim().replace('X', ''));
		const ya = Number(_ya.trim().replace('Y', ''));

		// B
		const [_xb, _yb] = buttonB.split(':')[1].trim().split(',');
		const xb = Number(_xb.trim().replace('X', ''));
		const yb = Number(_yb.trim().replace('Y', ''));

		// Prize
		const [_xp, _yp] = prize.split(':')[1].trim().split(',');
		const xp = Number(_xp.trim().replace('X=', ''));
		const yp = Number(_yp.trim().replace('Y=', ''));

		// A -> B
		const possibleScores: number[] = [];

		const clicksAB = getClicks(xa, ya, xb, yb, xp, yp);
		if (clicksAB) {
			const score = clicksAB[0] * A_TOKENS + clicksAB[1] * B_TOKENS;
			possibleScores.push(score);
		}
		const clicksBA = getClicks(xb, yb, xa, ya, xp, yp);
		if (clicksBA) {
			const score = clicksBA[0] * B_TOKENS + clicksBA[1] * A_TOKENS;
			possibleScores.push(score);
		}

		if (possibleScores.length > 0) sum += Math.min(...possibleScores);

		return sum;
	}, 0);
}

part1().then(console.log);
