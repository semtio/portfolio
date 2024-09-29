// dark mod
let faMoon = document.querySelector('.fa-moon');
let faSun = document.querySelector('.fa-sun');
let mainCss = document.querySelector('#main-css');
// dark mod off
// console.log(mainCss.href = 'light-style.css');
let flagLightDark = true;
function darkModFC(a, b) {
    a.addEventListener('click', function () {
        if (!a.classList.contains('ng')) {
            a.classList.add('ng');
            b.classList.remove('ng');
            b.classList.add('ok');
        }

        if (flagLightDark) {
            console.log(mainCss.href = 'light-style.css');
            flagLightDark = false;
        } else {
            console.log(mainCss.href = 'style.css');
            flagLightDark = true;
        }

    });
}
darkModFC(faSun, faMoon);
darkModFC(faMoon, faSun);

// popup
let closed = document.querySelector('.closed');
let popup = document.querySelector('.popup');

closed.addEventListener('click', function () {
    popup.classList.add('ng');
});

// popup_btn
let reportsBtn = document.querySelector('.reports-btn');
let flagCheckReportsBtnClick = false;

reportsBtn.addEventListener('click', function (e) {
    popup.classList.remove('ng');
    popup.classList.add('ok');
});

window.addEventListener('click', function (e) {
    console.log(e.target);
});

window.addEventListener('keydown', function (e) {
    if (e.key == 'Escape') {
        popup.classList.add('ng');
    }
    console.log(e.key);
});

popup.addEventListener('click', function () {
    popup.classList.remove('ok');
    popup.classList.add('ng');
});