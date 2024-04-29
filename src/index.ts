import { ExportedHandler } from '@cloudflare/workers-types';
import log from './log';
import { fetchCnbExchangeRate, FetchCnbExchangeRateResult } from './cnb';

// Variables (vars) are defined in wrangler.toml and/or using wrangle CLI and/or in Cloudflare Dashboard.
// They are passed by Cloudflare Workers runtime to the fetch handler.
// Their values can be only strings.
export interface Env {
	CACHE: KVNamespace;
}

const dateToKey = (obj: Date) => {
	const year = obj.getUTCFullYear();
	const month = obj.getUTCMonth() + 1;
	const date = obj.getUTCDate();
	return `${year.toString()}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
};

async function fetchCnbExchangeRateWithCache(
	cache: KVNamespace,
	date: Date,
): Promise<FetchCnbExchangeRateResult> {
	const cacheKey = dateToKey(date);

	log.info(`fetchCnbExchangeRateWithCache key=${cacheKey}`);

	const cachedRates = await cache.get(cacheKey);

	if (cachedRates !== null) {
		log.info('cache hit');
		return JSON.parse(cachedRates) as FetchCnbExchangeRateResult;
	}

	log.info('cache miss');
	const rates = await fetchCnbExchangeRate(date);

	await cache.put(cacheKey, JSON.stringify(rates));

	return rates;
}

export default <ExportedHandler<Env>>{
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		// log.debug(request.url, 'request.headers =', new Map(request.headers));

		const url = new URL(request.url);

		const currentDate = new Date();

		if (url.pathname === '/latest') {
			try {
				const rates = await fetchCnbExchangeRateWithCache(env.CACHE, currentDate);
				return Response.json(rates, { status: 200 });
			} catch (err) {
				log.error(err);
				return Response.json(
					{
						// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
						message: `Internal error: ${err}`,
					},
					{
						status: 500,
					},
				);
			}
		}

		if (url.pathname === '/currency') {
			const code = url.searchParams.get('code');
			if (code === null || code === '') {
				return Response.json(
					{
						message: `Missing currency code query parameter!`,
					},
					{
						status: 400,
					},
				);
			}
			try {
				log.debug(`fetching currency ${code}`);
				const rates = await fetchCnbExchangeRateWithCache(env.CACHE, currentDate);
				const rate = rates.rates.find(({ currency }) => currency === code);
				if (rate === undefined) {
					return Response.json(
						{
							message: `Rate for currency '${code}' not found!`,
						},
						{
							status: 404,
						},
					);
				}
				return Response.json(
					{
						requestedDate: rates.requestedDate,
						retrievedDate: rates.retrievedDate,
						rate,
					},
					{
						status: 200,
					},
				);
			} catch (err) {
				log.error(err);
				return Response.json(
					{
						// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
						message: `Internal error: ${err}`,
					},
					{
						status: 500,
					},
				);
			}
		}

		if (url.pathname === '/') {
			return Response.json(
				{
					message: 'Welcome to the currency rate serverless retriever!',
				},
				{
					status: 200,
				},
			);
		}

		return Response.json(
			{
				message: `The requested resource '${url.pathname}' found!`,
			},
			{
				status: 404,
			},
		);
	},
};
