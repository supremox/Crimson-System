"use client";

import React from "react";
import { Table, Avatar, Upload, Button } from "antd";
import type { TableColumnsType, UploadFile } from "antd";
import { createStyles } from "antd-style";
import { GetEmployeesRecord } from "@/app/hooks/useGetEmployeesRecord";
import { GetAttendanceRecord } from "@/app/hooks/useGetAttendance";
import { UploadOutlined } from "@ant-design/icons";

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
      <span className="flex flex-row items-center gap-3">
        <span className="flex flex-col">
          <span className="text-gray-500">
            <table className="w-full bg-white">
              <thead className="bg-gray-800 whitespace-nowrap">
                <tr>
                  <th className="p-4 text-left text-sm font-medium text-white">
                    Time in
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-white">
                    Time out
                  </th>
                </tr>
              </thead>
              <tbody className="whitespace-nowrap">
                <tr className="even:bg-gray-200">
                  <td className="p-4 text-[15px] text-slate-900 font-medium">
                    {row.time_in || "00:00:00"}
                  </td>
                  <td className="p-4 text-[15px] text-slate-900 font-medium">
                    {row.time_out || "00:00:00"}
                  </td>
                </tr>
              </tbody>
            </table>
          </span>
          <span
            className={"flex items-center justify-center mx-auto bg-red-800"}
            style={{
              height: "30px",
              width: "110px",
              borderRadius: "20px",
              color: "white",
            }}
          >
            Late
          </span>
        </span>
      </span>
    ),
  },
  {
    title: "09-21-2025",
    dataIndex: "address",
    key: "2",
    width: 150,
    render: (_, row) => (
      <span className="flex flex-row items-center gap-3">
        <span className="flex flex-col">
          <span className="text-gray-500">
            <table className="w-full bg-white">
              <thead className="bg-gray-800 whitespace-nowrap">
                <tr>
                  <th className="p-4 text-left text-sm font-medium text-white">
                    Time in
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-white">
                    Time out
                  </th>
                </tr>
              </thead>
              <tbody className="whitespace-nowrap">
                <tr className="even:bg-gray-200">
                  <td className="p-4 text-[15px] text-slate-900 font-medium">
                    08:30:00
                  </td>
                  <td className="p-4 text-[15px] text-slate-900 font-medium">
                    17:30:00
                  </td>
                </tr>
              </tbody>
            </table>
          </span>
          <span
            className={"flex items-center justify-center mx-auto bg-green-600"}
            style={{
              height: "30px",
              width: "110px",
              borderRadius: "20px",
              color: "white",
            }}
          >
            On-Time
          </span>
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
  const { useGetEmployees } = GetEmployeesRecord();
  const { useGetAttendance } = GetAttendanceRecord();

  const { data: attendance, isLoading } = useGetAttendance();
  const { data: employee } = useGetEmployees();
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
