export interface Logger {
	debug: (...args: unknown[]) => void;
	info: (...args: unknown[]) => void;
	error: (...args: unknown[]) => void;
}

const developmentPrefix = (level: 'info' | 'debug' | 'error') => {
	const now = new Date();
	return `[${now.toISOString()}] ${level.toUpperCase()}`;
};

const developmentLogger: Logger = {
	debug: (...args) => {
		console.log(developmentPrefix('debug'), ...args);
	},

	info: (...args) => {
		console.log(developmentPrefix('info'), ...args);
	},

	error: (...args) => {
		console.error(developmentPrefix('error'), ...args);
	},
};

// Cloudflare automatically adds timestamps and level to the structured logs it outputs
const productionLogger: Logger = {
	debug: () => {
		// completely ignore
	},

	info: (...args) => {
		console.log(...args);
	},

	error: (...args) => {
		console.error(...args);
	},
};

export default MODE === 'development' ? developmentLogger : productionLogger;
