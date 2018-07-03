import axios from 'axios';

export function search(name, start_date, end_date) {
	return new Promise((resolve, reject) => {
		axios
			.get(
				'/search-events?name=' +
					name +
					'&start_date=' +
					start_date +
					'&end_date=' +
					end_date +
					'&country_code=' +
					'&administrative_area=' +
					'&locality=' +
					'&postal_code=' +
					'&thoroughfare='
			)
			.then(res => {
				resolve(res);
			})
			.catch(err => {
				reject(err);
			});
	});
}
