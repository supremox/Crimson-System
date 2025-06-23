'use client';

import useSWR from 'swr';
import { fetcher } from '@/app/fetcher';
import { AuthActions } from '@/app/auth/utils';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AntdRegistry } from "@ant-design/nextjs-registry";
import Link from "next/link";

import { useMutation } from "@tanstack/react-query";

import {
  Layout,
  Menu,
  Avatar,
  Button,
  Typography,
  Card,
  MenuProps,
  Dropdown
} from 'antd';

import {
  CalendarOutlined,
  ClockCircleOutlined,
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  WalletOutlined,
  MenuOutlined,
  BellOutlined,
  NotificationOutlined,
  LogoutOutlined,
  HomeOutlined,
} from '@ant-design/icons';

const { Sider, Content,  Footer } = Layout;
const { Title, Paragraph } = Typography;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem(<Link href={"/dashboard"}>Dashboard</Link>, "1", <HomeOutlined />),
  getItem(
    <Link href={"/dashboard/calendar"}>Calendar</Link>,
    "2",
    <CalendarOutlined />
  ),
  getItem("Attendance", "3", <ClockCircleOutlined />),
  getItem("Request", "sub1", <FileOutlined />, [
    getItem("Leave", "4"),
    getItem("Halfday", "5"),
    getItem("Cash", "6"),
  ]),
  getItem("Payroll", "7", <WalletOutlined />),
  getItem(<Link href={"/dashboard/employee"}>Employee</Link>, "8", <UserOutlined />),
];

const profileMenuItems = [
  { key: "1", icon: <UserOutlined />, label: "Your Profile" },
  { key: "2", icon: <CalendarOutlined />, label: "My Calendar" },
  { key: "3", icon: <NotificationOutlined />, label: "Announcements" },
  { type: "divider" as const },
  { key: "4", icon: <LogoutOutlined />, label: "Logout", danger: true },
];



export default function Home({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const { data: user } = useSWR('/auth/userv2/me', fetcher);
  const { logout, removeTokens } = AuthActions();
  const [collapsed, setCollapsed] = useState(false);

 
  
  const profileMenu = {
    items: profileMenuItems,
    onClick: () =>
      logout()
        .res(() => {
          removeTokens();
          router.push('/');
        })
        .catch(() => {
          removeTokens();
          router.push('/');
      }),
   };
  
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
    <AntdRegistry>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="dark">
          <Dropdown
            menu={profileMenu}
            trigger={["click"]}
            placement="bottomRight"
            overlayStyle={{ marginLeft: "10px" }}
            arrow
          >
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
          </Dropdown>
           <Menu
            theme="dark"
            defaultSelectedKeys={["1"]}
            mode="inline"
            items={items}
          />
        </Sider>

        <Layout>
            <Content>
                <AntdRegistry>{children}</AntdRegistry>
            </Content>
          {/* <Content style={{ margin: '24px 16px', padding: 24, background: '#f0f2f5' }}>
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
          </Content> */}
        </Layout>
      </Layout>
    </AntdRegistry>
  );
}
