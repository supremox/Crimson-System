import React, { useState } from 'react';
import { Button, DatePicker, Modal, Divider, ConfigProvider, Form, Select, Input, TimePicker, Avatar } from 'antd';
import { ClockCircleOutlined, DollarOutlined, FolderOutlined, WalletOutlined } from '@ant-design/icons';
import dayjs from "dayjs";
import axiosInstance from '../../../../../server/instance_axios';
import { Dayjs } from "dayjs";
import { GetEmployeesRecord } from '@/app/hooks/useGetEmployeesRecord';
import { getQueryClient } from '@/app/components/getQueryClient';

export default function ShiftChangeFiling() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [employeeForm] = Form.useForm();
    const { Option } = Select;
    const showModal = () => {
        setIsModalOpen(true);
    };

    const { useGetEmployeeUser } = GetEmployeesRecord()
    const { data: user } = useGetEmployeeUser()

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const queryClient = getQueryClient();
        
    // Send Leave request to backend
    const handleSubmit = async (values: any) => {
        const payload = {
            shift_type: values.shift_type,
            start_time: dayjs(values.start_time).format("HH:mm"),
            end_time: dayjs(values.end_time).format("HH:mm"),
            break_start: values.break_start ? dayjs(values.break_start).format("HH:mm") : null,
            break_end: values.break_end ? dayjs(values.break_end).format("HH:mm") : null,
        };

        try {
            const res = await axiosInstance.post("/calendar/shift/create/", payload); 
            queryClient.invalidateQueries({ queryKey: ["shifts"] });
            alert("Shift change filed successfully.");
            setIsModalOpen(false);
            employeeForm.resetFields();
        } catch (error: any) {
            if (error.response?.data?.error) {
                alert(error.response.data.error);
            } else {
                alert("Failed to file shift change.");
            }
        }
    };

    
    return (
        <>
        <Button
            type="primary"
            icon={<ClockCircleOutlined />}
            className="h-10 shadow-lg mr-8"
            onClick={showModal}
        >
            Shift Change
        </Button>

        <Modal
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={false}
        >
            <div className="flex flex-col p-5 gap-3">
                <h2 className="text-xl font-bold mb-4 mt-2">Shift Change</h2>
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
                    
                    <div className='bg-white rounded-lg shadow-lg p-4'>
                         <Form.Item
                            label="Shift Type"
                            name="shift_type"
                            rules={[{ required: true }]}
                            >
                            <Select placeholder="Type of Leave" className='w-90  shadow-lg'>
                                <Option value="Half day">Half Day</Option>
                                <Option value="Temporary Shift">Temporary Shift</Option>
                            </Select>
                        </Form.Item>

                        <div className="flex flex-row gap-2">
                            <Form.Item label="Shift Start Time" name="start_time"  rules={[{ required: true }]} >
                                <TimePicker className='w-49 shadow-lg' />
                            </Form.Item>

                            <Form.Item label="Shift End Time" name="end_time"  rules={[{ required: true }]}>
                                <TimePicker className='w-49 shadow-lg'/>
                            </Form.Item>
                        </div>

                        <div className="flex flex-row gap-2">
                            <Form.Item label="Shift Break Start" name="break_start" >
                                <TimePicker  className='w-49 shadow-lg'/>
                            </Form.Item>

                            <Form.Item label="Shift Break End" name="break_end"  >
                                <TimePicker className='w-49 shadow-lg'/>
                            </Form.Item>
                        </div>

                        <Button
                            icon={<ClockCircleOutlined />}
                            type="primary"
                            className="h-10 mt-1 w-90 ml-5 shadow-lg"
                            htmlType="submit"
                        >
                            Shift Change
                        </Button>
                    </div> 
                </Form>
            </div>
        </Modal>
        </>

  )
}
