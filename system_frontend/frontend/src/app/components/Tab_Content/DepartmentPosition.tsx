import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Form, Input, Select } from 'antd'
import React from 'react'
import { getQueryClient } from '../getQueryClient';
import { GetEmployeesRecord } from '@/app/hooks/useGetEmployeesRecord';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../../../../server/instance_axios';

type DepartmentFieldType = {
  department_name: string;
};

type PositionFieldType = {
  position_name: string;
  department: string;
};



export default function DepartmentPosition() {
  
  const { useGetPosition, useGetDepartments} = GetEmployeesRecord();
  const queryClient = getQueryClient();
  const [departmentForm] = Form.useForm();
  const [positionForm] = Form.useForm();

  const { Option } = Select;

  const { data: departments, isLoading, error } = useGetDepartments()
  const { data: position } = useGetPosition()

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


  const onAddDepartment = (values: any) => {
    mutate_department(values, {
      onSuccess: (data) => {
        if (data.status === 201) {
          queryClient.invalidateQueries({ queryKey: ["departments"] });
        }
      },
      onError: (error) => {
        alert(error);
      },
    });
  };

  const onAddPosition = (values: any) => {
    mutate_position(values, {
      onSuccess: (data) => {
        if (data.status === 201) {
          queryClient.invalidateQueries({ queryKey: ["position"] });
        }
      },
      onError: (error) => {
        alert(error);
      },
    });
  };



  return (
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
                          <tr key={pos.id} className="even:bg-gray-200">
                            <td className="p-4 text-[15px] text-slate-900 font-medium">
                              {pos.id}
                            </td>
                            <td className="p-4 text-[15px] text-slate-900 font-medium">
                              {pos.position_name}
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
  )
}
