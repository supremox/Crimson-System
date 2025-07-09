import React, { useState } from 'react';
import { Button, DatePicker, Modal, Divider, ConfigProvider, Form, Select, Input, Avatar } from 'antd';
import { FolderOutlined, WalletOutlined } from '@ant-design/icons';
import dayjs from "dayjs";
import axiosInstance from '../../../../../server/instance_axios';
import { GetEmployeesRecord } from '@/app/hooks/useGetEmployeesRecord';
import { getQueryClient } from '@/app/components/getQueryClient';

export default function LeaveFiling() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [employeeForm] = Form.useForm();
    const { Option } = Select;
    const showModal = () => {
        setIsModalOpen(true);
    };

    const { useGetEmployeeUser } = GetEmployeesRecord()
    const { data: user } = useGetEmployeeUser()
    const { RangePicker } = DatePicker;
    const [dateRange, setDateRange] = useState<(dayjs.Dayjs | null)[]>([]);
    const queryClient = getQueryClient();
    
    // Send Leave request to backend
    const handleSubmit = async (values: any) => {
        if (!dateRange || dateRange.length !== 2 || !dateRange[0] || !dateRange[1]) {
            alert("Please select a leave date range.");
            return;
        }

        const payload = {
            leave_type: values.leave_type,
            leave_description: values.leave_discription,
            leave_start_date: dayjs(dateRange[0]).format("YYYY-MM-DD"),
            leave_end_date: dayjs(dateRange[1]).format("YYYY-MM-DD"),
        };

        try {
            const res = await axiosInstance.post("/calendar/leave/create/", payload);
            queryClient.invalidateQueries({ queryKey: ["leave"] });
            alert("Leave filed successfully.");
            setIsModalOpen(false);
            employeeForm.resetFields();
        } catch (error: any) {
            if (error.response?.data?.error) {
            alert(error.response.data.error);
            } else {
            alert("Failed to file leave.");
            }
        }
    };

    return (
        <>
        <Button
            type="primary"
            icon={<FolderOutlined />}
            className="h-10 shadow-lg mr-8"
             onClick={() => setIsModalOpen(true)}
        >
            File Leave
        </Button>

        <Modal
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={false}
        >
            <div className="flex flex-col p-5 gap-3">
                <h2 className="text-xl font-bold mb-4 mt-2">Leave Filing</h2>
                <Form
                    form={employeeForm}
                    layout="vertical"
                    onFinish={handleSubmit} 
                    className="rounded-lg"
                >
                  
                    <span className="flex flex-row bg-white rounded-lg shadow-lg p-4 items-center gap-3 mb-5">
                        <Avatar
                            size={40}
                            src="/img/default_avatar.png"
                            alt="avatar"
                            onError={() => true}
                        />
                        <span className="flex flex-col">
                            <span className="text-gray-500">{user?.employee_id}</span>
                            <span className="text-black">{user?.first_name} {user?.last_name}</span>
                        </span>
                    </span>
                        
                  
                    <Form.Item
                        label="Leave Type"
                        name="leave_type"
                        rules={[{ required: true }]}
                      >
                        <Select placeholder="Type of Leave" className='w-90 shadow-lg'>
                            <Option value="Vacation Leave">Vacation Leave</Option>
                            <Option value="Sick Leave">Sick Leave</Option>
                            <Option value="Paternity Leave">Paternity Leave</Option>
                            <Option value="Maternity Leave">Maternity Leave</Option>
                        </Select> 
                    </Form.Item>

                    <Form.Item
                        label="Leave Date"
                        name="department_id"
                        className="mb-3"
                        rules={[{ required: true }]}
                      >
                        <RangePicker
                            className="h-10 w-108 shadow-lg mb-3"
                            onChange={dates => setDateRange(dates ?? [])}
                        />
                    </Form.Item>
                    

                    <Form.Item
                        label="Reason for Leave"
                        name="leave_discription"
                        rules={[{ required: true }]}
                        className="mt-4"
                    >
                        <Input.TextArea className='w-90 shadow-lg' />
                    </Form.Item>

                    <Button
                        icon={<WalletOutlined />}
                        type="primary"
                        className="h-10 mt-1 ml-10 w-90 shadow-lg"
                        htmlType="submit"
                    >
                        File Leave
                    </Button>
                    
                </Form>
            </div>
        </Modal>
        </>

  )
}
