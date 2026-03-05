(() => {
	// Configurable values
	const START_RATE_USD_PER_HOUR = 10;
	const YEARLY_INCREASE_USD = 5;

	const rateNode = document.querySelector('#hourly-rate');
	if (!rateNode) {
		return;
	}

	// This precision makes growth visible every 3-5 seconds with +5 USD/year.
	const DECIMALS = 8;
	const baseTimestampUtc = Date.parse('2026-03-05T00:00:00Z');
	const millisecondsInYear = 365.2425 * 24 * 60 * 60 * 1000;

	function renderRate() {
		const nowUtc = Date.now();
		const elapsed = nowUtc - baseTimestampUtc;
		const growth = (elapsed / millisecondsInYear) * YEARLY_INCREASE_USD;
		const currentRate = START_RATE_USD_PER_HOUR + growth;

		rateNode.textContent = `${currentRate.toFixed(DECIMALS)}$ in hour`;
	}

	renderRate();
	setInterval(renderRate, 1000);
})();
