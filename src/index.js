export default contract => {
  return {
    impl: implementation => {
      Object.keys(contract).forEach(key => {
        if (!implementation.hasOwnProperty(key)) {
          throw new Error(`Expected function: ${key} has not been implemented.`);
        }
      });
    }
  };
};
