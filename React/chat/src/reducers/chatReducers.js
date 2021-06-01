import * as types  from '../actions/types';
import initialState from './initialState';

export const chatReducer = (state = initialState.chat, actions) => {
  switch (actions.type) {
    case types.SUCCESS_LOAD_CHAT:
      return actions.payload;
    default :
      return state;
  }
};
