import { read } from 'src/helpers/read';

async function part1() {
	const code = await read({
		scope: import.meta.url,
		name: 'input.txt',
	});

	return code.match(/mul\([0-9]+\,[0-9]+\)/gm).reduce((sum, operation) => {
		const [a, b] = operation
			.replace('mul(', '')
			.replace(')', '')
			.split(',');
		sum += Number(a) * Number(b);
		return sum;
	}, 0);
}

part1().then(console.log);
