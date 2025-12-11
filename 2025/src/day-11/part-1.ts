import { readByLine } from '../helpers/readByLine';

async function part1() {
	const graph: Record<string, string[]> = {};

	await new Promise<void>((resolve) =>
		readByLine({
			scope: import.meta.url,
			name: 'input.txt',
			onLine(line) {
				const [from, toUnparsed] = line.split(':');
				const to = toUnparsed.trim().split(/\s+/);
				graph[from] = to;
			},
			onClose: resolve,
		})
	);

	const cache = new Map<string, number>();
	function dfs(device: string): number {
		if (device === 'out') return 1;

		if (cache.has(device)) return cache.get(device);

		let sum = 0;
		for (const child of graph[device]) {
			sum += dfs(child);
		}
		cache.set(device, sum);
		return sum;
	}

	return dfs('you');
}

part1().then(console.log);
