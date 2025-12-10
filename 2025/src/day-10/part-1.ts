import { readByLine } from '../helpers/readByLine';

type Machine = {
	target: boolean[];
	buttons: number[][];
};

async function part1() {
	let sum = 0;

	await new Promise<void>((resolve) =>
		readByLine({
			scope: import.meta.url,
			name: 'input.txt',
			onLine(line) {
				const data = line.split(/\s+/);
				data.pop(); // remove unused joltage data

				const target = data
					.shift()
					.slice(1, -1)
					.split('')
					.map((v) => v === '#');
				const buttons = data.map((v) =>
					v.slice(1, -1).split(',').map(Number)
				);
				sum += solveMachine({ target, buttons });
			},
			onClose: resolve,
		})
	);

	return sum;
}

part1().then(console.log);

function simulate(
	target: boolean[],
	buttons: number[][],
	mask: number
): number | null {
	const m = target.length;
	const lights = new Array(m).fill(false);

	let presses = 0;

	for (let b = 0; b < buttons.length; b++) {
		if (mask & (1 << b)) {
			presses++;
			for (const light of buttons[b]) {
				lights[light] = !lights[light];
			}
		}
	}

	for (let i = 0; i < m; i++) {
		if (lights[i] !== target[i]) return null;
	}

	return presses;
}

function solveMachine(machine: Machine): number {
	const n = machine.buttons.length;
	let best = Infinity;

	const limit = 1 << n;

	for (let mask = 0; mask < limit; mask++) {
		const presses = simulate(machine.target, machine.buttons, mask);
		if (presses !== null && presses < best) {
			best = presses;
		}
	}

	return best;
}
