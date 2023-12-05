import { readFileSync } from 'fs';
import { join } from 'path';

const ENTRY_DIR = '2023/day-4';
const DATA_FILE_NAMES = ['example.txt', 'input.txt'];

const file = readFileSync(join(ENTRY_DIR, '.', DATA_FILE_NAMES[1])).toString();

const cardWin = {};

const splitRegEx = /\s+/g;
const rows = file.split(/\r?\n/);
for (const row of rows) {
	const [cardData, numbers] = row.split(':');
	const [, cardId] = cardData.split(splitRegEx);

	const [winningNums, nums] = numbers.split('|');
	const winningNumsMap = winningNums
		.trim()
		.split(splitRegEx)
		.reduce((acc, value) => {
			acc[value] = true;
			return acc;
		}, {});

	const matchingNums = nums
		.trim()
		.split(splitRegEx)
		.filter((value) => winningNumsMap[value]);

	cardWin[cardId] = matchingNums.length;
}

const cards = Array(Object.keys(cardWin).length).fill(1);

for (let i = 0; i < rows.length; i++) {
	const matches = cardWin[i + 1];
	if (matches === 0) continue;

	for (let j = 1; j <= matches; j++) {
		if (cards[i + j]) cards[i + j] += cards[i];
	}
}

const cardsCount = cards.reduce((sum, value) => sum + value, 0);
console.log(cardsCount);
