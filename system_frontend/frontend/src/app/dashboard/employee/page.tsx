"use client";

import { useState } from "react";
import useSWR from "swr";
import axiosInstance from "../../../../server/instance_axios";
import { useMutation, useQuery } from "@tanstack/react-query";

import { getQueryClient } from "@/app/components/getQueryClient";

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
  SelectProps,
  TimePicker,
} from "antd";

import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import { Dayjs } from "dayjs";
import dayjs from "dayjs";

interface DepartmentModel {
  department_name: string;
}

type DepartmentFieldType = {
  department_name: string;
};

type PositionFieldType = {
  position_name: string;
};

const queryClient = getQueryClient();

export default function EmployeePage() {
  // Tab state: "employee" or "add"
  const [employeeForm] = Form.useForm();
  const [departmentForm] = Form.useForm();
  const [positionForm] = Form.useForm();
  const [shiftForm] = Form.useForm();
  const [incentiveForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState<
    "employee" | "add" | "department_and_position" | "shift" | "incentive"
  >("employee");

  const { Option } = Select;

  const options: SelectProps["options"] = [];

  const fetcher = (url: string) =>
    axiosInstance.get(url).then((res) => res.data);

  const handleChange = (value: string[]) => {
    console.log(`selected ${value}`);
  };

  const [value, setValue] = useState<Dayjs | null>(null);

  const onTimeChange = (time: Dayjs) => {
    setValue(time);
  };

  // Fetch employee data from backend
  const {
    data: employees,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["employees"],
    queryFn: () => fetcher("/employee/name/"),
  });

  // Fetch incentives data from backend
  const { data: incentives } = useQuery({
    queryKey: ["incentives"],
    queryFn: () => fetcher("/employee/incentives/name/"),
  });

  // Fetch department data from backend
  const { data: department } = useQuery({
    queryKey: ["department"],
    queryFn: () => fetcher("/employee/departments/dropdown/"),
  });

  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: () => fetcher("/employee/departments/names/"),
  });

  // Fetch position data from backend
  const { data: position } = useQuery({
    queryKey: ["position"],
    queryFn: () => fetcher("/employee/position/names/"),
  });
  console.log(departments, department);

  // Fetch shift data from backend
  const { data: shift } = useQuery({
    queryKey: ["shift"],
    queryFn: () => fetcher("/employee/shifts/names/"),
  });

  const { data: incentive } = useQuery({
    queryKey: ["incentive"],
    queryFn: () => fetcher("/employee/incentives/name/"),
  });

  const { mutate: mutate_department } = useMutation({
    mutationFn: async (data: DepartmentFieldType) => {
      return await axiosInstance.post("/employee/departments/names/", data);
    },
  });

  const { mutate: mutate_position } = useMutation({
    mutationFn: async (data: PositionFieldType) => {
      return await axiosInstance.post("/employee/position/names/", data);
    },
  });

  const onAddEmployee = (values: any) => {
    // TODO: Call backend to add employee
    console.log(values);
  };

  const onAddDepartment = (values: any) => {
    console.log(values);
    mutate_department(values, {
      onSuccess: (data) => {
        if (data.status === 200) {
          queryClient.invalidateQueries({ queryKey: ["departments"] });
        }
      },
      onError: (error) => {
        alert(error);
      },
    });
  };

  const onAddPosition = (values: any) => {
    console.log(values);
    mutate_position(values, {
      onSuccess: (data) => {
        if (data.status === 200) {
          queryClient.invalidateQueries({ queryKey: ["position"] });
        }
      },
      onError: (error) => {
        alert(error);
      },
    });
  };

  const onAddShift = (values: any) => {
    // TODO: Call backend to add shift
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
                {Array.isArray(employees) && employees.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-slate-500">
                      No employees found.
                    </td>
                  </tr>
                )}
                {Array.isArray(employees) &&
                  employees.map((emp: any) => (
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
        <div id="settingContent" className="tab-content mt-2 mx-8">
          <Form
            form={employeeForm}
            layout="vertical"
            onFinish={onAddEmployee}
            className="rounded-lg p-4"
          >
            <div className="grid grid-cols-5 rounded-lg p-6 grid-rows-5 gap-4">
              <div className="col-span-4 row-span-3">
                <div className="flex flex-row gap-5">
                  <div className="flex flex-1 flex-col rounded-lg p-4 shadow-lg bg-white ">
                    <h2 className="text-xl font-bold mb-4 ml-4 mt-4">
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
                          <Option value="Jr">Jr.</Option>
                          <Option value="Sr">Sr.</Option>
                          <Option value="II">II</Option>
                          <Option value="III">III</Option>
                          <Option value="IV">IV</Option>
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
                  <div className="flex flex-col rounded-lg p-4 shadow-lg bg-white ">
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
              </div>

              <div className="col-span-4 row-span-10 row-start-4">
                <div className="flex flex-col p-4 rounded-lg shadow-lg bg-white">
                  <h2 className="text-xl font-bold mt-5 mb-4 ml-4">
                    Work Information
                  </h2>
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
                            {department?.results?.length > 0
                              ? department.results.map((dept: any) => (
                                  <Option key={dept.id} value={dept.id}>
                                    {dept.name}
                                  </Option>
                                ))
                              : null}
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

                      <Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          className="mt-5 ml-40"
                        >
                          Save Employee
                        </Button>
                      </Form.Item>
                    </div>

                    <div className="flex flex-col">
                      <Form.Item label="Incentives" name="incentives">
                        <Select
                          mode="multiple"
                          allowClear
                          style={{ width: "100%" }}
                          placeholder="Incentive"
                          onChange={handleChange}
                          options={incentives.map((inc: any) => ({
                            label: inc.name,
                            value: inc.id,
                          }))}
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
                </div>
              </div>
            </div>
          </Form>
        </div>
      )}

      {/* Add Department and Position Tab */}
      {activeTab === "department_and_position" && (
        <div id="deptTab" className="tab-content mt-2 mx-8">
          <div className="grid grid-cols-5 grid-rows-5 mt-7 gap-4">
            <div className="col-span-2 row-span-5">
              <div className="flex flex-col rounded-lg p-4 shadow-lg bg-white">
                <h2 className="text-xl font-bold mb-4 ml-2 mt-2">
                  Departments
                </h2>

                <Form
                  form={departmentForm}
                  layout="vertical"
                  onFinish={onAddDepartment}
                  className="rounded-lg p-4"
                >
                  <div className="flex flex-row gap-4">
                    <Form.Item
                      label="Department Name"
                      name="department_name"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="mt-7.5"
                      >
                        Create Department
                      </Button>
                    </Form.Item>
                  </div>
                </Form>

                <div className="overflow-x-auto mx-5 shadow-md">
                  <table className="w-full bg-white">
                    <thead className="bg-gray-800 whitespace-nowrap">
                      <tr>
                        <th className="p-4 text-left text-sm font-medium text-white">
                          Dept_ID
                        </th>
                        <th className="p-4 text-left text-sm font-medium text-white">
                          Department Name
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
                          <td
                            colSpan={7}
                            className="p-4 text-center text-red-500"
                          >
                            Failed to load Departments
                          </td>
                        </tr>
                      )}
                      {Array.isArray(departments) &&
                        departments.length === 0 && (
                          <tr>
                            <td
                              colSpan={7}
                              className="p-4 text-center text-slate-500"
                            >
                              No Department found.
                            </td>
                          </tr>
                        )}
                      {Array.isArray(departments) &&
                        departments.map((dept: any) => (
                          <tr key={dept.id} className="even:bg-blue-50">
                            <td className="p-4 text-[15px] text-blue-900 font-medium">
                              {dept.id}
                            </td>
                            <td className="p-4 text-[15px] text-blue-900 font-medium">
                              {dept.department_name}
                            </td>
                            <td className="p-4">
                              {/* Actions (edit/delete) */}
                              <div className="flex items-center">
                                <button
                                  className="mr-3 cursor-pointer text-blue-600 hover:text-blue-800"
                                  title="Update"
                                >
                                  <EditOutlined />
                                </button>
                                <button
                                  className="cursor-pointer text-red-600 hover:text-red-800"
                                  title="Delete"
                                >
                                  <DeleteOutlined />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-span-3 row-span-5 col-start-3">
              <div className="flex flex-col rounded-lg p-4 shadow-lg bg-white">
                <h2 className="text-xl font-bold mb-4 ml-2 mt-2">Positions</h2>
                <Form
                  form={positionForm}
                  layout="vertical"
                  onFinish={onAddPosition}
                  className="rounded-lg p-4"
                >
                  <div className="flex flex-row gap-4">
                    <Form.Item
                      label="Position Name"
                      name="position_name"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="Department"
                      name="department"
                      className="text-blue-950"
                      rules={[{ required: true }]}
                    >
                      <Select placeholder="Select department">
                        {Array.isArray(departments) &&
                          departments.length === 0 && (
                           <span>No Departments</span>
                          )}
                        {Array.isArray(departments) &&
                          departments.map((dept: any) => (
                            <Option key={dept.id} value={dept.department_name}>
                                {dept.department_name}
                              </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="mt-7.5"
                      >
                        Create Position
                      </Button>
                    </Form.Item>
                  </div>
                </Form>

                <div className="overflow-x-auto mx-5 shadow-md">
                  <table className="w-full bg-white">
                    <thead className="bg-gray-800 whitespace-nowrap">
                      <tr>
                        <th className="p-4 text-left text-sm font-medium text-white">
                          Pos_ID
                        </th>
                        <th className="p-4 text-left text-sm font-medium text-white">
                          Position
                        </th>
                        <th className="p-4 text-left text-sm font-medium text-white">
                          Department
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
                          <td
                            colSpan={7}
                            className="p-4 text-center text-red-500"
                          >
                            Failed to load Positions
                          </td>
                        </tr>
                      )}
                      {Array.isArray(position) && position.length === 0 && (
                        <tr>
                          <td
                            colSpan={7}
                            className="p-4 text-center text-slate-500"
                          >
                            No Position found.
                          </td>
                        </tr>
                      )}
                      {Array.isArray(position) &&
                        position.map((pos: any) => (
                          <tr key={pos.id} className="even:bg-blue-950">
                            <td className="p-4 text-[15px] text-slate-900 font-medium">
                              {pos.pos_id}
                            </td>
                            <td className="p-4 text-[15px] text-slate-900 font-medium">
                              {pos.name}
                            </td>
                            <td className="p-4 text-[15px] text-slate-900 font-medium">
                              {pos.department}
                            </td>
                            <td className="p-4">
                              {/* Actions (edit/delete) */}
                              <div className="flex items-center">
                                <button
                                  className="mr-3 cursor-pointer text-blue-600 hover:text-blue-800"
                                  title="Update"
                                >
                                  <EditOutlined />
                                </button>
                                <button
                                  className="cursor-pointer text-red-600 hover:text-red-800"
                                  title="Delete"
                                >
                                  <DeleteOutlined />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Shift Tab */}
      {activeTab === "shift" && (
        <div id="deptTab" className="tab-content mt-2 mx-8">
          <Form
            form={shiftForm}
            layout="vertical"
            onFinish={onAddShift}
            className="rounded-lg p-4"
          >
            <div className="grid grid-cols-5 grid-rows-5 mt-7 gap-4">
              <div className="col-span-2 row-span-5">
                <div className="flex flex-col rounded-lg p-4 shadow-lg bg-white">
                  <h2 className="text-xl font-bold mb-4 ml-2 mt-2">
                    Shift Creation
                  </h2>
                  <div className="flex flex-col ml-20 mt-4 gap-4">
                    <Form.Item
                      label="Shift Name"
                      name="shift_name"
                      className="w-75"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>

                    <div className="flex flex-row gap-6">
                      <Form.Item label="Shift Start Time" name="shiftStartTime">
                        <TimePicker value={value} onChange={onTimeChange} />
                      </Form.Item>

                      <Form.Item label="Shift End Time" name="shiftEndTime">
                        <TimePicker value={value} onChange={onTimeChange} />
                      </Form.Item>
                    </div>

                    <div className="flex flex-row gap-6">
                      <Form.Item
                        label="Shift Break Start"
                        name="shiftBreakStart"
                      >
                        <TimePicker value={value} onChange={onTimeChange} />
                      </Form.Item>

                      <Form.Item label="Shift Break End" name="shiftBreakEnd">
                        <TimePicker value={value} onChange={onTimeChange} />
                      </Form.Item>
                    </div>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="ml-25"
                      >
                        Create Shift
                      </Button>
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="col-span-3 row-span-5 col-start-3">
                <div className="flex flex-col rounded-lg p-4 shadow-lg bg-white">
                  <h2 className="text-xl font-bold mb-4 ml-2 mt-2">Shifts</h2>

                  <div className="overflow-x-auto shadow-md">
                    <table className="w-full bg-white">
                      <thead className="bg-gray-800 whitespace-nowrap">
                        <tr>
                          <th className="p-4 text-left text-sm font-medium text-white">
                            Shift_ID
                          </th>
                          <th className="p-4 text-left text-sm font-medium text-white">
                            Shift Name
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
                            <td
                              colSpan={7}
                              className="p-4 text-center text-red-500"
                            >
                              Failed to load Positions
                            </td>
                          </tr>
                        )}
                        {Array.isArray(shift) && shift.length === 0 && (
                          <tr>
                            <td
                              colSpan={7}
                              className="p-4 text-center text-slate-500"
                            >
                              No shift found.
                            </td>
                          </tr>
                        )}
                        {Array.isArray(shift) &&
                          shift.map((shft: any) => (
                            <tr key={shft.id} className="even:bg-blue-50">
                              <td className="p-4 text-[15px] text-slate-900 font-medium">
                                {shft.shift_id}
                              </td>
                              <td className="p-4 text-[15px] text-slate-900 font-medium">
                                {shft.shiftname}
                              </td>
                              <td className="p-4">
                                {/* Actions (edit/delete) */}
                                <div className="flex items-center">
                                  <button
                                    className="mr-3 cursor-pointer text-blue-600 hover:text-blue-800"
                                    title="Update"
                                  >
                                    <EditOutlined />
                                  </button>
                                  <button
                                    className="cursor-pointer text-red-600 hover:text-red-800"
                                    title="Delete"
                                  >
                                    <DeleteOutlined />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </div>
      )}

      {/* Add incentive Tab */}
      {activeTab === "incentive" && (
        <div id="deptTab" className="tab-content mt-2 mx-8">
          <Form
            form={incentiveForm}
            layout="vertical"
            onFinish={onAddShift}
            className="rounded-lg p-4"
          >
            <div className="grid grid-cols-5 grid-rows-5 mt-7 gap-4">
              <div className="col-span-2 row-span-5">
                <div className="flex flex-col rounded-lg p-4 shadow-lg bg-white">
                  <h2 className="text-xl font-bold mb-4 ml-2 mt-2">
                    Incentive Creation
                  </h2>
                  <div className="flex flex-col ml-20 mt-4 gap-4">
                    <Form.Item
                      label="Incentive Name"
                      name="incentive_name"
                      className="w-75"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="Incentive Amount"
                      name="incentive_value"
                      className="w-75"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="ml-25"
                      >
                        Create Incentive
                      </Button>
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="col-span-3 row-span-5 col-start-3">
                <div className="flex flex-col rounded-lg p-4 shadow-lg bg-white">
                  <h2 className="text-xl font-bold mb-4 ml-2 mt-2">
                    Incentive
                  </h2>

                  <div className="overflow-x-auto shadow-md">
                    <table className="w-full bg-white">
                      <thead className="bg-gray-800 whitespace-nowrap">
                        <tr>
                          <th className="p-4 text-left text-sm font-medium text-white">
                            Incentive_ID
                          </th>
                          <th className="p-4 text-left text-sm font-medium text-white">
                            Incentive Name
                          </th>
                          <th className="p-4 text-left text-sm font-medium text-white">
                            Incentive Value
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
                            <td
                              colSpan={7}
                              className="p-4 text-center text-red-500"
                            >
                              Failed to load Incentives
                            </td>
                          </tr>
                        )}
                        {Array.isArray(incentive) && incentive.length === 0 && (
                          <tr>
                            <td
                              colSpan={7}
                              className="p-4 text-center text-slate-500"
                            >
                              No Incentive found.
                            </td>
                          </tr>
                        )}
                        {Array.isArray(incentive) &&
                          incentive.map((inctve: any) => (
                            <tr key={inctve.id} className="even:bg-blue-50">
                              <td className="p-4 text-[15px] text-slate-900 font-medium">
                                {inctve.incentive_id}
                              </td>
                              <td className="p-4 text-[15px] text-slate-900 font-medium">
                                {inctve.incentive_name}
                              </td>
                              <td className="p-4 text-[15px] text-slate-900 font-medium">
                                {inctve.incentive_value}
                              </td>
                              <td className="p-4">
                                {/* Actions (edit/delete) */}
                                <div className="flex items-center">
                                  <button
                                    className="mr-3 cursor-pointer text-blue-600 hover:text-blue-800"
                                    title="Update"
                                  >
                                    <EditOutlined />
                                  </button>
                                  <button
                                    className="cursor-pointer text-red-600 hover:text-red-800"
                                    title="Delete"
                                  >
                                    <DeleteOutlined />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </div>
      )}
    </div>
  );
}
