"use client";

import React from "react";
import { Table, Avatar, Upload, Button } from "antd";
import type { TableColumnsType, UploadFile } from "antd";
import { createStyles } from "antd-style";
import { GetAttendanceRecord } from "@/app/hooks/useGetAttendance";
import { UploadOutlined } from "@ant-design/icons";

type AttendanceEntry = {
  employee_id: string;
  employee_name: string;
  avatar: string;
  attendance: {
    date: string;
    time_in: string;
    time_out: string;
    status: string;
  }[];
};

const useStyle = createStyles(({ css }) => {
  return {
    customTable: css`
      .ant-table {
        .ant-table-container {
          .ant-table-body,
          .ant-table-content {
            scrollbar-width: thin;
            scrollbar-color: #eaeaea transparent;
            scrollbar-gutter: stable;
          }
        }
      }
    `,
  };
});

const columns: TableColumnsType = [
  {
    title: "Employee",
    fixed: "left",
    width: 200,
    render: (_, row) => (
      <span className="flex flex-row items-center gap-3">
        <Avatar
          size={{ xs: 24, sm: 32, md: 40, lg: 40, xl: 40, xxl: 40 }}
          src="/img/ppic.png"
          alt="avatar"
          onError={() => true}
        />
        <span className="flex flex-col">
          <span className="text-gray-500">{row.employee_id}</span>
          <span>{row.employee_name}</span>
        </span>
      </span>
    ),
  },
  {
    title: "09-20-2025",
    dataIndex: "address",
    key: "1",
    width: 150,
    render: (_, row) => (
      <span className="flex flex-col gap-2">
        <div className="flex flex-row justify-between  bg-white gap-4 rounded-md px-4 py-2">
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Time in</span>
            <span className="text-slate-900 font-medium text-[15px]">
              {row.time_in || "00:00:00"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Time out</span>
            <span className="text-slate-900 font-medium text-[15px]">
              {row.time_out || "00:00:00"}
            </span>
          </div>
        </div>

        <span
          className="flex items-center justify-center bg-red-800 text-white text-sm rounded-full h-[30px] w-[110px] mx-auto"
        >
          Late
        </span>
      </span>

    ),
  },
  {
    title: "Column 3",
    dataIndex: "address",
    key: "3",
    width: 150,
  },
  {
    title: "Column 4",
    dataIndex: "address",
    key: "4",
    width: 150,
  },
  {
    title: "Column 5",
    dataIndex: "address",
    key: "5",
    width: 150,
  },
  {
    title: "Column 6",
    dataIndex: "address",
    key: "6",
    width: 150,
  },
  {
    title: "Column 7",
    dataIndex: "address",
    key: "7",
    width: 150,
  },
  {
    title: "Action",
    key: "operation",
    fixed: "right",
    width: 100,
    render: () => <a>action</a>,
  },
];

const fileList: UploadFile[] = [];

export default function AttendancePage() {
  const { styles } = useStyle();
  const { useGetAttendance } = GetAttendanceRecord();

  const { data: attendance, isLoading } = useGetAttendance();
  return (
    <>
      <div className="flex justify-end">
        <Upload
          name="file_upload"
          action="http://localhost:8000/attendance/import/"
          // listType="picture"
          // defaultFileList={fileList}
        >
          <Button
            type="primary"
            icon={<UploadOutlined />}
            className="mx-8 mt-8 align-left shadow-lg"
          >
            Punch Record
          </Button>
        </Upload>
      </div>

      <Table
        className="mx-8 mt-4 shadow-lg"
        columns={columns}
        dataSource={attendance}
        loading={isLoading}
        rowKey={(row) => row.id}
        scroll={{ x: "max-content", y: 55 * 5 }}
      />
    </>
  );
}
