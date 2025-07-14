import { ConfigProvider, InputNumber, Tabs  } from 'antd'
import type { TabsProps } from 'antd';
import React from 'react'

import SssTab from '../Tab_Contribution/sss_tab';
import Pagibig_tab from '../Tab_Contribution/pagibig_tab';
import Philhealth_tab from '../Tab_Contribution/philhealth_tab';
import BIR_tab from '../Tab_Contribution/BIR_tab';

export default function Contribution() {

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: <span className='ml-4 text-25 font-semibold'>SSS</span>,
            children: <SssTab/>,
        },
        {
            key: '2',
            label: <span className='text-25 font-semibold'>Pag-Ibig</span>,
            children: <Pagibig_tab/>,
        },
        {
            key: '3',
            label: <span className='text-25 font-semibold'>Philhealth</span>,
            children: <Philhealth_tab/>,
        },
        {
            key: '4',
            label: <span className='text-25 font-semibold'>BIR Tax</span>,
            children: <BIR_tab/>,
        },
    ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mt-5">
        <ConfigProvider
            theme={{
                components: {
                Tabs: {
                    itemColor: "white"
                },
                Table: {
                    headerBg: "#155dfc"
                },
                },
            }}
        >
            <Tabs defaultActiveKey="1" items={items} tabBarStyle={{color:"white", backgroundColor: "#001529", borderRadius: 7}}  />
        </ConfigProvider>
    </div>
  )
}
