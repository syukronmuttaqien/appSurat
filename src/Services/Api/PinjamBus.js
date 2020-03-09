import client from './client';

const PinjamBus = {};

PinjamBus.getAll = () => client.get('/pinjambus');
PinjamBus.getAllBus = () => client.get('/bus');
PinjamBus.add = (namaAcara, tujuan, busId, tanggalPinjam, tanggalSelesai) =>
  client.post('/pinjambus', {
    nama_acara: namaAcara,
    tujuan,
    bus_id: busId,
    tgl_peminjaman: tanggalPinjam,
    tgl_selesai_pinjam: tanggalSelesai,
  });

export default PinjamBus;
