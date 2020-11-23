import React from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';

const renderMenuItem = item => ( // item.route 菜单单独跳转的路由
  <Menu.Item
    key={item.path}
  >
    <Link to={(item.route || item.path) + (item.query || '')}>
      {item.icon && <Icon type={item.icon}/>}
      <span className="nav-text">{item.title}</span>
    </Link>
  </Menu.Item>
);

const Menus = ({ menus, ...props }) => (
  <Menu {...props}>
    {menus && menus.map(item =>
      renderMenuItem(item)
    )}
  </Menu>
);

export default Menus;