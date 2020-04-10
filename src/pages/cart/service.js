import Request from '../../utils/request2';

export const wxPay = data =>
  Request({
    url: '/wxPay?date='+Date.now(),
    method: 'GET',
    data,
  });

