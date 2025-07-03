import React, { useState } from 'react'
import axiosInstance from '../../../../../../server/instance_axios';
import { useMutation } from '@tanstack/react-query';
import { GetEmployeesRecord } from '@/app/hooks/useGetEmployeesRecord';
import { getQueryClient } from '@/app/components/getQueryClient';
import { Button, Form, Input, Modal } from 'antd';
import { EditOutlined, WalletOutlined } from '@ant-design/icons';

interface UpdateDepartmentProps {
  id: number;
}

type DepartmentFieldType = {
  department_name: string;
};

export default function UpdateDepartment(props: UpdateDepartmentProps) {

    const {  useGetDepartments } = GetEmployeesRecord();
    const { data: departments, isLoading } = useGetDepartments()
    const queryClient = getQueryClient();

    const [openResponsive, setOpenResponsive] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [departmentform] = Form.useForm();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const { mutate: mutate_update_department } = useMutation({
        mutationFn: async (data: DepartmentFieldType) => {
        return await axiosInstance.put(`/employee/department/update/${props.id}/`, data);
        },
    });

    const onUpdateDepartment = (values: any) => {
        // console.log('Employee Data', values);
        mutate_update_department(values, {
            onSuccess: (data) => {
                if (data.status === 201) {
                queryClient.invalidateQueries({ queryKey: ["departments"] });
                alert(data.data.message);
                console.log(data.data.employee.employee_id);
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
        <div>
            <Button
                type="primary"
                className="h-10 shadow-lg mr-8"
                onClick={() => setOpenResponsive(true)}
            >
                {<EditOutlined/>}
            </Button>

            <Modal
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={openResponsive}
                onCancel={() => setIsModalOpen(false)}
                footer={false}
            >
                <div className="flex flex-col p-5 gap-3">
                    <h2 className="text-xl font-bold mb-4 mt-2">Edit Department Name</h2>
                    <Form
                        form={departmentform}
                        layout="vertical"
                        // onFinish={onUpdateEmployee}
                        className="rounded-lg"
                    >
                        <Form.Item
                            label="Department Name"
                            name="department_name"
                            initialValue={departments.department_name}
                            rules={[{ required: true }]}
                        >
                            <Input className="shadow-lg w-90" />
                        </Form.Item>

                        <Button
                            icon={<EditOutlined />}
                            type="primary"
                            className="h-10 mt-1 w-90 ml-10 shadow-lg"
                            onClick={onUpdateDepartment}
                        >
                            Update Department Name
                        </Button>
                        
                    </Form>
                </div>
            </Modal>
        </div>
    )
}
