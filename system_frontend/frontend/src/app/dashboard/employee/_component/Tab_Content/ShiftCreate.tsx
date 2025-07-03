import { GetEmployeesRecord } from '@/app/hooks/useGetEmployeesRecord';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Form, Input, TimePicker } from 'antd'
import React, { useState } from 'react'
import { getQueryClient } from '@/app/components/getQueryClient'; 
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../../../../../../server/instance_axios';
import dayjs from "dayjs";
import { Dayjs } from "dayjs";

type ShiftFieldType = {
  shift_name: string;
  start_time: string;
  end_time: string;
  break_start: string;
  break_end: string;
};


export default function ShiftCreate() {
    const { useGetShift} = GetEmployeesRecord();
    const queryClient = getQueryClient();
    const [shiftForm] = Form.useForm();

    const { data: shift, isLoading, error } = useGetShift()

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
        <div id="deptTab" className="tab-content mt-2 mx-8">
            <Form
                form={shiftForm}
                layout="vertical"
                onFinish={onAddShift}
                className="rounded-lg p-4"
            >
                <div className="grid grid-cols-5 grid-rows-5 mt-7 gap-4">
                <div className="col-span-2 row-span-5">
                    <div className="flex flex-col rounded-lg p-4 shadow-lg bg-white">
                    <h2 className="text-xl font-bold mb-4 ml-2 mt-2">
                        Shift Creation
                    </h2>
                    <div className="flex flex-col ml-20 mt-4 gap-4">
                        <Form.Item
                        label="Shift Name"
                        name="shift_name"
                        className="w-75"
                        rules={[{ required: true }]}
                        >
                        <Input />
                        </Form.Item>

                        <div className="flex flex-row gap-6">
                            <Form.Item label="Shift Start Time" name="start_time">
                                <TimePicker value={value} onChange={onTimeChange} />
                            </Form.Item>

                            <Form.Item label="Shift End Time" name="end_time">
                                <TimePicker value={value} onChange={onTimeChange} />
                            </Form.Item>
                        </div>

                        <div className="flex flex-row gap-6">
                            <Form.Item label="Shift Break Start" name="break_start">
                                <TimePicker value={value} onChange={onTimeChange} />
                            </Form.Item>

                            <Form.Item label="Shift Break End" name="break_end">
                                <TimePicker value={value} onChange={onTimeChange} />
                            </Form.Item>
                        </div>
                        <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="ml-25"
                        >
                            Create Shift
                        </Button>
                        </Form.Item>
                    </div>
                    </div>
                </div>

                <div className="col-span-3 row-span-5 col-start-3">
                    <div className="flex flex-col rounded-lg p-4 shadow-lg bg-white">
                    <h2 className="text-xl font-bold mb-4 ml-2 mt-2">Shifts</h2>

                    <div className="overflow-x-auto shadow-md">
                        <table className="w-full bg-white">
                        <thead className="bg-gray-800 whitespace-nowrap">
                            <tr>
                            <th className="p-4 text-left text-sm font-medium text-white">
                                Shift_ID
                            </th>
                            <th className="p-4 text-left text-sm font-medium text-white">
                                Shift Name
                            </th>
                            <th className="p-4 text-left text-sm font-medium text-white">
                                Shift Start
                            </th>
                            <th className="p-4 text-left text-sm font-medium text-white">
                                Shift End
                            </th>
                            <th className="p-4 text-left text-sm font-medium text-white">
                                Actions
                            </th>
                            </tr>
                        </thead>
                        <tbody className="whitespace-nowrap">
                            {isLoading && (
                            <tr>
                                <td colSpan={7} className="p-4 text-center">
                                Loading...
                                </td>
                            </tr>
                            )}
                            {error && (
                            <tr>
                                <td
                                colSpan={7}
                                className="p-4 text-center text-red-500"
                                >
                                Failed to load Positions
                                </td>
                            </tr>
                            )}
                            {Array.isArray(shift) && shift.length === 0 && (
                            <tr>
                                <td
                                colSpan={7}
                                className="p-4 text-center text-slate-500"
                                >
                                No shift found.
                                </td>
                            </tr>
                            )}
                            {Array.isArray(shift) &&
                            shift.map((shft: any) => (
                                <tr key={shft.id} className="even:bg-blue-50">
                                <td className="p-4 text-[15px] text-slate-900 font-medium">
                                    {shft.id}
                                </td>
                                <td className="p-4 text-[15px] text-slate-900 font-medium">
                                    {shft.shift_name}
                                </td>
                                <td className="p-4 text-[15px] text-slate-900 font-medium">
                                    {shft.start_time}
                                </td>
                                <td className="p-4 text-[15px] text-slate-900 font-medium">
                                    {shft.end_time}
                                </td>
                                <td className="p-4">
                                    {/* Actions (edit/delete) */}
                                    <div className="flex items-center">
                                    <button
                                        className="mr-3 cursor-pointer text-blue-600 hover:text-blue-800"
                                        title="Update"
                                    >
                                        <EditOutlined />
                                    </button>
                                    <button
                                        className="cursor-pointer text-red-600 hover:text-red-800"
                                        title="Delete"
                                    >
                                        <DeleteOutlined />
                                    </button>
                                    </div>
                                </td>
                                </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                    </div>
                </div>
                </div>
            </Form>
        </div>
  )
}
