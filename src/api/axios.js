import axios from 'axios';

export default axios.create({
	// baseURL: 'https://pa-shop-api.up.railway.app',
	baseURL: 'http://localhost:8080',
	// baseURL: 'https://test-ptit.up.railway.app',

	// baseURL: 'https://pa-shop-service.azurewebsites.net',
});
