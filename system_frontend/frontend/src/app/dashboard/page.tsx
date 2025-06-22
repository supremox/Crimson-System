'use client';

import useSWR from 'swr';
import { fetcher } from '@/app/fetcher';
import { AuthActions } from '@/app/auth/utils';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import {
  Layout,
  Menu,
  Avatar,
  Button,
  Typography,
  Card,
} from 'antd';
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
const { Title, Paragraph } = Typography;

export default function Home() {
  const router = useRouter();
  const { data: user } = useSWR('/auth/userv2/me', fetcher);
  const { logout, removeTokens } = AuthActions();
  const [collapsed, setCollapsed] = useState(false);

  console.log(user)
    
  const handleLogout = () => {
    logout()
      .res(() => {
        removeTokens();
        router.push('/');
      })
      .catch(() => {
        removeTokens();
        router.push('/');
      });
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="dark">
        <div style={{ padding: 16, textAlign: 'center' }}>
          <Avatar
            size={collapsed ? 40 : 64}
            src="img/ppic.png"
            style={{ marginBottom: 16 }}
          />
           {!collapsed && (
                <div className="flex flex-col text-white">
                <h1 className="text-base font-semibold leading-tight">
                    {user?.first_name || user?.username}
                </h1>
                <h3 className="text-sm text-gray-400">Frontend Dev</h3>
                </div>
            )}
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<HomeOutlined />}>
            {!collapsed && 'Dashboard'}
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            {!collapsed && 'Employee'}
          </Menu.Item>
          <Menu.Item key="3" icon={<FileOutlined />}>
            {!collapsed && 'Files'}
          </Menu.Item>
          <Menu.Item key="4" icon={<SettingOutlined />}>
            {!collapsed && 'Settings'}
          </Menu.Item>
          <Menu.Item
            key="5"
            icon={<PoweroffOutlined />}
            onClick={handleLogout}
            style={{ color: 'red' }}
          >
            {!collapsed && 'Logout'}
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#f0f2f5' }}>
          <Card style={{ maxWidth: 500, margin: '0 auto' }}>
            <Title level={3}>Hi, {user?.first_name}!</Title>
            <Paragraph>Your account details:</Paragraph>
            <ul style={{ marginBottom: 16 }}>
              <li><strong>First_name:</strong> {user?.first_name}</li>
              <li><strong>Email:</strong> {user?.email}</li>
            </ul>
            <Button type="primary" danger onClick={handleLogout}>
              Disconnect
            </Button>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
}
