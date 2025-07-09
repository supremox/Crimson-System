"use client";

import '@ant-design/v5-patch-for-react-19';
import React, { useState } from "react";
import { Table, Avatar, Upload, Button, DatePicker, Input } from "antd";
import type { TableColumnsType } from "antd";
import { DeleteOutlined, EyeOutlined} from "@ant-design/icons";
import ShiftChangeFiling from "./modal/ShiftChangeFiling";
import { GetCalendarEventsRecord } from "@/app/hooks/useGetCalendarEvent";
import UpdateShift from './modal/UpdateShift';

export default function ShiftChangePage() {
  const { useGetShifts } = GetCalendarEventsRecord();

  const { data: shift, isLoading, refetch } = useGetShifts();


  const dynamicColumns: TableColumnsType = [
    {
      title: <span>Employee</span>,
      width: 200,
      render: (_, row) => (
      <span className='flex flex-row items-center gap-3'> 
            <Avatar
              size={{ xs: 24, sm: 32, md: 40, lg: 40, xl: 40, xxl: 40 }}
              src={row.avatar}
              alt="avatar"
              onError={() => true}
            />
            <span className='flex flex-col'>
              <span className='text-gray-500'>{row.employee_id}</span>
              <span>{row.name}</span>
            </span>
        </span> 
        ),
    },
    {
      title: <span className="">Designation</span>,
      width: 100,
      render: (_, row) => 
        <span className='flex flex-col w-40'>
          <span className='text-gray-500'>{row.department}</span>
          <span className='font-semibold text-md'>{row.position}</span>
        </span>
    },
    {
      title: <span className="">Shift Type</span>,
      width: 100,
      render: (_, row) => <span className="">{row.shift_type}</span>,
    },
    {
      title: <span className="">Date</span>,
      width: 100,
      render: (_, row) => <span className="">{row.date}</span>,
    },
    {
      title: <span className="flex items-center justify-center mx-auto">Shift Status</span>,
      width: 100,
      render: (_, row) => 
        <span 
            className={`flex items-center justify-center mx-auto ${
               row.shift_status === "Approve"
              ? "bg-green-600"
              : row.shift_status === "Rejected"
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
            {row.shift_status}
        </span>,
    },
    {
      title: <span className="flex items-center justify-center">Action</span>,
      key: "action",
      fixed: "right",
      width: 100,
      render: (_, row) => 
      <span className="flex items-center justify-center gap-3">
        <UpdateShift id={row.id}/>
        <Button
            type="primary"
            danger
            className="h-10 shadow-lg"
            // onClick={handleFilter}
        >
            <DeleteOutlined />
        </Button>
      </span> 
    },
  ];


  return (
    <>
      <div className="flex flex-col">
        <div className="bg-white rounded-lg mx-5 mt-4 mb-5 p-5">
          <h3 className="text-2xl font-bold font-sans">Shift Change Management</h3>
          <p className="ml-4 mt-2 italic">This is a Shift Change Management were you can Generate Payroll for Specific date and see it in the table. <br /> 
              Using Shift Change you can see the total amout to pay by selecting The Start date and End date</p>
        </div>
        <div className="bg-white rounded-lg mx-5 mb-5 p-5">
            <div className="flex flex-wrap justify-end items-center gap-4 mt-4">
                <ShiftChangeFiling />
            </div>


            <Table
              className="mb-5 mt-4 shadow-lg shadow-blue-900"
              size="middle"
              columns={dynamicColumns}
              dataSource={shift}
              loading={isLoading}
              rowKey={(row) => row.id}
              scroll={{ x: "max-content", y: 55 * 5 }}
            />
        </div>
      </div>
    </>
  );
}


