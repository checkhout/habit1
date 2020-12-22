import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';

const renderMenuItem = item => ( // item.route 菜单单独跳转的路由
  <Menu.Item
    key={item.path}
  >
    <Link to={{pathname: item.path, state: {}}}>
      {/*{item.icon && <i className={item.iconClassName}/>}*/}
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
