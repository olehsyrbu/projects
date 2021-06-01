import * as types  from './types';
import { getChatData } from '../api';
import {beginAjaxCall} from './ajaxStatusActions';

export function fetchChatData(){
  return (dispatch) => {
    dispatch(beginAjaxCall());
    return getChatData().then((response)=>{
      console.log('res', response);
      return dispatch({
        type: types.SUCCESS_LOAD_CHAT,
        payload: response.data
      });
    });
  }
}
