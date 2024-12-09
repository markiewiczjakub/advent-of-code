import { read } from '../helpers/read';

async function part1() {
	const file = await read({
		scope: import.meta.url,
		name: 'input.txt',
	});

	const data = file.split('').map(Number);

	const disk: number[] = [];
	let isFile = true;
	let fileIndex = 0;
	for (let i = 0; i < data.length; i++) {
		for (let j = 0; j < data[i]; j++) {
			disk.push(isFile ? fileIndex : -1);
		}

		if (isFile) fileIndex++;
		isFile = !isFile;
	}

	const reorderedDisk: number[] = [];

	while (disk.length) {
		const element = disk.shift();

		// clean empty trail
		while (disk[disk.length - 1] === -1) {
			disk.pop();
		}

		if (element === -1) {
			const file = disk.pop();
			reorderedDisk.push(file);
		} else {
			reorderedDisk.push(element);
		}
	}

	return reorderedDisk.reduce((sum, file, index) => {
		sum += file * index;
		return sum;
	}, 0);
}

part1().then(console.log);
