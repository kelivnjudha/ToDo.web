function generate(minLength = 10, maxLength = 20) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    
    // Generate a random length between minLength and maxLength
    const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
    
    let randomString = '';
    
    for (let i = 0; i < length; i++) {
      randomString += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    
    return randomString;
  }
  
module.exports = generate;
  