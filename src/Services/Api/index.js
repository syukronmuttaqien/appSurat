import client, { initialize } from './client';
import User from './User';
import Jabatan from './Jabatan';
import JenisSurat from './JenisSurat';
import Surat from './Surat';

const Api = {};

Api.getClient = () => client;

Api.initialize = () => {
  initialize();
};

export default Api;
export {
  User,
  Jabatan,
  JenisSurat,
  Surat,
};
