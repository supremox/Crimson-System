import React, { useState } from 'react';
import { Button, DatePicker, Modal, Divider, ConfigProvider, Form, Select, Input, Avatar, Space } from 'antd';
import { ArrowRightOutlined, CheckOutlined, EyeOutlined, FolderOutlined, WalletOutlined } from '@ant-design/icons';
import axiosInstance from '../../../../../server/instance_axios';
import { XIcon } from 'lucide-react';
import { GetCalendarEventsRecord } from '@/app/hooks/useGetCalendarEvent';
import { getQueryClient } from '@/app/components/getQueryClient';

interface UpdateShiftProps {
  id: number;
}


export default function UpdateShift(props: UpdateShiftProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [employeeForm] = Form.useForm();
    const { Option } = Select;
    const showModal = () => {
        setIsModalOpen(true);
    };

    const { useGetShiftDetail } = GetCalendarEventsRecord();
    const queryClient = getQueryClient();
    const { data: shift, isLoading, refetch } = useGetShiftDetail(props.id);
    console.log("Shift Detailed:", shift)

    // Send Approve or Reject Leave
    const handleDecision = async (shiftID: number, decision: 'Approve' | 'Rejected') => {
    try {
        const res = await axiosInstance.patch(`/calendar/shift/update/${shiftID}/`, {
        shift_status: decision,
        });
        alert(`Leave ${decision} successfully!`);
        queryClient.invalidateQueries({ queryKey: ["shift-detail"] });
        queryClient.invalidateQueries({ queryKey: ["shifts"] });
        setIsModalOpen(false);
    } catch (error: any) {
        if (error.response?.data?.error) {
        alert(error.response.data.error);
        } else {
        alert(`Failed to ${decision} leave.`);
        }
    }
    };


    return (
        <>
        <Button
            type="primary"
            className="h-10 shadow-lg"
             onClick={() => setIsModalOpen(true)}
        >
            <EyeOutlined />
        </Button>

        <Modal
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={false}
        >
            <div className="flex flex-col p-5 gap-3">
                <h2 className="text-xl font-bold mb-4 mt-2">Shift Details</h2>
                <Form
                    form={employeeForm}
                    layout="vertical"
                    // onFinish={onUpdateEmployee}
                    className="rounded-lg"
                >
              
                    <div className="flex flex-col gap-3 mb-5">
                        <span className="flex flex-row bg-white rounded-lg shadow-lg p-4 items-center gap-3">
                            <Avatar
                                size={40}
                                src={shift?.avatar}
                                alt="avatar"
                                onError={() => true}
                            />
                            <span className="flex flex-col">
                                <span className="text-gray-500">{shift?.employee_id}</span>
                                <span className="text-black">{shift?.name}</span>
                            </span>
                        </span>

                        <span className="flex flex-row bg-white rounded-lg shadow-lg p-4 gap-6">
                            <div className="flex flex-col gap-2">
                                <span className='text-sm font-semibold text-gray-500'>Department</span>
                                <span>{shift?.department}</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className='text-sm font-semibold text-gray-500'>Position</span>
                                <span>{shift?.position}</span>
                            </div>
                        </span>

                        <span className='flex flex-row bg-white rounded-lg shadow-lg p-4 gap-6'>
                            <span className='text-sm font-semibold text-gray-500'>Type of Shift:</span>
                            <span>{shift?.shift_type}</span>
                        </span>

                        <span className='flex flex-row bg-white rounded-lg shadow-lg p-4 gap-6'>
                            <span className='text-sm font-semibold text-gray-500'>Date</span>
                            <span>{shift?.date}</span>
                        </span>

                        <span className="flex flex-row bg-white rounded-lg shadow-lg p-4 gap-10">
                            <div className="flex flex-col gap-2">
                                <span className='text-sm font-semibold text-gray-500'>Start Time</span>
                                <span>{shift?.start_time}</span>
                            </div>
                            <ArrowRightOutlined />
                            <div className="flex flex-col gap-2">
                                <span className='text-sm font-semibold text-gray-500'>End Time</span>
                                <span>{shift?.end_time}</span>
                            </div>  
                        </span>

                        <span className="flex flex-row bg-white rounded-lg shadow-lg p-4 gap-10">
                            <div className="flex flex-col gap-2">
                                <span className='text-sm font-semibold text-gray-500'>Break Start</span>
                                <span>{shift?.break_start}</span>
                            </div>
                            <ArrowRightOutlined />
                            <div className="flex flex-col gap-2">
                                <span className='text-sm font-semibold text-gray-500'>Break End</span>
                                <span>{shift?.break_end}</span>
                            </div>  
                        </span>

                        <span className='bg-white rounded-lg shadow-lg p-4'>
                            <div className="flex flex-row gap-10">
                                <span className='text-sm font-semibold mt-1 text-gray-500'>Shift Status</span>
                                <span
                                    className={`flex items-center justify-center cursor-pointer ${
                                        shift?.shift_status === "Approve"
                                        ? "bg-green-600"
                                        : shift?.shift_status === "Rejected"
                                        ? "bg-red-600"
                                        : "bg-gray-600"
                                    }`}
                                    
                                    style={{
                                        height: "30px",
                                        width: "110px",
                                        borderRadius: "20px",
                                        color: "white",
                                    }}
                                >
                                    {shift?.shift_status}
                                </span>
                            </div>
                        </span>

                        <div className="flex flex-row gap-2 px-10">
                            <Button
                                icon={<CheckOutlined />}
                                type="primary"
                                disabled={shift?.shift_status === "Approve"}
                                style={{ backgroundColor: "green", borderColor: "green" }}
                                className="h-10 mt-1 w-90 shadow-lg"
                                onClick={() => handleDecision(shift?.id, 'Approve')}
                            >
                                Approve
                            </Button>
                            
                            <Button
                                icon={<XIcon className='w-4 h-4' />}
                                type="primary"
                                className="h-10 mt-1 w-90 shadow-lg"
                                danger
                                onClick={() => handleDecision(shift?.id, 'Rejected')}
                            >
                                Reject
                            </Button>
                        </div>
                    </div>
                </Form>
            </div>
        </Modal>
        </>

  )
}
