const currencyInfo = {
    BRL: { name: "Real", locale: "pt-BR", currency: "BRL" },
    USD: { name: "Dólar", locale: "en-US", currency: "USD" },
    EUR: { name: "Euro", locale: "de-DE", currency: "EUR" }
};

const defaultRates = {
    BRL: 1,
    USD: 4.8,
    EUR: 5.4
};

let exchangeRates = { ...defaultRates };
let lastRatesUpdate = null;

const ratesAPIURL = "https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL";

const form = document.getElementById("addCoinForm");
const currencySelect = document.getElementById("currency");
const amountInput = document.getElementById("amount");
const formMessage = document.getElementById("formMessage");
const tableBody = document.getElementById("coinTableBody");
const emptyState = document.getElementById("emptyState");
const conversionSelect = document.getElementById("conversionCurrency");
const totalBRLElement = document.getElementById("totalBRL");
const convertedTotalElement = document.getElementById("convertedTotal");
const resetButton = document.getElementById("resetButton");
const refreshRatesButton = document.getElementById("refreshRates");
const rateStatusElement = document.getElementById("rateStatus");

const storageKey = "cofrinho-moedas";
let coins = loadFromStorage();

render();
refreshRates();

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const currency = currencySelect.value;
    const amount = Number(amountInput.value);

    if (!currency) {
        showMessage("Selecione uma moeda antes de adicionar.", "error");
        return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        showMessage("Informe um valor maior que zero.", "error");
        amountInput.focus();
        return;
    }

    coins.push({ currency, amount });
    saveToStorage();
    render();
    form.reset();
    showMessage(`${currencyInfo[currency].name} adicionado com sucesso!`, "success");
});

conversionSelect.addEventListener("change", () => updateTotals());

resetButton.addEventListener("click", () => {
    if (!coins.length) {
        showMessage("O cofrinho já está vazio.", "error");
        return;
    }

    if (confirm("Tem certeza de que deseja remover todas as moedas?")) {
        coins = [];
        saveToStorage();
        render();
        showMessage("Cofrinho esvaziado.", "success");
    }
});

if (refreshRatesButton) {
    refreshRatesButton.addEventListener("click", () => refreshRates({ manual: true }));
}

function loadFromStorage() {
    try {
        const saved = localStorage.getItem(storageKey);
        if (!saved) {
            return [];
        }
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed)) {
            return [];
        }
        return parsed.filter((coin) =>
            coin && typeof coin.currency === "string" && Number.isFinite(Number(coin.amount))
        ).map((coin) => ({
            currency: coin.currency,
            amount: Number(coin.amount)
        }));
    } catch (error) {
        console.error("Erro ao carregar dados do cofrinho:", error);
        return [];
    }
}

function saveToStorage() {
    localStorage.setItem(storageKey, JSON.stringify(coins));
}

function render() {
    tableBody.innerHTML = "";

    if (!coins.length) {
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none";
    }

    coins.forEach((coin, index) => {
        const row = document.createElement("tr");

        const originalCell = document.createElement("td");
        originalCell.textContent = `${currencyInfo[coin.currency].name} (${coin.currency})`;

        const amountCell = document.createElement("td");
        amountCell.textContent = formatCurrency(coin.amount, coin.currency);

        const convertedCell = document.createElement("td");
        convertedCell.textContent = formatCurrency(convertToBRL(coin), "BRL");

        const actionsCell = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.className = "btn btn--ghost";
        deleteButton.textContent = "Remover";
        deleteButton.addEventListener("click", () => removeCoin(index));
        actionsCell.appendChild(deleteButton);

        row.appendChild(originalCell);
        row.appendChild(amountCell);
        row.appendChild(convertedCell);
        row.appendChild(actionsCell);
        tableBody.appendChild(row);
    });

    updateTotals();
}

function removeCoin(index) {
    coins.splice(index, 1);
    saveToStorage();
    render();
    showMessage("Moeda removida.", "success");
}

function convertToBRL(coin) {
    return coin.amount * getRate(coin.currency);
}

function calculateTotalBRL() {
    return coins.reduce((total, coin) => total + convertToBRL(coin), 0);
}

function updateTotals() {
    const totalBRL = calculateTotalBRL();
    totalBRLElement.textContent = formatCurrency(totalBRL, "BRL");

    const targetCurrency = conversionSelect.value;
    const convertedValue = convertFromBRL(totalBRL, targetCurrency);
    convertedTotalElement.textContent = formatCurrency(convertedValue, targetCurrency);
}

function convertFromBRL(value, targetCurrency) {
    if (!currencyInfo[targetCurrency]) {
        return value;
    }
    const rate = getRate(targetCurrency);
    return targetCurrency === "BRL" ? value : value / rate;
}

function formatCurrency(value, currencyCode) {
    const config = currencyInfo[currencyCode] || currencyInfo.BRL;
    return new Intl.NumberFormat(config.locale, {
        style: "currency",
        currency: config.currency
    }).format(value || 0);
}

function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.classList.remove("form-message--error", "form-message--success");

    if (type === "error") {
        formMessage.classList.add("form-message--error");
    } else if (type === "success") {
        formMessage.classList.add("form-message--success");
    }
}

function getRate(currency) {
    return exchangeRates[currency] ?? defaultRates[currency] ?? 1;
}

async function refreshRates(options = {}) {
    if (!refreshRatesButton || !rateStatusElement) {
        return;
    }

    const { manual = false } = options;
    const previousText = refreshRatesButton.textContent;

    try {
        refreshRatesButton.disabled = true;
        refreshRatesButton.textContent = "Atualizando...";
        rateStatusElement.textContent = "Consultando cotações em tempo real...";
        rateStatusElement.classList.remove("helper-text--error");

        const response = await fetch(ratesAPIURL);
        if (!response.ok) {
            throw new Error(`Falha HTTP ${response.status}`);
        }

        const data = await response.json();
        const usdRate = Number(data?.USDBRL?.bid);
        const eurRate = Number(data?.EURBRL?.bid);

        if (!usdRate || !eurRate) {
            throw new Error("Resposta inesperada da API");
        }

        exchangeRates = {
            ...exchangeRates,
            USD: usdRate,
            EUR: eurRate
        };
        lastRatesUpdate = new Date();

        rateStatusElement.textContent = `Cotações atualizadas via AwesomeAPI em ${formatDateTime(lastRatesUpdate)}.`;

        if (manual) {
            showMessage("Cotações atualizadas com sucesso!", "success");
        }
    } catch (error) {
        console.error("Falha ao atualizar cotações:", error);
        rateStatusElement.textContent = "Não foi possível consultar as cotações agora. Usando valores padrão offline.";
        rateStatusElement.classList.add("helper-text--error");

        if (manual) {
            showMessage("Não foi possível atualizar as cotações online.", "error");
        }
    } finally {
        refreshRatesButton.disabled = false;
        refreshRatesButton.textContent = previousText;
        updateTotals();
    }
}

function formatDateTime(date) {
    if (!(date instanceof Date)) {
        return "";
    }

    return date.toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short"
    });
}
