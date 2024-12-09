import { read } from '../helpers/read';

type Block = { size: number; value: number; processed?: boolean };

async function part2() {
	const file = await read({
		scope: import.meta.url,
		name: 'input.txt',
	});

	const data = file.split('').map(Number);

	let blocks: Block[] = [];
	let isFile = true;
	let fileIndex = 0;
	for (let i = 0; i < data.length; i++) {
		if (isFile) {
			blocks.push({
				size: data[i],
				value: fileIndex,
			});
		} else {
			blocks.push({
				size: data[i],
				value: -1,
			});
		}

		if (isFile) fileIndex++;
		isFile = !isFile;
	}

	while (!blocks.every((b) => b.processed)) {
		let processingIndex = -1;
		for (let i = blocks.length - 1; i >= 0; i--) {
			if (!blocks[i].processed) {
				processingIndex = i;
				break;
			}
		}

		const block = blocks[processingIndex];
		if (!block.processed && block.value !== -1) {
			let index = -1;
			for (let i = 0; i < blocks.length; i++) {
				if (blocks[i].value !== -1) continue;
				if (blocks[i].size < block.size) continue;
				if (i > processingIndex) break;

				blocks[i].size = blocks[i].size - block.size;
				blocks[processingIndex] = {
					...block,
					value: -1,
				};
				index = i;
				break;
			}

			if (index !== -1) {
				blocks.splice(index, 0, block);
			}

			block.processed = true;
		} else if (!block.processed && block.value === -1) {
			block.processed = true;
		}

		// reorganize
		const newBlocks: Block[] = [];
		for (let i = 0; i < blocks.length; i++) {
			const block = blocks[i];
			if (block.size === 0) continue;
			if (block.value === -1) {
				if (newBlocks[newBlocks.length - 1]?.value === -1) {
					newBlocks[newBlocks.length - 1].size += block.size;
				} else {
					newBlocks.push(block);
				}
			} else {
				newBlocks.push(block);
			}
		}
		blocks = newBlocks;
	}

	let sum = 0;
	let lastIndex = 0;
	for (let i = 0; i < blocks.length; i++) {
		const block = blocks[i];

		if (block.value !== -1) {
			for (let j = 0; j < block.size; j++) {
				sum += (lastIndex + i + j) * block.value;
			}
		}

		lastIndex += block.size - 1;
	}

	return sum;
}

part2().then(console.log);
