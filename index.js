const baucuaArray = [
    'bau', 'cua', 'tom', 'ca', 'huou', 'ga'
];

let clickedPic = [];
let resultPic = [];

const betContainer = document.querySelector('.bet_container_imgs');
const resetButton = document.querySelector('.bet_container_btn_for_reset');
const resultButton = document.querySelector('.bet_container_btn_for_result');
const notification = document.querySelector('.result_notification');

window.onload = function() {
    renderImages();
    addEventListeners();
}

function renderImages() {
    const imgElementArray = baucuaArray.map((link, index) => `
        <div class="img_bet" id="${link}">
            <label class="num_for_bet num-${index + 1} text-xl font-semibold absolute">0</label>
            <img src="./imgs/${link}.png" alt="${index}" style="padding: 1rem" class="bet_img image hover:p-[30px] cursor-pointer">
        </div>
    `);
    
    betContainer.innerHTML = imgElementArray.join('');
    adjustLabelsPosition();
}

function adjustLabelsPosition() {
    const offSetOfImg = Array.from(document.querySelectorAll('.bet_img')).map(f => {
        return {
            top: f.getBoundingClientRect().top,
            left: f.getBoundingClientRect().left,
        };
    });
    
    offSetOfImg.forEach((f, index) => {
        const label = document.querySelector(`.num_for_bet.num-${index + 1}`);
        label.style.top = `${f.top - 10}px`;
        label.style.left = `${f.left + 10}px`;
    });
}

function addEventListeners() {
    document.querySelectorAll('.bet_container_imgs .img_bet').forEach(f => {
        f.addEventListener('mouseup', handleImageClick);
    });

    resetButton.addEventListener('click', resetGame);
    resultButton.addEventListener('click', startResultGeneration);
}

function handleImageClick() {

    if (clickedPic.length > 2) return;

    const value = parseInt(this.firstElementChild.innerHTML);
    this.children[1].style.padding = "30px";
    this.children[1].style.backgroundColor = 'rgba(0, 0, 0, 0.065)';
    this.firstElementChild.innerHTML = value + 1;
    clickedPic.push(this.getAttribute('id'));
}

function resetGame() {
    if(clickedPic.length === 0){
        notification.classList.remove('opacity-0');
        notification.innerHTML = 'You have not bet anything ! Please choose one of those pictures below';
        notification.classList.add('text-red-400');
        notification.classList.remove('text-green-400');
        return;
    }
    clickedPic = [];
    document.querySelectorAll('.bet_container_imgs .img_bet').forEach(f => {
        f.children[1].style.padding = '1rem';
        f.children[1].style.backgroundColor = '';
        f.firstElementChild.innerHTML = 0;
    });
}

function startResultGeneration() {
    if(clickedPic.length === 0 ){
        notification.classList.remove('opacity-0');
        notification.innerHTML = 'You have not bet anything ! Please choose one of those pictures below';
        notification.classList.add('text-red-400');
        notification.classList.remove('text-green-400');
        return;
    }
    let count = 0;
    resultButton.setAttribute('disabled', 'true');
    resetButton.setAttribute('disabled', 'true');
    resultButton.classList.remove('active:bg-blue-900');
    resetButton.classList.remove('active:bg-blue-900');
    notification.classList.add('opacity-0');
    
    const intervalId = setInterval(() => {
        updateResultImages();
        count++;
        
        if (count >= 100) {
            clearInterval(intervalId);
            finalizeResult();
        }
    }, 50);
}

function updateResultImages() {
    document.querySelectorAll('.result_img').forEach(f => {
        const randomPic = Math.floor(Math.random() * baucuaArray.length);
        f.setAttribute('src', `./imgs/${baucuaArray[randomPic]}.png`);
    });
}

function finalizeResult() {
    document.querySelectorAll('.result_img').forEach(f => {
        resultPic.push(f.getAttribute('src').match(/\/([^\/]+)\./)[1]);
    });

    resultButton.removeAttribute('disabled');
    resetButton.removeAttribute('disabled');
    resultButton.classList.add('active:bg-blue-900');
    resetButton.classList.add('active:bg-blue-900');

    notification.classList.remove('opacity-0');
    if (checkResult()) {
        notification.innerHTML = 'Congratulation !!! You Won';
        notification.classList.add('text-green-400');
        notification.classList.remove('text-red-400');
    } else {
        notification.innerHTML = 'What a pity! Please try again';
        notification.classList.add('text-red-400');
        notification.classList.remove('text-green-400');
    }
}

function checkResult() {
    if (clickedPic.length !== resultPic.length) {
        return false;
    }

    const areArraysIdentical = [...new Set(clickedPic)].length === [...new Set(resultPic)].length &&
    [...new Set(clickedPic)].every(item => new Set(resultPic).has(item));
    return areArraysIdentical;
}
