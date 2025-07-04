import React, { useState } from 'react';
import axiosInstance from '../../../../../../server/instance_axios';
import { useMutation } from '@tanstack/react-query';
import { GetEmployeesRecord } from '@/app/hooks/useGetEmployeesRecord';
import { getQueryClient } from '@/app/components/getQueryClient';
import { Button, Form, Input, Modal, Select } from 'antd';
import { EditOutlined } from '@ant-design/icons';

interface UpdatePositionProps {
  id: number;
}

type PositionFieldType = {
  position_name: string;
  department: string;
};

export default function UpdatePosition({ id }: UpdatePositionProps) {
  const { useGetDepartments } = GetEmployeesRecord();
  const { data: departments, isLoading } = useGetDepartments();
  const queryClient = getQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const { mutate: updatePosition } = useMutation({
    mutationFn: async (data: PositionFieldType) =>
      await axiosInstance.put(`/employee/position/update/${id}/`, data),
    onSuccess: (data) => {
      if (data.status === 201) {
        queryClient.invalidateQueries({ queryKey: ['position'] });
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
      .then((values) => updatePosition(values))
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
            <h2 className="text-xl font-bold mb-4 mt-2">Edit Position</h2>
            <Form
                form={form}
                layout="vertical"
                initialValues={{ position_name: '', department: '' }}
                >
                <Form.Item
                    label="Position Name"
                    name="position_name"
                    rules={[{ required: true, message: 'Please enter position name' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Department"
                    name="department"
                    rules={[{ required: true, message: 'Please select a department' }]}
                >
                    <Select placeholder="Select department">
                    {Array.isArray(departments) &&
                        departments.map((dept: any) => (
                        <Select.Option key={dept.id} value={dept.department_name}>
                            {dept.department_name}
                        </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button
                    icon={<EditOutlined />}
                    type="primary"
                    className="w-full shadow-lg"
                    onClick={handleUpdate}
                    >
                    Update Position
                    </Button>
                </Form.Item>
            </Form>
        </div>
      </Modal>
    </div>
  );
}
