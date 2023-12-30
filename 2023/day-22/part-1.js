import { randomUUID } from 'crypto';
import { readFileSync } from 'fs';
import { join } from 'path';

const ENTRY_DIR = '2023/day-22';
const DATA_FILE_NAMES = ['example.txt', 'input.txt'];

const file = readFileSync(join(ENTRY_DIR, '.', DATA_FILE_NAMES[1])).toString();

class Point {
	static points = new Map();

	static of(x, y, z) {
		const key = `${x}.${y}.${z}`;
		if (Point.points.has(key)) return Point.points.get(key);

		const newPoint = new Point(x, y, z);
		Point.points.set(key, newPoint);
		return newPoint;
	}

	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	compare(otherPoint) {
		return this === otherPoint;
	}

	add(x, y, z) {
		return Point.of(this.x + x, this.y + y, this.z + z);
	}
}

class Brick {
	constructor(head, tail, id) {
		this.id = id;
		this.points = [];
		this.head = Point.of(...head);
		this.tail = Point.of(...tail);

		this.bottomEdges = new Set();
		this.topEdges = new Set();
		this.edges = new Set();

		this.getPoints();
	}

	getPoints() {
		const isDiffX = this.head.x !== this.tail.x;
		const isDiffY = this.head.y !== this.tail.y;
		const isDiffZ = this.head.z !== this.tail.z;

		const points = [this.head, this.tail];

		const getMinMax = (axis) => [
			Math.min(this.head[axis], this.tail[axis]),
			Math.max(this.head[axis], this.tail[axis]),
		];

		if (isDiffX) {
			const [min, max] = getMinMax('x');
			for (let i = min; i <= max; i++) {
				points.push(Point.of(i, this.head.y, this.head.z));
			}
		}

		if (isDiffY) {
			const [min, max] = getMinMax('y');
			for (let i = min; i <= max; i++) {
				points.push(Point.of(this.head.x, i, this.head.z));
			}
		}

		if (isDiffZ) {
			const [min, max] = getMinMax('z');
			for (let i = min; i <= max; i++) {
				points.push(Point.of(this.head.x, this.head.y, i));
			}
		}

		this.points = points;
	}

	getLowestPoint() {
		return this.head.z > this.tail.z ? this.tail : this.head;
	}

	getHighestPoint() {
		return this.head.z > this.tail.z ? this.head : this.tail;
	}

	lower(z) {
		this.head = this.head.add(0, 0, -z);
		this.tail = this.tail.add(0, 0, -z);
		for (let i = 0; i < this.points.length; i++) {
			this.points[i] = this.points[i].add(0, 0, -z);
		}
	}

	intersectsBottomWith(bricks) {
		const intersects = [];

		const lowestPoint = this.getLowestPoint();

		for (const brick of bricks) {
			if (Math.abs(brick.getHighestPoint().z - lowestPoint.z) > 1) {
				continue;
			}

			for (const point of this.points) {
				for (const brickPoint of brick.points) {
					if (point.add(0, 0, -1).compare(brickPoint))
						intersects.push(brick.id);
				}
			}
		}

		return intersects;
	}
}

const bricksMap = new Map();
const bricks = file.split(/\r?\n/).map((row, i) => {
	let [head, tail] = row.split('~');
	head = head.split(',').map(Number);
	tail = tail.split(',').map(Number);

	const brick = new Brick(head, tail, i);
	bricksMap.set(i, brick);
	return brick;
});

// lower bricks
const bricksSorted = bricks.sort((a, b) => {
	if (a.getLowestPoint().z > b.getLowestPoint().z) return 1;
	else return -1;
});

// lowering bricks
const stack = [...bricksSorted];
const lowered = [];
while (stack.length) {
	const brick = stack.shift();

	let intersects = [];
	while (brick.getLowestPoint().z > 1) {
		intersects = brick.intersectsBottomWith(lowered);
		if (intersects.length > 0) break;

		brick.lower(1);
	}

	if (intersects.length) {
		for (const brickId of intersects) {
			const otherBrick = bricksMap.get(brickId);
			otherBrick.topEdges.add(brick.id);
			otherBrick.edges.add(brick.id);

			brick.bottomEdges.add(brickId);
			brick.edges.add(brickId);
		}
	}
	lowered.push(brick);
}

let sum = 0;
for (const brick of bricksMap.values()) {
	const topEdges = [...brick.topEdges];

	let canBeRemoved = true;
	for (const topBrickId of topEdges) {
		const topBrick = bricksMap.get(topBrickId);
		const bottomEdges = [...topBrick.bottomEdges].filter(
			(id) => id !== brick.id
		);
		if (bottomEdges.length === 0) {
			canBeRemoved = false;
			break;
		}
	}

	if (canBeRemoved) sum += 1;
}

console.log(sum);
