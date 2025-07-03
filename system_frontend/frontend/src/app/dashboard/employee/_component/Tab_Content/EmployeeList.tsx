import React from 'react'
import { Space, Table, Tag, Avatar } from 'antd';
import type { TableProps} from 'antd';
import { useQuery } from '@tanstack/react-query';
import { GetEmployeesRecord } from '@/app/hooks/useGetEmployeesRecord';
import UpdateEmployee from '../Modal/UpdateEmployee';
import { EditOutlined } from '@ant-design/icons';

const columns: TableProps['columns'] = [
  {
    title: 'Employee',
    // dataIndex: ['first_name', 'last_name'],
    render: (_, row) => 
    <span className='flex flex-row items-center gap-3'> 
      <Avatar
        size={{ xs: 24, sm: 32, md: 40, lg: 40, xl: 40, xxl: 40 }}
        src={row.avatar}
        alt="avatar"
        onError={() => true}
      />
      <span className='flex flex-col'>
        <span className='text-gray-500'>{row.employee_id}</span>
        <span>{row.first_name} {row.last_name}</span>
      </span>
    </span> 
  },
  {
    title: 'Email',
    dataIndex: 'email',
    
  },
  {
    title: 'Department',
    // dataIndex: 'department.department_name',
    render: (_, row) => <span>{row.department}</span> 


  },
  {
    title: 'Position',
    render: (_, row) => <span>{row.position}</span> 
  },
  {
    title: 'Career Status',
    render: (_, row) => {
      const statusColorMap: Record<string, string> = {
        Probationary: 'bg-yellow-500',
        Intern: 'bg-blue-500',
        Regular: 'bg-green-600',
      };
      const bgColor = statusColorMap[row.career_status] || 'bg-gray-400';

      return (
        <span
          className={`${bgColor} flex items-center justify-center mx-auto`}
          style={{
            height: "30px",
            width: "110px",
            borderRadius: "20px",
            color: "white",
          }}
        >
          {row.career_status || "-"}
        </span>
      );
    }
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
    <>
      <div className="flex flex-col mt-4 rounded-lg p-4 shadow-lg bg-white">
          <h2 className="text-xl font-bold mb-4 ml-2 mt-1">List of Employees</h2>
          <Table columns={columns} dataSource={employee} loading={isLoading} rowKey={row => row.id} className='shadow-lg '/>
      </div>
    </>
     
  )
}
