let summary = document.querySelector('summary');
let summaryText = document.querySelector('#summaryText');

summaryText.style.opacity = '0';
summaryText.style.marginTop = '-20px';

summary.addEventListener('click', function () {
    summaryText.classList.add('animate-1');
});