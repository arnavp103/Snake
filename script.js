"use strict";
// 		constrain() {
// 			const ground = gameCanvas.canvas.height - this.dimension;
// 			const walls = gameCanvas.canvas.width - this.dimension;
// 			if (this.y > ground || this.y < 0 || this.x > walls || this.x < 0) {
// 				this.yspeed = 0;
// 				this.xspeed = 0;
// 			}
// 		}

const canv = document.getElementById("canvas");
canv.width = window.innerHeight * 0.8;
canv.height = window.innerHeight * 0.8; // consider the grid to be 100 across and 100 tall
let ctx = canv.getContext("2d");
ctx.lineJoin = "round"; // How do lines connect
ctx.lineCap = "round"; // How do lines finish off

const dim = canv.height * 0.02;

document.querySelector("header").style.width = `${canv.width}px`;

const squares = new Array(50).fill(0).map(() => new Array(50)); // 50 cuz dim = 2%
for (let i = 0; i < squares.length; i++) {
	for (let j = 0; j < squares.length; j++) {
		squares[i][j] = [dim * i, dim * j];
	}
}

class Snake {
	#maxFood = 1;
	food = [];
	body = []; // all 3 of their elements should of form [x, y]
	toInsert = [];
	// x and y are the indices that represent the starting position
	constructor(x, y) {
		this.head = [x, y];
		this.xspeed = 0;
		this.yspeed = 0;
		this.color = `hsl(${this.head[0] + this.head[1] + 271}, 100%, 53%)`;
		ctx.fillStyle = this.color;
		ctx.fillRect(this.head[0], this.head[1], dim, dim);
	}

	draw() {
		try {
			ctx.clearRect(
				...squares[this.head[0] - this.xspeed][
					this.head[1] - this.yspeed
				],
				dim,
				dim
			);
			if (this.body.length) {
				ctx.clearRect(
					...squares[this.toBeRemoved[0]][this.toBeRemoved[1]],
					dim,
					dim
				);
			}
			ctx.fillStyle = "fuchsia";
			ctx.fillRect(...squares[this.head[0]][this.head[1]], dim, dim);
			ctx.fillStyle = this.color;
			for (let i = 0; i < this.body.length; i++) {
				ctx.fillRect(
					...squares[this.body[i][0]][this.body[i][1]],
					dim,
					dim
				);
			}
		} catch (error) {
			console.log(error);
			clearInterval(intervals[0]);
		}
	}

	eat() {
		for (let i = 0; i < this.food.length; i++) {
			if (
				this.head[0] === this.food[i][0] &&
				this.head[1] === this.food[i][1]
			) {
				this.toInsert.push([
					...this.head,
					ticker + this.body.length + 1
				]);
				this.food.splice(i, 1);
			}
		}
	}

	insert() {
		if (this.toInsert.length > 0 && this.toInsert[0][2] == ticker) {
			this.body.push([this.toInsert[0][0], this.toInsert[0][1]]);
			this.toInsert.shift();
		}
	}

	move() {
		if (this.body.length > 0) {
			this.toBeRemoved = this.body.pop();
			this.body.unshift([...this.head]);
		}
		this.head[0] += this.xspeed;
		this.head[1] += this.yspeed;
		document.addEventListener("keydown", (press) => {
			switch (press.key) {
				case "ArrowLeft":
					if (this.xspeed === 1) {
						break;
					}
					this.yspeed = 0;
					this.xspeed = -1;
					break;
				case "ArrowUp":
					if (this.yspeed === 1) {
						break;
					}
					this.yspeed = -1;
					this.xspeed = 0;
					break;
				case "ArrowRight":
					if (this.xspeed === -1) {
						break;
					}
					this.yspeed = 0;
					this.xspeed = 1;
					break;
				case "ArrowDown":
					if (this.yspeed === -1) {
						break;
					}
					this.yspeed = 1;
					this.xspeed = 0;
					break;
				default:
					break;
			}
		});
	}

	collide() {
		for (let i = 0; i < this.body.length; i++) {
			if (
				this.head[0] === this.body[i][0] &&
				this.head[1] === this.body[i][1]
			) {
				console.log("gg! Score: ", this.body.length+1);
				clearInterval(intervals[0]);
			}
		}
	}

	// makes food only if we can make more food
	fillFood() {
		this.food.length < this.#maxFood && this.makeFood();
	}
	makeFood() {
		ctx.fillStyle = "red";
		const foodpos = [
			Math.round(Math.random() * 49),
			Math.round(Math.random() * 49)
		];
		this.food.push(foodpos);
		for (let i = 0; i < this.food.length; i++) {
			ctx.fillRect(
				...squares[this.food[i][0]][this.food[i][1]],
				dim,
				dim
			);
		}
	}

	clear() {
		clearInterval(intervals[0]);
		try{
			ctx.clearRect(
				...squares[this.head[0]][
					this.head[1]
				],
				dim,
				dim
			);
		} catch{
			console.log("OK");
		}
		if (this.body.length) {
			for (let i = 0; i < this.body.length; i++) {
				ctx.clearRect(
					...squares[this.body[i][0]][this.body[i][1]],
					dim,
					dim
				);
			}
		}

		for (let i = 0; i < this.food.length; i++) {
			ctx.clearRect(
				...squares[this.food[i][0]][this.food[i][1]],
				dim,
				dim
			);
		}
	}
}

let p1 = new Snake(...squares[0][0]);

let ticker = 0;
let intervals = []
intervals.push(setInterval(update, 120));
function update() {
	p1.fillFood();
	p1.eat();
	p1.move();
	p1.draw();
	p1.insert();
	p1.collide();
	ticker++;
}

document.querySelector(".restart").addEventListener("click", () => {
	p1.clear();
	p1 = new Snake(...squares[0][0]);
	ticker = 0;
	intervals.unshift(setInterval(update, 120));
})
