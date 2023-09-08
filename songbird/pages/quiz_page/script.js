import {birdsData} from '../../assets/birds.js';

let currentLevel = 0;
let count = 0;
let tries = 0;
let answersOptions = [];
let correctAnswer;

let birdInterval;
let answerInterval;
let isFirstOption = true;

const levelsHTML = document.querySelectorAll('.header__level');

const optionsListHTML = document.querySelector('.options__list');
const birdBlockHTML = document.querySelector('.answer__data');
const birdBlockNoneHTML = document.querySelector('.answer__default');
const nextBtnHTML = document.querySelector('.main__next');
const scoreHTML = document.querySelector('#scoreCount');

const mainBlockImgHTML = document.querySelector('.bird__img');
const mainBlockNameHTML = document.querySelector('.bird__name');

const birdBlockImgHTML = document.querySelector('.answer__img');
const birdBlockNameHTML = document.querySelector('.answer__name');
const birdBlockLatinHTML = document.querySelector('.answer__latin');
const birdBlockDescHTML = document.querySelector('.answer__description');

nextBtnHTML.addEventListener('click', nextLevel);

const audioBird = document.querySelector('#birdAudio');
const playBirdHTML = document.querySelector('#btnPlayBird');
const playBirdImgHTML = document.querySelector('#playBirdImg');
const birdMnutesAll = document.querySelector('#birdMinutesAll');
const birdSecondsAll = document.querySelector('#birdSecondsAll');
const birdMnutesCurrent = document.querySelector('#birdMinutes');
const birdSecondsCurrent = document.querySelector('#birdSeconds');
const birdTimeline = document.querySelector('#birdTimeline');
const birdVolume = document.querySelector('#birdVolume');

const audioAnswer = document.querySelector('#answerAudio');
const playAnswerHTML = document.querySelector('#btnPlayAnswer');
const playAnswerImgHTML = document.querySelector('#playAnswerImg');
const answerMnutesAll = document.querySelector('#answerMinutesAll');
const answerSecondsAll = document.querySelector('#answerSecondsAll');
const answerMnutesCurrent = document.querySelector('#answerMinutes');
const answerSecondsCurrent = document.querySelector('#answerSeconds');
const answerTimeline = document.querySelector('#answerTimeline');
const answerVolume = document.querySelector('#answerVolume');

function generateQuestion(level) {
    let birdsOptions = birdsData[level];

    let correctIdx = Math.floor(Math.random() * birdsOptions.length);
    correctAnswer = birdsOptions[correctIdx];

    if (level == 0) {
        setAudio(birdInterval, audioBird, correctAnswer.audio, birdMnutesAll, birdSecondsAll, birdMnutesCurrent, birdSecondsCurrent, birdTimeline, birdVolume, playBirdImgHTML);
        setPlayerListeners(audioBird, playBirdHTML, playBirdImgHTML);
    } else {
        audioBird.setAttribute('src', correctAnswer.audio);
    }

    answersOptions = [];
    birdsOptions.map(x => answersOptions.push(x.name));

    mainBlockNameHTML.innerHTML = 'НАЗВАНИЕ';
    mainBlockImgHTML.setAttribute('src', '../../assets/img/default_bird.png');

    tries = 0;
    nextBtnHTML.classList.add('main__next--disabled');
    birdBlockHTML.classList.add('answer__data--invisible');
    birdBlockNoneHTML.classList.remove('answer__default--invisible');

    fillOptions();
}

function createInterval(interval, audio, minutesCur, secondsCur, timeline) {
    interval = setInterval(function() {
        let birdCurrent = audio.currentTime;
        let birdMinutesCur = Math.floor(birdCurrent / 60);
        let birdSecondsCur = Math.floor(birdCurrent - birdMinutesCur * 60);

        birdMinutesCur.toString().length < 2 ? minutesCur.innerHTML = "0" + birdMinutesCur : minutesCur.innerHTML = birdMinutesCur;
        birdSecondsCur.toString().length < 2 ? secondsCur.innerHTML = "0" + birdSecondsCur : secondsCur.innerHTML = birdSecondsCur;

        !audio.paused ? timeline.value++ : false;
    }, 1000);
}

