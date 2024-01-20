// modules/referralUtils.js
const codegenerator = function generateReferralCode() {
  // Simple implementation, you can customize it based on your requirements
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const codeLength = 8;
  let code = '';

  for (let i = 0; i < codeLength; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return code;
}

module.exports = codegenerator;
