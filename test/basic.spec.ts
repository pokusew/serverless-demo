import { UnstableDevWorker, unstable_dev } from 'wrangler';

// Note:
//   These are very basic tests (integration / smoke tests) just to make sure it runs.
//   However, the whole testing setup is very robust, and more tests could be easily added
//   (unit tests, integration tests, and e2e tests).
describe('the serverless demo', () => {
	let worker: UnstableDevWorker;

	beforeAll(async () => {
		worker = await unstable_dev('src/index.ts', {
			experimental: { disableExperimentalWarning: true },
			// env: 'dev',
			// ip: '127.0.0.1',
			// vars,
		});
	});

	afterAll(async () => {
		await worker.stop();
	});

	it('root 200', async () => {
		const res = await worker.fetch();
		expect(res.status).toBe(200);
		expect(res.headers.get('Content-Type')).toBe('application/json');
		await expect(res.json()).resolves.toStrictEqual({
			message: 'Welcome to the currency rate serverless retriever!',
		});
	});
});
