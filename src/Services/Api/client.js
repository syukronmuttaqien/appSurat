import axios from 'axios';
import { Platform } from 'react-native';

const client = axios;
// const host = 'http://siadum.poltekkesjakarta3.ac.id/surat-api/public/index.php/api';
const host = 'http:/api-poltekkes.ljj-kesehatan.com/api';
const hostBase = 'http://192.168.43.119:8000/';

export default client;

export { hostBase };

export function initialize() {
  axios.defaults.baseURL = host;
  axios.defaults.timeout = 30000;
  axios.defaults.headers.common['Content-Type'] = 'application/json';
  axios.defaults.headers.common.token =
    '161349545ea8199c4a8a469a5cce0bacbb81b281';
  axios.defaults.headers.common['X-Platform'] = Platform.OS;

  axios.defaults.headers.post['Content-Type'] = 'application/json';

  if (__DEV__) {
    axios.interceptors.request.use(
      config => {
        console.log(`Sending Request to ${config.baseURL}${config.url}`);
        console.log({
          ...config.headers.common,
          ...config.headers[config.method],
        });
        if (config.data) {
          console.log(config.data);
        }

        return config;
      },
      error => {
        console.log('Request Error:', error.message);

        if (error.request) {
          console.log('Request:', error.request);
        }

        return Promise.reject(error);
      },
    );

    axios.interceptors.response.use(
      success => {
        console.log('Request Success:', success);

        return Promise.resolve(success);
      },
      error => {
        console.log('Request Error:', error.message);

        if (error.request) {
          console.log(error.request._response);
        }

        if (error.response) {
          console.log(
            `Request failed with status code ${error.response.status}`,
          );
          console.log('Response', error.response.data);
        }

        return Promise.reject(error);
      },
    );
  }

  axios.interceptors.response.use(null, error => {
    // TODO Log error here too.

    return Promise.reject(error);
  });
}
