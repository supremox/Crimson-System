"use client";

import React, { useEffect, useState } from "react";
import { Button, Checkbox, DatePicker, Form, Input, Modal, Select } from "antd";

import { GetEmployeesRecord } from "@/app/hooks/useGetEmployeesRecord";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../../../../server/instance_axios";
import dayjs from "dayjs";
import { getQueryClient } from "@/app/components/getQueryClient";

interface UpdateEmployeeProps {
  id: number;
}

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

export default function UpdateEmployee(props: UpdateEmployeeProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { useGetEmployeeDetail, useGetDepartments, useGetShift, useGetIncentives, useGetDepartmentPosition } = GetEmployeesRecord();
    const { data: employeeDetail, isLoading, isSuccess: employeeSuccess } = useGetEmployeeDetail(props.id)
    const [openResponsive, setOpenResponsive] = useState(false);
    console.log(employeeDetail)
    const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

    useEffect(() => {
        if (employeeSuccess) {
            setSelectedDepartment(employeeDetail.department.id)
        }
    }, [employeeSuccess])

    const { data: shift } = useGetShift()
    const { data: incentives} = useGetIncentives()
    const { data: departments } = useGetDepartments()
    const { data: departmentPosition, isSuccess } = useGetDepartmentPosition(selectedDepartment);
    console.log(selectedDepartment)
    const [employeeForm] = Form.useForm();

    const queryClient = getQueryClient();

    const { mutate: mutate_update_employee } = useMutation({
        mutationFn: async (data: EmployeeFieldType) => {
        return await axiosInstance.put(`/employee/detailed/${props.id}/`, data);
        },
    });

    const { Option } = Select;

    
    const departmenthandleChange = (value: string) => {
        setSelectedDepartment(value);
        employeeForm.setFieldsValue({ position_id: undefined });
    };

    // console.log(employeeForm.getFieldValue('position.id'))

    const handleChange = (value: string[]) => {
        console.log(`selected ${value}`);
    };

    const handleFieldsChange = (changedFields: any, allFields: any) => {
      console.log('Changed:', changedFields);
      // console.log('All:', allFields);
    };

    const onUpdateEmployee = (values: any) => {
        const employeeformattedValues: EmployeeFieldType = {
          ...values,
          date_of_birth: values.date_of_birth
            ? dayjs(values.date_of_birth).format("YYYY-MM-DD")
            : "",
          start_date: values.start_date
            ? dayjs(values.start_date).format("YYYY-MM-DD")
            : "",
        };
        
        console.log('Employee Data', employeeformattedValues);
        mutate_update_employee(employeeformattedValues, {
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

        if (isLoading) {
            return <Button loading></Button>
        }

  return (
    <>
      <Button size="small" type="primary" onClick={() => setOpenResponsive(true)}>
        Update
      </Button>
      <Modal
        closable={{ "aria-label": "Custom Close Button" }}
        open={openResponsive}
        onOk={() => setOpenResponsive(false)}
        onCancel={() => setOpenResponsive(false)}
        width={{
          xs: "90%",
          sm: "80%",
          md: "70%",
          lg: "60%",
          xl: "50%",
          xxl: "40%",
        }}
        footer={false}
        mask={true}
      >
        <div className="grid grid-cols-1 gap-4">
          <Form
            form={employeeForm}
            layout="vertical"
            onFinish={onUpdateEmployee}
            onFieldsChange={handleFieldsChange}
            className="rounded-lg p-4"
          >
            <div className="col-span-2 row-span-2 mb-4 bg-white shadow-lg rounded-lg">
              <div className="flex flex-1 flex-col rounded-lg p-4">
                <h2 className="text-xl font-bold mb-4 ml-4 mt-4">
                  Personal Information
                </h2>
                {/* Personal Information */}
                <div className="flex flex-row gap-4 ml-4">
                  <Form.Item
                    label="First Name"
                    name="first_name"
                    initialValue={employeeDetail.first_name}
                    rules={[{ required: true }]}
                  >
                    <Input/>
                  </Form.Item>

                  <Form.Item
                    label="Last Name"
                    name="last_name"
                    initialValue={employeeDetail.last_name}
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item label="Middle Name" name="middle_name" initialValue={employeeDetail.middle_name}>
                    <Input />
                  </Form.Item>

                  <Form.Item label="Suffix" name="suffix" initialValue={employeeDetail.suffix}>
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
                    initialValue={employeeDetail.employee_id}
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name="email"
                    initialValue={employeeDetail.email}
                    rules={[{ required: true }]}
                    className="w-69"
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Phone Number"
                    name="phone_no"
                    initialValue={employeeDetail.phone_no}
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
                      initialValue={dayjs(employeeDetail.date_of_birth)} 
                      rules={[{ required: true }]}
                    >
                      <DatePicker className="w-full" />
                    </Form.Item>

                    <Form.Item
                      label="Gender"
                      name="gender"
                      initialValue={employeeDetail.gender}
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
                      initialValue={employeeDetail.civil_status}
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
                      initialValue={employeeDetail.educational_attainment}
                      rules={[{ required: true }]}
                    >
                      <Select placeholder="Educational Attainment">
                        <Option value="Associate degree">
                          Associate degree
                        </Option>
                        <Option value="Bachelor's degree">
                          Bachelor's degree
                        </Option>
                        <Option value="Master's degree">Master's degree</Option>
                        <Option value="PhD degree">PhD degree</Option>
                      </Select>
                    </Form.Item>
                  </div>
                  <Form.Item
                    label="Address"
                    name="address"
                    initialValue={employeeDetail.address}
                    rules={[{ required: true }]}
                    className="w-md"
                  >
                    <Input.TextArea />
                  </Form.Item>
                </div>
              </div>
            </div>
            {/* Government IDs */}
            <div className="col-span-2 row-start-3 mb-4 bg-white shadow-lg rounded-lg">
              <div className="flex flex-col rounded-lg p-4 shadow-lg">
                <h2 className="text-xl font-bold mb-2 mt-4 ml-2">
                  Government IDs
                </h2>
                <div className="flex flex-row mt-6 gap-4">
                  <Form.Item
                    label="SSS"
                    name="sss"
                    initialValue={employeeDetail.sss}
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Pag-IBIG"
                    name="pag_ibig"
                    initialValue={employeeDetail.pag_ibig}
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="PhilHealth"
                    name="philhealth"
                    initialValue={employeeDetail.philhealth}
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="TIN"
                    name="tin"
                    initialValue={employeeDetail.tin}
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </div>
              </div>
            </div>
            {/* Work Informations */}
            <div className="col-span-2 row-span-2 row-start-4 bg-white shadow-lg rounded-lg">
              <div className="flex flex-col p-4 rounded-lg">
                <h2 className="text-xl font-bold mt-5 mb-4 ml-4">
                  Work Information
                </h2>
                <div className="flex flex-row gap-6">
                  <div className="flex flex-col ml-4">
                    <div className="flex flex-row gap-4">
                      <Form.Item
                        label="Start Date"
                        name="start_date"
                        initialValue={dayjs(employeeDetail.start_date)} 
                        rules={[{ required: true }]}
                      >
                        <DatePicker className="w-full" />
                      </Form.Item>

                      <Form.Item
                        label="Salary"
                        name="salary"
                        initialValue={employeeDetail.salary}
                        rules={[{ required: true }]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        label="Shift"
                        name="shift_id"
                        initialValue={employeeDetail.shift.id}
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

                      <Form.Item
                        label="Incentives"
                        name="incentives_id"
                        initialValue={employeeDetail.incentives.map((inc: any) => inc.id)} // []
                        className="w-60"
                      >
                        <Select
                          mode="multiple"
                          allowClear
                          placeholder="Incentive"
                          onChange={handleChange}
                          options={incentives?.map((inc: any) => ({
                            label: inc.incentive_name,
                            value: inc.id,
                          }))}
                        />
                      </Form.Item>
                    </div>

                    <div className="flex flex-row gap-4">
                      <Form.Item
                        label="Department"
                        name="department_id"
                        className="w-40"
                        initialValue={selectedDepartment}
                        rules={[{ required: true }]}
                      >
                        <Select
                          placeholder="Department"
                          onChange={departmenthandleChange}
                          options={departments?.map((dept: any) => ({
                            label: dept.department_name,
                            value: dept.id,
                          }))}
                        />
                      </Form.Item>

                      <Form.Item
                        label="Position"
                        name="position_id"
                        className="w-40"
                        initialValue={employeeDetail.position.id}
                        rules={[{ required: true }]}
                      >
                        <Select
                          style={{ width: "100%" }}
                          placeholder="position"
                          onChange={handleChange}
                          options={departmentPosition?.positions?.map(
                            (pos: any) => ({
                              label: pos.position_name,
                              value: pos.id,
                            })
                          )}
                        />
                      </Form.Item>

                      <Form.Item
                        label="Career Status"
                        name="career_status"
                        initialValue={employeeDetail.career_status}
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

                    <Form.Item label="Work Days" name="work_days" initialValue={employeeDetail.working_days_display.map((inc: any) => inc.day)}>
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

                    <Form.Item label="On Call Days" name="on_call_days" initialValue={employeeDetail.on_call_days_display.map((inc: any) => inc.day)}>
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

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="mt-5 ml-65"
                      >
                        Update Employee
                      </Button>
                    </Form.Item>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
}
