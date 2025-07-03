import React, { useState } from 'react';
import { Button, DatePicker, Modal, Divider, ConfigProvider, Form, Select, Input, TimePicker } from 'antd';
import { ClockCircleOutlined, DollarOutlined, FolderOutlined, WalletOutlined } from '@ant-design/icons';
import dayjs from "dayjs";
import axiosInstance from '../../../../../server/instance_axios';
import { Dayjs } from "dayjs";

export default function ShiftChangeFiling() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [employeeForm] = Form.useForm();
    const { Option } = Select;
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [value, setValue] = useState<Dayjs | null>(null);

    const onTimeChange = (time: Dayjs) => {
            setValue(time);
        };

    <ConfigProvider
        theme={{
            components: {
            Modal: {
                colorBgElevated: "transparent"
            },
            },
        }}
        >
        ...
    </ConfigProvider>

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
                    // onFinish={onUpdateEmployee}
                    className="rounded-lg"
                >
                    <Form.Item
                        label="Shift Type"
                        name="shift_type"
                        rules={[{ required: true }]}
                        >
                        <Select placeholder="Type of Leave" className='w-90  shadow-lg'>
                            <Option value="Half day">Half Day</Option>
                            <Option value="Temporary Shift">Temporary Shift</Option>
                        </Select>
                        {/* //   onChange={departmenthandleChange}
                        //   options={departments?.map((dept: any) => ({
                        //     label: dept.department_name,
                        //     value: dept.id,
                        //   }))} */}
                        
                    </Form.Item>

                    <div className="flex flex-row gap-2">
                        <Form.Item label="Shift Start Time" name="start_time"  rules={[{ required: true }]} >
                            <TimePicker value={value} onChange={onTimeChange} className='w-53' />
                        </Form.Item>

                        <Form.Item label="Shift End Time" name="end_time"  rules={[{ required: true }]}>
                            <TimePicker value={value} onChange={onTimeChange}  className='w-53'/>
                        </Form.Item>
                    </div>

                    <div className="flex flex-row gap-2">
                        <Form.Item label="Shift Break Start" name="break_start" >
                            <TimePicker value={value} onChange={onTimeChange} className='w-53'/>
                        </Form.Item>

                        <Form.Item label="Shift Break End" name="break_end"  >
                            <TimePicker value={value} onChange={onTimeChange} className='w-53'/>
                        </Form.Item>
                    </div>

                    <Button
                        icon={<ClockCircleOutlined />}
                        type="primary"
                        className="h-10 mt-1 w-90 ml-10 shadow-lg"
                        // onClick={handleFilter}
                    >
                        Shift Change
                    </Button>
                    
                </Form>
            </div>
        </Modal>
        </>

  )
}
