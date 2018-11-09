
module.exports = (app) => {
	const http = require('https');
	const EDAMAM_APP_ID = process.env.EDAMAM_APP_ID;
	const EDAMAM_API_KEY = process.env.EDAMAM_API_KEY;

	app.get('/', (req, res) => {
		let queryString = '';

		// This preloads the page with first 100 recipes
		if (!req.query.term) {
			queryString = 'keto';
		} else {
			queryString = `keto ${req.query.term}`;
		}

		// ENCODE THE QUERY STRING TO REMOVE WHITE SPACES AND RESTRICTED CHARACTERS
		const term = encodeURIComponent(queryString);
		// PUT THE SEARCH TERM INTO THE EDEMAM API SEARCH URL
		const url = `https://api.edamam.com/search?q=${term}&from=0&to=100&app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_API_KEY}`;

		http.get(url, (response) => {
			response.setEncoding('utf8');
			let body = '';

			response.on('data', (d) => {
				body += d;
			});

			response.on('end', () => {
				// WHEN DATA IS FULLY RECEIVED PARSE INTO JSON
				const parsed = JSON.parse(body);
				// Index Template & pass recipe data to the template
				res.render('index', { recipes: parsed.hits });
			});
		});
	});
}
