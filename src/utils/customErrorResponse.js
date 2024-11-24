const customErrorResponse = (error) => {
  return {
    success: false,
    message: error.message,
    data: {},
    error: error
  };
};

export default customErrorResponse;
