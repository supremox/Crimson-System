import React, { useState } from 'react';
import { Button, DatePicker, Modal, Divider, ConfigProvider, Form, Select, Input } from 'antd';
import { DollarOutlined, FolderOutlined, WalletOutlined } from '@ant-design/icons';
import dayjs from "dayjs";
import axiosInstance from '../../../../../server/instance_axios';

export default function CashAdvanceFiling() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [employeeForm] = Form.useForm();
    const { Option } = Select;
    const showModal = () => {
        setIsModalOpen(true);
    };

    return (
        <>
        <Button
            type="primary"
            icon={<WalletOutlined />}
            className="h-10 shadow-lg mr-8"
            onClick={showModal}
        >
            Cash Advance
        </Button>

        <Modal
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={isModalOpen}
            footer={false}
        >
            <div className="flex flex-col p-5 gap-3">
                <h2 className="text-xl font-bold mb-4 mt-2">Cash Advance</h2>
                <Form
                    form={employeeForm}
                    layout="vertical"
                    // onFinish={onUpdateEmployee}
                    className="rounded-lg"
                >
                    <Form.Item
                        label="Cash Advance Amount"
                        name="cash_advance_amount"
                        rules={[{ required: true }]}
                    >
                        <Input className="shadow-lg w-90" prefix="₱" />
                    </Form.Item>

                    <Form.Item
                        label="Amount to Pay Per Cut Off"
                        name="cash_advance_deductions"
                        rules={[{ required: true }]}
                    >
                        <Input className="shadow-lg w-90" prefix="₱" />
                    </Form.Item>
                    

                    <Form.Item
                        label="Reason for Cash Advance"
                        name="leave_discription"
                        rules={[{ required: true }]}
                        className=" mt-4"
                    >
                        <Input.TextArea className='w-90 shadow-lg' />
                    </Form.Item>

                    <Button
                        icon={<WalletOutlined />}
                        type="primary"
                        className="h-10 mt-1 w-90 ml-10 shadow-lg"
                        // onClick={handleFilter}
                    >
                        File Cash Advance
                    </Button>
                    
                </Form>
            </div>
        </Modal>
        </>

  )
}
