import client from './client';

const User = {};

User.login = (username, password) => client.post('/user/login', { username, password });

export default User;
