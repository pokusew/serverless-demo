// https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/
import log from './log';

const CNB_URL =
	'https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/denni_kurz.txt';

const mapColumns = (columns: string[]) => {
	// země|měna|množství|kód|kurz
	return {
		currency: columns[3],
		rate: Number(columns[4].replace(',', '.')) / Number(columns[2].replace(',', '.')),
	};
};

const toNumericPart = (number: number, length = 2) =>
	number.toString().padStart(length, '0');

const formatDate = (date: Date) =>
	`${toNumericPart(date.getUTCDate())}.${toNumericPart(date.getUTCMonth() + 1)}.${date.getUTCFullYear().toString()}`;

// example dateStr format: 24.12.2020
const parseDate = (dateStr: string): Date => {
	const [date, month, year] = dateStr.split('.').map((value) => parseInt(value));

	// set time to noon for better readability
	return new Date(Date.UTC(year, month - 1, date, 12, 0, 0, 0));
};

export interface FetchCnbExchangeRateResult {
	requestedDate: Date;
	retrievedDate: Date;
	rates: { rate: number; currency: string }[];
}

export interface CurrencyFilter {
	(currency: string): boolean;
}

export const DEFAULT_CURRENCIES = new Set(['EUR', 'USD', 'GBP']);

export const DEFAULT_CURRENCY_FILTER: CurrencyFilter = (currency: string) =>
	DEFAULT_CURRENCIES.has(currency);

export const fetchCnbExchangeRate = async (
	requestedDate: Date,
	currencyFilter: CurrencyFilter = DEFAULT_CURRENCY_FILTER,
): Promise<FetchCnbExchangeRateResult> => {
	const formattedRequestedDate = formatDate(requestedDate);

	const url = `${CNB_URL}?date=${formattedRequestedDate}`;

	log.info('[fetchCnbExchangeRate] requesting', url);

	const response = await fetch(url);
	const text = await response.text();
	const lines = text.split('\n'); // \r\n does not matter

	const responseDate = lines[0].split(' ')[0];

	if (responseDate !== formattedRequestedDate) {
		log.info(
			`[fetchCnbExchangeRate] CNB responded with old exchange rates, wanted: ${formattedRequestedDate}, got ${responseDate}`,
		);
	}

	const retrievedDate =
		responseDate !== formattedRequestedDate ? parseDate(responseDate) : requestedDate;

	const allExchanges = lines
		.slice(2)
		.map((line) => line.split('|'))
		.filter((cols) => cols.length === 5)
		.map((cols) => mapColumns(cols));

	const filtered = allExchanges.filter(({ currency }) => currencyFilter(currency));

	log.info('[fetchCnbExchangeRate] downloaded exchange rates:', filtered);

	return {
		requestedDate,
		retrievedDate,
		rates: filtered,
	};
};
