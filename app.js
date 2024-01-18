let summary = document.querySelector('#summary');
let summaryText = document.querySelector('#summaryText');

// summaryText.style.opacity = '0';
// summaryText.style.display = 'none';
// summaryText.style.color = 'lime';
// summaryText.style.marginTop = '-20px';

let counterSummary = 0;
summary.addEventListener('click', function f() {
    counterSummary++;
    summaryText.classList.add('animate-1');
    summaryText.style.display = 'block';

    // if (counterSummary > 2) {
    //     summaryText.style.opacity = '0';
    //     summaryText.style.color = 'lime';
    //     summaryText.style.marginTop = '-20px';
    // }

});