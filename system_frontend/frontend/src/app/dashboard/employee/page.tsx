"use client";

import { useState } from "react";
import AddEmployee from "./_component/Tab_Content/AddEmployee";
import EmployeeList from "./_component/Tab_Content/EmployeeList";
import ShiftCreate from "./_component/Tab_Content/ShiftCreate";
import IncetiveCreate from "./_component/Tab_Content/IncetiveCreate";
import DepartmentPositionList from "./_component/Tab_Content/DepartmentPositionList";
import ShiftList from "./_component/Tab_Content/ShiftList";
import IncentiveList from "./_component/Tab_Content/IncentiveList";


export default function EmployeePage() {
  const [activeTab, setActiveTab] = useState<
    "employee" | "add" | "department_and_position" | "shift" | "incentive"
  >("employee");

  return (
    <div className="p-4">
      {/* Tabs */}
      <ul className="flex w-max border-b border-gray-300 space-x-4 overflow-hidden">
        <li
          id="homeTab"
          className={`tab text-center text-[15px] py-2.5 px-6 rounded-tl-2xl rounded-tr-2xl cursor-pointer font-semibold ${
            activeTab === "employee"
              ? "text-white bg-blue-600"
              : "text-slate-600 bg-gray-200"
          }`}
          onClick={() => setActiveTab("employee")}
        >
          Employee
        </li>
        <li
          id="settingTab"
          className={`tab text-center text-[15px] py-2.5 px-6 rounded-tl-2xl rounded-tr-2xl cursor-pointer font-semibold ${
            activeTab === "add"
              ? "text-white bg-blue-600"
              : "text-slate-600 bg-gray-200"
          }`}
          onClick={() => setActiveTab("add")}
        >
          Add Employee
        </li>
        <li
          id="deptTab"
          className={`tab text-center text-[15px] py-2.5 px-6 rounded-tl-2xl rounded-tr-2xl cursor-pointer font-semibold ${
            activeTab === "department_and_position"
              ? "text-white bg-blue-600"
              : "text-slate-600 bg-gray-200"
          }`}
          onClick={() => setActiveTab("department_and_position")}
        >
          Department / Position
        </li>

        <li
          id="shiftTab"
          className={`tab text-center text-[15px] py-2.5 px-6 rounded-tl-2xl rounded-tr-2xl cursor-pointer font-semibold ${
            activeTab === "shift"
              ? "text-white bg-blue-600"
              : "text-slate-600 bg-gray-200"
          }`}
          onClick={() => setActiveTab("shift")}
        >
          Shift
        </li>

        <li
          id="settingTab"
          className={`tab text-center text-[15px] py-2.5 px-6 rounded-tl-2xl rounded-tr-2xl cursor-pointer font-semibold ${
            activeTab === "incentive"
              ? "text-white bg-blue-600"
              : "text-slate-600 bg-gray-200"
          }`}
          onClick={() => setActiveTab("incentive")}
        >
          Incentive / Leave
        </li>
      </ul>

      {/* Employee List Tab */}
      {activeTab === "employee" && (
        <EmployeeList />
      )}

      {/* Add Employee Tab */}
      {activeTab === "add" && (
        <AddEmployee />
      )}

      {/* Add Department and Position Tab */}
      {activeTab === "department_and_position" && (
        <DepartmentPositionList/>
      )}

      {/* Add Shift Tab */}
      {activeTab === "shift" && (
        <ShiftList/>
      )}

      {/* Add incentive Tab */}
      {activeTab === "incentive" && (
       <IncentiveList/>
      )}
    </div>
  );
}
