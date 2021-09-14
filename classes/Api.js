const axios = require('axios');
const { tiny_api_key } = require('../config.json');
const Logger = require('./Log');

// TINY Api Service
const tinyApi = axios.create({
	baseURL: 'https://api.tinyarmy.org/v1',
	withCredentials: true,
	headers: {
		Accept: 'application/json',
		Authorization: tiny_api_key,
		'Content-Type': 'application/json',
	},
});

// GW2 Api Service
const gw2Api = axios.create({
	baseURL: 'https://api.guildwars2.com/v2/',
	withCredentials: true,
	headers: {
		Accept: 'application/json',
		// Authorization: gw2_api_key,
		'Content-Type': 'application/json',
	},
});

function auth(key) {
	return {
		headers: {
			Authorization: `Bearer ${key}`,
		},
	};
}

module.exports = {
	tiny: {
		async findMember(account) {
			try {
				return await tinyApi.get(`members/${account}`);
			} catch (error) {
				Logger.Error(JSON.stringify(error, null, 2));
				return false;
			}
		},
		async addDiscord(account, discord) {
			try {
				return await tinyApi.post(`/members/${account}/discord`, { discord: discord });
			} catch (error) {
				Logger.Error(JSON.stringify(error, null, 2));
				return false;
			}
		},
		async addKey(account, key) {
			try {
				return await tinyApi.post(`/members/${account}/key`, { key: key });
			} catch (error) {
				Logger.Error(JSON.stringify(error, null, 2));
				return false;
			}
		},
		async getLotteryEntries(account) {
			try {
				const result = await tinyApi.get(`/lottery/${account}/entries`);
				return result.data;
			} catch (error) {
				Logger.Error(JSON.stringify(error, null, 2));
				return false;
			}
		},
		async getLotteryPot() {
			try {
				const result = await tinyApi.get('/lottery/pot');
				return result.data;
			} catch (error) {
				Logger.Error(JSON.stringify(error, null, 2));
				return false;
			}
		},
	},
	gw2: {
		async checkKey(key) {
			try {
				const result = await gw2Api.get('tokeninfo', auth(key));
				if (result.data.permissions.includes('characters')) {
					return true;
				} else {
					return false;
				}
			} catch (error) {
				Logger.Error(JSON.stringify(error, null, 2));
				return false;
			}
		},
		async getAccount(key) {
			try {
				const account = await gw2Api.get('account', auth(key));
				return account.data;
			} catch (error) {
				Logger.Error(JSON.stringify(error, null, 2));
				return false;
			}
		},
	},
};
