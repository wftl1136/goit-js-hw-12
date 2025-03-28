import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';
const myApiKey = '49272526-e1b2de60044cea6af49c76424';

export const fetchImages =  async (query, page, per_page) => {
  const response = await axios
    .get('', {
      params: {
        key: myApiKey,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page,
        page,
      },
    });
  return response.data;
};