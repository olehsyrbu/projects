import * as axios from 'axios';

export function getChatData(){
  // ??????
  let url = 'http://127.0.0.1:8000';
  return axios.get(url);
}
