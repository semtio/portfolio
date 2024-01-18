let summary = document.querySelector('summary');
let summaryText = document.querySelector('#summaryText');

summary.addEventListener('click', function () {
    summaryText.classList.add('animate-1');
});