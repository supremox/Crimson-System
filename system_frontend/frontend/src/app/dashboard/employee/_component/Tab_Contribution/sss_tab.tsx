import React, { useState } from 'react';
import { Button, Input, Table, Flex, ConfigProvider, Alert, TableProps, InputNumber } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import axiosInstance from '../../../../../../server/instance_axios';
import { getQueryClient } from '@/app/components/getQueryClient';
import { GetPayrollRecord } from '@/app/hooks/useGetPayroll';

export default function SssTab() {
    const makeRow = (key: any) => ({
        key: key.toString(),
        compensation_from: 'initial',
        compensation_to: 'initial',
        total_credit: 'initial',
        employer_total: 'initial',
        employee_total: 'initial',
        overall_total: 'initial',
    });

    const { useGetSSS } = GetPayrollRecord()
    const {data: sss_list , isLoading} = useGetSSS()

    const [dataSource, setDataSource] = useState([makeRow(0)]);
    const queryClient = getQueryClient();
    
    const [inputs, setInputs] = useState({
        compensation_from: '',
        compensation_to: '',
        total_credit: '',
        employer_total: '',
        employee_total: '',
        overall_total: ''
    });

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setInputs(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const [errorMessage, setErrorMessage] = useState('');

    const handleAdd = async () => {
        const { compensation_from, compensation_to, total_credit, employee_total, employer_total, overall_total} = inputs;

        const payload = {
            "compensation_from": compensation_from,
            "compensation_to": compensation_to,
            "total_credit": total_credit,
            "employee_total": employee_total,
            "employer_total": employer_total,
            "overall_total": overall_total,
        };

        console.log("Table Input", payload);

         if (
            !compensation_from.trim() ||
            !compensation_to.trim() ||
            !total_credit.trim() ||
            !employee_total.trim() ||
            !employer_total.trim() ||
            !overall_total.trim()
        ) {
            setErrorMessage("All fields are required.");
            return;
        }

        try {
            const res = await axiosInstance.post(`/payroll/sss/create/`, payload);
            alert("SSS Rate Added Successfully!");

            queryClient.invalidateQueries({ queryKey: ["sss"] });

            // Optional: reset inputs after success
            setInputs({
                compensation_from: '',
                compensation_to: '',
                total_credit: '',
                employer_total: '',
                employee_total: '',
                overall_total: '',
            });
        } 
        catch (error: any) {
            if (error.response?.data?.error) {
                alert(error.response.data.error);
            } 
            else {
                alert("Failed to add SSS rate.");
            }
        }
    };


    const handleDelete = (key: any) => {
        setDataSource(dataSource.filter(item => item.key !== key));
    };

    const columns = [
        {
            title: 'Minimum Salary',
            dataIndex: 'compensation_from',
            render: (value: any, record: any) => <Input className='shadow-md' name='compensation_from' onChange={handleInputChange}/>
            
        }, 
        {
            title: 'Maximum Salary',
            dataIndex: 'compensation_to',
            render: (value: any, record: any) => <Input className='shadow-md' name='compensation_to' onChange={handleInputChange}/>
        },
        {
            title: 'Monthly Salary Credit',
            dataIndex: 'total_credit',
            render: (value: any, record: any) => <Input className='shadow-md' name='total_credit' onChange={handleInputChange}/>
        },
        {
            title: 'Employeer Total',
            dataIndex: 'employer_total',
            render: (value: any, record: any) => <Input className='shadow-md' name='employer_total' onChange={handleInputChange}/>
        },
        {
            title: 'Employee Total',
            dataIndex: 'employee_total',
            render: (value: any, record: any) => <Input className='shadow-md' name='employee_total' onChange={handleInputChange}/>
        },
        {
            title: 'Over all Total',
            dataIndex: 'overall_total',
            render: (value: any, record: any) => <Input className='shadow-md' name='overall_total' onChange={handleInputChange}/>
        },
        {
            title: '',
            dataIndex: 'action',
            width: '50px',
            render: (_: any, record: any) => (
                <>
                <Button icon={<PlusOutlined/>} shape="circle" onClick={handleAdd} />
                {/* <Button icon={<DeleteOutlined />} shape="circle" danger onClick={handleDelete}/> */}
                </>
            )
        }
    ];

    const datacolumns: TableProps['columns'] = [
        {
            title: 'Minimum Salary',
            dataIndex: 'compensation_from',
            render: (_: any, record: any) => <span>{record.compensation_from}</span>
        },
        {
            title: 'Maximum Salary',
            dataIndex: 'compensation_to',
            render: (value: any, record: any) => <span>{record.compensation_to}</span>,
        },
        {
            title: 'Monthly Salary Credit',
            dataIndex: 'total_credit',
            render: (value: any, record: any) => <span>{record.total_credit}</span>
        },
        {
            title: 'Employeer Total',
            dataIndex: 'employer_total',
            render: (value: any, record: any) => <span>{record.employer_total}</span>
        },
        {
            title: 'Employee Total',
            dataIndex: 'employee_total',
            render: (value: any, record: any) => <span>{record.employee_total}</span>
        },
        {
            title: 'Over all Total',
            dataIndex: 'overall_total',
            render: (value: any, record: any) => <span>{record.overall_total}</span>
        },
        {
            title: '',
            dataIndex: 'action',
            width: '50px',
            render: (_: any, record: any) => (
                <>
                <div className="flex flex-row gap-2">
                    <Button icon={<EditOutlined/>} shape="circle"  />
                    <Button icon={<DeleteOutlined />} shape="circle" danger onClick={handleDelete}/>
                </div>
                </>
            )
        }
    ];

    return (
        <div className='flex flex-col gap-2'>          
             <ConfigProvider
                theme={{
                    components: {
                        Table: {
                            headerBg: "#388E3C"
                            
                        },
                    },
                }}
            >
                {errorMessage && (
                    <Alert
                        message={errorMessage}
                        type="error"
                        showIcon
                        banner
                        closable
                        onClose={() => setErrorMessage("")}
                    />
                )}
                <Table
                    size="small"
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                    className='shadow-lg'
                    style={{marginTop: 0}}
                />
            </ConfigProvider>
             <Table
                size="small"
                // showHeader={false}
                // rowSelection={rowSelection}
                columns={datacolumns}
                dataSource={sss_list}
                pagination={false}
                className='shadow-lg'
            />
        </div>
    );
}
