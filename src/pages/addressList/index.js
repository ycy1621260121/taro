import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './index.scss';

@connect(({ addressList }) => ({
  ...addressList,
}))
class Addresslist extends Component {
  config = {
    navigationBarTitleText: '收货地址',
  };
  constructor(props) {
    super(props);
    this.state = {
      userName:'',
      address:'',
      telNumber:''
    };
  }

  componentDidMount = () => {
    if (process.env.TARO_ENV === 'h5'){
      this.props.dispatch({
         type: 'addressList/getAddressList',
      });
    }
  };

  componentDidShow = () => {
    if (process.env.TARO_ENV === 'h5'){
      this.props.dispatch({
         type: 'addressList/getAddressList',
      });
    }
    let _this = this;
    if (process.env.TARO_ENV === 'weapp') {
      wx.getStorage({
        key: 'address',
        success (res) {
          _this.setState({
            userName:res.data.userName,
            address:res.data.address,
            telNumber:res.data.telNumber,
          });
        },fail(res){
          console.log(res);
          wx.getSetting({
            success(ress) {
              if (!ress.authSetting['scope.address']) {
                wx.authorize({
                  scope: 'scope.address',
                  success () {
                   _this.addressUpdate();
                  }
                })
              }
            }
          });
        }
      });
    }
  };

  addressUpdate = () => {
    let _this = this;
    wx.chooseAddress({
      success (res) {
        _this.setState({
          userName:res.userName,
          address:res.provinceName + res.cityName + res.countyName + res.detailInfo,
          telNumber:res.telNumber,
        });
        wx.setStorage({
          key:"address",
          data:{
            userName:res.userName,
            address:res.provinceName + res.cityName + res.countyName + res.detailInfo,
            telNumber:res.telNumber,
          }
        })
        // console.log(res.userName)//名字
        // console.log(res.postalCode)//邮编
        // console.log(res.provinceName)//省份
        // console.log(res.cityName)//城市
        // console.log(res.countyName)//区
        // console.log(res.detailInfo)//路
        // console.log(res.nationalCode)//邮编
        // console.log(res.telNumber)//电话
      }
    })

    if(process.env.TARO_ENV === 'h5'){
      this.props.dispatch({
            type: 'addressUpdate/save',
            payload: {
              addressId: '',
              showValue: {
                region_code: '',
                region_name: '',
              },
              contact_name: '',
              contact_mobile: '',
              address_detail: '',
            },
          });
          Taro.navigateTo({
            url: '/pages/addressUpdate/index',
          });
    }
  };
  addressEdit = e => {
      const {
        id,
        region_code,
        region_name,
        contact_name,
        contact_mobile,
        address_detail,
      } = e.currentTarget.dataset;
      this.props.dispatch({
        type: 'addressUpdate/save',
        payload: {
          addressId: id,
          showValue: {
            region_code,
            region_name,
          },
          contact_name,
          contact_mobile,
          address_detail,
        },
      });
      Taro.navigateTo({
        url: '/pages/addressUpdate/index',
      });
    };
  render() {
   const {userName,address,telNumber}= this.state;
   const { addressList } = this.props;
    return (
      <View className="addressList-page">
           {process.env.TARO_ENV === 'weapp'?
            (<View className="content">
              <View className="info">
                <View className="contact">
                  <Text className="name">{userName}</Text>
                  <Text className="mobile">{telNumber}</Text>
                </View>
                <View className="region">
                  <View className="name">{address}</View>
                </View>
              </View>
              <View
                className="edit"
                data-contact_name={userName}
                data-contact_mobile={telNumber}
                data-address_detail={address}
                onClick={this.addressUpdate}
              >
                <Image
                  mode="widthFix"
                  src="http://static-r.msparis.com/uploads/9/1/91d94589817e388f6c2d641f34d99b2f.png"
                />
              </View>
            </View>):(addressList.length > 0 ? (
                addressList.map(item => (
                  <View className="content" key={item.id}>
                    <View className="info">
                      <View className="contact">
                        <Text className="name">{item.contact_name}</Text>
                        <Text className="mobile">{item.contact_mobile}</Text>
                      </View>
                      <View className="region">
                        <View className="name">{item.region_name}</View>
                        <View className="detail">{item.address_detail}</View>
                      </View>
                    </View>
                    <View
                      className="edit"
                      data-id={item.id}
                      data-region_code={item.region_code}
                      data-region_name={item.region_name}
                      data-contact_name={item.contact_name}
                      data-contact_mobile={item.contact_mobile}
                      data-address_detail={item.address_detail}
                      onClick={this.addressEdit}
                    >
                      <Image
                        mode="widthFix"
                        src="http://static-r.msparis.com/uploads/9/1/91d94589817e388f6c2d641f34d99b2f.png"
                      />
                    </View>
                  </View>
                ))
              ) : (
                <View className="empty-address">
                  <Image
                    mode="widthFix"
                    src="https://static-rs.msparis.com/m-site/images/empty/address.png"
                  />
                </View>
              ))
            }
            {process.env.TARO_ENV === 'weapp' ?(<View></View>):(<View className="add" onClick={this.addressUpdate}>
              <Image mode="widthFix" src={require('../../images/icon/add.png')} />
              <Text>添加地址</Text>
            </View>)

            }
      </View>
    );
  }
}

export default Addresslist;
