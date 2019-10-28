import Type from '../Type';

const userAction = {};

userAction.setUser = (data) => {
  const action = {
    type: Type.SET_USER,
    payload: data,
  };

  return action;
};

userAction.unsetUser = () => {
  const action = {
    type: Type.UNSET_USER,
  };

  return action;
};


export default userAction;
