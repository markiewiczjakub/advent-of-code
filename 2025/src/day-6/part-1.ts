import { read } from '../helpers/read';

async function part1() {
	const content = await read({ scope: import.meta.url, name: 'input.txt' });

	const lines = content.split('\n');
	const numbers: Record<number, number[]> = {};

	let sum = 0;
	for (const line of lines) {
		const parsedLine = line.trim().split(/\s+/);
		
		for(let i = 0; i < parsedLine.length; i++) {
			if(!numbers[i]) numbers[i] = [];

			const v = parsedLine[i];
			if(v === '*' || v === '+') sum += doMath(numbers[i], v);
			else numbers[i].push(parseInt(v))
		}
	}

	return sum;
}

function doMath(input: number[], operation: '+' | '*'): number {
	return input.reduce((prev, v) => {
		if(operation === '*') return prev * v;
		else if(operation === '+') return prev + v;
	})
}

part1().then(console.log);
