"use client";

import React, { useRef, useState } from "react";
import { Table, Avatar, Upload, Button, DatePicker, Input } from "antd";
import type { TableColumnsType } from "antd";
import { createStyles } from "antd-style";
import { GetAttendanceRecord } from "@/app/hooks/useGetAttendance";
import { FilterOutlined, FolderViewOutlined, SearchOutlined, UploadOutlined } from "@ant-design/icons";
import DayAttendance from "./Modals/DayAttendance";
import axiosInstance from "../../../../server/instance_axios";
import dayjs from "dayjs";
import warning from "antd/es/_util/warning";
import { getQueryClient } from "@/app/components/getQueryClient";

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

  const { RangePicker } = DatePicker;

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
        <span className="flex flex-row items-center ml-3 gap-3">
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
                      ? "bg-orange-600"
                      : att.status === "Absent"
                      ? "bg-red-600"
                      : att.status === "On-Call"
                      ? "bg-violet-800"
                      : att.status === "Holiday"
                      ? "bg-indigo-400"
                      : att.status === "Rest Day"
                      ? "bg-yellow-600"
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
      render: () => <Button
                      icon={<FolderViewOutlined />}
                      type="primary"
                      className="h-10 mt-1 shadow-lg"
                      // onClick={handleFilter}
                    >
                      View
                    </Button>,
    },
  ];

  const [dateRange, setDateRange] = useState<(dayjs.Dayjs | null)[]>([]);
  const [searchText, setSearchText] = useState("");
  const [tableLoading, setTableLoading] = useState(false);
  const [filteredAttendance, setFilteredAttendance] = useState<any[] | null>(null);
  const queryClient = getQueryClient();
  
  // Send filter request to backend
  const handleFilter = async () => {
    if (dateRange.length === 2 && dateRange[0] && dateRange[1]) {
      setTableLoading(true);
      try {
        const res = await axiosInstance.post("/attendance/filter/date/", {
          start_date: dayjs(dateRange[0]).format("YYYY-MM-DD"),
          end_date: dayjs(dateRange[1]).format("YYYY-MM-DD"),
        });
        setFilteredAttendance(res.data);
      } catch (error: any) {
        setFilteredAttendance([]);
        if (error.response && error.response.data && error.response.data.error) {
          alert(error.response.data.error);
          setFilteredAttendance(null);
        } else {
          alert("Failed to fetch filtered attendance.");
        }
      } finally {
        setTableLoading(false);
      }
    } else {
      alert("Please select a start and end date.");
    }
  };

  const attendanceData = (filteredAttendance ?? attendance)?.map((emp: any) => {
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

  // Filtered data for table
  const filteredDataSource = attendanceData?.filter((row: any) => {
    const name = row.employee_name?.toLowerCase() || "";
    const id = row.employee_id?.toLowerCase() || "";
    return (
      name.includes(searchText.toLowerCase()) ||
      id.includes(searchText.toLowerCase())
    );
  });

  const handleSearch = (e: any) => {
    setSearchText(e.target.value);
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="bg-white rounded-lg mx-5 mt-4 mb-5 p-5">
          <h3 className="text-2xl font-bold font-sans">Attendance Management</h3>
          <p className="ml-4 mt-2 italic">This is a Attendance Management were you can log attendance record from Excel and see it in the table. <br /> 
              Using Look Up you can see attendance data by selecting The Start date and End date</p>
        </div>
        <div className="bg-white rounded-lg mx-5 mb-5 p-5">
            <div className="flex flex-wrap justify-end items-center gap-4 mt-4">
              <div className="flex flex-row gap-4">
                <Input
                    placeholder="Search by name or ID"
                    allowClear
                    value={searchText}
                    onChange={handleSearch}
                    prefix={<SearchOutlined className="mx-2" style={{ color: "#9CA3AF" }}/>}
                    className="h-10 shadow-lg"
                  />

                <RangePicker
                  className="h-10 w-100 shadow-lg"
                  onChange={dates => setDateRange(dates ?? [])}
                />

                <Button
                  icon={<FilterOutlined />}
                  type="primary"
                  className="h-10 mt-1 shadow-lg"
                  onClick={handleFilter}
                >
                  Look Up
                </Button>
              </div>
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
                  className="h-10 shadow-lg mr-8"
                >
                  Punch Record
                </Button>
              </Upload>
            </div>


            <Table
              className="mx-5 mb-5 mt-4 shadow-lg shadow-blue-900"
              size="middle"
              columns={dynamicColumns}
              dataSource={filteredDataSource}
              loading={isLoading || tableLoading}
              rowKey={(row) => row.id}
              scroll={{ x: "max-content", y: 55 * 5 }}
            />
        </div>
      </div>
    </>
  );
}
function onFilter(arg0: { start_date: any; end_date: any; }) {
  throw new Error("Function not implemented.");
}

