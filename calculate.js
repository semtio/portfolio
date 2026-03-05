(() => {
    // Service catalog can be expanded with additional options and metadata.
    function getServiceCatalog() {
        return [
            // { name: 'Sample', priceUsd: 220, devHours: 12 }
            // Ru
            { name: 'Помощь в выборе хостинга', devHours: 1 },
            { name: 'Настройка хостинга', devHours: 1 },
            { name: 'Покупка домена', devHours: 1 },
            { name: 'Установка WordPress', devHours: 1 },
            { name: 'Установка CMS', devHours: 1 },
            { name: 'Установка SSL', devHours: 1 },
            { name: 'Помощь в выборе темы', devHours: 1 },
            { name: 'Настройка/установка плагинов - установка плагина', devHours: 1 },
            { name: 'Разработка темы по дизайну из Adobe/Figma', devHours: 16 },
            { name: 'Настройка WooCommerce', devHours: 3 },
            { name: 'Настройка VDS', devHours: 8 },
            { name: 'Настройка Сервера', devHours: 3 },
            { name: 'Автоматизация процессов', devHours: 8 },
            { name: 'n8n Автоматизация', devHours: 1 },
            { name: 'Python Автоматизация', devHours: 1 },
            { name: 'Разработка SaaS приложения', devHours: 60 },
            { name: 'Разработка MVP приложения', devHours: 8 },
            { name: 'Настройка CDN', devHours: 2 },
            { name: 'Разработать Одностраничный сайт - лендинг', devHours: 8 },
            { name: 'Разработать Многостраничный сайт или корпоративный', devHours: 56 },
            { name: 'Разработать Интернет магазин', devHours: 100 },
            { name: 'Оптимизация скорости загрузки сайта', devHours: 24 },
            { name: 'Ускорение скорости загрузки сайта', devHours: 24 },

            // En
            { name: 'Website speed optimization', devHours: 24 },
            { name: 'Website speed acceleration', devHours: 24 },
            { name: 'Develop Landing page', devHours: 8 },
            { name: 'Develop Corporate website', devHours: 56 },
            { name: 'Develop Online store', devHours: 100 },
            { name: 'Hosting selection assistance', devHours: 1 },
            { name: 'Domain purchase', devHours: 1 },
            { name: 'Hosting setup', devHours: 1 },
            { name: 'WordPress installation', devHours: 1 },
            { name: 'CMS installation', devHours: 1 },
            { name: 'SSL installation', devHours: 1 },
            { name: 'Theme selection assistance', devHours: 1 },
            { name: 'Plugin setup/installation - per plugin', devHours: 1 },
            { name: 'WooCommerce setup', devHours: 3 },
            { name: 'Theme development based on Adobe/Figma design', devHours: 16 },
            { name: 'VDS setup', devHours: 8 },
            { name: 'Server setup', devHours: 3 },
            { name: 'Process automation', devHours: 8 },
            { name: 'n8n Automation', devHours: 1 },
            { name: 'Python Automation', devHours: 1 },
            { name: 'SaaS application development', devHours: 60 },
            { name: 'MVP application development', devHours: 8 },
            { name: 'CDN setup', devHours: 2 }
        ];
    }

    function getElements() {
        return {
            calculateBtn: document.querySelector('.calculator-btn'),
            modal: document.querySelector('.calculate-modal'),
            closeBtn: document.querySelector('.calculate-closed'),
            panel: document.querySelector('.calculate-modal__panel'),
            searchInput: document.querySelector('#calculate-search'),
            hourlyRateNode: document.querySelector('#hourly-rate')
        };
    }

    function getLiveHourlyRate(hourlyRateNode) {
        if (!hourlyRateNode) {
            return 0;
        }

        const rawText = hourlyRateNode.textContent || '';
        const match = rawText.match(/\d+(?:[.,]\d+)?/);
        if (!match) {
            return 0;
        }

        const parsed = Number(match[0].replace(',', '.'));
        return Number.isFinite(parsed) ? parsed : 0;
    }

    function resolveServicePriceUsd(service, hourlyRateNode) {
        if (Number.isFinite(service.priceUsd)) {
            return service.priceUsd;
        }

        return getLiveHourlyRate(hourlyRateNode);
    }

    function formatUsdValue(value) {
        return Number.isInteger(value) ? String(value) : value.toFixed(8);
    }

    function formatTotalUsdCeil(value) {
        return String(Math.ceil(value));
    }

    function createSuggestionsContainer(searchInput) {
        const searchResults = document.createElement('div');
        searchResults.className = 'calculate-suggestions ng';
        searchInput.insertAdjacentElement('afterend', searchResults);
        return searchResults;
    }

    function createCartContainer(searchResults) {
        const cartWrap = document.createElement('div');
        cartWrap.className = 'calculate-selected calculate-placeholder';

        const cartTitle = document.createElement('strong');
        cartTitle.textContent = 'Cart:';

        const cartList = document.createElement('div');
        cartList.className = 'calculate-cart-list';

        const cartTotal = document.createElement('div');
        cartTotal.className = 'calculate-cart-total';
        cartTotal.textContent = 'Total: 0 USD, 0 h';

        cartWrap.appendChild(cartTitle);
        cartWrap.appendChild(cartList);
        cartWrap.appendChild(cartTotal);

        searchResults.insertAdjacentElement('afterend', cartWrap);

        return { cartWrap, cartList, cartTotal };
    }

    function clearSearchResults(searchResults) {
        searchResults.innerHTML = '';
        searchResults.classList.add('ng');
    }

    function buildEmptyStateElement() {
        const empty = document.createElement('button');
        empty.type = 'button';
        empty.className = 'calculate-suggestion is-empty';
        empty.textContent = 'No matches found';
        empty.disabled = true;
        return empty;
    }

    function buildSearchResultElement(item, searchInput, searchResults, cartState) {
        const option = document.createElement('button');
        option.type = 'button';
        option.className = 'calculate-suggestion';
        option.textContent = item.name;
        option.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            searchInput.value = '';
            addServiceToCart(item, cartState);
            clearSearchResults(searchResults);
            searchInput.focus();
        });
        return option;
    }

    function renderSearchResults(list, searchInput, searchResults, cartState) {
        searchResults.innerHTML = '';

        if (!list.length) {
            searchResults.appendChild(buildEmptyStateElement());
            searchResults.classList.remove('ng');
            return;
        }

        list.forEach((item) => {
            searchResults.appendChild(
                buildSearchResultElement(item, searchInput, searchResults, cartState)
            );
        });

        searchResults.classList.remove('ng');
    }

    function filterCatalog(catalog, query) {
        return catalog.filter((service) => service.name.toLowerCase().includes(query));
    }

    // Start searching only after 3 typed characters.
    function handleSearchInput(searchInput, catalog, searchResults, cartState) {
        const query = searchInput.value.trim().toLowerCase();

        if (query.length < 3) {
            clearSearchResults(searchResults);
            return;
        }

        const filtered = filterCatalog(catalog, query);
        renderSearchResults(filtered, searchInput, searchResults, cartState);
    }

    function getServiceLineTotals(item, hourlyRateNode) {
        const qty = item.qty || 1;
        const hourlyRate = getLiveHourlyRate(hourlyRateNode);
        const hasFixedPrice = Number.isFinite(item.priceUsd);
        const unitPrice = hasFixedPrice ? item.priceUsd : hourlyRate;
        const lineHours = (typeof item.devHours === 'number' ? item.devHours : 0) * qty;

        const linePrice = hasFixedPrice
            ? unitPrice * qty
            : unitPrice * (lineHours || qty);

        return { unitPrice, linePrice, lineHours, hasFixedPrice };
    }

    function renderCart(cartState) {
        const { cartItems, cartList, cartTotal, hourlyRateNode } = cartState;
        cartList.innerHTML = '';

        if (!cartItems.length) {
            const emptyRow = document.createElement('div');
            emptyRow.className = 'calculate-selected-item';
            emptyRow.textContent = 'Cart is empty';
            cartList.appendChild(emptyRow);
            cartTotal.textContent = 'Total: 0 USD, 0 h';
            return;
        }

        let totalPrice = 0;
        let totalHours = 0;

        cartItems.forEach((item) => {
            const row = document.createElement('div');
            row.className = 'calculate-selected-item';

            const { unitPrice, linePrice, lineHours, hasFixedPrice } = getServiceLineTotals(item, hourlyRateNode);
            totalPrice += linePrice;
            totalHours += lineHours;

            const parts = [item.name, `${item.qty}x`];
            parts.push(
                hasFixedPrice
                    ? `${formatUsdValue(unitPrice)} USD`
                    : `${formatUsdValue(unitPrice)} USD/h`
            );
            parts.push(`line: ${formatUsdValue(linePrice)} USD`);
            if (typeof item.devHours === 'number') {
                parts.push(`${item.devHours} h`);
                parts.push(`line: ${lineHours} h`);
            }

            const rowText = document.createElement('span');
            rowText.textContent = parts.join(', ');

            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'calculate-remove-item';
            removeBtn.textContent = 'Remove';
            removeBtn.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                removeServiceFromCart(item.name, cartState);
            });

            row.appendChild(rowText);
            row.appendChild(removeBtn);
            cartList.appendChild(row);
        });

        cartTotal.textContent = `Total: ${formatTotalUsdCeil(totalPrice)} USD, ${totalHours} h`;
    }

    function addServiceToCart(service, cartState) {
        const existing = cartState.cartItems.find((item) => item.name === service.name);

        if (existing) {
            existing.qty += 1;
        } else {
            cartState.cartItems.push({ ...service, qty: 1 });
        }

        renderCart(cartState);
    }

    function removeServiceFromCart(serviceName, cartState) {
        cartState.cartItems = cartState.cartItems.filter((item) => item.name !== serviceName);
        renderCart(cartState);
    }

    // Modal visibility controls.
    function openCalculateModal(modal, searchInput) {
        modal.classList.remove('ng');
        modal.classList.add('ok');
        modal.setAttribute('aria-hidden', 'false');
        searchInput.focus();
    }

    function closeCalculateModal(modal, searchResults) {
        modal.classList.remove('ok');
        modal.classList.add('ng');
        modal.setAttribute('aria-hidden', 'true');
        clearSearchResults(searchResults);
    }

    // Centralized event wiring for modal and autocomplete behavior.
    function bindEvents(ctx) {
        const {
            calculateBtn,
            modal,
            closeBtn,
            panel,
            searchInput,
            catalog,
            searchResults,
            cartState
        } = ctx;

        calculateBtn.addEventListener('click', () => {
            openCalculateModal(modal, searchInput);
        });

        closeBtn.addEventListener('click', () => {
            closeCalculateModal(modal, searchResults);
        });

        searchInput.addEventListener('input', () => {
            handleSearchInput(searchInput, catalog, searchResults, cartState);
        });

        searchInput.addEventListener('blur', () => {
            setTimeout(() => clearSearchResults(searchResults), 120);
        });

        modal.addEventListener('click', (event) => {
            if (!event.composedPath().includes(panel)) {
                closeCalculateModal(modal, searchResults);
            }
        });

        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !modal.classList.contains('ng')) {
                closeCalculateModal(modal, searchResults);
            }
        });
    }

    // Entry point for Calculate modal.
    function initCalculateModal() {
        const elements = getElements();
        const { calculateBtn, modal, closeBtn, panel, searchInput, hourlyRateNode } = elements;

        if (!calculateBtn || !modal || !closeBtn || !panel || !searchInput) {
            return;
        }

        const catalog = getServiceCatalog();
        const searchResults = createSuggestionsContainer(searchInput);
        const { cartList, cartTotal } = createCartContainer(searchResults);
        const cartState = {
            cartItems: [],
            cartList,
            cartTotal,
            hourlyRateNode
        };
        renderCart(cartState);

        bindEvents({
            calculateBtn,
            modal,
            closeBtn,
            panel,
            searchInput,
            catalog,
            searchResults,
            cartState
        });
    }

    initCalculateModal();
})();
