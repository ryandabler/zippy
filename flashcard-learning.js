'use strict';

const FLASHCARD_TREE = [
    'div.container',
    [
        [
            'div.flashcard',
            [
                ["div[data-side='front']", []],
                ["div[data-side='back']", []],
            ],
        ],
    ],
];

const mountCard = (cardDef, anchor) => {
    const { front, back } = cardDef;
    const card = createElementTree(...FLASHCARD_TREE);
    card.querySelector('[data-side="front"]').innerText = front;
    card.querySelector('[data-side="back"]').innerText = back;

    anchor.append(card);

    return Promise.resolve(card);
};

const getReadyToFlip = (DECK, anchor) => () => {
    const nextCard = DECK.shift();
    if (nextCard) {
        mountCard(nextCard, anchor).then(card => card.classList.add('queued'));
    }

    const [flashcard] = document.getElementsByClassName('flashcard');
    const scoreBar = new DOM(document.getElementById('score-bar'));
    flashcard.classList.toggle('flip-card');
    scoreBar.removeClass('hidden');
};

const switchToNextCard = (DECK, carousel) => e => {
    const [oldCard, newCard] = document.getElementsByClassName('container');
    const scoreBar = new DOM(document.getElementById('score-bar'));
    const initiator = e.target;

    if ('score' in initiator.dataset) {
        e.stopPropagation();

        oldCard.classList.add('exit');
        oldCard.addEventListener('transitionend', e => e.target.remove());
        scoreBar.addClass('hidden');

        if (!newCard) {
            return;
        }

        newCard.classList.remove('queued');

        document.addEventListener('click', getReadyToFlip(DECK, carousel), {
            once: true,
        });
    }
};

const onEnter = deck => {
    const firstCard = deck.shift();
    const carousel = document.getElementById('flashcard-carousel');
    const scoreBar = document.getElementById('score-bar');

    scoreBar.addEventListener('click', switchToNextCard(deck, carousel));

    mountCard(firstCard, carousel).then(() => {
        document.addEventListener('click', getReadyToFlip(deck, carousel), {
            once: true,
        });
    });
};
