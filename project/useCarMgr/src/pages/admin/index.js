import React, {Component} from 'react';
import {connect} from "react-redux";
import {Layout} from 'antd';
import {Switch, Route, Redirect} from 'react-router-dom';
//改为容器组件
import UseCarManagement from '@pages/useCarManagement';
import AddressBook from '@pages/addressBook';
import CertificationAudit from '@pages/certificationAudit';


import HeaderCustom from './header/index';

const { Header, Content } = Layout;

@connect((state) => ({
  loginResult: state.loginResult,
}))

class Admin extends Component {
  render () {
    //登陆验证（保证第一次渲染和重新渲染都要做登陆验证）
    if (!this.props.loginResult.data.username) {
      return <Redirect to='/login'/>
    }

    // console.log('role check ===>  ', this.props.location, this.props.loginResult);

    return (
      <Layout style={{minHeight: '100vh', minWidth: '1120px'}}>
        <Header>
          <HeaderCustom />
        </Header>

        <Content >
          <Switch>
            <Route path='/useCarManager' component={UseCarManagement}/>
            <Route path='/addressBook' component={AddressBook}/>
            <Route path='/certificationAudit' component={CertificationAudit}/>

            <Redirect to='/useCarManager'/>
          </Switch>
        </Content>
      </Layout>
    )
  }
}

export default Admin
