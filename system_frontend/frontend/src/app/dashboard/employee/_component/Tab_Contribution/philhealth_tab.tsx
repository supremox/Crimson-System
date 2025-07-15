import React, { useState } from 'react'
import { Button, Input, Table, Flex, ConfigProvider, Alert, TableProps, InputNumber } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import axiosInstance from '../../../../../../server/instance_axios';
import { getQueryClient } from '@/app/components/getQueryClient';
import { GetPayrollRecord } from '@/app/hooks/useGetPayroll';

export default function Philhealth_tab() {
    const makeRow = (key: any) => ({
            key: key.toString(),
            compensation_from: 'initial',
            compensation_to: 'initial',
            employee_rate: 'initial',
            employer_rate: 'initial',
           
    });
    
    const [dataSource, setDataSource] = useState([makeRow(0)]);

    const { useGetPhilhealth } = GetPayrollRecord()
    const {data: philhealth_list , isLoading} = useGetPhilhealth()
    const queryClient = getQueryClient();
    
    const [inputs, setInputs] = useState({
        compensation_from: 0,
        compensation_to: 0,
        employer_rate: 0,
        employee_rate: 0
    });

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setInputs(prev => ({
            ...prev,
            [name]: value
        }));
    };

      // For InputNumber — a separate handler
    const handleNumberChange = (name: string, value: number | null) => {
        setInputs(prev => ({
            ...prev,
            [name]: value !== null ? value : 0 
        }));
    };


    const [errorMessage, setErrorMessage] = useState('');

    const handleAdd = async () => {
        const { compensation_from, compensation_to, employer_rate, employee_rate } = inputs;

        const payload = {
            "salary_floor": compensation_from,
            "salary_ceiling": compensation_to,
            "employer_rate": employer_rate,
            "employee_rate": employee_rate
        };

        console.log("Table Input", payload);

        //  if (
        //     !compensation_from ||
        //     !compensation_to ||
        //     !employer_rate ||
        //     !employee_rate
        // ) {
        //     setErrorMessage("All fields are required.");
        //     return;
        // }

        try {
            const res = await axiosInstance.post(`/payroll/philhealth/create/`, payload);
            alert("PhilhealthRate Added Successfully!");

            queryClient.invalidateQueries({ queryKey: ["philhealth"] });

            // Optional: reset inputs after success
            // setInputs({
            //     compensation_from: 0,
            //     compensation_to: 0,
            //     employer_rate: 0,
            //     employee_rate: 0
            // });
        } 
        catch (error: any) {
            if (error.response?.data?.error) {
                alert(error.response.data.error);
            } 
            else {
            setErrorMessage("Failed to add Philhealth rate!");
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
                style={{width: 250}}
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
                style={{width: 250}}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                onChange={(value) => handleNumberChange('compensation_to', value)}
                />      
        },
        {
            title: 'Employer Rate',
            dataIndex: 'employer_rate',
            render: () => <InputNumber<number>
                defaultValue={0.00}
                name='employer_rate'
                style={{width: 250}}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                onChange={(value) => handleNumberChange('employer_rate', value)}
                />      
        },
        {
            title: 'Employee Rate',
            dataIndex: 'employee_rate',
            render: () => <InputNumber<number>
                defaultValue={0.00}
                name='employee_rate'
                style={{width: 250}}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                onChange={(value) => handleNumberChange('employee_rate', value)}
                />        
        },
        {
            title: '',
            dataIndex: 'action',
            width: '50px',
            render: () => (
                <>
                <Button icon={<PlusOutlined style={{color: "white"}}/>} shape="circle" onClick={handleAdd} style={{backgroundColor: "#388E3C"}}/>
                {/* <Button icon={<DeleteOutlined />} shape="circle" danger onClick={handleDelete}/> */}
                </>
            )
        }
    ];

    const datacolumns: TableProps['columns'] = [
        {
            title: 'Minimum Salary',
            dataIndex: 'compensation_from',
            render: (_, record) => <span>{record.salary_floor}</span>
        },
        {
            title: 'Maximum Salary',
            dataIndex: 'compensation_to',
            render: (_, record) => <span>{record.salary_ceiling}</span>,
        },
        {
            title: 'Employer Rate',
            dataIndex: 'employer_rate',
            render: (_, record) => <span>{record.employer_rate}</span>
        },
        {
            title: 'Employee Rate',
            dataIndex: 'employee_rate',
            render: (_, record) => <span>{record.employee_rate}</span>
        },
        {
            title: '',
            dataIndex: 'action',
            width: '50px',
            render: () => (
                <>
                <div className="flex flex-row gap-2">
                    <Button icon={<EditOutlined/>} shape="circle"  />
                    <Button icon={<DeleteOutlined />} shape="circle" danger />
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
                    columns={datacolumns}
                    dataSource={philhealth_list}
                    rowClassName={(record, index) => `${index % 2 === 0 ? 'bg-white' : 'bg-[#fbfbfb]'} custom-hover-row`}
                    pagination={false}
                    rowKey={(row) => row.id}
                    scroll={{ x: 'max-content', y: 400 }}
                    className="shadow-lg no-scrollbar-table"
                />
            </ConfigProvider>
            
        </div>
    )
}
