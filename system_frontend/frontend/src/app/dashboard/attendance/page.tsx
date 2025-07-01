"use client";

import React, { useState } from "react";
import { Table, Avatar, Upload, Button } from "antd";
import type { TableColumnsType } from "antd";
import { createStyles } from "antd-style";
import { GetAttendanceRecord } from "@/app/hooks/useGetAttendance";
import { UploadOutlined } from "@ant-design/icons";
import DayAttendance from "./Modals/DayAttendance";

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


export default function AttendancePage() {
  const { styles } = useStyle();
  const { useGetAttendance } = GetAttendanceRecord();

  const { data: attendance, isLoading, refetch } = useGetAttendance();

  const [selected, setSelected] = useState<{ emp_id: string; day: string } | null>(null);

  const handleStatusClick = (emp_id: string, day: string) => {
    setSelected({ emp_id, day });
  };

  const handleCloseDayAttendance = () => {
    setSelected(null);
  };

  const allDates = [
    ...new Set(
      attendance?.flatMap((emp: any) => emp.attendance.map((a: any) => a.date))
    ),
  ];

  const dataSource = attendance?.map((emp: any) => {
    const record: {
      key: any;
      employee_name: any;
      employee_id: any;
      avatar: any;
      [date: string]: any;
    } = {
      key: emp.employee_id,
      employee_name: emp.employee_name,
      employee_id: emp.employee_id,
      avatar: emp.avatar,
    };

    emp.attendance.forEach((att: any) => {
      record[att.date] = att;
    });

    return record;
  });

  const dynamicColumns: TableColumnsType = [
    {
      title: "Employee",
      fixed: "left",
      width: 200,
      render: (_, row) => (
        <span className="flex flex-row items-center gap-3">
          <Avatar
            size={40}
            src={row.avatar || "/img/ppic.png"}
            alt="avatar"
          />
          <span className="flex flex-col">
            <span className="text-gray-500">{row.employee_id}</span>
            <span>{row.employee_name}</span>
          </span>
        </span>
      ),
    },
    ...allDates.map((date) => ({
      title: String(date),
      dataIndex: String(date),
      key: String(date),
      width: 180,
      render: (_: unknown, row: any) => {
        const att = row[String(date)];
        return att ? (
          <span className="flex flex-col gap-2">
            <div className="flex justify-between bg-white rounded-md px-2 py-0">
              <div className="flex flex-col">
                <span className="text-gray-500 text-xs">Time in</span>
                <span className="text-slate-900 font-medium text-sm">{att.time_in}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-xs">Time out</span>
                <span className="text-slate-900 font-medium text-sm">{att.time_out}</span>
              </div>
            </div>
            <DayAttendance emp_id={row.employee_id} day={String(date)}>
              <span
                className={`text-center rounded-full text-white text-xs px-2 py-1 cursor-pointer ${
                  ["Sick Leave", "Vacation Leave", "Paternity Leave", "Maternity Leave"].includes(att.status)
                    ? "bg-blue-600"
                    : att.status === "Late"
                    ? "bg-red-600"
                    : "bg-green-600"
                }`}
              >
                {att.status}
              </span>
            </DayAttendance>
          </span>
        ) : (
          <div className="text-gray-400 italic text-center">N/A</div>
        );
      },
    })),
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 100,
      render: () => <a>Edit</a>,
    },
  ];


  return (
    <>
      <div className="flex justify-end">
        <Upload
          name="file_upload"
          action="http://localhost:8000/attendance/import/"
          onChange={info => {
            if (info.file.status === 'done') {
              refetch();
            }
          }}
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
        size="middle"
        columns={dynamicColumns}
        dataSource={dataSource}
        loading={isLoading}
        rowKey={(row) => row.id}
        scroll={{ x: "max-content", y: 55 * 5 }}
      />
    </>
  );
}
