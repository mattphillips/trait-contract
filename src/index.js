export default contract => {
  return {
    impl: implementation => {
      Object.keys(contract).forEach(key => {
        if (!implementation.hasOwnProperty(key)) {
          throw new Error(`Expected function: ${key} has not been implemented.`);
        }
      });

      return Object.keys(implementation).reduce((acc, key) => {
        if (typeof implementation[key] === 'function') {
          return {
            ...acc,
            [key]: (...args) => {
              if (contract.hasOwnProperty(key) && contract[key].length != args.length) {
                throw new Error(`Expected: ${contract[key].length} argument/s but received: ${args.length}`);
              }
              return implementation[key](...args);
            }
          };
        }

        return {
          ...acc,
          [key]: implementation[key]
        };
      }, {});
    }
  };
};
