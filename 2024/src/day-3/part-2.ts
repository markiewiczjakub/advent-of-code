import { read } from 'src/helpers/read';

async function part2() {
	const code = await read({
		scope: import.meta.url,
		name: 'input.txt',
	});

	let sum = 0;
	let currentIndex = 0;
	let isEnabled = true;

	while (currentIndex < code.length - 1) {
		const subCode = code.slice(currentIndex, code.length - 1);

		if (/^do\(\)/i.test(subCode)) {
			isEnabled = true;
			currentIndex += 'do()'.length - 1;
		} else if (/^don\'t\(\)/i.test(subCode)) {
			isEnabled = false;
			currentIndex += "don't()".length - 1;
		} else if (isEnabled && /^mul\([0-9]+\,[0-9]+\)/i.test(subCode)) {
			const [operation] = subCode.match(/^mul\([0-9]+\,[0-9]+\)/);
			const [a, b] = operation
				.replace('mul(', '')
				.replace(')', '')
				.split(',');
			sum += Number(a) * Number(b);
			currentIndex += operation.length - 1;
		} else {
			currentIndex++;
		}
	}

	return sum;
}

part2().then(console.log);
