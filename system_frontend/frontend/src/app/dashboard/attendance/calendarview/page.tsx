"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Modal, ConfigProvider } from "antd";
import type { CalendarProps } from "antd";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/en";

interface AttendanceEntry {
  date: string;
  time_in: string;
  time_out: string;
  status: string;
}

const attendanceData: AttendanceEntry[] = [
  { date: "2025-05-02", time_in: "08:26:00", time_out: "17:34:00", status: "Early" },
  { date: "2025-05-03", time_in: "08:20:00", time_out: "17:37:00", status: "Late" },
  { date: "2025-05-04", time_in: "00:00:00", time_out: "00:00:00", status: "Rest Day" },
  { date: "2025-05-05", time_in: "00:00:00", time_out: "00:00:00", status: "Absent" },
  { date: "2025-05-06", time_in: "08:30:00", time_out: "17:36:00", status: "Early" },
  { date: "2025-05-07", time_in: "08:25:00", time_out: "17:38:00", status: "Early" },
  { date: "2025-05-08", time_in: "00:00:00", time_out: "00:00:00", status: "Holiday" },
  { date: "2025-05-09", time_in: "08:29:00", time_out: "17:47:00", status: "Early" },
  { date: "2025-05-10", time_in: "08:23:00", time_out: "19:38:00", status: "Early" },
  { date: "2025-05-11", time_in: "00:00:00", time_out: "00:00:00", status: "Rest Day" },
  { date: "2025-05-12", time_in: "00:00:00", time_out: "00:00:00", status: "Absent" },
];

const statusColorMap: Record<string, string> = {
  Early: "#22c55e",
  Late: "#f97316",
  Holiday: "#6366f1",
  "Rest Day": "#d97706",
  Absent: "#ef4444",
};

const getAttendanceByDate = (date: Dayjs) => {
  const dateStr = date.format("YYYY-MM-DD");
  return attendanceData.find((entry) => entry.date === dateStr);
};

export default function CalendarViewPage() {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fullCellRender: CalendarProps<Dayjs>["fullCellRender"] = (current) => {
    const attendance = getAttendanceByDate(current);
    return (
      <div
        onClick={() => {
          setSelectedDate(current);
          setModalVisible(true);
        }}
        className={`w-auto h-20 p-2 bg-blue-100 rounded-md text-center transition-all duration-150 cursor-pointer 
          ${current.isSame(selectedDate, "day") ? "bg-blue-800 text-white" : ""}
          hover:bg-blue-100`}
      >
        <div className="text-sm font-semibold">{current.date()}</div>
        {attendance && (
          <div
            className="text-white text-xs mt-2 px-2 py-1 rounded-full"
            style={{ backgroundColor: statusColorMap[attendance.status] }}
          >
            {attendance.status}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .ant-picker-calendar .ant-picker-content {
        border-collapse: separate !important;
        border-spacing: 8px !important;
      }

      .ant-picker-calendar .ant-picker-content thead > tr > th {
        background-color: #1e3a8a !important;
        color: white !important;
        text-align: center !important;
        padding: 12px 0 !important;
        font-weight: 600;
        font-size: 14px;
        border-radius: 10px;
      }

      .ant-picker-calendar .ant-picker-cell {
        padding: 4px !important;
      }

      .ant-picker-calendar .ant-picker-content td {
        vertical-align: top !important;
      }

      /* Align header section (h1 + year/month picker) */
      .calendar-header-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .calendar-header-wrapper .ant-picker-calendar-header {
        margin-bottom: 0px !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="p-8">
      <div className="mx-auto bg-blue-200 rounded-2xl shadow-lg p-8">
        <ConfigProvider
          theme={{
            token: {
              colorBgContainer: "#bfdbfe",
              colorText: "#111827",
              borderRadius: 12,
            },
          }}
        >
          {/* 👇 Custom Header Row: title + AntD picker */}
          <div className="calendar-header-wrapper">
            <h1 className="text-2xl font-bold text-slate-900">Attendance Calendar</h1>
          </div>

          <Calendar
            fullscreen
            fullCellRender={fullCellRender}
            className="rounded-2xl"
          />
        </ConfigProvider>
      </div>

      <Modal
        open={modalVisible}
        title="Attendance Details"
        onCancel={() => setModalVisible(false)}
        onOk={() => setModalVisible(false)}
        okText="Close"
        footer={false}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        {selectedDate ? (
          <>
            <p><strong>Date:</strong> {selectedDate.format("YYYY-MM-DD")}</p>
            {getAttendanceByDate(selectedDate) ? (
              <>
                <p><strong>Time In:</strong> {getAttendanceByDate(selectedDate)?.time_in}</p>
                <p><strong>Time Out:</strong> {getAttendanceByDate(selectedDate)?.time_out}</p>
                <p><strong>Status:</strong> {getAttendanceByDate(selectedDate)?.status}</p>
              </>
            ) : (
              <p>No attendance recorded for this date.</p>
            )}
          </>
        ) : null}
      </Modal>
    </div>
  );
}
