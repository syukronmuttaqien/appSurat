import client from './client';

const JenisSurat = {};

JenisSurat.getAll = () => client.get('/jenissurat');

export default JenisSurat;
