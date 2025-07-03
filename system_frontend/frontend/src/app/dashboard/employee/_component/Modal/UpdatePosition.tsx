import React, { useState } from 'react'
import axiosInstance from '../../../../../../server/instance_axios';
import { useMutation } from '@tanstack/react-query';
import { GetEmployeesRecord } from '@/app/hooks/useGetEmployeesRecord';
import { getQueryClient } from '@/app/components/getQueryClient';
import { Button, Form, Input, Modal, Select } from 'antd';
import { EditOutlined, WalletOutlined } from '@ant-design/icons';

interface UpdatePositionProps {
  id: number;
}

type PositionFieldType = {
  position_name: string;
  department: string;
};

export default function UpdatePosition(props: UpdatePositionProps) {

    const {  useGetDepartments } = GetEmployeesRecord();
    const { data: departments, isLoading } = useGetDepartments()
    const queryClient = getQueryClient();

    const [isModalOpen, setIsModalOpen] = useState(false);
        const [departmentform] = Form.useForm();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const { Option } = Select;

    const { mutate: mutate_update_position } = useMutation({
        mutationFn: async (data: PositionFieldType) => {
        return await axiosInstance.put(`/employee/position/update/${props.id}/`, data);
        },
    });

    const onUpdatePosition = (values: any) => {
        mutate_update_position(values, {
            onSuccess: (data) => {
                if (data.status === 201) {
                queryClient.invalidateQueries({ queryKey: ["position"] });
                alert(data.data.message);
                }
            },
            onError: (error) => {
                alert(error);
            },
            });
        };

        if (isLoading) {
            return <Button loading></Button>
        }


    return (
        <>
        <div>
            <Button
                type="primary"
                className="h-10 shadow-lg mr-8"
                onClick={showModal}
            >
                {<EditOutlined/>}
            </Button>

            <Modal
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpen}
                footer={false}
            >
                <div className="flex flex-col p-5 gap-3">
                    <h2 className="text-xl font-bold mb-4 mt-2">Edit Position</h2>
                    <Form
                        form={departmentform}
                        layout="vertical"
                        // onFinish={onUpdateEmployee}
                        className="rounded-lg"
                    >
                        <div className="flex flex-col gap-4">
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
                                    <span>No Departments</span>
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
                                    icon={<EditOutlined />}
                                    type="primary"
                                    className="h-10 mt-1 w-90 ml-10 shadow-lg"
                                    onClick={onUpdatePosition}
                                >
                                    Update Position
                                </Button>
                            </Form.Item>
                        </div> 
                    </Form>
                </div>
            </Modal>
        </div>
        </>
    );
}
