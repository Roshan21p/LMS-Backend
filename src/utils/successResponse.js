const successResponse = (data, message) => {
  return {
    success: true,
    message,
    data,
    error: {}
  };
};

export default successResponse;
