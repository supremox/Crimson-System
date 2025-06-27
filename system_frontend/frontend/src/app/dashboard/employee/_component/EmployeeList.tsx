import React from 'react'
import { Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { GetEmployeesRecord } from '@/app/hooks/useGetEmployeesRecord';
import UpdateEmployee from './UpdateEmployee';

const columns: TableProps['columns'] = [
  {
    title: 'Employee ID',
    dataIndex: 'employee_id',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Name',
    // dataIndex: ['first_name', 'last_name'],
    render: (_, row) => <span>{row.first_name} {row.last_name}</span> 
  },
  {
    title: 'Email',
    dataIndex: 'email',
    
  },
  {
    title: 'Department',
    // dataIndex: 'department.department_name',
    render: (_, row) => <span>{row.department.department_name}</span> 


  },
  {
    title: 'Position',
    render: (_, row) => <span>{row.position.position_name}</span> 
  },
  {
    title: 'Action',
    render: (_, record) => (
      <Space size="middle">
        <UpdateEmployee id={record.id}/>
      </Space>
    ),
  },
];

export default function EmployeeList() {
  const { useGetEmployees } = GetEmployeesRecord();

  const {data: employee, isLoading} = useGetEmployees()

  return (
    <Table columns={columns} dataSource={employee} loading={isLoading} rowKey={row => row.id} className='mt-6 mx-6 '/>
  )
}
