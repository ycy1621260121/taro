import Taro from '@tarojs/taro';
import { netUrl, noConsole } from '../config';

const request_data = {
  platform: 'wap',
  rent_mode: 2,
};

export default (options = { method: 'POST', data: {} }) => {
  if (!noConsole) {
    console.log(
      `${new Date().toLocaleString()}【 M=${options.url} 】P=${JSON.stringify(
        options.data
      )}`
    );
  }
  return Taro.request({
    url: netUrl + options.url,
    data: {
      ...request_data,
      ...options.data,
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: options.method.toUpperCase(),
  }).then(res => {
    const { data } = res;
    if (data) {
      console.log(`${new Date().toLocaleString()}【 M=${options.url} 】【接口响应：】`,data);
      return data;
    }
  });
};
