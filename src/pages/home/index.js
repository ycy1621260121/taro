import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import MySwiper from '../../components/MySwiper';
import GoodsList from '../../components/GoodsList';
import './index.scss';

@connect(({ home, cart, loading }) => ({
  ...home,
  ...cart,
  ...loading,
}))
class Index extends Component {
  config = {
    navigationBarTitleText: '首页',
  };
  componentDidMount = () => {
    this.props.dispatch({
      type: 'home/load',
    });
    this.props.dispatch({
      type: 'home/product',
    });

    // 设置衣袋小红点
    if (this.props.items.length > 0) {
      Taro.setTabBarBadge({
        index: 1,
        text: String(this.props.items.length),
      });
    } else {
      Taro.removeTabBarBadge({
        index: 1,
      });
    }

    //小程序设备方向
    /* if (process.env.TARO_ENV === 'weapp') {
       wx.startDeviceMotionListening({
          success: function (e) {
            console.log('设备方向',e);
          }
        });
        // alpha  number  当 手机坐标 X / Y 和 地球 X / Y 重合时，绕着 Z 轴转动的夹角为 alpha，范围值为[0, 2 * PI) 。逆时针转动为正。
        wx.onDeviceMotionChange(function (res) {
            var alpha = parseFloat(res.alpha);
            if (alpha > 45 && alpha < 136) {
              console.log({ screen: '左侧' })
            } else if (alpha > 225 && alpha < 316) {
              console.log({ screen: '右侧' })
            } else if (alpha > 135 && alpha < 226) {
              console.log({ screen: '反面' })
            } else {
              console.log({ screen: '正面' })
            }
          })
    }*/

  };

  //分享
  onShareAppMessage() {
    return {
      title: '基于Taro框架开发的时装衣橱',
      path: '/pages/home/index',
    };
  }

  //小程序上拉加载
  onReachBottom() {
    // this.props.dispatch({
    //   type: 'home/save',
    //   payload: {
    //     page: this.props.page + 1,
    //   },
    // });
    this.props.dispatch({
      type: 'home/product',
      payload: {
         page: this.props.page + 1,
      },
    });
  }

  render() {
    const { banner, brands, products_list, effects } = this.props;
    return (
      <View className="home-page">
        <MySwiper banner={banner} home />
        <View className="nav-list">
          {brands.map((item, index) => (
            <View className="nav-item" key={index}>
              <Image mode="widthFix" src={item.image_src} />
            </View>
          ))}
        </View>
        {/* 流量主广告 */}
        {Taro.getEnv() === Taro.ENV_TYPE.WEAPP && (
          <ad unit-id="adunit-dc1c0a38156fa412" />
        )}
        <Text className="recommend">为你推荐</Text>
        <GoodsList list={products_list} loading={effects['home/product']} />
      </View>
    );
  }
}

export default Index;
