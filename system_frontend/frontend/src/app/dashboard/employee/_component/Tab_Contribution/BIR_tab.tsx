import React, { useState } from 'react'
import { Button, Input, Table, Flex, ConfigProvider, Alert } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import axiosInstance from '../../../../../../server/instance_axios';
import { getQueryClient } from '@/app/components/getQueryClient';

export default function BIR_tab() {
    const makeRow = (key: any) => ({
            key: key.toString(),
            frequency: "initial",
            min_compensation: 'initial',
            max_compensation: 'initial',
            base_tax: 'initial',
            percentage_over: 'initial',
            excess_over: 'initial',
           
    });
    
    const [dataSource, setDataSource] = useState([makeRow(0)]);
   const queryClient = getQueryClient();
    
    const [inputs, setInputs] = useState({
        compensation_from: '',
        compensation_to: '',
        employer_rate: '',
        employee_rate: ''
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
        const { compensation_from, compensation_to, employer_rate, employee_rate } = inputs;

        const payload = {
            "compensation_from": compensation_from,
            "compensation_to": compensation_to,
            "employer_rate": employer_rate,
            "employee_rate": employee_rate
        };

        console.log("Table Input", payload);

         if (
            !compensation_from.trim() ||
            !compensation_to.trim() ||
            !employer_rate.trim() ||
            !employee_rate.trim()
        ) {
            setErrorMessage("All fields are required.");
            return;
        }

        try {
            const res = await axiosInstance.post(`/payroll/bir/create/`, payload);
            alert("BIR Rate Added Successfully!");

            queryClient.invalidateQueries({ queryKey: ["bir"] });

            // Optional: reset inputs after success
            setInputs({
                compensation_from: '',
                compensation_to: '',
                employer_rate: '',
                employee_rate: ''
            });
        } 
        catch (error: any) {
            if (error.response?.data?.error) {
                alert(error.response.data.error);
            } 
            else {
                alert("Failed to add Pag-Ibig rate.");
            }
        }
    };
    
    const handleDelete = (key: any) => {
        setDataSource(dataSource.filter(item => item.key !== key));
    };

    const columns = [
        {
            title: 'Frequency',
            dataIndex: 'frequency',
            render: (value: any, record: any) => value === 'initial' ? <Input className='shadow-md' style={{backgroundColor: "white"}}/> : value
        },
         {
            title: 'Minimum Salary',
            dataIndex: 'min_compensation',
            render: (value: any, record: any) => value === 'initial' ? <Input className='shadow-md' style={{backgroundColor: "white"}} /> : value,
        },
        {
            title: 'Maximum Salary',
            dataIndex: 'max_compensation',
            render: (value: any, record: any) => value === 'initial' ? <Input className='shadow-md' style={{backgroundColor: "white"}} /> : value,
        },
        {
            title: 'Base Tax',
            dataIndex: 'base_tax',
            render: (value: any, record: any) => value === 'initial' ? <Input className='shadow-md' style={{backgroundColor: "white"}}/> : value
        },
        {
            title: 'Percentage',
            dataIndex: 'percentage_over',
            render: (value: any, record: any) => value === 'initial' ? <Input className='shadow-md' style={{backgroundColor: "white"}}/> : value
        },
        {
            title: 'Excess Over',
            dataIndex: 'excess_over',
            render: (value: any, record: any) => value === 'initial' ? <Input className='shadow-md' style={{backgroundColor: "white"}}/> : value
        },
        {
            title: '',
            dataIndex: 'action',
            width: '50px',
            render: (_: any, record: any) => (
                <>
                <Button icon={<PlusOutlined/>} shape="circle" onClick={handleAdd} style={{backgroundColor: "white"}}/>
                {/* <Button icon={<DeleteOutlined />} shape="circle" danger onClick={handleDelete}/> */}
                </>
            )
        }
    ];

    const datacolumns = [
        {
            title: 'Frequency',
            dataIndex: 'frequency',
            render: (value: any, record: any) => <span>Semi-Monthly</span>
        },
        {
            title: 'Minimum Salary',
            dataIndex: 'min_compensation',
            render: (value: any, record: any) => <span>0.00</span>
        },
        {
            title: 'Maximum Salary',
            dataIndex: 'max_compensation',
            render: (value: any, record: any) => <span>10440</span>
        },
        {
            title: 'Base Tax',
            dataIndex: 'base_tax',
            render: (value: any, record: any) => <span>0.0</span>
        },
        {
            title: 'Percentage',
            dataIndex: 'percentage_over',
            render: (value: any, record: any) => <span>0.0</span>
        },
        {
            title: 'Excess Over',
            dataIndex: 'excess_over',
            render: (value: any, record: any) => <span>0.0</span>
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
                dataSource={dataSource}
                pagination={false}
                className='shadow-lg'
            />
           
        </div>
    )
}
