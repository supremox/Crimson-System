"use client";

import '@ant-design/v5-patch-for-react-19';
import React, { useRef, useState } from "react";
import { Table, Avatar, Upload, Button, DatePicker, Input } from "antd";
import type { TableColumnsType } from "antd";
import { createStyles } from "antd-style";
import { GetAttendanceRecord } from "@/app/hooks/useGetAttendance";
import { EyeOutlined, FilterOutlined, FolderViewOutlined, RollbackOutlined, SearchOutlined, UploadOutlined } from "@ant-design/icons";
import DayAttendance from "./_component/Modals/DayAttendance";
import axiosInstance from "../../../../server/instance_axios";
import dayjs from "dayjs";
import warning from "antd/es/_util/warning";
import { getQueryClient } from "@/app/components/getQueryClient";
import Link from "next/link";
import { GetEmployeesRecord } from '@/app/hooks/useGetEmployeesRecord';

interface AttendanceEntry {
  date: string;
  time_in: string;
  time_out: string;
  status: string;
}

interface EmployeeRow {
  employee_id: string;
  employee_name: string;
  attendance: AttendanceEntry[];
}

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
  const { useGetAttendance, useGetUserAttendance } = GetAttendanceRecord();
  const { useGetEmployeeUser } = GetEmployeesRecord()

  const { data: user } = useGetEmployeeUser() 
  const { data: attendance, isLoading, refetch } = useGetAttendance();
  const { data: user_attendance } = useGetUserAttendance()

  const [dateRange, setDateRange] = useState<(dayjs.Dayjs | null)[]>([]);
  const [searchText, setSearchText] = useState("");
  const [tableLoading, setTableLoading] = useState(false);

  const [filteredAttendance, setFilteredAttendance] = useState<any[] | null>(null);
  const [filteredUserAttendance, setuserFilteredAttendance] = useState<any[] | null>(null);

  const [showAllAttendance, setShowAllAttendance] = useState(false);

  const queryClient = getQueryClient();
  
  // console.log("User Permissions", user?.custom_permissions)

  const userAttendanceColumn: TableColumnsType<AttendanceEntry> = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Time-In",
      dataIndex: "time_in",
      key: "time_in",
    },
    {
      title: "Time-Out",
      dataIndex: "time_out",
      key: "time_out",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const statusColor = ["Sick Leave", "Vacation Leave", "Paternity Leave", "Maternity Leave"].includes(status)
          ? "bg-blue-600"
          : status === "Late"
          ? "bg-orange-600"
          : status === "Absent"
          ? "bg-red-600"
          : status === "On-Call"
          ? "bg-violet-800"
          : status === "Holiday"
          ? "bg-indigo-400"
          : status === "Rest Day"
          ? "bg-yellow-600"
          : "bg-green-600";

        return (
          <span
            className={`text-center text-white  flex items-center justify-center cursor-pointer ${statusColor}`}
            style={{
              height: "30px",
              width: "110px",
              borderRadius: "20px",
              color: "white",
            }}
          >
            {status}
          </span>
        );
      },
    },
  ];  

  const { RangePicker } = DatePicker;

  const allDates = [
      ...new Set(
      (dateRange.length > 0 ? filteredAttendance : attendance)?.flatMap(
        (emp: any) => emp.attendance.map((a: any) => a.date) ?? []
      )
    ),
  ];

  const dataSource = (dateRange.length > 0 ? filteredAttendance : attendance)?.map((emp: any) => {
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

  // console.log("All Dates", allDates)

  const dynamicColumns: TableColumnsType = [
    {
      title: "Employee",
      fixed: "left",
      width: 200,
      render: (_, row) => (
        <span className="flex flex-row items-center ml-3 gap-3">
          <Avatar
            size={40}
            src="/img/default_avatar.png"
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
      width: 180,
      render: (_: unknown, row: any) => {
        const att = row[String(date)];
        return att ? (
          <span className="flex flex-col gap-2" key={`${row.employee_id}-${date}`}>
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
          <div className="text-gray-400 italic text-center">No Attendance Record</div>
        );
      },
    })),
  ];

  
  // console.log(dateRange)
  
  const handleFilter = async () => {
    if (dateRange.length === 2 && dateRange[0] && dateRange[1]) {
      setTableLoading(true);

      try {
        // Choose endpoint based on view mode
        const endpoint = showAllAttendance
          ? "/attendance/filter/date/"
          : "/attendance/user/filter/date/";

        const res = await axiosInstance.post(endpoint, {
          start_date: dayjs(dateRange[0]).format("YYYY-MM-DD"),
          end_date: dayjs(dateRange[1]).format("YYYY-MM-DD"),
        });

        if (endpoint === "/attendance/user/filter/date/") {
          setuserFilteredAttendance(res.data.attendance ?? []);
        } else {
          setFilteredAttendance(res.data);
        }

      } catch (error: any) {
        const message =
          error?.response?.data?.error || "Failed to fetch filtered attendance.";

        alert(message);

        // Clear the correct state
        if (showAllAttendance) {
          setFilteredAttendance(null);
        } else {
          setuserFilteredAttendance([]);
        }

      } finally {
        setTableLoading(false);
      }
    } else {
      alert("Please select a start and end date.");
    }
  };


  // console.log("Filtered Attendance Data", filteredAttendance)
  // console.log("After Attendance Data", attendance)

  const handleSearch = (e: any) => {
    const text = e.target.value.toLowerCase();
    setSearchText(text);

    if (!showAllAttendance) return; // Only apply search when viewing all

    const baseData = dateRange.length > 0 && filteredAttendance ? filteredAttendance : attendance;

    if (!baseData) return;

    if (text === "") {
      setFilteredAttendance(baseData);
      return;
    }

    const filtered = baseData.filter((emp: any) => {
      return (
        emp.employee_name.toLowerCase().includes(text) ||
        emp.employee_id.toLowerCase().includes(text)
      );
    });

    setFilteredAttendance(filtered);
  };



  return (
    <>
      <div className="flex flex-col">
        <div className="bg-white rounded-lg mx-5 mt-4 mb-5 p-5">
          <h3 className="text-2xl font-bold font-sans">Attendance Management</h3>
          <p className="ml-4 mt-2 italic">This is a Attendance Management were you can log attendance record from Excel and see it in the table. <br /> 
              Using Look Up you can see attendance data by selecting The Start date and End date</p>
        </div>

        {/* All Employees Attendance */}
        <div className="bg-white rounded-lg shadow-lg mx-5 mb-5 p-5">
          <div className="flex justify-between items-center gap-4 mt-4 flex-nowrap overflow-x-auto">

              <div className="flex flex-row items-center gap-4">

                <span className="flex flex-row items-center gap-3 bg-white rounded-lg shadow-lg p-2 min-w-[240px]">
                  <Avatar
                    size={40}
                    src="/img/default_avatar.png"
                    alt="avatar"
                  />
                  <span className="flex flex-col">
                    <span className="text-gray-500">{user_attendance?.employee_id}</span>
                    <span>{user_attendance?.employee_name}</span>
                  </span>
                </span>

                {user?.custom_permissions?.some((perm: any) => perm.code === "can_view_all") && showAllAttendance && (
                  <Input
                    placeholder="Search by name or ID"
                    allowClear
                    value={searchText}
                    onChange={handleSearch}
                    prefix={<SearchOutlined className="mx-2" style={{ color: "#9CA3AF" }} />}
                    className="h-10 shadow-lg"
                    style={{ width: 200 }}
                  />
                )}

                <RangePicker
                  className="h-10 shadow-lg"
                  onChange={(dates) => setDateRange(dates ?? [])}
                />

                <Button
                  icon={<FilterOutlined />}
                  type="primary"
                  className="h-10 shadow-lg"
                  onClick={handleFilter}
                >
                  Look Up
                </Button>

                {user?.custom_permissions?.some((perm: any) => perm.code === "can_view_all") && (
                  !showAllAttendance ? (
                    <Button
                      type="primary"
                      icon={<EyeOutlined />}
                      className="h-10 shadow-lg"
                      onClick={async () => {
                        setTableLoading(true);
                        try {
                          await refetch(); // only fetches when View All is clicked
                          setShowAllAttendance(true);
                        } finally {
                          setTableLoading(false);
                        }
                      }}
                    >
                      View All
                    </Button>
                  ) : (
                    <Button
                      type="default"
                      className="h-10 shadow-lg"
                      onClick={() => {
                        setShowAllAttendance(false);
                        setFilteredAttendance(null); // Clear filtered data when returning to user-only view
                      }}
                    >
                      <RollbackOutlined/>
                    </Button>
                  )
                )}


                {user?.custom_permissions?.some((perm: any) => perm.code === "can_punch_record") && (
                  <Upload
                    name="file_upload"
                    action="http://localhost:8000/attendance/import/"
                    onChange={(info) => {
                      if (info.file.status === "done") {
                        refetch();
                      }
                    }}
                  >
                    <Button
                      type="primary"
                      icon={<UploadOutlined />}
                      className="h-10 shadow-lg"
                    >
                      Punch Record
                    </Button>
                  </Upload>
                )}
              </div>
          </div>
          
          {!showAllAttendance ? (
            // User Attendance Record
            <Table
              columns={userAttendanceColumn}
              dataSource={filteredUserAttendance || user_attendance?.attendance || []}
              loading={isLoading || tableLoading}
              rowKey={(row) => row.date}
              scroll={{ x: "max-content", y: 55 * 5 }}
              className="mb-5 mt-4 shadow-lg shadow-blue-900"
              size="middle"
            />
          ) : (
            // All Employee Attendance Record
            <Table
              columns={dynamicColumns}
              dataSource={dataSource}
              loading={isLoading || tableLoading}
              rowKey={(row) => row.employee_id}
              scroll={{ x: "max-content", y: 55 * 5 }}
              className="mb-5 mt-4 shadow-lg shadow-blue-900"
              size="middle"
            />
          )}


        </div>
      </div>
    </>
  );
}




