import axios from 'axios';

export function search(
	name,
	start_date,
	end_date,
	country_code,
	administrative_area,
	locality,
	postal_code,
	thoroughfare,
	event_types
) {
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
					country_code +
					'&administrative_area=' +
					administrative_area +
					'&locality=' +
					locality +
					'&postal_code=' +
					postal_code +
					'&thoroughfare=' +
					thoroughfare +
					'&event_types=' +
					event_types
			)
			.then(res => {
				resolve(res);
			})
			.catch(err => {
				reject(err);
			});
	});
}
