module.exports = (success, message, data) => {
  return {
    ok: success,
    message: message,
    body: data,
  };
};
