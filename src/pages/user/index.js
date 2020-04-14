import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text, Icon, OpenData } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './index.scss';
import scanCode_img from '../../images/user/scan.png';
import message_img from '../../images/user/message.png';
import avatar_img from '../../images/user/avatar.png';
import coupon_img from '../../images/user/coupon.png';
import about_img from '../../images/user/about.png';
import address_img from '../../images/user/address.png';
import QQMapWX  from '../../js/qqmap-wx-jssdk.js';

@connect(({ user, common }) => ({
  ...user,
  ...common,
}))
class User extends Component {
  config = {
    navigationBarTitleText: '我的',
  };
  constructor(props) {
    super(props);
    this.state = {
     title:'',
     mapData:[],
     isClick :true
    };
  }
  componentWillMount() {
    let _this =this;
     if (process.env.TARO_ENV === 'weapp') {
      wx.startLocationUpdate({
          success(res) {
            //console.log('开启后台定位', res);
            if(res){
              _this.getLocationIt();
            }
          },
          fail(res) {
            console.log('开启后台定位失败', res)
          }
        });
      }
  }
  getLocationIt=()=>{
    const { isClick } = this.state;
    let _this = this;
    if (isClick) {   //如果为true 开始执行
    this.setState({ isClick: false }) ;
    wx.getLocation({
     type: 'gcj02', //返回可以用于wx.openLocation的经纬度
     success (ress) {
       const latitude = ress.latitude;
       const longitude = ress.longitude;
       // 实例化API核心类
       var qqmapsdk = new QQMapWX({
         key: 'PMOBZ-TL2WJ-ZFUFV-FSDDJ-YO2Y6-NJFIA' // 必填
       });
      // 调用接口
       qqmapsdk.getSuggestion({
          keyword: '海底捞',  //搜索关键词
          page_size:5,
          auto_extend:0,
          location: latitude+','+longitude,  //设置周边搜索中心点
          success: function (res) { //搜索成功后的回调
          _this.setState({
            mapData:res.data
          });
           const itemListData =[];
           for(let i in res.data){
             itemListData[i]=res.data[i].title + ('  ('+res.data[i]._distance+'米)');
           }
            console.log('看这里',res.data);
            Taro.showActionSheet({
              itemList: itemListData
            })
            .then(rs =>{
              console.log(rs.tapIndex,res.data[rs.tapIndex].id)//获取到当前选择店铺的id
              _this.setState({
                title:res.data[rs.tapIndex].title
              });
            })
            .catch(err => console.log(err.errMsg))
          },
          fail: function (res) {
            console.log(res);
          },
      });
     }
    })
    setTimeout(() =>{       // 设置延迟事件，1秒后将执行
    _this.setState({ isClick: true })   // 将isClick设置为true
    }, 1500);
    }
  }
  changeMap(){
    const { mapData, isClick }=this.state;
    const itemListData =[];
    let _this = this;
    if (isClick) {   //如果为true 开始执行
    this.setState({ isClick: false })
    for(let i in mapData){
      itemListData[i]=mapData[i].title + ('  ('+mapData[i]._distance+'米)');
    }
     Taro.showActionSheet({
       itemList: itemListData
     })
     .then(rs =>{
        console.log(rs.tapIndex,mapData[rs.tapIndex].id)//获取到当前选择店铺的id
       _this.setState({
         title:mapData[rs.tapIndex].title
       });
     })
     .catch(err => console.log(err.errMsg))
     }
     setTimeout(() =>{       // 设置延迟事件，1秒后将执行
     _this.setState({ isClick: true })   // 将isClick设置为true
     }, 1500);
  }
  goPage = e => {
    //console.log(e.currentTarget.dataset.url)
    if ( e.currentTarget.dataset.url == '/pages/login/index' && process.env.TARO_ENV === 'h5') {
       Taro.navigateTo({
         url: e.currentTarget.dataset.url,
       });
     }

  };

  goToPage = e => {
    if (!this.props.access_token && process.env.TARO_ENV === 'h5') {
      Taro.navigateTo({
        url: '/pages/login/index',
      });
      return;
    }
      Taro.navigateTo({
        url: e.currentTarget.dataset.url,
      });
  };

  toScanCode = () =>{
    Taro.scanCode({
      success (res) {
        console.log(res)
      }
    })
  }

