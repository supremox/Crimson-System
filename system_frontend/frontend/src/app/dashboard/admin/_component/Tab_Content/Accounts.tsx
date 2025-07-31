import React, { useEffect, useState } from 'react'
import '@ant-design/v5-patch-for-react-19';
import { GetEmployeesRecord } from '@/app/hooks/useGetEmployeesRecord';
import { Avatar, Button, Input, Table, TableProps } from 'antd';
import { DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { Span } from 'next/dist/trace';

export default function Accounts() {
  const { useGetUsers } = GetEmployeesRecord();
  const { data: accounts, isLoading } = useGetUsers();

  const [searchText, setSearchText] = useState("");
  const [filteredAccounts, setFilteredAccounts] = useState([]);

  // Keep filtered data in sync with original data
  useEffect(() => {
    if (accounts) {
      setFilteredAccounts(accounts);
    }
  }, [accounts]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setSearchText(text);

    if (!accounts) return;

    if (text.trim() === "") {
      setFilteredAccounts(accounts); // Show all if empty
    } else {
      const lowerText = text.toLowerCase();
      const filtered = accounts.filter((acc: any) =>
        acc.employee_id.toLowerCase().includes(lowerText) ||
        acc.first_name.toLowerCase().includes(lowerText) ||
        acc.last_name.toLowerCase().includes(lowerText)
      );
      setFilteredAccounts(filtered);
    }
  };

  const accountscolumns: TableProps['columns'] = [
    {
      title: 'Employee',
      render: (_, data) =>
        <span className="flex flex-row items-center ml-3 gap-3">
          <Avatar
            size={40}
            src="/img/default_avatar.png"
            alt="avatar"
          />
          <span className="flex flex-col">
            <span className="text-gray-500">{data.employee_id}</span>
            <span>{data.first_name} {data.last_name}</span>
          </span>
        </span>
    },
    {
      title: 'Email',
      render: (_, data) => <span>{data.email}</span>
    },
    {
      title: 'Username',
      render: (_, data) => <span>{data.username}</span>
    },
    {
      title: 'Role',
      render: (_, data) => (
        <span className="flex flex-wrap gap-2">
          {data.role?.map((r: string, idx: number) => (
            <span
              key={idx}
              className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-lg"
            >
              {r}
            </span>
          ))}
        </span>
      ),
    },
    {
      title: 'Permissions',
      render: (_, data) => (
        <div className="grid grid-cols-2 gap-2">
          {data.custom_permissions?.map((perm: { code: string }, idx: number) => (
            <span
              key={idx}
              className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-lg text-center"
            >
              {perm.code}
            </span>
          ))}
        </div>
      ),
    },
    {
      title: 'Status',
      render: (_, data) => {
        const isActive = data.is_active === true || data.is_active === "true";
        const statusColor = isActive ? "bg-green-600" : "bg-red-600";
        const statusText = isActive ? "Active" : "Not Active";

        return (
          <span
            className={`text-center text-white flex items-center justify-center cursor-pointer ${statusColor}`}
            style={{
              height: "30px",
              width: "110px",
              borderRadius: "20px",
            }}
          >
            {statusText}
          </span>
        );
      },
    },
    {
      title: 'Action',
      width: '50px',
      render: () => (
        <div className='flex flex-row gap-1 mx-2'>
          <Button icon={<EyeOutlined style={{ color: "white" }} />} shape="circle" style={{ backgroundColor: "#001529" }} />
          <Button icon={<DeleteOutlined />} shape="circle" danger />
        </div>
      )
    }
  ];

  return (
    <div className='bg-white rounded-lg shadow-lg p-3'>
      <Input
        placeholder="Search by name or ID"
        allowClear
        value={searchText}
        onChange={handleSearch}
        prefix={<SearchOutlined className="mx-2" style={{ color: "#9CA3AF" }} />}
        className="h-10 shadow-lg mb-4"
        style={{ width: 300 }}
      />

      <Table
        size="small"
        columns={accountscolumns}
        dataSource={filteredAccounts}
        loading={isLoading}
        className='shadow-lg'
        rowKey={(row) => row.employee_id}
      />
    </div>
  );
}
