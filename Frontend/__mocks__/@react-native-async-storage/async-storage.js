const mockAsyncStorage = {
	getItem: jest.fn(() => Promise.resolve(JSON.stringify({}))),
	setItem: jest.fn(() => Promise.resolve(null)),
	removeItem: jest.fn(() => Promise.resolve(null)),
	clear: jest.fn(() => Promise.resolve(null)),
};

export default mockAsyncStorage;