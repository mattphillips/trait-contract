export default contract => {
  return {
    impl: implementation => {
      Object.keys(contract).forEach(key => {
        if (!implementation.hasOwnProperty(key)) {
          throw new Error(`Expected function: ${key} has not been implemented.`);
        }
      });

      return Object.keys(implementation).reduce((acc, key) => {
        return {
          ...acc,
          [key]: function () {
            if (contract[key].length != arguments.length) {
              throw new Error(`Expected: ${contract[key].length} argument/s but received: ${arguments.length}`);
            }
            return implementation[key](...Object.values(arguments));
          }
        };
      }, {});
    }
  };
};
