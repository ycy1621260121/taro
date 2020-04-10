import Request from '../../utils/request2';

export const getWxPay = data =>
  Request({
    url: '/wxPay?date='+Date.now(),
    method: 'GET',
    data,
  });
export const getWxOpenId = data =>
  Request({
    url: '/wxOpenId?date='+Date.now(),
    method: 'GET',
    data,
  });