function setAudio(interval, audio, audioToSet, minutesAll, secondsAll, minutesCur, secondsCur, timeline, volume, imgHTML) {
    audio.setAttribute('src', audioToSet);
    audio.loop = false;
    audio.onloadedmetadata = function() {
        let birdDuration = audio.duration;
        let birdMinutes = Math.floor(birdDuration / 60);
        let birdSeconds = Math.floor(birdDuration - birdMinutes * 60);

        birdMinutes.toString().length < 2 ? minutesAll.innerHTML = "0" + birdMinutes : minutesAll.innerHTML = birdMinutes;
        birdSeconds.toString().length < 2 ? secondsAll.innerHTML = "0" + birdSeconds : secondsAll.innerHTML = birdSeconds;

        timeline.max = Math.floor(birdDuration);
    };

    createInterval(interval, audio, minutesCur, secondsCur, timeline)

    audio.addEventListener('ended', function() {
        imgHTML.setAttribute('src', '../../assets/img/play_btn.png');
        audio.currentTime = 0;
        timeline.value = 0;
    })

    timeline.addEventListener('input', function() {
        audio.currentTime = timeline.value;
    })

    volume.addEventListener('input', function() {
        audio.volume = volume.value / 10;
    })
}

function setPlayerListeners(audio, playHTML, imgHTML) {
    playHTML.addEventListener('click', function() {
        if (!audio.paused) {
            audio.pause();
            imgHTML.setAttribute('src', '../../assets/img/play_btn.png');
        } else {
            audio.play();
            imgHTML.setAttribute('src', '../../assets/img/pause_btn.png');
        }
    })
}

function resetAudio(audio, timeline, imgHTML) {
    timeline.value = 0;
    audio = null;
    imgHTML.setAttribute('src', '../../assets/img/play_btn.png');
    clearInterval(birdInterval);
    clearInterval(answerInterval);
}

function fillOptions() {
    optionsListHTML.innerHTML = '';

    for (let i = 0; i < answersOptions.length; i++) {
        let option = document.createElement('li');
        option.classList.add('options__item');
        option.innerHTML = answersOptions[i];
        option.onclick = function() {
            let isCorrect = correctAnswer.name === this.innerHTML ? true : false;
            let bird = birdsData[currentLevel].find(x => x.name == this.innerHTML);
            fillBirdBlock(bird);
            resetAudio(audioAnswer, answerTimeline, playAnswerImgHTML);
            if (isFirstOption) {
                setAudio(answerInterval, audioAnswer, bird.audio, answerMnutesAll, answerSecondsAll, answerMnutesCurrent, answerSecondsCurrent, answerTimeline, answerVolume, playAnswerImgHTML);
                setPlayerListeners(audioAnswer, playAnswerHTML, playAnswerImgHTML);
                isFirstOption = false;
            } else {
                audioAnswer.setAttribute('src', bird.audio);
            }
            if (isCorrect) {
                let correctAudio = new Audio('../../../assets/sounds/correct.mp3');
                correctAudio.play();
                nextBtnHTML.classList.remove('main__next--disabled');
                this.classList.add('options__item--correct');
                let answersHTML = Array.from(document.querySelectorAll('.options__item'));
                answersHTML.map(x => (x != this) ? x.classList.add('options__item--others', 'options__item--wrong') : false);

                count += 5 - tries;
                scoreHTML.innerHTML = count;

                mainBlockNameHTML.innerHTML = bird.name;
                mainBlockImgHTML.setAttribute('src', bird.image);
            } else {
                let wrongAudio = new Audio('../../../assets/sounds/wrong.mp3');
                wrongAudio.play();
                this.classList.add('options__item--wrong');
            }
                tries++;
            }
        optionsListHTML.append(option);
    }
}

function nextLevel() {
    if (!nextBtnHTML.classList.contains('main__next--disabled')) {
        if (currentLevel == 5) {
            localStorage.setItem('count', count);
            window.location.href = '../result_page/index.html';
        } else {
            currentLevel++;
            resetAudio(audioBird, birdTimeline, playBirdImgHTML);
            resetAudio(audioAnswer, answerTimeline, playAnswerImgHTML);
            changeLevel();
            generateQuestion(currentLevel);
        }
    }
}

function changeLevel() {
    levelsHTML[currentLevel-1].classList.remove('header__level--chosen');
    levelsHTML[currentLevel].classList.add('header__level--chosen');
}

function fillBirdBlock(bird) {
    birdBlockHTML.classList.remove('answer__data--invisible');
    birdBlockNoneHTML.classList.add('answer__default--invisible');

    birdBlockImgHTML.setAttribute('src', bird.image);
    birdBlockNameHTML.innerHTML = bird.name;
    birdBlockLatinHTML.innerHTML = bird.species;
    birdBlockDescHTML.innerHTML = bird.description;
}

window.onload = generateQuestion(0);