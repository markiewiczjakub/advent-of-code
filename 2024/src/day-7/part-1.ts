import { readByLine } from '../helpers/readByLine';

async function part1() {
	const combinations = new Map<number, string[]>();

	function generateCombinations(n: number) {
		if (combinations.has(n)) return combinations.get(n);

		const result: string[] = [];
		function backtrack(current: string) {
			if (current.length === n) {
				result.push(current);
				return;
			}

			backtrack(`${current}+`);
			backtrack(`${current}*`);
		}

		backtrack('');

		combinations.set(n, result);
		return result;
	}

	let sum = 0;

	function evaluate(
		matchResult: number,
		equation: number[],
		operations: string[]
	) {
		for (const operation of operations) {
			let result = equation[0];
			for (let i = 1; i < equation.length; i++) {
				switch (operation[i - 1]) {
					case '*':
						result *= equation[i];
						break;
					case '+':
						result += equation[i];
						break;
				}
			}

			if (result === matchResult) {
				sum += matchResult;
				break;
			}
		}
	}

	await new Promise<void>((resolve) =>
		readByLine({
			scope: import.meta.url,
			name: 'input.txt',
			onLine: (line) => {
				const [left, right] = line.split(':');
				const result = Number(left);
				const equation = right.trim().split(/\s+/).map(Number);

				const operations = generateCombinations(equation.length - 1);

				evaluate(result, equation, operations);
			},
			onClose: resolve,
		})
	);

	return sum;
}

part1().then(console.log);
