import { read } from '../helpers/read';

type Operator = '+' | '*';
async function part2() {
	const content = await read({ scope: import.meta.url, name: 'input.txt' });

	const lines = content.split('\n').map((v) => v.split(''));

	let sum = 0;
	let currentColumnIndexes: number[] = [];
	let currentOperator: Operator = '*';
	for (let i = 0; i < lines[lines.length - 1].length; i++) {
		const value = lines[lines.length - 1][i];
		if (isOperator(value)) currentOperator = value;

		const nextValue = lines[lines.length - 1][i + 1];
		if (nextValue === undefined) currentColumnIndexes.unshift(i);

		if (isOperator(nextValue) || nextValue === undefined) {
			const numbers = [];

			for (const index of currentColumnIndexes) {
				let number = '';
				for (let j = 0; j < lines.length - 1; j++) {
					number += lines[j][index];
				}

				numbers.push(parseInt(number));
			}
			sum += doMath(numbers, currentOperator);

			currentColumnIndexes = [];
		} else {
			currentColumnIndexes.unshift(i);
		}
	}

	return sum;
}

function isOperator(operator: string) {
	return operator === '+' || operator === '*';
}

function doMath(input: number[], operation: Operator): number {
	return input.reduce((prev, v) => {
		if (operation === '*') return prev * v;
		else if (operation === '+') return prev + v;
	});
}

part2().then(console.log);
