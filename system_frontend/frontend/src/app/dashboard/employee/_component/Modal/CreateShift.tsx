import React, { useState } from 'react';
import { Button, DatePicker, Modal, Divider, ConfigProvider, Form, Select, Input, TimePicker } from 'antd';
import { ClockCircleOutlined, DollarOutlined, FolderOutlined, WalletOutlined } from '@ant-design/icons';
import dayjs from "dayjs";
import axiosInstance from '../../../../../../server/instance_axios';
import { useMutation } from '@tanstack/react-query';
import { Dayjs } from "dayjs";
import { getQueryClient } from '@/app/components/getQueryClient';

type ShiftFieldType = {
  shift_name: string;
  start_time: string;
  end_time: string;
  break_start: string;
  break_end: string;
};

export default function CreateShift() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shiftForm] = Form.useForm();
    const queryClient = getQueryClient();
    const { Option } = Select;
    const showModal = () => {
        setIsModalOpen(true);
    };

    const { mutate: mutate_shift } = useMutation({
        mutationFn: async (data: ShiftFieldType) => {
        // console.log(data.start_time)
        return await axiosInstance.post("/employee/shifts/names/", data);
        },
    });

    const [value, setValue] = useState<Dayjs | null>(null);
    
    const onTimeChange = (time: Dayjs) => {
        setValue(time);
    };

    const onAddShift = (values: any) => {
        const formattedValues: ShiftFieldType = {
            ...values,
            start_time: values.start_time
            ? dayjs(values.start_time).format("HH:mm:ss")
            : "",
            end_time: values.end_time
            ? dayjs(values.end_time).format("HH:mm:ss")
            : "",
            break_start: values.break_start
            ? dayjs(values.break_start).format("HH:mm:ss")
            : "",
            break_end: values.break_end
            ? dayjs(values.break_end).format("HH:mm:ss")
            : "",
        };
        // console.log(formattedValues)
        mutate_shift(formattedValues, {
            onSuccess: (data) => {
            if (data.status === 201) {
                queryClient.invalidateQueries({ queryKey: ["shift"] });
            }
            },
            onError: (error) => {
            alert(error);
            },
        });
    };
    

    return (
        <>
            <Button
                type="primary"
                icon={<ClockCircleOutlined />}
                className="h-10 shadow-lg"
                onClick={showModal}
            >
                Create Shift
            </Button>

            <Modal
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpen}
                footer={false}
            >
                <div className="flex flex-col p-5 gap-3">
                    <h2 className="text-xl font-bold mb-4 mt-2">Shift Creation</h2>
                    <Form
                        form={shiftForm}
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
                            <Form.Item label="Shift Start Time" name="start_time"  rules={[{ required: true }]} >
                                <TimePicker value={value} onChange={onTimeChange} className='w-53' />
                            </Form.Item>
    
                            <Form.Item label="Shift End Time" name="end_time"  rules={[{ required: true }]}>
                                <TimePicker value={value} onChange={onTimeChange}  className='w-53'/>
                            </Form.Item>
                        </div>
    
                        <div className="flex flex-row gap-2">
                            <Form.Item label="Shift Break Start" name="break_start" rules={[{ required: true }]} >
                                <TimePicker value={value} onChange={onTimeChange} className='w-53'/>
                            </Form.Item>
    
                            <Form.Item label="Shift Break End" name="break_end" rules={[{ required: true }]} >
                                <TimePicker value={value} onChange={onTimeChange} className='w-53'/>
                            </Form.Item>
                        </div>

                        <Button
                            icon={<ClockCircleOutlined />}
                            type="primary"
                            className="h-10 mt-1 w-90 ml-10 shadow-lg"
                            onClick={onAddShift}
                        >
                            Create Shift
                        </Button>

                    </Form>          
                </div>
            </Modal>
        </>

  )
}
