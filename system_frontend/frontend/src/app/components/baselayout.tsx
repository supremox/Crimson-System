'use client';
import { useState } from 'react';
import { Layout, Menu, Avatar } from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  FileOutlined,
  SettingOutlined,
  PoweroffOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

const { Sider, Content } = Layout;

export default function SidebarLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="dark">
        <div style={{ padding: 16, textAlign: 'center' }}>
          <div className='flex flex-row'>
            <Avatar
              size={collapsed ? 40 : 64}
              src="https://randomuser.me/api/portraits/women/76.jpg"
              style={{ marginBottom: 16 }}
            />
            <div className='flex flex-col'>
              <h1>Vince</h1>
              <h3>Backend</h3>
            </div>
          </div>
         
        </div>

        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<HomeOutlined />}>
            {!collapsed && 'Dashboard'}
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            {!collapsed && 'Profile'}
          </Menu.Item>
          <Menu.Item key="3" icon={<FileOutlined />}>
            {!collapsed && 'Files'}
          </Menu.Item>
          <Menu.Item key="4" icon={<SettingOutlined />}>
            {!collapsed && 'Settings'}
          </Menu.Item>
          <Menu.Item key="5" icon={<PoweroffOutlined />} style={{ color: 'red' }}>
            {!collapsed && 'Logout'}
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Content style={{ margin: '24px 16px', background: '#f0f2f5', padding: 24 }}>
          <h1>Main Content Area</h1>
        </Content>
      </Layout>
    </Layout>
  );
}
