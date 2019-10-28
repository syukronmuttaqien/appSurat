import client from './client';

const Surat = {};

const config = { headers: { 'Content-Type': 'multipart/form-data' } };

Surat.add = (formData) => client.post('/surat', formData, config);
Surat.getAll = () => client.get('/surat');
Surat.getAllByJabatan = (jabatan_id) => client.get(`/surat?jabatan=${jabatan_id}`);
Surat.getById = (id) => client.get(`/surat/${id}`);
Surat.disposisi = (surat_id, jabatan_id, catatan) => client.post('/surat/disposisi', { surat_id, jabatan_id, catatan });

export default Surat;
