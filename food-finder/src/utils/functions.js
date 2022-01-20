module.exports = function cookiesToObject(cookies) {
  const pairs = cookies.split('; ');
  const cookieObject = {};

  pairs.forEach(pair => {
    pair.split('=').reduce((key, value) => {
      cookieObject[key] = value;
      return true;
    });
  });

  return cookieObject;
};
