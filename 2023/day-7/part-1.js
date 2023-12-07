import { readFileSync } from 'fs';
import { join } from 'path';

const ENTRY_DIR = '2023/day-7';
const DATA_FILE_NAMES = ['example.txt', 'input.txt'];

const CARD_VALUES = [
	'A',
	'K',
	'Q',
	'J',
	'T',
	'9',
	'8',
	'7',
	'6',
	'5',
	'4',
	'3',
	'2',
].reverse();

const file = readFileSync(join(ENTRY_DIR, '.', DATA_FILE_NAMES[1])).toString();

const games = file
	.split(/\r?\n/)
	.map((game) => game.split(/\s+/).map((part) => part.trim()));

const hands = [];
const bids = [];
const handCardsCount = {};
const types = {
	five: [],
	four: [],
	full: [],
	three: [],
	two: [],
	one: [],
	high: [],
};

for (let i = 0; i < games.length; i++) {
	const hand = games[i][0];
	hands.push(hand);

	const bid = Number(games[i][1]);
	bids.push(bid);

	handCardsCount[i] = hand.split('').reduce((acc, card) => {
		acc[card] = (acc[card] ?? 0) + 1;
		return acc;
	}, {});

	const handCount = handCardsCount[i];
	if (isFive(handCount)) {
		types.five.push(i);
	} else if (isFour(handCount)) {
		types.four.push(i);
	} else if (isFull(handCount)) {
		types.full.push(i);
	} else if (isThree(handCount)) {
		types.three.push(i);
	} else if (isTwo(handCount)) {
		types.two.push(i);
	} else if (isOne(handCount)) {
		types.one.push(i);
	} else {
		types.high.push(i);
	}
}

for (const type in types) {
	const handIndexes = types[type];
	if (handIndexes.length < 2) continue;

	handIndexes.sort((a, b) => {
		for (let i = 0; i < 5; i++) {
			const cardA = hands[a][i];
			const cardB = hands[b][i];

			if (cardA === cardB) continue;

			return CARD_VALUES.indexOf(cardA) > CARD_VALUES.indexOf(cardB)
				? -1
				: 1;
		}

		return 0;
	});
}

const sum = Object.values(types)
	.flat()
	.map((handIndex, index) => {
		const rank = hands.length - index;
		const bid = bids[handIndex];
		return bid * rank;
	})
	.reduce((sum, value) => {
		sum += value;
		return sum;
	}, 0);

console.log(sum);

function isFive(cardsCount) {
	return Object.values(cardsCount).some((value) => value === 5);
}

function isFour(cardsCount) {
	return Object.values(cardsCount).some((value) => value === 4);
}

function isFull(cardsCount) {
	return (
		Object.values(cardsCount).some((value) => value === 3) &&
		Object.values(cardsCount).some((value) => value === 2)
	);
}

function isThree(cardsCount) {
	return Object.values(cardsCount).some((value) => value === 3);
}

function isTwo(cardsCount) {
	return Object.values(cardsCount).filter((value) => value === 2).length > 1;
}

function isOne(cardsCount) {
	return Object.values(cardsCount).some((value) => value === 2);
}
