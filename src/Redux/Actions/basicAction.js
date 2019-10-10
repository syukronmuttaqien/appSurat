import Type from '../Type';

const basic = {};

basic.isWorking = () => {
  const action = {
    type: Type.IS_REDUX_WORKING,
  };

  return action;
};

export default basic;
