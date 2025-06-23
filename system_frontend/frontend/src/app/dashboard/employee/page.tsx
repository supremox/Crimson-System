"use client";

import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/app/fetcher";
import {
  Button,
  Modal,
  Input,
  DatePicker,
  Select,
  Form,
  Checkbox,
  Divider,
  FormProps,
} from "antd";

import dayjs from "dayjs";

const { Option } = Select;

export default function EmployeePage() {
  // Tab state: "employee" or "add"
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState<
    "employee" | "add" | "department_and_position" | "shift" | "incentive"
  >("employee");

  // Fetch employee data from backend
  const { data, error, isLoading } = useSWR("/employee/name/", fetcher);

  // Example Add Employee form handler (implement as needed)
  const onAddEmployee = (values: any) => {
    // TODO: Call backend to add employee
    console.log(values);
  };

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
          id="settingTab"
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
          id="settingTab"
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
          Incentive
        </li>
      </ul>

      {/* Employee List Tab */}
      {activeTab === "employee" && (
        <div id="homeContent" className="tab-content mx-8 mt-8">
          <h2
            className="bg-blue-600 flex font-medium text-l items-center justify-center ml-0 mb-5"
            style={{ height: 50, width: 200, borderRadius: 10, color: "white" }}
          >
            List of Employees
          </h2>
          <div className="overflow-x-auto shadow-md">
            <table className="w-full bg-white">
              <thead className="bg-gray-800 whitespace-nowrap">
                <tr>
                  <th className="p-4 text-left text-sm font-medium text-white">
                    Employee ID
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-white">
                    Name
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-white">
                    Email
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-white">
                    Department
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-white">
                    Role
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-white">
                    Status
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="whitespace-nowrap">
                {isLoading && (
                  <tr>
                    <td colSpan={7} className="p-4 text-center">
                      Loading...
                    </td>
                  </tr>
                )}
                {error && (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-red-500">
                      Failed to load employees
                    </td>
                  </tr>
                )}
                {Array.isArray(data) && data.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-slate-500">
                      No employees found.
                    </td>
                  </tr>
                )}
                {Array.isArray(data) &&
                  data.map((emp: any) => (
                    <tr key={emp.id} className="even:bg-blue-50">
                      <td className="p-4 text-[15px] text-slate-900 font-medium">
                        {emp.employee_id}
                      </td>
                      <td className="p-4 text-[15px] text-slate-900 font-medium">
                        {emp.name}
                      </td>
                      <td className="p-4 text-[15px] text-slate-600 font-medium">
                        {emp.email}
                      </td>
                      <td className="p-4 text-[15px] text-slate-600 font-medium">
                        {emp.department}
                      </td>
                      <td className="p-4 text-[15px] text-slate-600 font-medium">
                        {emp.position}
                      </td>
                      <td className="p-4 text-[15px] text-slate-600 font-medium">
                        <h3
                          className="bg-green-600 flex items-center justify-center"
                          style={{
                            height: 30,
                            width: 110,
                            borderRadius: 20,
                            color: "white",
                          }}
                        >
                          {emp.status || "Regular"}
                        </h3>
                      </td>
                      <td className="p-4">
                        {/* Actions (edit/delete) */}
                        <div className="flex items-center">
                          <button className="mr-3 cursor-pointer" title="Edit">
                            {/* ...edit icon... */}
                          </button>
                          <button title="Delete" className="cursor-pointer">
                            {/* ...delete icon... */}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Employee Tab */}
      {activeTab === "add" && (
        <div id="settingContent" className="tab-content rounded-lg mt-6">
          <Form
            form={form}
            layout="vertical"
            onFinish={onAddEmployee}
            className="w-auto mx-auto mt-10 rounded-lg p-6  rounded shadow-md"
          >
            <div className="flex flex-row gap-6">
              <div className="flex flex-col rounded-lg p-4 bg-white ">
                <h2 className="text-xl font-bold mb-4 mt-4 ml-4">
                  Personal Information
                </h2>
                <div className="flex flex-row gap-4 ml-4">
                  <Form.Item
                    label="First Name"
                    name="first_name"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Last Name"
                    name="last_name"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item label="Middle Name" name="middle_name">
                    <Input />
                  </Form.Item>

                  <Form.Item label="Suffix" name="suffix">
                    <Select placeholder="Suffix">
                      <Option value="Single">Jr.</Option>
                      <Option value="Married">Sr.</Option>
                      <Option value="Widowed">II</Option>
                      <Option value="Widowed">III</Option>
                      <Option value="Widowed">IV</Option>
                    </Select>
                  </Form.Item>
                </div>

                <div className="flex flex-row gap-4 ml-4">
                  <Form.Item
                    label="Employee ID"
                    name="employee_id"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true }]}
                    className="w-69"
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Phone Number"
                    name="phone_no"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </div>

                <div className="flex flex-col ml-4">
                  <div className="flex flex-row gap-4">
                    <Form.Item
                      label="Date of Birth"
                      name="date_of_birth"
                      rules={[{ required: true }]}
                    >
                      <DatePicker className="w-full" />
                    </Form.Item>

                    <Form.Item
                      label="Gender"
                      name="gender"
                      rules={[{ required: true }]}
                    >
                      <Select placeholder="Select gender">
                        <Option value="Male">Male</Option>
                        <Option value="Female">Female</Option>
                        <Option value="Other">LGBTQ+</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      label="Civil Status"
                      name="civil_status"
                      rules={[{ required: true }]}
                    >
                      <Select placeholder="Select civil status">
                        <Option value="Single">Single</Option>
                        <Option value="Married">Married</Option>
                        <Option value="Widowed">Widowed</Option>
                      </Select>
                    </Form.Item>
                  </div>
                  <Form.Item
                    label="Address"
                    name="address"
                    rules={[{ required: true }]}
                    className="w-md"
                  >
                    <Input.TextArea />
                  </Form.Item>
                </div>
              </div>

              <div className="flex flex-col rounded-lg p-4 bg-white ">
                <h2 className="text-xl font-bold mb-4 mt-4 ml-4">
                  Government IDs
                </h2>
                <div className="flex flex-col">
                  <Form.Item
                    label="SSS"
                    name="sss"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Pag-IBIG"
                    name="pag_ibig"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="PhilHealth"
                    name="philhealth"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="TIN"
                    name="tin"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </div>
              </div>
            </div>

            <div className="flex flex-col p-4 bg-white">
              <h2 className="text-xl font-bold mt-4 mb-4">Work Information</h2>
              <div className="flex flex-row gap-6">
                <div className="flex flex-col ml-4">
                  <div className="flex flex-row gap-4">
                    <Form.Item
                      label="Start Date"
                      name="start_date"
                      rules={[{ required: true }]}
                    >
                      <DatePicker className="w-full" />
                    </Form.Item>

                    <Form.Item
                      label="Salary"
                      name="salary"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="Shift"
                      name="shift"
                      rules={[{ required: true }]}
                    >
                      <Select placeholder="Select shift">
                        {/* Populate dynamically from API */}
                        <Option value="1">Morning Shift</Option>
                        <Option value="2">Night Shift</Option>
                      </Select>
                    </Form.Item>
                  </div>

                  <div className="flex flex-row gap-4">
                    <Form.Item
                      label="Department"
                      name="department"
                      rules={[{ required: true }]}
                    >
                      <Select placeholder="Select department">
                        {/* Populate dynamically from API */}
                        <Option value="1">HR</Option>
                        <Option value="2">Engineering</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      label="Position"
                      name="position"
                      rules={[{ required: true }]}
                    >
                      <Select placeholder="Select position">
                        {/* Populate dynamically from API */}
                        <Option value="1">Manager</Option>
                        <Option value="2">Developer</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      label="Career Status"
                      name="career_status"
                      rules={[{ required: true }]}
                    >
                      <Select placeholder="Select status">
                        <Option value="Probationary">Probationay</Option>
                        <Option value="Regular">Regular</Option>
                        <Option value="Intern">Intern</Option>
                        <Option value="Traine">Traine</Option>
                      </Select>
                    </Form.Item>
                  </div>
                </div>
                   <Form.Item label="Incentives" name="incentives">
                    <Checkbox.Group
                      options={[
                        { label: "Bonus", value: "1" },
                        { label: "Health Allowance", value: "2" },
                      ]}
                    />
                  </Form.Item>

                  <Form.Item label="Work Days" name="work_days">
                    <Checkbox.Group
                      options={[
                        { label: "Monday", value: "mon" },
                        { label: "Tuesday", value: "tue" },
                        { label: "Wednesday", value: "wed" },
                        { label: "Thursday", value: "thu" },
                        { label: "Friday", value: "fri" },
                        { label: "Saturday", value: "sat" },
                        { label: "Sunday", value: "sun" },
                      ]}
                    />
                  </Form.Item>

                  <Form.Item label="On Call Days" name="on_call_days">
                    <Checkbox.Group
                      options={[
                        { label: "Monday", value: "mon" },
                        { label: "Tuesday", value: "tue" },
                        { label: "Wednesday", value: "wed" },
                        { label: "Thursday", value: "thu" },
                        { label: "Friday", value: "fri" },
                        { label: "Saturday", value: "sat" },
                        { label: "Sunday", value: "sun" },
                      ]}
                    />
                  </Form.Item>
              </div>
            </div>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Save Employee
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
      {/* Add Department and Position Tab */}
      {activeTab === "department_and_position" && (
        <div>{/* Department & Position Form goes here */}</div>
      )}
      {/* Add Shift Tab */}
      {activeTab === "shift" && <div>{/* Shift Form goes here */}</div>}
      {/* Add incentive Tab */}
      {activeTab === "incentive" && <div>{/* Incentive Form goes here */}</div>}
    </div>
  );
}
