"use client";

import React, { useState } from "react";
import { Table, Button} from "antd";
import type { TableColumnsType } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getQueryClient } from "@/app/components/getQueryClient";
import { GetEmployeesRecord } from "@/app/hooks/useGetEmployeesRecord";
import CreateShift from "../Modal/CreateShift";
import UpdateShift from "../Modal/UpdateShift";


export default function ShiftList() {
  const { useGetShift } = GetEmployeesRecord();

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
            <UpdateShift />
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
      <div className="flex flex-col mt-5">
        <div className="bg-white rounded-lg shadow-lg mb-5 p-5">
            <div className="flex flex-wrap justify-between  items-center gap-4 mt-4">
                <h3 className="text-2xl font-bold ml-2 font-sans">Shifts Management</h3>
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


