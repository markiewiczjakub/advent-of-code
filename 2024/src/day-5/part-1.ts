import { read } from '../helpers/read';

async function part1() {
	const rules: Array<[number, number]> = [];

	const file = await read({
		scope: import.meta.url,
		name: 'input.txt',
	});

	const [ordersString, updatesString] = file.split('\n\n');
	const orders = ordersString.split('\n');
	const updates = updatesString.split('\n');

	for (let i = 0; i < orders.length; i++) {
		rules.push(orders[i].split('|').map(Number) as [number, number]);
	}

	function isUpdateValid(update: number[]) {
		for (const [before, after] of rules) {
			const beforeIndex = update.indexOf(before);
			const afterIndex = update.indexOf(after);

			if (beforeIndex !== -1 && afterIndex !== -1)
				if (beforeIndex > afterIndex) return false;
		}

		return true;
	}

	let sum = 0;
	for (let i = 0; i < updates.length; i++) {
		const update = updates[i].split(',').map(Number);
		if (isUpdateValid(update)) {
			const middle = update[Math.floor(update.length / 2)];
			sum += middle;
		}
	}

	return sum;
}

part1().then(console.log);
