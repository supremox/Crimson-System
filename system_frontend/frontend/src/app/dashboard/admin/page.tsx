"use client";
import { ConfigProvider, InputNumber, Tabs  } from 'antd'
import type { TabsProps } from 'antd';
import React from 'react'

import Accounts from './_component/Tab_Content/Accounts';


export default function Admin() {

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: <span className='ml-4 text-25 font-semibold'>Accounts</span>,
            children: <Accounts/>,
        },
        // {
        //     key: '2',
        //     label: <span className='text-25 font-semibold'>Permissions</span>,
        //     children: " ",
        // },
    ];

  return (
    <div className="p-4">
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
