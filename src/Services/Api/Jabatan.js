import client from './client';

const Jabatan = {};

Jabatan.getAll = () => client.get('/jabatan');
Jabatan.getByExist = jabatan_id_array =>
  client.get(`/jabatan?exist=${jabatan_id_array}`);
Jabatan.getByJenisSurat = (jenis_surat_id, jabatan_id) =>
  client.get(`/jabatan/${jenis_surat_id}/${jabatan_id}?all=true`);

export default Jabatan;
