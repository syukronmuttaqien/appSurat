import client from './client';

const LaporanBarangRusak = {};

const config = { headers: { 'Content-Type': 'multipart/form-data' } };

LaporanBarangRusak.getAll = () => client.get('/laporanbarangrusak');
LaporanBarangRusak.getById = (id) => client.get(`/laporanbarangrusak/${id}`);
LaporanBarangRusak.add = (formData) => client.post('/laporanbarangrusak', formData, config);
LaporanBarangRusak.updateStatus = (id, formData) => client.post(`/laporanbarangrusak/${id}`, formData, config);

export default LaporanBarangRusak;
