"use client";

import useSWR from "swr";

// import { fetcher } from '@/app/fetcher';
import axiosInstance from "../../../server/instance_axios";
// import { AuthActions } from '@/app/auth/utils';
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { removeToken } from "../../../server/getToken";
import { useMutation, useQuery } from "@tanstack/react-query";

import { GetEmployeesRecord } from "../hooks/useGetEmployeesRecord";

import {
  Layout,
  Menu,
  Avatar,
  Button,
  Typography,
  Card,
  MenuProps,
  Dropdown,
  Popover,
  List,
} from "antd";

import {
  CalendarOutlined,
  ClockCircleOutlined,
  FileOutlined,
  UserOutlined,
  WalletOutlined,
  NotificationOutlined,
  LogoutOutlined,
  HomeOutlined,
} from "@ant-design/icons";

const { Sider, Content, Footer } = Layout;
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
  getItem(<Link href={"/dashboard/calendar"}>Calendar</Link>,"2",<CalendarOutlined />),
  getItem(<Link href={"/dashboard/attendance"}>Attendance</Link>, "3", <ClockCircleOutlined />),
  getItem("Forms", "sub1", <FileOutlined />, [
    getItem(<Link href={"/dashboard/leave"}>Leave</Link>, "4"),
    getItem(<Link href={"/dashboard/shiftchange"}>Shift Change</Link>, "5"),
    getItem(<Link href={"/dashboard/overtime"}>Over-Time</Link>, "6"),
    getItem(<Link href={"/dashboard/cashadvance"}>Cash Advance</Link>, "7"),
  ]),
  getItem(<Link href={"/dashboard/payroll"}>Payroll</Link>, "8", <WalletOutlined />),
  getItem(<Link href={"/dashboard/employee"}>Management</Link>,"9",<UserOutlined />),
];

const profileMenuItems = [
  { key: "1", icon: <UserOutlined />, label: "Your Profile" },
  { key: "2", icon: <CalendarOutlined />, label: "My Calendar" },
  { key: "3", icon: <NotificationOutlined />, label: "Announcements" },
  { type: "divider" as const },
  { key: "4", icon: <LogoutOutlined />, label: "Logout", danger: true },
];

const fetcher = (url: string) => axiosInstance.get(url);

export default function Home({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  const { useGetEmployeeUser } = GetEmployeesRecord()
  const router = useRouter();
  const { data: user } = useGetEmployeeUser()

  console.log("user", user)

  const [collapsed, setCollapsed] = useState(false);

  console.log(user);

  const { mutate: logout } = useMutation({
    mutationFn: () => axiosInstance.post("/auth/logout/"),
  });

  
  const handleProfileClick = (key: string) => {
    if (key === "4") {
      removeToken("accessToken");
      removeToken("refreshToken");
      router.push("/");
    } else {
      console.log("Clicked:", key);
      // You can handle other keys here
    }
  };

  const popoverContent = (
    <List
      size="small"
      dataSource={profileMenuItems}
      renderItem={(item) =>
        item.type === "divider" ? (
          <hr />
        ) : (
          <List.Item onClick={() => handleProfileClick(item.key)}>
            <div className="flex items-center gap-2 cursor-pointer hover:text-blue-500">
              {item.icon}
              <span className={item.danger ? "text-red-500" : ""}>{item.label}</span>
            </div>
          </List.Item>
        )
      }
    />
  );

  return (
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          theme="dark"
        >
          <Popover placement="rightBottom" title="User Menu" content={popoverContent} trigger="click">
            <div style={{ padding: 16, textAlign: "center", cursor: "pointer" }}>
              <Avatar
                size={collapsed ? 40 : 64}
                src="/img/ppic.png"
                style={{ marginBottom: 16 }}
              />
              {!collapsed && (
                <div className="flex flex-col text-white">
                  <h1 className="text-base font-semibold leading-tight">
                    {user?.first_name || user?.first_name}
                  </h1>
                  <h3 className="text-sm text-gray-400">{user?.position}</h3>
                </div>
              )}
            </div>
          </Popover>

          <Menu
            theme="dark"
            defaultSelectedKeys={["1"]}
            mode="inline"
            items={items}
          />
        </Sider>

        <Layout>
          <Content>
            {children}
          </Content>
        </Layout>
      </Layout>
  );
}
