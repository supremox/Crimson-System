import { GetEmployeesRecord } from '@/app/hooks/useGetEmployeesRecord';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, Table } from 'antd';
import type { InputRef, TableColumnsType } from "antd";
import React, { useRef } from 'react'
import { getQueryClient } from '@/app/components/getQueryClient'; 
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../../../../../../server/instance_axios';
import { Span } from 'next/dist/trace';

type IncentiveFieldType = {
  incentive_name: string;
  incentive_amount: string;
};


export default function IncetiveList() {
    const { useGetIncentives, useGetLeaves } = GetEmployeesRecord();
    const queryClient = getQueryClient();
    const [incentiveForm] = Form.useForm();
    const [leaveform] = Form.useForm();
    const vacationRef = useRef<InputRef>(null);
    const sickRef = useRef<InputRef>(null);

    const { data: incentive, isLoading, error } = useGetIncentives()
    const { data: leave } = useGetLeaves()
    
    console.log("leave", leave)

    const { mutate: mutate_incentive } = useMutation({
        mutationFn: async (data: IncentiveFieldType) => {
        return await axiosInstance.post("/employee/incentives/name/", data);
        },
    });

  
    const onAddIncentive = (values: any) => {
        mutate_incentive(values, {
        onSuccess: (data) => {
            if (data.status === 201) {
            queryClient.invalidateQueries({ queryKey: ["incentive"] });
            }
        },
        onError: (error) => {
            alert(error);
        },
        });
    };

    const { mutate: mutate_updateLeave } = useMutation({
        mutationFn: async (data: { vacation_leave?: number; sick_leave?: number }) => {
            return await axiosInstance.patch("/employee/leave/1/", data);
        },
    });

    const onUpdateLeave = (values: { vacation_leave: number; sick_leave: number }) => {
        mutate_updateLeave(values, {
            onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leave'] }); // refresh leave data
            },
            onError: (error) => {
            alert('Failed to update leave');
            console.error(error);
            },
        });
    };

     const dynamicColumns: TableColumnsType = [
         {
            title: 'Incentive_ID',
            // dataIndex: ['first_name', 'last_name'],
            render: (_, row) => <span>{row.id}</span>
        },
        {
            title: 'Incentive',
            // dataIndex: 'department.department_name',
            render: (_, row) => <span>{row.incentive_name}</span> 
    
    
        },
        {
            title: 'Incentive Value',
            // dataIndex: 'department.department_name',
            render: (_, row) => <span>{row.incentive_amount}</span> 
    
    
        },
        {
          title: <span className="flex items-center justify-center">Action</span>,
          key: "action",
          fixed: "right",
          width: 100,
          render: () => 
          <span className="flex items-center justify-center gap-2">
            <Button
                type="primary"
                className="h-10 shadow-lg"
                // onClick={handleFilter}
            >
                <EditOutlined />
            </Button>
            <Button
                type="primary"
                danger
                className="h-10 shadow-lg"
                // onClick={handleFilter}
            >
               <DeleteOutlined />
            </Button>
          </span> 
        },
      ];

    return (
        <>
            <div className="flex flex-col">
                <div className="bg-white rounded-lg shadow-lg mt-4 mb-5 p-2">
                    <Form
                        form={incentiveForm}
                        layout="vertical"
                        onFinish={onAddIncentive}
                        className="rounded-lg p-4"
                    >
                        <div className="flex flex-row mt-4 gap-4">
                            <h2 className="text-xl font-bold ml-4 mt-6.5 mr-8">Incentive Creation</h2>

                            <Form.Item
                                label="Incentive Name"
                                name="incentive_name"
                                rules={[{ required: true }]}
                            >
                                <Input className="w-75 shadow-lg" />
                            </Form.Item>
        
                            <Form.Item
                                label="Incentive Amount"
                                name="incentive_amount"
                                rules={[{ required: true }]}
                            >
                                <Input className="w-75 shadow-lg"/>
                            </Form.Item>
        
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className='mt-7.5 shadow-lg'
                                    icon={<PlusOutlined/>}
                                    >
                                    Create Incentive
                                </Button>
                            </Form.Item>
                        </div>
                    </Form>
                </div>

                {/* Incentives Table */}
                <div className="bg-white rounded-lg shadow-lg mb-5 p-5">
                    
                    <Table
                        className="mt-4 shadow-lg "
                        size="middle"
                        columns={dynamicColumns}
                        dataSource={incentive}
                        loading={isLoading}
                        rowKey={(row) => row.id}
                        scroll={{ x: "max-content", y: 55 * 5 }}
                    />

                </div>

                {/* Leaves */}
                <div className="bg-white rounded-lg shadow-lg mb-5 p-5">
                    <div className="flex flex-row gap-4">
                        <h2 className="text-xl font-bold ml-4 mt-2 mr-4">Leave</h2>
                        <div className="flex flex-row gap-2">
                            <Form
                                form={leaveform}
                                layout="inline"
                                onFinish={onUpdateLeave} 
                            >
                                <Form.Item label={<span className='mt-1.5 text-sm font-semibold'>Vacation Leave</span>}  name="vacation_leave" initialValue={leave?.vacation_leave} rules={[{ required: true, message: 'Required' }]}>
                                    <Input className="h-10 shadow-lg w-60" placeholder="Total Vacation Leave" />
                                </Form.Item>

                                <Form.Item label={<span className='mt-1.5 text-sm font-semibold'>Sick Leave</span>} name="sick_leave" initialValue={leave?.sick_leave} rules={[{ required: true, message: 'Required' }]}>
                                    <Input className="h-10 shadow-lg w-60" placeholder="Sick Leave" />
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="h-10 mt-1 shadow-lg"
                                    icon={<PlusOutlined />}
                                    >
                                    Update Leave
                                    </Button>
                                </Form.Item>
                            </Form>

                            <div className="flex flex-row">
                                <h3 className="text-sm font-semibold mt-2 ml-10 mr-4">Total Leave:</h3>
                                <span
                                    className={`bg-blue-500 flex items-center justify-center mt-1 mx-auto`}
                                    style={{
                                        height: "30px",
                                        width: "110px",
                                        borderRadius: "20px",
                                        color: "white",
                                    }}
                                >
                                    {leave?.total_leave}
                                </span>
                            </div>  

                        </div>         
                    </div>
                </div>

            </div>
        </>
  )
}
