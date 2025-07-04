import React, { useState } from 'react';
import {
  Button,
  DatePicker,
  Modal,
  Divider,
  ConfigProvider,
  Form,
  Select,
  Input,
  TimePicker,
} from 'antd';
import {
  ClockCircleOutlined,
  DollarOutlined,
  EditOutlined,
  FolderOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import axiosInstance from '../../../../../../server/instance_axios';
import { useMutation } from '@tanstack/react-query';
import { getQueryClient } from '@/app/components/getQueryClient';

type ShiftFieldType = {
  shift_name: string;
  start_time: string;
  end_time: string;
  break_start: string;
  break_end: string;
};

export default function UpdateShift() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const queryClient = getQueryClient();

  const { mutate: mutate_shift } = useMutation({
    mutationFn: async (data: ShiftFieldType) =>
      await axiosInstance.post('/employee/shifts/names/', data),
    onSuccess: (data) => {
      if (data.status === 201) {
        queryClient.invalidateQueries({ queryKey: ['shift'] });
        setIsModalOpen(false); // ✅ Close modal on success
        form.resetFields(); // Optional: reset form
      }
    },
    onError: (error) => {
      alert(error);
    },
  });

  const onAddShift = (values: any) => {
    const formattedValues: ShiftFieldType = {
      ...values,
      start_time: dayjs(values.start_time).format('HH:mm:ss'),
      end_time: dayjs(values.end_time).format('HH:mm:ss'),
      break_start: dayjs(values.break_start).format('HH:mm:ss'),
      break_end: dayjs(values.break_end).format('HH:mm:ss'),
    };

    mutate_shift(formattedValues);
  };

  return (
    <>
      <Button
        type="primary"
        className="h-10 w-2 shadow-lg"
        onClick={() => setIsModalOpen(true)}
      >
        <EditOutlined />
      </Button>

      <Modal

        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)} 
        footer={false}
      >
        <div className="flex flex-col p-5 gap-3">
          <h2 className="text-xl font-bold mb-4 mt-2">Edit Shift</h2>
          <Form
            form={form}
            layout="vertical"
            onFinish={onAddShift}
            className="rounded-lg p-4"
          >
            <Form.Item
              label="Shift Name"
              name="shift_name"
              rules={[{ required: true }]}
            >
              <Input className="shadow-lg w-90" />
            </Form.Item>

            <div className="flex flex-row gap-2">
              <Form.Item
                label="Shift Start Time"
                name="start_time"
                rules={[{ required: true }]}
              >
                <TimePicker className="w-53 shadow-lg" />
              </Form.Item>

              <Form.Item
                label="Shift End Time"
                name="end_time"
                rules={[{ required: true }]}
              >
                <TimePicker className="w-53 shadow-lg" />
              </Form.Item>
            </div>

            <div className="flex flex-row gap-2">
              <Form.Item
                label="Shift Break Start"
                name="break_start"
                rules={[{ required: true }]}
              >
                <TimePicker className="w-53 shadow-lg" />
              </Form.Item>

              <Form.Item
                label="Shift Break End"
                name="break_end"
                rules={[{ required: true }]}
              >
                <TimePicker className="w-53 shadow-lg" />
              </Form.Item>
            </div>

            <Button
              icon={<ClockCircleOutlined />}
              type="primary"
              className="h-10 mt-1 w-90 ml-10 shadow-lg"
              onClick={() => form.submit()} 
            >
              Update Shift
            </Button>
          </Form>
        </div>
      </Modal>
    </>
  );
}