  outLogin = e => {
    e.stopPropagation();
    if (!this.props.access_token) {
      Taro.navigateTo({
        url: '/pages/login/index',
      });
      return;
    }
    Taro.showModal({
      content: '是否退出当前账号？',
    }).then(res => {
      if (res.confirm) {
        Taro.removeStorageSync('user_info');
        Taro.removeStorageSync('access_token');
        this.props.dispatch({
          type: 'cart/init',
        });
        this.props.dispatch({
          type: 'common/save',
          payload: {
            access_token: '',
            invitation_code: '',
            mobile: '',
            nickname: '',
            new_user: '',
            is_has_buy_card: '',
            erroMessage: '',
          },
        });
        this.props.dispatch({
          type: 'login/save',
          payload: {
            access_token: '',
            invitation_code: '',
            mobile: '',
            nickname: '',
            new_user: '',
            is_has_buy_card: '',
            erroMessage: '',
          },
        });
      }
    });
  };

  render() {
    const { mobile, coupon_number, nickname, list } = this.props;
    const { title } =this.state;
    return (
      <View className="user-page">
        <View className="not-login">
          <View
            className="to-login"
            data-url="/pages/login/index"
            onClick={this.goPage}
          >
            <View className="left">
              {process.env.TARO_ENV === 'weapp'?
              (<View className='name black'>
                <OpenData type='userNickName' />
              </View>):
              (
              <View className={mobile ? 'name black' : 'name '}>
                {nickname || '请登录 >'}
              </View>)
              }
              <View>
                <View
                  className="msg"
                  data-url="/pages/message/index"
                  onClick={this.goToPage}
                >
                  <Image mode="widthFix" src={message_img} />
                </View>
                <View className="msg" onClick={this.outLogin}>
                  <Image
                    mode="widthFix"
                    src="http://static-r.msparis.com/uploads/9/a/9a00ce9a5953a6813a03ee3324cbad2a.png"
                  />
                </View>
                <View
                  className="msg"
                  onClick={this.toScanCode}
                >
                  <Image mode="widthFix" src={scanCode_img} />
                </View>
              </View>
            </View>
            <View className="avatar-container">
            {process.env.TARO_ENV === 'weapp' &&
              <OpenData type='userAvatarUrl' className="avatar" />
            }
            {process.env.TARO_ENV === 'h5' &&
              <Image className="avatar" src={avatar_img} />
            }
            </View>
          </View>
          {title?(<View
            className="maphere"
            onClick={this.changeMap}
          >
           <Text>{title+' '}></Text>
          </View>):null
          }
          <View className="list">
            {list &&
              list.map((item, index) => (
                <View
                  className="item"
                  key={index}
                  data-url={`/pages/order/index?type=${index}`}
                  onClick={this.goToPage}
                >
                  <Image mode="widthFix" src={item.img} />
                  <Text>{item.txt}</Text>
                  {item.num > 0 && <Icon className="num">{item.num}</Icon>}
                </View>
              ))}
          </View>
        </View>
        <View className="login">
          <View className="card">
            <View className="type type0">
             {process.env.TARO_ENV === 'h5' ?( <View className="operation">
                <View className="txt">
                  {mobile ? 'VIP会员用户' : '您还不是会员'}
                </View>
                {!mobile && (
                  <View
                    className="btn"
                    data-url="/pages/login/index"
                    onClick={this.goPage}
                  >
                    成为会员
                    <View className="iconfont icon-membership_more" />
                  </View>
                )}
              </View>):(<View className="operation">
                <View className="txt">VIP会员用户</View>
              </View>)
             }
            </View>
          </View>
          <View
            className="item"
            data-url="/pages/addressList/index"
            onClick={this.goToPage}
          >
            <View className="left">
              <Image className="icon-left" src={address_img} />
              <Text>收货地址</Text>
            </View>
            <View className="right">
              {coupon_number && <View className="num">{coupon_number}</View>}
              <View className="iconfont icon-more arrow" />
            </View>
          </View>
          <View
            className="item"
            data-url="/pages/couponList/index"
            onClick={this.goToPage}
          >
            <View className="left">
              <Image className="icon-left" src={coupon_img} />
              <Text>优惠券</Text>
            </View>
            <View className="right">
              {coupon_number && <View className="num">{coupon_number}</View>}
              <View className="iconfont icon-more arrow" />
            </View>
          </View>
          <View
            className="item"
            data-url="/pages/about/index"
            onClick={this.goPage}
          >
            <View className="left">
              <Image className="icon-left" src={about_img} />
              <Text>关于</Text>
            </View>
            <View className="right">
              <View className="iconfont icon-more arrow" />
            </View>
          </View>
          {/* 流量主广告 */}
          {Taro.getEnv() === Taro.ENV_TYPE.WEAPP && (
            <ad unit-id="adunit-acab7e823a01abbd" />
          )}
        </View>
      </View>
    );
  }
}

export default User
