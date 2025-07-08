import '@ant-design/v5-patch-for-react-19';
import React, { useState } from 'react';
import axiosInstance from '../../../../../../server/instance_axios';
import { useMutation } from '@tanstack/react-query';
import { GetEmployeesRecord } from '@/app/hooks/useGetEmployeesRecord';
import { getQueryClient } from '@/app/components/getQueryClient';
import { Button, Form, Input, Modal } from 'antd';
import { EditOutlined } from '@ant-design/icons';

interface UpdateDepartmentProps {
  id: number;
}

type DepartmentFieldType = {
  department_name: string;
};

export default function UpdateDepartment({ id }: UpdateDepartmentProps) {
  const { useGetDepartments } = GetEmployeesRecord();
  const { data: departments, isLoading } = useGetDepartments();
  const queryClient = getQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const { mutate: updateDepartment } = useMutation({
    mutationFn: async (data: DepartmentFieldType) =>
      await axiosInstance.put(`/employee/department/update/${id}/`, data),
    onSuccess: (data) => {
      if (data.status === 201) {
        queryClient.invalidateQueries({ queryKey: ['departments'] });
        alert(data.data.message);
        setIsModalOpen(false); // ✅ Close modal on success
      }
    },
    onError: (error) => {
      alert(error);
    },
  });

  const handleUpdate = () => {
    form
      .validateFields()
      .then((values) => updateDepartment(values))
      .catch((info) => console.log('Validation Failed:', info));
  };

  if (isLoading) {
    return <Button loading />;
  }

  return (
    <div>
      <Button
        type="primary"
        className="h-10 shadow-lg mr-8"
        onClick={() => setIsModalOpen(true)}
      >
        <EditOutlined />
      </Button>

      <Modal

        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null} 
      >
        <div className="flex flex-col p-5 gap-3">
            <h2 className="text-xl font-bold mb-4 mt-2">Edit Department</h2>
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    department_name: departments?.department_name || '',
                }}
            >
                <Form.Item
                    label="Department Name"
                    name="department_name"
                    rules={[{ required: true, message: 'Please enter department name' }]}
                >
                    <Input className="w-90 shadow-lg" />
                </Form.Item>

                <Button
                    icon={<EditOutlined />}
                    type="primary"
                    className="w-90 ml-10 mt-2 shadow-lg"
                    onClick={handleUpdate}
                >
                    Update Department
                </Button>
            </Form>
        </div>
      </Modal>
    </div>
  );
}
