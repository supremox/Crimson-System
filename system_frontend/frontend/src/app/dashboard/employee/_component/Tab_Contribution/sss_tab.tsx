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
        compensation_from: 0,
        compensation_to: 0,
        total_credit: 0,
        employer_total: 0,
        employee_total: 0,
        overall_total: 0
    });

    // For InputNumber — a separate handler
    const handleNumberChange = (name: string, value: number | null) => {
        setInputs(prev => ({
            ...prev,
            [name]: value !== null ? value : 0 
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

        // const isEmpty = (value: number) => value === 0 || value === null || value === undefined;

        // if (
        //     isEmpty(compensation_from) ||
        //     isEmpty(compensation_to) ||
        //     isEmpty(total_credit) ||
        //     isEmpty(employee_total) ||
        //     isEmpty(employer_total) ||
        //     isEmpty(overall_total)
        // ) {
        //     setErrorMessage("All fields are required.");
        //     return;
        // }

        try {
            const res = await axiosInstance.post(`/payroll/sss/create/`, payload);
            alert("SSS Rate Added Successfully!");

            queryClient.invalidateQueries({ queryKey: ["sss"] });

        } 
        catch (error: any) {
            if (error.response?.data?.error) {
                alert(error.response.data.error);
            } 
            else {
            setErrorMessage("Failed to create SSS rule");
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
            render: () => <InputNumber<number>
                defaultValue={0.00}
                name='compensation_from'
                style={{width: 150}}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                onChange={(value) => handleNumberChange('compensation_from', value)}
                />            
        }, 
        {
            title: 'Maximum Salary',
            dataIndex: 'compensation_to',
            render: () => <InputNumber<number>
                defaultValue={0.00}
                name='compensation_to'
                style={{width: 150}}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                onChange={(value) => handleNumberChange('compensation_to', value)}
                />        
        },
        {
            title: 'Monthly Salary Credit Total',
            dataIndex: 'total_credit',
            render: () => <InputNumber<number>
                defaultValue={0.00}
                name='total_credit'
                style={{width: 150}}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                onChange={(value) => handleNumberChange('total_credit', value)}
                />        
        },
        {
            title: 'Employeer Total',
            dataIndex: 'employer_total',
            render: () => <InputNumber<number>
                defaultValue={0.00}
                name='employer_total'
                style={{width: 150}}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                onChange={(value) => handleNumberChange('employer_total', value)}
                />       
        },
        {
            title: 'Employee Total',
            dataIndex: 'employee_total',
            render: () => <InputNumber<number>
                defaultValue={0.00}
                name='employee_total'
                style={{width: 150}}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                onChange={(value) => handleNumberChange('employee_total', value)}
                />       
        },
        {
            title: 'Over all Total',
            dataIndex: 'overall_total',
            render: () => <InputNumber<number>
                defaultValue={0.00}
                name='overall_total'
                style={{width: 150}}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                onChange={(value) => handleNumberChange('overall_total', value)}
                />       
        },
        {
            title: '',
            dataIndex: 'action',
            width: '50px',
            render: (_: any, record: any) => (
                <>
                <Button icon={<PlusOutlined style={{color: "white"}}/>} shape="circle" onClick={handleAdd} style={{backgroundColor: "#388E3C"}} />
                {/* <Button icon={<DeleteOutlined />} shape="circle" danger onClick={handleDelete}/> */}
                </>
            )
        }
    ];

    const datacolumns: TableProps['columns'] = [
        {
            title: 'Minimum Salary',
            dataIndex: 'compensation_from',
            render: (_: any, record: any) => <span>{record.compensation_from}</span>,
            // onCell: () => ({
            //     className: 'border-x-2 border-blue-400',
            // }),
        },
        {
            title: 'Maximum Salary',
            dataIndex: 'compensation_to',
            render: (value: any, record: any) => <span>{record.compensation_to}</span>,
        },
        {
            title: 'Monthly Salary Credit',
            dataIndex: 'total_credit',
            render: (value: any, record: any) => <span>{record.total_credit}</span>,
        },
        {
            title: 'Employeer Total',
            dataIndex: 'employer_total',
            render: (value: any, record: any) => <span>{record.employer_total}</span>,
        },
        {
            title: 'Employee Total',
            dataIndex: 'employee_total',
            render: (value: any, record: any) => <span>{record.employee_total}</span>,
        },
        {
            title: 'Over all Total',
            dataIndex: 'overall_total',
            render: (value: any, record: any) => <span>{record.overall_total}</span>,
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
            ),
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
            <ConfigProvider
                theme={{
                    components: {
                        Table: {
                            rowHoverBg: "#6596FF",    
                        },
                    },
                }}
            >
                <Table
                    size="small"
                    // showHeader={false}
                    // rowSelection={rowSelection}
                    rowClassName={(record, index) => `${index % 2 === 0 ? 'bg-white' : 'bg-[#fbfbfb]'} custom-hover-row`}
                    columns={datacolumns}
                    dataSource={sss_list}
                    pagination={false}
                    rowKey={(row) => row.id}
                    scroll={{
                        x: 'max-content',
                        y: 400,
                    }}
                    className="shadow-lg no-scrollbar-table "
                />
            </ConfigProvider>
        </div>
    );
}
