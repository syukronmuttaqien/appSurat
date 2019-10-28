import client from './client';

const Jabatan = {};

Jabatan.getAll = () => client.get('/jabatan');
Jabatan.getByExist = (jabatan_id_array) => client.get(`/jabatan?exist=${jabatan_id_array}`);

export default Jabatan;
