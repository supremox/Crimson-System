import React, { useState } from 'react';
import { Button, DatePicker, Modal, Divider, ConfigProvider, Form, Select, Input } from 'antd';
import { FolderOutlined, WalletOutlined } from '@ant-design/icons';
import dayjs from "dayjs";
import axiosInstance from '../../../../../server/instance_axios';

export default function LeaveFiling() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [employeeForm] = Form.useForm();
    const { Option } = Select;
    const showModal = () => {
        setIsModalOpen(true);
    };

    const { RangePicker } = DatePicker;
    const [dateRange, setDateRange] = useState<(dayjs.Dayjs | null)[]>([]);

    // Send filter request to backend
    const handleFilter = async () => {
        if (dateRange.length === 2 && dateRange[0] && dateRange[1]) {
        try {
            const res = await axiosInstance.post("/attendance/filter/date/", {
            start_date: dayjs(dateRange[0]).format("YYYY-MM-DD"),
            end_date: dayjs(dateRange[1]).format("YYYY-MM-DD"),
            });
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.error) {
            alert(error.response.data.error);
            }
            else {
            alert("Failed to Generate Payroll.");
            }
        } 
        } else {
        alert("Please select a start and end date.");
        }
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
            icon={<FolderOutlined />}
            className="h-10 shadow-lg mr-8"
            onClick={showModal}
        >
            File Leave
        </Button>

        <Modal
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={isModalOpen}
            footer={false}
        >
            <div className="flex flex-col p-5 gap-3">
                <h2 className="text-xl font-bold mb-4 mt-2">Leave Filing</h2>
                <Form
                    form={employeeForm}
                    layout="vertical"
                    // onFinish={onUpdateEmployee}
                    className="rounded-lg"
                >
                    <Form.Item
                        label="Leave Type"
                        name="leave_type"
                        rules={[{ required: true }]}
                      >
                        <Select placeholder="Type of Leave" className='w-90 shadow-lg'>
                            <Option value="Associate degree">Vacation Leave</Option>
                            <Option value="Bachelor's degree">Sicke Leave</Option>
                            <Option value="Master's degree">Paternity Leave</Option>
                            <Option value="PhD degree">Maternity Leave</Option>
                        </Select>
                        {/* //   onChange={departmenthandleChange}
                        //   options={departments?.map((dept: any) => ({
                        //     label: dept.department_name,
                        //     value: dept.id,
                        //   }))} */}
                        
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
                        onClick={handleFilter}
                    >
                        File Leave
                    </Button>
                    
                </Form>
            </div>
        </Modal>
        </>

  )
}
