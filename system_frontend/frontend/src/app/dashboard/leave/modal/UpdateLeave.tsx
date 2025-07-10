import '@ant-design/v5-patch-for-react-19';
import React, { useState } from 'react';
import { Button, DatePicker, Modal, Divider, ConfigProvider, Form, Select, Input, Avatar, Space } from 'antd';
import { ArrowRightOutlined, CheckOutlined, EyeOutlined, FolderOutlined, WalletOutlined } from '@ant-design/icons';
import axiosInstance from '../../../../../server/instance_axios';
import { XIcon } from 'lucide-react';
import { GetCalendarEventsRecord } from '@/app/hooks/useGetCalendarEvent';
import { getQueryClient } from '@/app/components/getQueryClient';

interface UpdateLeaveProps {
  id: number;
}


export default function UpdateLeave(props: UpdateLeaveProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [employeeForm] = Form.useForm();
    const { Option } = Select;
    const showModal = () => {
        setIsModalOpen(true);
    };

    const { useGetLeaveDetail } = GetCalendarEventsRecord();
    const queryClient = getQueryClient();
    const { data: leaves, isLoading, refetch } = useGetLeaveDetail(props.id);
    console.log("Leave Detailed:", leaves)

    // Send Approve or Reject Leave
    const handleDecision = async (leaveId: number, decision: 'Approve' | 'Rejected') => {
    try {
        const res = await axiosInstance.patch(`/calendar/leave/update/${leaveId}/`, {
        leave_status: decision,
        });
        alert(`Leave ${decision} successfully!`);
        queryClient.invalidateQueries({ queryKey: ["leave-detail"] });
        queryClient.invalidateQueries({ queryKey: ["leave"] });
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
                <h2 className="text-xl font-bold mb-4 mt-2">Leave Details</h2>
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
                                src="/img/default_avatar.png"
                                alt="avatar"
                                onError={() => true}
                            />
                            <span className="flex flex-col">
                                <span className="text-gray-500">{leaves?.employee_id}</span>
                                <span className="text-black">{leaves?.name}</span>
                            </span>
                        </span>

                        <span className="flex flex-row bg-white rounded-lg shadow-lg p-4 gap-6">
                            <div className="flex flex-col gap-2">
                                <span className='text-sm font-semibold text-gray-500'>Department</span>
                                <span>{leaves?.department}</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className='text-sm font-semibold text-gray-500'>Position</span>
                                <span>{leaves?.position}</span>
                            </div>
                        </span>

                        <span className='flex flex-row bg-white rounded-lg shadow-lg p-4 gap-6'>
                            <span className='text-sm font-semibold text-gray-500'>Type of Leave:</span>
                            <span>{leaves?.leave_type}</span>
                        </span>

                        <span className="flex flex-row bg-white rounded-lg shadow-lg p-4 gap-10">
                            <div className="flex flex-col gap-2">
                                <span className='text-sm font-semibold text-gray-500'>Start Date</span>
                                <span>{leaves?.leave_start_date}</span>
                            </div>
                            <ArrowRightOutlined />
                            <div className="flex flex-col gap-2">
                                <span className='text-sm font-semibold text-gray-500'>End Date</span>
                                <span>{leaves?.leave_end_date}</span>
                            </div>  
                        </span>

                        <span className='bg-white rounded-lg shadow-lg p-4'>
                            <div className="flex flex-col gap-2">
                                <span className='text-sm font-semibold text-gray-500'>Reason for Leave</span>
                                <span>{leaves?.leave_description}</span>
                            </div>   
                        </span>

                        <span className='bg-white rounded-lg shadow-lg p-4'>
                            <div className="flex flex-row gap-10">
                                <span className='text-sm font-semibold mt-1 text-gray-500'>Leave Status</span>
                                <span
                                    className={`flex items-center justify-center cursor-pointer ${
                                        leaves?.leave_status === "Approve"
                                        ? "bg-green-600"
                                        : leaves?.leave_status === "Rejected"
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
                                    {leaves?.leave_status}
                                </span>
                            </div>
                        </span>

                        <div className="flex flex-row gap-2 px-10">
                            <Button
                                icon={<CheckOutlined />}
                                type="primary"
                                disabled={leaves?.leave_status === "Approve"}
                                style={{ backgroundColor: "green", borderColor: "green" }}
                                className="h-10 mt-1 w-90 shadow-lg"
                                onClick={() => handleDecision(leaves?.id, 'Approve')}
                            >
                                Approve
                            </Button>
                            
                            <Button
                                icon={<XIcon className='w-4 h-4' />}
                                type="primary"
                                className="h-10 mt-1 w-90 shadow-lg"
                                danger
                                onClick={() => handleDecision(leaves?.id, 'Rejected')}
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
