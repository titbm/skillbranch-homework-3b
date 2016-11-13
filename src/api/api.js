import axios from 'axios';

const URL_TO_GET_DATA = 'https://gist.githubusercontent.com/isuvorov/ce6b8d87983611482aac89f6d7bc0037/raw/pc.json';

const api = {
  getData() {
    return axios.get(URL_TO_GET_DATA)
      .then(response => response.data)
      .catch((error) => { throw new Error(error); });
  },
};

export default api;
