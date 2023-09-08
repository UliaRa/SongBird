let count = 0;

const winBlock = document.querySelector('.win');
const notWinBlock = document.querySelector('.not-win');

const scoreWinHTML = document.querySelector('#winScore');
const scoreNotWinHTML = document.querySelector('#notWinScore');

function setWindow() {
    count = localStorage.getItem('count');
    localStorage.setItem('count', 0);
    count < 30 ? showBlock(notWinBlock, scoreNotWinHTML) : showBlock(winBlock, scoreWinHTML);
}

function showBlock(block, paragraph) {
    block.classList.remove('main__block--invisible');
    paragraph.innerHTML = count;
}

window.onload = setWindow;