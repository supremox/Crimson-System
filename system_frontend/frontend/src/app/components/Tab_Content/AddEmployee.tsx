import { Button, Checkbox, DatePicker, Form, Input, Select, SelectProps } from 'antd'
import React, { useState } from 'react'
import axiosInstance from '../../../../server/instance_axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import dayjs from "dayjs";
import { getQueryClient } from '../getQueryClient'; 

/** queries */
import { GetEmployeesRecord } from '@/app/hooks/useGetEmployeesRecord';
import { AxiosError } from 'axios';

type EmployeeFieldType = {
  first_name: string;
  last_name: string;
  middle_name: string;
  suffix: string;
  employee_id: string;
  email: string;
  phone_no: string;
  date_of_birth: Date;
  gender: string;
  civil_status: string;
  educational_attainment: string;
  address: string;
  sss: string;
  pag_ibig: string;
  philhealth: string;
  tin: string;
  start_date: Date;
  salary: string;
  shift_id: string;
  department_id: string;
  position_id: string;
  status: string;
  incentives_id: string;
  work_days: string;
  on_call_days: string;
};

export default function AddEmployee() {

    const { useGetDepartmentPosition, useGetIncentives, useGetShift, useGetDepartments} = GetEmployeesRecord();
    const queryClient = getQueryClient();

    const [employeeForm] = Form.useForm();

    const { Option } = Select;
    
    const handleChange = (value: string[]) => {
        console.log(`selected ${value}`);
    };

    const { mutate: mutate_employee } = useMutation({
        mutationFn: async (data: EmployeeFieldType) => {
        return await axiosInstance.post("/employee/name/", data);
        },
    });

    const onAddEmployee = (values: any) => {
        const employeeformattedValues: EmployeeFieldType = {
          ...values,
          date_of_birth: values.date_of_birth
            ? dayjs(values.date_of_birth).format("YYYY-MM-DD")
            : "",
          start_date: values.start_date
            ? dayjs(values.start_date).format("YYYY-MM-DD")
            : "",
        };
        // console.log('Employee Data', employeeformattedValues);
        mutate_employee(employeeformattedValues, {
          onSuccess: (data) => {
            if (data.status === 201) {
              queryClient.invalidateQueries({ queryKey: ["employees"] });
              alert(data.data.message);
              console.log(data.data.employee.employee_id);
            }
          },
          onError: (error) => {
            alert(error);
          },
        });
      };

    const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
          null
    );

    const { data: departmentPosition, isSuccess } = useGetDepartmentPosition(selectedDepartment);

    // console.log("department pos", departmentPosition?.data)

    const departmenthandleChange = (value: string) => {
        // console.log(`selected ${value}`);
        setSelectedDepartment(value);
        // Optionally reset position field in the form
        employeeForm.setFieldsValue({ position: undefined });
    };

     // Fetch shift data from backend
    const { data: shift } = useGetShift()
    const { data: incentives, isLoading, error } = useGetIncentives()
    const { data: departments } = useGetDepartments()

    return (
        <div id="settingContent" className="tab-content mt-2 mx-8">
            <Form
                form={employeeForm}
                layout="vertical"
                onFinish={onAddEmployee}
                className="rounded-lg p-4"
            >
                <div className="grid grid-cols-1 rounded-lg p-6 grid-rows-5 gap-4">
                    <div className="col-span-4 row-span-3">
                        <div className="flex flex-row gap-5">

                            {/* Personal Information fields */}
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

                                        <Form.Item
                                        label="Educational Attainment"
                                        name="educational_attainment"
                                        rules={[{ required: true }]}
                                        >
                                        <Select placeholder="Educational Attainment">
                                            <Option value="Associate degree">
                                            Associate degree
                                            </Option>
                                            <Option value="Bachelor's degree">
                                            Bachelor's degree
                                            </Option>
                                            <Option value="Master's degree">
                                            Master's degree
                                            </Option>
                                            <Option value="PhD degree">PhD degree</Option>
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

                            {/* Government IDs */}
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
                    {/* Work Information */}
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
                                        name="shift_id"
                                        rules={[{ required: true }]}
                                        >
                                        <Select
                                            placeholder="Select Shift"
                                            onChange={handleChange}
                                            options={shift?.map((shft: any) => ({
                                            label: shft.shift_name,
                                            value: shft.id,
                                            }))}
                                        />
                                        </Form.Item>
                                    </div>

                                    <div className="flex flex-row gap-4">
                                        <Form.Item
                                        label="Department"
                                        name="department_id"
                                        className="w-40"
                                        rules={[{ required: true }]}
                                        >
                                        <Select
                                            placeholder="Department"
                                            onChange={departmenthandleChange}
                                            options={departments.map((dept: any) => ({
                                            label: dept.department_name,
                                            value: dept.id,
                                            }))}
                                        />
                                        </Form.Item>

                                        <Form.Item
                                        label="Position"
                                        name="position_id"
                                        className="w-40"
                                        rules={[{ required: true }]}
                                        >
                                        <Select
                                            style={{ width: "100%" }}
                                            placeholder="position"
                                            onChange={handleChange}
                                            options={departmentPosition?.positions?.map((pos: any) => ({
                                            label: pos.position_name,
                                            value: pos.id,
                                            }))}
                                        />
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
                                    <Form.Item label="Incentives" name="incentives_id">
                                        <Select
                                        mode="multiple"
                                        allowClear
                                        style={{ width: "100%" }}
                                        placeholder="Incentive"
                                        onChange={handleChange}
                                        loading={isLoading}
                                        options={incentives?.map((inc: any) => ({
                                            label: inc.incentive_name,
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
    )
}
