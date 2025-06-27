import { GetEmployeesRecord } from '@/app/hooks/useGetEmployeesRecord';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Form, Input } from 'antd'
import React from 'react'
import { getQueryClient } from '../getQueryClient';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../../../../server/instance_axios';

type IncentiveFieldType = {
  incentive_name: string;
  incentive_amount: string;
};


export default function IncetiveCreate() {
    const { useGetIncentives } = GetEmployeesRecord();
    const queryClient = getQueryClient();
    const [incentiveForm] = Form.useForm();

    const { data: incentive, isLoading, error } = useGetIncentives()

    const { mutate: mutate_incentive } = useMutation({
        mutationFn: async (data: IncentiveFieldType) => {
        return await axiosInstance.post("/employee/incentives/name/", data);
        },
    });

  
    const onAddIncentive = (values: any) => {
        mutate_incentive(values, {
        onSuccess: (data) => {
            if (data.status === 201) {
            queryClient.invalidateQueries({ queryKey: ["incentive"] });
            }
        },
        onError: (error) => {
            alert(error);
        },
        });
    };

    return (
        <div id="IncetiveTab" className="tab-content mt-2 mx-8">
          <Form
            form={incentiveForm}
            layout="vertical"
            onFinish={onAddIncentive}
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
                      name="incentive_amount"
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
                                {inctve.id}
                              </td>
                              <td className="p-4 text-[15px] text-slate-900 font-medium">
                                {inctve.incentive_name}
                              </td>
                              <td className="p-4 text-[15px] text-slate-900 font-medium">
                                {inctve.incentive_amount}
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
  )
}
