export const formatResponse = <T>(data: T) => {
  return {
    status: 'success',
    data,
  };
};
