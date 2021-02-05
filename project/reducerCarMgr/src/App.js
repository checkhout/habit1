import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { basename } from '@config'

import Login from './pages/login';
import Admin from './pages/admin';

//引入全局样式
import './assets/style/index.less';


export default class App extends Component {

  render () {
    return (
      <Router basename={basename}>{/*转测时是在二级路径下的所以需要设置basename*/}
        <Switch>
          <Route path='/login' component={Login}/>
          <Route path='/' component={Admin}/>
        </Switch>
      </Router>
    )
  }
}
