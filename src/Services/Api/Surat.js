import client from './client';

const Surat = {};

const config = { headers: { 'Content-Type': 'multipart/form-data' } };

Surat.add = formData => client.post('/surat', formData, config);
Surat.getAll = () => client.get('/surat');
Surat.getAllByJabatan = jabatan_id =>
  client.get(`/surat?jabatan=${jabatan_id}`);
Surat.getById = (id, jabatan_id) => client.get(`/surat/${id}?jabatan_id=${jabatan_id}`);
Surat.disposisi = (surat_id, jabatan_id, catatan, from_jabatan_id) =>
  client.post('/surat/disposisi', { surat_id, jabatan_id, catatan, from_jabatan_id });
Surat.updateSelesai = surat_id => client.patch(`/surat/selesai/${surat_id}`);

export default Surat;
