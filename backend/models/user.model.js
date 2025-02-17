const connection = require('../config/db');

const User = {
    findByUsername: (correo, callback) => {
        connection.query('SELECT * FROM usuarios WHERE correo = ?', [correo], callback);
    }
};

module.exports = User;
