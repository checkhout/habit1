import React, {Component} from 'react';
import {connect} from "react-redux";
import {Layout} from 'antd';
import {Switch, Route, Redirect} from 'react-router-dom';
//改为容器组件
import Dashboard from '@pages/dashboard';


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

    return (
      <Layout style={{minHeight: '100vh', minWidth: '1200px'}}>
        <Header>
          <HeaderCustom />
        </Header>

        <Content >
          <Switch>
            <Route path='/dashboard' component={Dashboard}/>
            <Route path='/addressBook' component={Dashboard}/>
            <Route path='/certificationAudit' component={Dashboard}/>

            <Redirect to='/dashboard'/>
          </Switch>
        </Content>
      </Layout>
    )
  }
}

export default Admin
