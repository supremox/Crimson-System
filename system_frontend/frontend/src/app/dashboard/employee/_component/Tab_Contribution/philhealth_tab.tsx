import React, { useState } from 'react'
import { Button, Input, Table, Flex, ConfigProvider, Alert } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import axiosInstance from '../../../../../../server/instance_axios';
import { getQueryClient } from '@/app/components/getQueryClient';

export default function Philhealth_tab() {
    const makeRow = (key: any) => ({
            key: key.toString(),
            compensation_from: 'initial',
            compensation_to: 'initial',
            employee_rate: 'initial',
            employer_rate: 'initial',
           
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
            const res = await axiosInstance.post(`/payroll/philhealth/create/`, payload);
            alert("PhilhealthRate Added Successfully!");

            queryClient.invalidateQueries({ queryKey: ["philhealth"] });

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
            title: 'Minimum Salary',
            dataIndex: 'compensation_from',
            render: (value: any, record: any) => value === 'initial' ? <Input className='shadow-md'/> : value
        },
        {
            title: 'Maximum Salary',
            dataIndex: 'compensation_to',
            render: (value: any, record: any) => value === 'initial' ? <Input className='shadow-md' /> : value,
        },
        {
            title: 'Employer Rate',
            dataIndex: 'employer_rate',
            render: (value: any, record: any) => value === 'initial' ? <Input className='shadow-md' /> : value
        },
        {
            title: 'Employee Rate',
            dataIndex: 'employee_rate',
            render: (value: any, record: any) => value === 'initial' ? <Input className='shadow-md' /> : value
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

    const datacolumns = [
        {
            title: 'Minimum Salary',
            dataIndex: 'compensation_from',
            render: (value: any, record: any) => <span>Vince</span>
        },
        {
            title: 'Maximum Salary',
            dataIndex: 'compensation_to',
            render: (value: any, record: any) => <span>Vince</span>,
        },
        {
            title: 'Employer Rate',
            dataIndex: 'employer_rate',
            render: (value: any, record: any) => <span>Vince</span>
        },
        {
            title: 'Employee Rate',
            dataIndex: 'employee_rate',
            render: (value: any, record: any) => <span>Vince</span>
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
