import React, { useState } from 'react';
import { Button, DatePicker, Modal, Divider, ConfigProvider, Checkbox } from 'antd';
import type { CheckboxProps } from 'antd';
import { WalletOutlined } from '@ant-design/icons';
import dayjs from "dayjs";
import axiosInstance from '../../../../../server/instance_axios';

export default function GeneratePayroll() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const { RangePicker } = DatePicker;
    const [dateRange, setDateRange] = useState<(dayjs.Dayjs | null)[]>([]);

    // Send filter request to backend
    const handleFilter = async () => {
        if (!selected) {
            alert("Please select a deduction option.");
            return;
        }
        if (!selectedtype) {
            alert("Please select a payroll type.");
            return;
        }
        if (dateRange.length === 2 && dateRange[0] && dateRange[1]) {
        try {
            const res = await axiosInstance.post("/payroll/generate/", {
            start_date: dayjs(dateRange[0]).format("YYYY-MM-DD"),
            end_date: dayjs(dateRange[1]).format("YYYY-MM-DD"),
            deduction_option: selected,
            payroll_type: selectedtype
            });
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.error) {
            alert(error.response.data.error);
            }
            else {
            alert("Failed to Generate Payroll.");
            }
        } 
        } 
        else {
            alert("Please select a start and end date.");
        }

    };

    const [selected, setSelected] = useState<string | null>(null);
    const [selectedtype, setTypeSelected] = useState<string | null>(null);

    const handleCheckboxChange = (value: string) => {
        setSelected(prev => (prev === value ? null : value));
    };

    const handleTypeCheckboxChange = (value: string) => {
        setTypeSelected(prev => (prev === value ? null : value));
    };

    <ConfigProvider
        theme={{
            components: {
            Modal: {
                colorBgElevated: "transparent"
            },
            },
        }}
        >
        ...
    </ConfigProvider>

    return (
        <>
        <Button
            type="primary"
            icon={<WalletOutlined />}
            className="h-10 shadow-lg"
            onClick={showModal}
        >
            Generate Payroll
        </Button>

        <Modal
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={false}
        >
            <div className="flex flex-col p-5 gap-3">
                <h2 className="text-xl font-bold mb-4 mt-2">Payroll Generation</h2>

                <div className="flex flex-row gap-2">
                    <RangePicker
                        className="h-10 shadow-lg"
                        onChange={dates => setDateRange(dates ?? [])}
                    />
                    <div className="flex flex-row bg-white shadow-lg p-2 rounded-lg gap-2">
                        <Checkbox checked={selectedtype === 'first_cut_off'}  onChange={() => handleTypeCheckboxChange('first_cut_off')} >1st</Checkbox>
                        <Checkbox checked={selectedtype === 'second_cut_off'} onChange={() => handleTypeCheckboxChange('second_cut_off')} >2nd</Checkbox>
                    </div>
                </div>
            
                <div className="flex flex-row bg-white shadow-lg p-2 rounded-lg gap-4">
                    <Checkbox checked={selected === 'No Deduction'} onChange={() => handleCheckboxChange('No Deduction')} >No Deduction</Checkbox>
                    <Checkbox checked={selected === 'Per Cut-Off'}      onChange={() => handleCheckboxChange('Per Cut-Off')} >Per Cut-Off</Checkbox>
                    <Checkbox checked={selected === 'Second Cut-Off'}   onChange={() => handleCheckboxChange('Second Cut-Off')} >Second-Off</Checkbox>
                </div>
                
                <Button
                    icon={<WalletOutlined />}
                    type="primary"
                    className="h-10 mt-1 shadow-lg"
                    onClick={handleFilter}
                >
                    Generate Payroll
                </Button>
            </div>
        </Modal>
        </>

  )
}
