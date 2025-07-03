"use client";

import React, { useState } from "react";
import { Table, Avatar, Upload, Button, DatePicker, Input } from "antd";
import type { TableColumnsType } from "antd";
import { createStyles } from "antd-style";
import { GetAttendanceRecord } from "@/app/hooks/useGetAttendance";
import { DeleteOutlined, EditOutlined, FilterOutlined, FolderViewOutlined, SearchOutlined, UploadOutlined, WalletOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getQueryClient } from "@/app/components/getQueryClient";
import { GetEmployeesRecord } from "@/app/hooks/useGetEmployeesRecord";
import CreateShift from "../Modal/CreateShift";


export default function ShiftList() {
  const { useGetShift} = GetEmployeesRecord();

  const { data: shift, isLoading, error } = useGetShift()


  const dynamicColumns: TableColumnsType = [
     {
        title: 'Shift_ID',
        // dataIndex: ['first_name', 'last_name'],
        render: (_, row) => <span>{row.id}</span>
    },
    {
        title: 'Shift',
        // dataIndex: 'department.department_name',
        render: (_, row) => <span>{row.shift_name}</span> 


    },
    {
        title: 'Shift Start',
        // dataIndex: 'department.department_name',
        render: (_, row) => <span>{row.start_time}</span> 


    },
    {
        title: 'Shift End',
        // dataIndex: 'department.department_name',
        render: (_, row) => <span>{row.end_time}</span> 


    },
    {
        title: 'Shift Break Start',
        // dataIndex: 'department.department_name',
        render: (_, row) => <span>{row.break_start}</span> 


    },
    {
        title: 'Shift Break End',
        // dataIndex: 'department.department_name',
        render: (_, row) => <span>{row.break_end}</span> 


    },
    {
      title: <span className="flex items-center justify-center">Action</span>,
      key: "action",
      fixed: "right",
      width: 100,
      render: () => 
      <span className="flex items-center justify-center gap-2">
        <Button
            type="primary"
            className="h-10 shadow-lg"
            // onClick={handleFilter}
        >
            <EditOutlined />
        </Button>
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
        <div className="bg-white rounded-lg mt-4 mb-5 p-5">
          <h3 className="text-2xl font-bold font-sans">Shifts Management</h3>
        </div>
        <div className="bg-white rounded-lg mb-5 p-5">
            <div className="flex flex-wrap justify-end items-center gap-4 mt-4">
                <CreateShift />
            </div>

            <Table
              className="mt-4 shadow-lg "
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


