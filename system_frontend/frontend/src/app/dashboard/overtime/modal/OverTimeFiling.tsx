import React, { useState } from 'react';
import { Button, DatePicker, Modal, Divider, ConfigProvider, Form, Select, Input, TimePicker } from 'antd';
import { ClockCircleOutlined, DollarOutlined, FolderOutlined, WalletOutlined } from '@ant-design/icons';
import dayjs from "dayjs";
import axiosInstance from '../../../../../server/instance_axios';
import { Dayjs } from "dayjs";

export default function OverTimeFiling() {
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
            File Over-Time
        </Button>

        <Modal
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={false}
        >
            <div className="flex flex-col p-5 gap-3">
                <h2 className="text-xl font-bold mb-4 mt-2">Over-Time Filing</h2>
                <Form
                    form={employeeForm}
                    layout="vertical"
                    // onFinish={onUpdateEmployee}
                    className="rounded-lg"
                >
                    <Form.Item
                        label="Date of Birth"
                        name="date_of_birth"
                        rules={[{ required: true }]}
                    >
                        <DatePicker className="w-full" />
                    </Form.Item>

                    <div className="flex flex-row gap-2">
                        <Form.Item label="Over-time Start Time" name="start_time" rules={[{ required: true }]} >
                            <TimePicker value={value} onChange={onTimeChange} className='w-53' />
                        </Form.Item>

                        <Form.Item label="Over-time End Time" name="end_time" rules={[{ required: true }]}>
                            <TimePicker value={value} onChange={onTimeChange}  className='w-53'/>
                        </Form.Item>
                    </div>

                    <Form.Item
                        label="Reason for Over-Time"
                        name="overtime_discription"
                        rules={[{ required: true }]}
                        className=" mt-4"
                    >
                        <Input.TextArea className='w-90 shadow-lg' />
                    </Form.Item>

                    <Button
                        icon={<ClockCircleOutlined />}
                        type="primary"
                        className="h-10 mt-1 ml-10 w-90 shadow-lg"
                        // onClick={handleFilter}
                    >
                        File Over-Time
                    </Button>
                    
                </Form>
            </div>
        </Modal>
        </>

  )
}
