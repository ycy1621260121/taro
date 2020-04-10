import Taro from '@tarojs/taro';
import * as cartApi from './service';


export default {
  namespace: 'cart',
  state: {
    items: Taro.getStorageSync('items') || [],
    wxdata:{}
  },
  effects: {
    *wxpay({ payload, callback }, { call, put }) {
      const data = yield call(cartApi.wxPay, payload);
      //直接返回
      if (callback && typeof callback === 'function') {
            callback(data); // 返回结果
      };
      //映射到props
      yield put({
        type: 'save',
        payload: {
          wxdata: data,
        },
      });
    },
  },
  reducers: {
    save(state, { payload }) {
      if(payload.items){
        Taro.setStorageSync('items', [...state.items, ...payload.items]);
      }
      return { ...state, ...payload };
    },
    deleteClothes(state, { payload }) {
      const { id } = payload;
      const items = state.items.filter(item => item.product_id != id);
      // 设置衣袋小红点
      if (items.length > 0) {
        Taro.setStorageSync('items', items);
        Taro.setTabBarBadge({
          index: 1,
          text: String(items.length),
        });
      } else {
        Taro.removeStorageSync('items');
        Taro.removeTabBarBadge({
          index: 1,
        });
      }
      return {
        ...state,
        ...{
          items,
        },
      };
    },
    init() {
      Taro.removeStorageSync('items');
      Taro.removeTabBarBadge({
        index: 1,
      });
      return {
        items: [],
      };
    },
  },
};
