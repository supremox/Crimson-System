import React from 'react'
import { Popover, ConfigProvider, Descriptions, Spin } from 'antd';
import { GetAttendanceRecord } from '@/app/hooks/useGetAttendance';

interface DayAttendanceProps {
  emp_id: string;
  day: string;
  children: React.ReactNode;
}

export default function DayAttendance({ emp_id, day, children }: DayAttendanceProps) {
    const { useGetDayRecord } = GetAttendanceRecord();

    const [visible, setVisible] = React.useState(false);

    const { data: attendance, isLoading, refetch } = useGetDayRecord(day, emp_id, {
        enabled: false, // don't fetch until triggered
    });

    const handleVisibleChange = (newVisible: boolean) => {
        setVisible(newVisible);
        if (newVisible) {
        refetch(); // fetch only on click
        }
    };

    const content = isLoading ? (
        <Spin />
    ) : (
        <div className='flex flex-col'>
            <div className="flex flex-col border-b-3 border-indigo-500">
                <span className="text-gray-500 text-xs">Employee</span>
                {attendance?.employee_name}
            </div>
            <div className="flex flex-row gap-5 border-b-3 border-indigo-500">
                <div className="flex flex-col">
                    <span className="text-gray-500 text-xs mt-1">Time-In</span>
                    {attendance?.time_in}
                </div>
                <div className="flex flex-col">
                    <span className="text-gray-500 text-xs mt-1">Time-Out</span>
                    {attendance?.time_out}
                </div>
            </div>
            <div className="flex flex-col border-b-3 border-indigo-500">
                <span className="text-gray-500 text-xs mt-1">Late</span>
                {attendance?.late}
            </div>
            <div className="flex flex-col border-b-3 border-indigo-500">
                <span className="text-gray-500 text-xs mt-1">Under-Time</span>
                {attendance?.undertime}
            </div>
            <div className="flex flex-col border-b-3 border-indigo-500">
                <span className="text-gray-500 text-xs mt-1">Over-Time</span>
                {attendance?.overtime.before_10pm.hour}:{attendance?.overtime.before_10pm.minutes} {attendance?.overtime.after_10pm.hour}:{attendance?.overtime.after_10pm.minutes} {attendance?.overtime.after_6am.hour}:{attendance?.overtime.after_6am.minutes}
            </div>
            <div className="flex flex-col border-b-3 border-indigo-500">
                <span className="text-gray-500 text-xs mt-1">Total Worked hrs</span>
                {attendance?.total_hours_worked}
            </div>
            <div className="flex flex-col border-b-3 border-indigo-500">
                <span className="text-gray-500 text-xs mt-1">Status</span>
                {attendance?.status}
            </div>
        </div>
    );

    return (
        <ConfigProvider>
            <Popover placement="bottom" title="Attendance Info" content={content} trigger="click" open={visible} onOpenChange={handleVisibleChange}>{children}</Popover>
        </ConfigProvider>
    );
}


