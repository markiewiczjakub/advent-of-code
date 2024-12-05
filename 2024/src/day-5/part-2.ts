import { read } from '../helpers/read';

async function part2() {
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

	function reorderUpdate(update: number[]) {
		// Topological sort
		const graph = new Map<number, number[]>();
		const inDegree = new Map<number, number>();

		for (let i = 0; i < update.length; i++) {
			const pageNumber = update[i];
			graph.set(pageNumber, []);
			inDegree.set(pageNumber, 0);
		}

		for (const [before, after] of rules) {
			if (!graph.has(before) || !graph.has(after)) continue;

			graph.get(before).push(after);
			inDegree.set(after, (inDegree.get(after) ?? 0) + 1);
		}

		const queue: number[] = [];
		inDegree.forEach((degree, pageNumber) => {
			if (degree > 0) return;
			queue.push(pageNumber);
		});

		const result: number[] = [];

		while (queue.length > 0) {
			const pageNumber = queue.shift();
			result.push(pageNumber);

			const neighbors = graph.get(pageNumber);
			for (let i = 0; i < neighbors.length; i++) {
				const neighbor = neighbors[i];
				const newInDegree = inDegree.get(neighbor) - 1;
				inDegree.set(neighbor, newInDegree);
				if (newInDegree === 0) queue.push(neighbor);
			}
		}

		return result;
	}

	let sum = 0;
	for (let i = 0; i < updates.length; i++) {
		const update = updates[i].split(',').map(Number);
		if (isUpdateValid(update)) continue;

		const updateSorted = reorderUpdate(update);
		const middle = updateSorted[Math.floor(updateSorted.length / 2)];
		sum += middle;
	}

	return sum;
}

part2().then(console.log);
