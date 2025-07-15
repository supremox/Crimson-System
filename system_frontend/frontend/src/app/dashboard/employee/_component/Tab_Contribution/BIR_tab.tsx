import React, { useState } from 'react'
import { Button, Input, Table, Flex, ConfigProvider, Alert, TableProps, InputNumber, Select } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import axiosInstance from '../../../../../../server/instance_axios';
import { getQueryClient } from '@/app/components/getQueryClient';
import { GetPayrollRecord } from '@/app/hooks/useGetPayroll';

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
    const { Option } = Select;
    const [dataSource, setDataSource] = useState([makeRow(0)]);
    
    const { useGetBir } = GetPayrollRecord()
    const {data: bir_list , isLoading} = useGetBir()
    
    const queryClient = getQueryClient();
    
    const [inputs, setInputs] = useState({
        frequency: '',
        min_compensation: 0,
        max_compensation: 0,
        base_tax: 0,
        percentage_over: 0,
        excess_over: 0,
    });

    const handleInputSelect = (name: string, value: string) => {
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
        const { frequency, min_compensation, max_compensation, base_tax, percentage_over, excess_over  } = inputs;

        const payload = {
            "frequency": frequency,
            "min_compensation": min_compensation,
            "max_compensation": max_compensation,
            "base_tax": base_tax,
            "percentage_over": percentage_over,
            "excess_over": excess_over,
        };

        console.log("Table Input", payload);


        try {
            const res = await axiosInstance.post(`/payroll/bir/create/`, payload);
            alert("BIR Rate Added Successfully!");

            queryClient.invalidateQueries({ queryKey: ["bir"] });

            // Optional: reset inputs after success
            // setInputs({
            //     frequency: '',
            //     min_compensation: 0,
            //     max_compensation: 0,
            //     base_tax: 0,
            //     percentage_over: 0,
            //     excess_over: 0
            // });
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
            render: () => <Select 
                            placeholder={<span className='text-black'>Frequency</span>} 
                            style={{width: 200}} 
                            onChange={(value) => handleInputSelect('frequency', value)}
                        >
                            <Option value="daily">Daily</Option>
                            <Option value="weekly">Weekly</Option>
                            <Option value="semi-monthly">Semi-Monthly</Option>
                            <Option value="monthly">Monthly</Option>
                        </Select>
        },
        {
            title: 'Minimum Salary',
            dataIndex: 'min_compensation',
            render: () => <InputNumber<number>
                defaultValue={0.00}
                name='min_compensation'
                style={{width: 150}}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                onChange={(value) => handleNumberChange('min_compensation', value)}
                />         
        },
        {
            title: 'Maximum Salary',
            dataIndex: 'max_compensation',
            render: () => <InputNumber<number>
                defaultValue={0.00}
                name='max_compensation'
                style={{width: 150}}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                onChange={(value) => handleNumberChange('max_compensation', value)}
                />         
        },
        {
            title: 'Base Tax',
            dataIndex: 'base_tax',
            render: () => <InputNumber<number>
                defaultValue={0.00}
                name='base_tax'
                style={{width: 150}}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                onChange={(value) => handleNumberChange('base_tax', value)}
                />         
        },
        {
            title: 'Percentage',
            dataIndex: 'percentage_over',
            render: () => <InputNumber<number>
                defaultValue={0.00}
                name='percentage_over'
                style={{width: 150}}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                onChange={(value) => handleNumberChange('percentage_over', value)}
                />         
        },
        {
            title: 'Excess Over',
            dataIndex: 'excess_over',
            render: () => <InputNumber<number>
                defaultValue={0.00}
                name='excess_over'
                style={{width: 150}}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                onChange={(value) => handleNumberChange('excess_over', value)}
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
            title: 'Frequency',
            // dataIndex: 'frequency',
            render: (_, record) => <span>{record.frequency}</span>
        },
        {
            title: 'Minimum Salary',
            // dataIndex: 'min_compensation',
            render: (_, record) => <span>{record.min_compensation}</span>
        },
        {
            title: 'Maximum Salary',
            // dataIndex: 'max_compensation',
            render: (_, record) => <span>{record.max_compensation}</span>
        },
        {
            title: 'Base Tax',
            // dataIndex: 'base_tax',
            render: (_, record) => <span>{record.base_tax}</span>
        },
        {
            title: 'Percentage',
            // dataIndex: 'percentage_over',
            render: (_, record) => <span>{record.percentage_over}</span>
        },
        {
            title: 'Excess Over',
            // dataIndex: 'excess_over',
            render: (_, record) => <span>{record.excess_over}</span>
        },
        {
            title: '',
            // dataIndex: 'action',
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
                    columns={datacolumns}
                    dataSource={bir_list}
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
