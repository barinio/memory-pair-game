//Створення карточки
class Card {
	constructor(image) {
		this.image = image;
		this.isFlipped = false;

		this.element = document.createElement('li');
		this.element.classList.add('card');
		this.element.style.backgroundImage = `url('${this.backPath}')`;
		this.element.currentCard = this;
	}

	get imagePath() {
		return `./images/${this.image}`;
	}

	get backPath() {
		return './images/card-back.jpg';
	}

	flip() {
		if (this.isFlipped) {
			this.element.style.backgroundImage = `url('${this.backPath}')`;
		} else {
			this.element.style.backgroundImage = `url('${this.imagePath}')`;
		}
		this.isFlipped = !this.isFlipped;
	}

	disconnectFromDOM() {
		this.element.currentCard = null;
	}
}
//Створення колоди і тасування
class Deck {
	constructor() {
		this.cards = [];
		this.cardsImages = [
			'american-football.jpg',
			'baseball.jpg',
			'basketball.jpg',
			'billiard-ball.jpg',
			'bowling-ball.jpg',
			'football.jpg',
			'golf-ball.jpg',
			'pingpongbal.jpg',
			'tennis-ball.jpg',
			'volleyball.jpg'
		];
		this.createCards();
	}

	createCards() {
		this.cardsImages.forEach(img => {
			this.cards.push(new Card(img));
			this.cards.push(new Card(img));
		});
	}

	shuffle() {
		this.cards.sort(() => Math.random() - 0.5);
	}

	removeCard(card) {
		const index = this.cards.findIndex(item => item.image === card.image);
		if (index !== -1) {
			this.cards.splice(index, 1);
		}
		card.disconnectFromDOM();
	}
}
//Управління грою
class GameManager {
	constructor(board, score) {
		this.boardElement = typeof board === 'string' ? document.querySelector(board) : board;
		this.scoreElement = typeof score === 'string' ? document.querySelector(score) : score;
		this.deck = new Deck();
		this.firstCard = null;
		this.secondCard = null;
		this.attemptNumber = 0;
	}

	startGame() {
		this.attemptNumber = 0;
		this.deck = new Deck();
		this.boardElement.innerHTML = '';
		this.shuffleAndDeal();
	}

	shuffleAndDeal() {
		this.deck.shuffle();
		this.deck.cards.forEach(card => {
			this.boardElement.append(card.element);
		});
	}

	selectCard(card) {
		if (this.firstCard === card) return;
		card.flip();

		if (this.firstCard && this.secondCard) {
			this.firstCard.flip();
			this.secondCard.flip();
			this.firstCard = this.secondCard = null;
		}

		if (this.firstCard === null) {
			this.firstCard = card;
		} else if (this.secondCard === null) {
			this.attemptNumber++;
			this.secondCard = card;

			if (this.firstCard.image === card.image) {
				this.deck.removeCard(this.firstCard);
				this.deck.removeCard(this.secondCard);
				this.firstCard = this.secondCard = null;
			}
		}
	}

	get attemptNumber() {
		return this._attemptNumber;
	}

	set attemptNumber(value) {
		this._attemptNumber = value;
		this.scoreElement.innerHTML = value;
	}
}
//Основа(відображення і запуск)
let board = document.querySelector('.board');
let score = document.querySelector('.score');
let startBtn = document.querySelector('.start');

const game = new GameManager(board, score);
game.startGame();

board.addEventListener('click', (e) => {
	let clickedCard = e.target.currentCard;
	if (clickedCard) {
		game.selectCard(clickedCard)
	};
});
startBtn.addEventListener('click', () => {
	game.startGame();
})