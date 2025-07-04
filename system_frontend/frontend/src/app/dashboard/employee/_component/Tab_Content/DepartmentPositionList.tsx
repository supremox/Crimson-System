import { getQueryClient } from '@/app/components/getQueryClient';
import { GetEmployeesRecord } from '@/app/hooks/useGetEmployeesRecord';
import '@ant-design/v5-patch-for-react-19';
import { Button, Form, Input, Select, Space, Table, TableProps } from 'antd'
import React from 'react'
import axiosInstance from '../../../../../../server/instance_axios';
import { useMutation } from '@tanstack/react-query';
import UpdateDepartment from '../Modal/UpdateDepartment';
import UpdatePosition from '../Modal/UpdatePosition';

type DepartmentFieldType = {
  department_name: string;
};

type PositionFieldType = {
  position_name: string;
  department: string;
};

const columns: TableProps['columns'] = [
  {
    title: 'Dept_ID',
    // dataIndex: ['first_name', 'last_name'],
    render: (_, row) => <span>{row.id}</span>
  },
  {
    title: 'Department',
    // dataIndex: 'department.department_name',
    render: (_, row) => <span>{row.department_name}</span> 


  },
  {
    title: 'Action',
    render: (_, record) => (
      <Space size="middle">
        <UpdateDepartment id={record.id}/>
      </Space>
    ),
  },
];

const positioncolumns: TableProps['columns'] = [
  {
    title: 'Pos_ID',
    // dataIndex: ['first_name', 'last_name'],
    render: (_, row) => <span>{row.id}</span>
  },
  {
    title: 'Position',
    render: (_, row) => <span>{row.position_name}</span> 
    
  },
  {
    title: 'Department',
    // dataIndex: 'department.department_name',
    render: (_, row) => <span>{row.department_name}</span> 


  },
  {
    title: 'Action',
    render: (_, record) => (
      <Space size="middle">
        <UpdatePosition id={record.id}/>
      </Space>
    ),
  },
];




export default function DepartmentPositionList() {

    const { useGetPosition, useGetDepartments} = GetEmployeesRecord();
    const queryClient = getQueryClient();
    const [departmentForm] = Form.useForm();
    const [positionForm] = Form.useForm();

    const { data: departments, isLoading, error } = useGetDepartments()
    const { data: position } = useGetPosition()

    const { Option } = Select;

    const { mutate: mutate_department } = useMutation({
        mutationFn: async (data: DepartmentFieldType) => {
        return await axiosInstance.post("/employee/departments/names/", data);
        },
    });

    const { mutate: mutate_position } = useMutation({
        mutationFn: async (data: PositionFieldType) => {
        return await axiosInstance.post("/employee/position/names/", data);
        },
    });


    const onAddDepartment = (values: any) => {
        mutate_department(values, {
        onSuccess: (data) => {
            if (data.status === 201) {
            queryClient.invalidateQueries({ queryKey: ["departments"] });
            }
        },
        onError: (error) => {
            alert(error);
        },
        });
    };

    const onAddPosition = (values: any) => {
        mutate_position(values, {
        onSuccess: (data) => {
            if (data.status === 201) {
            queryClient.invalidateQueries({ queryKey: ["position"] });
            }
        },
        onError: (error) => {
            alert(error);
        },
        });
    };


  return (
       <div id="deptTab" className="tab-content mt-2">
            <div className="grid grid-cols-5 grid-rows-5 mt-7 gap-4">
                {/* Deparments List/Creation */}
                <div className="col-span-2 row-span-5">
                    <div className="flex flex-col rounded-lg p-4 shadow-lg bg-white">
                        <h2 className="text-xl font-bold mb-4 ml-2 mt-2">Departments</h2>
                        <Form
                        form={departmentForm}
                        layout="vertical"
                        onFinish={onAddDepartment}
                        className="rounded-lg p-4"
                        >
                            <div className="flex flex-row gap-4">
                                <Form.Item
                                label="Department Name"
                                name="department_name"
                                rules={[{ required: true }]}
                                >
                                <Input />
                                </Form.Item>
                                <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="mt-7.5"
                                >
                                    Create Department
                                </Button>
                                </Form.Item>
                            </div>
                        </Form>

                        <Table columns={columns} dataSource={departments} loading={isLoading} rowKey={row => row.id} className='shadow-lg '/>
                    </div>
                </div>

                {/* Positions List/Creation */}
                <div className="col-span-3 row-span-5 col-start-3 rounded-lg p-4 shadow-lg bg-white">
                    <h2 className="text-xl font-bold mb-4 ml-2 mt-2">Positions</h2>
                    <Form
                        form={positionForm}
                        layout="vertical"
                        onFinish={onAddPosition}
                        className="rounded-lg p-4"
                        >
                        <div className="flex flex-row gap-4">
                            <Form.Item
                                label="Position Name"
                                name="position_name"
                                rules={[{ required: true }]}
                                >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Department"
                                name="department"
                                className="text-blue-950"
                                rules={[{ required: true }]}
                                >
                                <Select placeholder="Select department">
                                    {Array.isArray(departments) &&
                                    departments.length === 0 && (
                                        <Option>No Departments</Option>
                                    )}
                                    {Array.isArray(departments) &&
                                    departments.map((dept: any) => (
                                        <Option key={dept.id} value={dept.department_name}>
                                        {dept.department_name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            
                            <Form.Item>
                                <Button
                                type="primary"
                                htmlType="submit"
                                className="mt-7.5"
                                >
                                Create Position
                                </Button>
                            </Form.Item>
                        </div>
                    </Form>
                    
                    <Table columns={positioncolumns} dataSource={position} loading={isLoading} rowKey={row => row.id} className='shadow-lg '/>

                </div>

            </div>
        </div>
  )
}
