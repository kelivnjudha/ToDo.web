function generate(){
    const crypto = require('crypto');
    const secretKey = crypto.randomBytes(32).toString('hex');
    return secretKey;
}

module.exports = generate;