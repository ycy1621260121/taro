import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View, Image, Button, Text } from '@tarojs/components';
import ClothingsItem from '../../components/ClothingsItem';
import * as cartApi from './service';
import './index.scss';

@connect(({ cart }) => ({
  ...cart,
}))
class Cart extends Component {
  config = {
    navigationBarTitleText: '衣袋',
  };

  goHome() {
    if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
      Taro.navigateTo({
        url: '/pages/home/index',
      });
    } else {
      Taro.switchTab({
        url: '/pages/home/index',
      });
    }
  }
  //扫码
  // scanCode(){
  //   Taro.scanCode({
  //     success (res) {
  //        console.log(res)
  //      }
  //   })
  // }

  clothingNumExplain() {
    const content =
      '“会员每次免费租4件”可付费多租一件，5件封顶；VIP每次免费可租4件会员+1件VIP美衣或者2件会员+2件VIP美衣，或者3件VIP美衣；可付费多租1-2件，5件封顶；';
    Taro.showModal({
      content,
      showCancel: false,
    });
  }

  // 删除美衣
  onDeleteClothing = e => {
    const id = e.currentTarget.dataset.id;
    Taro.showModal({
      content: '是否删除该美衣？',
    }).then(res => {
      if (res.confirm) {
        this.props.dispatch({
          type: 'cart/deleteClothes',
          payload: {
            id,
          },
        });
      }
    });
  };

  componentDidShow() {
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
  }
 async getOpen(code){
   const rs = await cartApi.getWxOpenId({
     code: code,
   });
  if(rs.data.openid){
    const ress = await cartApi.getWxPay({
      openid:'ohS93v4wig9xYj136xsvQJ7cN_-U'
    });
   Taro.requestPayment({
     timeStamp: ress.timeStamp,
     nonceStr: ress.nonceStr,
     package: ress.package,
     signType: ress.signType,
     paySign: ress.paySign,
     success (res) {
         if (res.err_msg == "get_brand_wcpay_request:ok") {
           console.log('付款成功')
         } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
           console.log('取消付款')
         } else if (res.err_msg == "get_brand_wcpay_request:fail") {
           console.log('付款失败')
         }
     },
     fail (res) {console.log('取消付款',res)}
   })
  }
   /*let params={
     openid:'ohS93v4wig9xYj136xsvQJ7cN_-U'
   }
   this.props.dispatch({
     type: 'cart/wxpay',
     payload: params,
     callback: (ress) => {
       //if (process.env.TARO_ENV === 'weapp') {
         Taro.requestPayment({
           timeStamp: ress.timeStamp,
           nonceStr: ress.nonceStr,
           package: ress.package,
           signType: ress.signType,
           paySign: ress.paySign,
           success (res) {
               if (res.err_msg == "get_brand_wcpay_request:ok") {
                 console.log('付款成功')
               } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                 console.log('取消付款')
               } else if (res.err_msg == "get_brand_wcpay_request:fail") {
                 console.log('付款失败')
               }
           },
           fail (res) {console.log('取消付款',res)}
         })
     //  }
      }
   });*/
 }
  buy=()=>{
    // Taro.showToast({
    //   title: '衣袋尚未激活，下单失败～～',
    //   icon: 'none',
    // });
    //微信支付
    if (process.env.TARO_ENV === 'weapp') {
      let _this= this;
      wx.login({
        success (res) {
          if (res.code) {
            //发起网络请求
            _this.getOpen(res.code)
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    }

  }

  render() {
    const { items } = this.props;
    const isH5 = Taro.getEnv() === Taro.ENV_TYPE.WEB;
    return (
      <View className="cart-page">
        {items.length == 0 ? (
          <View className="empty">
            <Image
              mode="widthFix"
              src="http://static-r.msparis.com/uploads/b/c/bcffdaebb616ab8264f9cfc7ca3e6a4e.png"
            />
            <Button type="primary" className="am-button" onClick={this.goHome}>
              立即去挑选美衣
            </Button>
          </View>
        ) : (
          <View className="isLogin">
            <Image
              onClick={this.clothingNumExplain}
              mode="widthFix"
              src="https://static-rs.msparis.com/uploads/1/0/106494e4c47110f6c0e4ea40e15ad446.png"
            />
            <ClothingsItem
              clothing={items}
              onDeleteClothing={this.onDeleteClothing}
            />
            <View className="bottom-count" style={!isH5 && 'bottom:0;'}>
              <View className="fj">
                <View>
                  合计：
                  <Text className={!items.length ? 'disabled price' : 'price'}>
                    0.00
                  </Text>
                </View>
                <Button
                  className="cart-btn"
                  onClick={this.buy}
                  disabled={!items.length}
                >
                  下单
                </Button>
                <View className="info">
                  如有失效美衣，建议删除，以免占用衣袋件数
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}

export default Cart;
