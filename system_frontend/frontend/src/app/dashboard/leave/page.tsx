"use client";

import React, { useState } from "react";
import { Table, Avatar, Upload, Button, DatePicker, Input, Space } from "antd";
import type { TableColumnsType } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined, DeleteOutlined, EyeOutlined, FilterOutlined, FolderViewOutlined, SearchOutlined, UploadOutlined, WalletOutlined } from "@ant-design/icons";
import axiosInstance from "../../../../server/instance_axios";
import dayjs from "dayjs";
import { getQueryClient } from "@/app/components/getQueryClient";
import LeaveFiling from "./modal/LeaveFiling";
import { GetCalendarEventsRecord } from "@/app/hooks/useGetCalendarEvent";
import UpdateLeave from "./modal/UpdateLeave";


export default function LeavePage() {
  const { useGetLeaves } = GetCalendarEventsRecord();

  const { data: leaves, isLoading, refetch } = useGetLeaves();


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
      title: <span className="">Leave Type</span>,
      width: 100,
      render: (_, row) => <span className="">{row.leave_type}</span>,
    },
    {
      title: <span className="">Leave Date</span>,
      width: 100,
      render: (_, row) => 
        <span className='flex flex-row w-40 gap-3'>
          <span>{row.leave_start_date}</span>
           <Space><ArrowRightOutlined/></Space>
          <span>{row.leave_end_date}</span>
        </span>
    },
    {
      title: <span className="flex items-center justify-center mx-auto">Leave Status</span>,
      width: 100,
      render: (_, row) => 
        <span 
            className={`flex items-center justify-center mx-auto ${
               row.leave_status === "Approve"
              ? "bg-green-600"
              : row.leave_status === "Rejected"
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
            {row.leave_status}
        </span>,
    },
    {
      title: <span className="flex items-center justify-center">Action</span>,
      key: "action",
      fixed: "right",
      width: 100,
      render: (_, row) => 
      <span className="flex items-center justify-center gap-2">
        <UpdateLeave id={row.id} />
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
          <h3 className="text-2xl font-bold font-sans">Leave Management</h3>
          <p className="ml-4 mt-2 italic">This is a Leave Management were you can Generate Payroll for Specific date and see it in the table. <br /> 
              Using Generate Payroll you can see the total amout to pay by selecting The Start date and End date</p>
        </div>
        <div className="bg-white rounded-lg mx-5 mb-5 p-5">
            <div className="flex flex-wrap justify-end mt-4">
                <LeaveFiling />
            </div>


            <Table
              className="mb-5 mt-4 shadow-lg shadow-blue-900"
              size="middle"
              columns={dynamicColumns}
              dataSource={leaves}
              loading={isLoading}
              rowKey={(row) => row.id}
              scroll={{ x: "max-content", y: 55 * 5 }}
            />
        </div>
      </div>
    </>
  );
}


