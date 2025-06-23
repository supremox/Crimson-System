"use client";


import useSWR from 'swr';
import { fetcher } from '@/app/fetcher';
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/app/components/ReactQueryProvider"; 
import axios from 'axios'
import axiosInstance from "../../../../server/instance_axios";



import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Input,
  DatePicker,
  Select,
  Form,
  FormProps,
} from "antd";
import { RightOutlined, LeftOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

interface CalendarEventsModel {
  date: string;
  event: string;
  event_type: string;
  description: string;
}

type FieldType = {
    date: string;
    event: string;
    event_type: string;
    description?: string;
  };

export default function EmployeePage() {

  const { data: user } = useSWR('/auth/userv2/me', fetcher);
  
 

  return (
   <div className="p-4">
          <ul className="flex w-max border-b border-gray-300 space-x-4 overflow-hidden">
              <li id="homeTab"
                  className="tab text-white font-semibold bg-blue-600 text-center text-[15px] py-2.5 px-6 rounded-tl-2xl rounded-tr-2xl cursor-pointer">
                  Employee</li>
              <li id="settingTab"
                  className="tab text-slate-600 font-semibold bg-gray-200 text-center text-[15px] py-2.5 px-6 rounded-tl-2xl rounded-tr-2xl cursor-pointer">
                  Add Employee</li>
          </ul>

          <div id="homeContent" className="tab-content mx-8 mt-8">
            <h2
              className="bg-blue-600 flex font-medium text-l items-center justify-center ml-0 mb-5"
              style={{ height: 50, width: 200, borderRadius: 10, color: "white" }}
            >
              List of Employees
            </h2>
            <div className="overflow-x-auto shadow-md">
                <table className="w-full bg-white ">
                    <thead className="bg-gray-800 whitespace-nowrap">
                    <tr>
                        <th className="p-4 text-left text-sm font-medium text-white">
                        Employee ID
                        </th>
                        <th className="p-4 text-left text-sm font-medium text-white">
                        Name
                        </th>
                        <th className="p-4 text-left text-sm font-medium text-white">
                        Email
                        </th>
                        <th className="p-4 text-left text-sm font-medium text-white">
                        Department
                        </th>
                        <th className="p-4 text-left text-sm font-medium text-white">
                        Role
                        </th>
                        <th className="p-4 text-left text-sm font-medium text-white">
                        Status
                        </th>
                        <th className="p-4 text-left text-sm font-medium text-white">
                        Actions
                        </th>
                    </tr>
                    </thead>

                    <tbody className="whitespace-nowrap">

                    <tr className="even:bg-blue-50">
                        <td className="p-4 text-[15px] text-slate-900 font-medium">
                        2025001
                        </td>
                        <td className="p-4 text-[15px] text-slate-900 font-medium">
                        John Doe
                        </td>
                        <td className="p-4 text-[15px] text-slate-600 font-medium">
                        john@example.com
                        </td>
                        <td className="p-4 text-[15px] text-slate-600 font-medium">
                        Research and Development
                        </td>
                        <td className="p-4 text-[15px] text-slate-600 font-medium">
                        Back-end Developer
                        </td>
                        <td className="p-4 text-[15px] text-slate-600 font-medium">
                          <h3 className="bg-green-600 flex items-center justify-center" 
                            style= {{height:30, width:110, borderRadius: 20, color: "white"}}>
                            Regular               
                          </h3>
                        </td>
                        
                        

                        <td className="p-4">
                        <div className="flex items-center">
                            <button className="mr-3 cursor-pointer" title="Edit">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-blue-500 hover:fill-blue-700"
                                viewBox="0 0 348.882 348.882">
                                <path
                                d="m333.988 11.758-.42-.383A43.363 43.363 0 0 0 304.258 0a43.579 43.579 0 0 0-32.104 14.153L116.803 184.231a14.993 14.993 0 0 0-3.154 5.37l-18.267 54.762c-2.112 6.331-1.052 13.333 2.835 18.729 3.918 5.438 10.23 8.685 16.886 8.685h.001c2.879 0 5.693-.592 8.362-1.76l52.89-23.138a14.985 14.985 0 0 0 5.063-3.626L336.771 73.176c16.166-17.697 14.919-45.247-2.783-61.418zM130.381 234.247l10.719-32.134.904-.99 20.316 18.556-.904.99-31.035 13.578zm184.24-181.304L182.553 197.53l-20.316-18.556L294.305 34.386c2.583-2.828 6.118-4.386 9.954-4.386 3.365 0 6.588 1.252 9.082 3.53l.419.383c5.484 5.009 5.87 13.546.861 19.03z"
                                data-original="#000000" />
                                <path
                                d="M303.85 138.388c-8.284 0-15 6.716-15 15v127.347c0 21.034-17.113 38.147-38.147 38.147H68.904c-21.035 0-38.147-17.113-38.147-38.147V100.413c0-21.034 17.113-38.147 38.147-38.147h131.587c8.284 0 15-6.716 15-15s-6.716-15-15-15H68.904C31.327 32.266.757 62.837.757 100.413v180.321c0 37.576 30.571 68.147 68.147 68.147h181.798c37.576 0 68.147-30.571 68.147-68.147V153.388c.001-8.284-6.715-15-14.999-15z"
                                data-original="#000000" />
                            </svg>
                            </button>
                            <button title="Delete" className="cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-red-500 hover:fill-red-700" viewBox="0 0 24 24">
                                <path
                                d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                                data-original="#000000" />
                                <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                                data-original="#000000" />
                            </svg>
                            </button>
                        </div>
                        </td>
                    </tr>

                    <tr className="even:bg-blue-50">
                        <td className="p-4 text-[15px] text-slate-900 font-medium">
                        2025002
                        </td>
                        <td className="p-4 text-[15px] text-slate-900 font-medium">
                        Jane Smith
                        </td>
                        <td className="p-4 text-[15px] text-slate-600 font-medium">
                        jane@example.com
                        </td>
                        <td className="p-4 text-[15px] text-slate-600 font-medium">
                        Accounting 
                        </td>
                        <td className="p-4 text-[15px] text-slate-600 font-medium">
                        Accounting Officer
                        </td>
                        <td className="p-4 text-[15px] text-slate-600 font-medium">
                          <h3 className="bg-green-600 flex items-center justify-center" 
                            style= {{height:30, width:110, borderRadius: 20, color: "white"}}>
                            Regular               
                          </h3>
                        </td>
                        <td className="p-4">
                        <div className="flex items-center">
                            <button className="mr-3 cursor-pointer" title="Edit">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-blue-500 hover:fill-blue-700"
                                viewBox="0 0 348.882 348.882">
                                <path
                                d="m333.988 11.758-.42-.383A43.363 43.363 0 0 0 304.258 0a43.579 43.579 0 0 0-32.104 14.153L116.803 184.231a14.993 14.993 0 0 0-3.154 5.37l-18.267 54.762c-2.112 6.331-1.052 13.333 2.835 18.729 3.918 5.438 10.23 8.685 16.886 8.685h.001c2.879 0 5.693-.592 8.362-1.76l52.89-23.138a14.985 14.985 0 0 0 5.063-3.626L336.771 73.176c16.166-17.697 14.919-45.247-2.783-61.418zM130.381 234.247l10.719-32.134.904-.99 20.316 18.556-.904.99-31.035 13.578zm184.24-181.304L182.553 197.53l-20.316-18.556L294.305 34.386c2.583-2.828 6.118-4.386 9.954-4.386 3.365 0 6.588 1.252 9.082 3.53l.419.383c5.484 5.009 5.87 13.546.861 19.03z"
                                data-original="#000000" />
                                <path
                                d="M303.85 138.388c-8.284 0-15 6.716-15 15v127.347c0 21.034-17.113 38.147-38.147 38.147H68.904c-21.035 0-38.147-17.113-38.147-38.147V100.413c0-21.034 17.113-38.147 38.147-38.147h131.587c8.284 0 15-6.716 15-15s-6.716-15-15-15H68.904C31.327 32.266.757 62.837.757 100.413v180.321c0 37.576 30.571 68.147 68.147 68.147h181.798c37.576 0 68.147-30.571 68.147-68.147V153.388c.001-8.284-6.715-15-14.999-15z"
                                data-original="#000000" />
                            </svg>
                            </button>
                            <button title="Delete" className="cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-red-500 hover:fill-red-700" viewBox="0 0 24 24">
                                <path
                                d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                                data-original="#000000" />
                                <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                                data-original="#000000" />
                            </svg>
                            </button>
                        </div>
                        </td>
                    </tr>

                    <tr className="even:bg-blue-50">
                        <td className="p-4 text-[15px] text-slate-900 font-medium">
                        2025003
                        </td>
                        <td className="p-4 text-[15px] text-slate-900 font-medium">
                        Alen Doe
                        </td>
                        <td className="p-4 text-[15px] text-slate-600 font-medium">
                        alen@example.com
                        </td>
                        <td className="p-4 text-[15px] text-slate-600 font-medium">
                        Engineering
                        </td>
                        <td className="p-4 text-[15px] text-slate-600 font-medium">
                        ECE
                        </td>
                        <td className="p-4 text-[15px] text-slate-600 font-medium">
                          <h3 className="bg-green-600 flex items-center justify-center" 
                            style= {{height:30, width:110, borderRadius: 20, color: "white"}}>
                            Regular               
                          </h3>
                        </td>
                        <td className="p-4">
                        <div className="flex items-center">
                            <button className="mr-3 cursor-pointer" title="Edit">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-blue-500 hover:fill-blue-700"
                                viewBox="0 0 348.882 348.882">
                                <path
                                d="m333.988 11.758-.42-.383A43.363 43.363 0 0 0 304.258 0a43.579 43.579 0 0 0-32.104 14.153L116.803 184.231a14.993 14.993 0 0 0-3.154 5.37l-18.267 54.762c-2.112 6.331-1.052 13.333 2.835 18.729 3.918 5.438 10.23 8.685 16.886 8.685h.001c2.879 0 5.693-.592 8.362-1.76l52.89-23.138a14.985 14.985 0 0 0 5.063-3.626L336.771 73.176c16.166-17.697 14.919-45.247-2.783-61.418zM130.381 234.247l10.719-32.134.904-.99 20.316 18.556-.904.99-31.035 13.578zm184.24-181.304L182.553 197.53l-20.316-18.556L294.305 34.386c2.583-2.828 6.118-4.386 9.954-4.386 3.365 0 6.588 1.252 9.082 3.53l.419.383c5.484 5.009 5.87 13.546.861 19.03z"
                                data-original="#000000" />
                                <path
                                d="M303.85 138.388c-8.284 0-15 6.716-15 15v127.347c0 21.034-17.113 38.147-38.147 38.147H68.904c-21.035 0-38.147-17.113-38.147-38.147V100.413c0-21.034 17.113-38.147 38.147-38.147h131.587c8.284 0 15-6.716 15-15s-6.716-15-15-15H68.904C31.327 32.266.757 62.837.757 100.413v180.321c0 37.576 30.571 68.147 68.147 68.147h181.798c37.576 0 68.147-30.571 68.147-68.147V153.388c.001-8.284-6.715-15-14.999-15z"
                                data-original="#000000" />
                            </svg>
                            </button>
                            <button title="Delete" className="cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-red-500 hover:fill-red-700" viewBox="0 0 24 24">
                                <path
                                d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                                data-original="#000000" />
                                <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                                data-original="#000000" />
                            </svg>
                            </button>
                        </div>
                        </td>
                    </tr>

                    <tr className="even:bg-blue-50">
                        <td className="p-4 text-[15px] text-slate-900 font-medium">
                        2025001
                        </td>
                        <td className="p-4 text-[15px] text-slate-900 font-medium">
                        Kelwin mark
                        </td>
                        <td className="p-4 text-[15px] text-slate-600 font-medium">
                        kelwin@example.com
                        </td>
                        <td className="p-4 text-[15px] text-slate-600 font-medium">
                        Human Resource
                        </td>
                        <td className="p-4 text-[15px] text-slate-600 font-medium">
                        HR
                        </td>
                        <td className="p-4 text-[15px] text-slate-600 font-medium">
                          <h3 className="bg-green-600 flex items-center justify-center" 
                            style= {{height:30, width:110, borderRadius: 20, color: "white"}}>
                            Regular               
                          </h3>
                        </td>
                        <td className="p-4">
                        <div className="flex items-center">
                            <button className="mr-3 cursor-pointer" title="Edit">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-blue-500 hover:fill-blue-700"
                                viewBox="0 0 348.882 348.882">
                                <path
                                d="m333.988 11.758-.42-.383A43.363 43.363 0 0 0 304.258 0a43.579 43.579 0 0 0-32.104 14.153L116.803 184.231a14.993 14.993 0 0 0-3.154 5.37l-18.267 54.762c-2.112 6.331-1.052 13.333 2.835 18.729 3.918 5.438 10.23 8.685 16.886 8.685h.001c2.879 0 5.693-.592 8.362-1.76l52.89-23.138a14.985 14.985 0 0 0 5.063-3.626L336.771 73.176c16.166-17.697 14.919-45.247-2.783-61.418zM130.381 234.247l10.719-32.134.904-.99 20.316 18.556-.904.99-31.035 13.578zm184.24-181.304L182.553 197.53l-20.316-18.556L294.305 34.386c2.583-2.828 6.118-4.386 9.954-4.386 3.365 0 6.588 1.252 9.082 3.53l.419.383c5.484 5.009 5.87 13.546.861 19.03z"
                                data-original="#000000" />
                                <path
                                d="M303.85 138.388c-8.284 0-15 6.716-15 15v127.347c0 21.034-17.113 38.147-38.147 38.147H68.904c-21.035 0-38.147-17.113-38.147-38.147V100.413c0-21.034 17.113-38.147 38.147-38.147h131.587c8.284 0 15-6.716 15-15s-6.716-15-15-15H68.904C31.327 32.266.757 62.837.757 100.413v180.321c0 37.576 30.571 68.147 68.147 68.147h181.798c37.576 0 68.147-30.571 68.147-68.147V153.388c.001-8.284-6.715-15-14.999-15z"
                                data-original="#000000" />
                            </svg>
                            </button>
                            <button title="Delete" className="cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-red-500 hover:fill-red-700" viewBox="0 0 24 24">
                                <path
                                d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                                data-original="#000000" />
                                <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                                data-original="#000000" />
                            </svg>
                            </button>
                        </div>
                        </td>
                    </tr>

                    <tr className="even:bg-blue-50">
                        <td className="p-4 text-[15px] text-slate-900 font-medium">
                        2025004
                        </td>
                        <td className="p-4 text-[15px] text-slate-900 font-medium">
                        Dustin
                        </td>
                        <td className="p-4 text-[15px] text-slate-600 font-medium">
                        dustin@example.com
                        </td>
                        <td className="p-4 text-[15px] text-slate-600 font-medium">
                        Research and Development
                        </td>
                        <td className="p-4 text-[15px] text-slate-600 font-medium">
                        Front-end Developer
                        </td>
                        <td className="p-4 text-[15px] text-slate-600 font-medium">
                          <h3 className="bg-green-600 flex items-center justify-center" 
                            style= {{height:30, width:110, borderRadius: 20, color: "white"}}>
                            Regular               
                          </h3>
                        </td>
                        <td className="p-4">
                        <div className="flex items-center">
                            <button className="mr-3 cursor-pointer" title="Edit">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-blue-500 hover:fill-blue-700"
                                viewBox="0 0 348.882 348.882">
                                <path
                                d="m333.988 11.758-.42-.383A43.363 43.363 0 0 0 304.258 0a43.579 43.579 0 0 0-32.104 14.153L116.803 184.231a14.993 14.993 0 0 0-3.154 5.37l-18.267 54.762c-2.112 6.331-1.052 13.333 2.835 18.729 3.918 5.438 10.23 8.685 16.886 8.685h.001c2.879 0 5.693-.592 8.362-1.76l52.89-23.138a14.985 14.985 0 0 0 5.063-3.626L336.771 73.176c16.166-17.697 14.919-45.247-2.783-61.418zM130.381 234.247l10.719-32.134.904-.99 20.316 18.556-.904.99-31.035 13.578zm184.24-181.304L182.553 197.53l-20.316-18.556L294.305 34.386c2.583-2.828 6.118-4.386 9.954-4.386 3.365 0 6.588 1.252 9.082 3.53l.419.383c5.484 5.009 5.87 13.546.861 19.03z"
                                data-original="#000000" />
                                <path
                                d="M303.85 138.388c-8.284 0-15 6.716-15 15v127.347c0 21.034-17.113 38.147-38.147 38.147H68.904c-21.035 0-38.147-17.113-38.147-38.147V100.413c0-21.034 17.113-38.147 38.147-38.147h131.587c8.284 0 15-6.716 15-15s-6.716-15-15-15H68.904C31.327 32.266.757 62.837.757 100.413v180.321c0 37.576 30.571 68.147 68.147 68.147h181.798c37.576 0 68.147-30.571 68.147-68.147V153.388c.001-8.284-6.715-15-14.999-15z"
                                data-original="#000000" />
                            </svg>
                            </button>
                            <button title="Delete" className="cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-red-500 hover:fill-red-700" viewBox="0 0 24 24">
                                <path
                                d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                                data-original="#000000" />
                                <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                                data-original="#000000" />
                            </svg>
                            </button>
                        </div>
                        </td>
                    </tr>

                    <tr className="even:bg-blue-50">
                        <td className="p-4 text-[15px] text-slate-900 font-medium">
                        2025005
                        </td>
                        <td className="p-4 text-[15px] text-slate-900 font-medium">
                        Jams david
                        </td>
                        <td className="p-4 text-[15px] text-slate-600 font-medium">
                        jams@example.com
                        </td>
                        <td className="p-4 text-[15px] text-slate-600 font-medium">
                        Research and Development
                        </td>
                        <td className="p-4 text-[15px] text-slate-600 font-medium">
                        Software Engineer
                        </td>
                        <td className="p-4 text-[15px] text-slate-600 font-medium">
                          <h3 className="bg-green-600 flex items-center justify-center" 
                            style= {{height:30, width:110, borderRadius: 20, color: "white"}}>
                            Regular               
                          </h3>
                        </td>
                        <td className="p-4">
                        <div className="flex items-center">
                            <button className="mr-3 cursor-pointer" title="Edit">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-blue-500 hover:fill-blue-700"
                                viewBox="0 0 348.882 348.882">
                                <path
                                d="m333.988 11.758-.42-.383A43.363 43.363 0 0 0 304.258 0a43.579 43.579 0 0 0-32.104 14.153L116.803 184.231a14.993 14.993 0 0 0-3.154 5.37l-18.267 54.762c-2.112 6.331-1.052 13.333 2.835 18.729 3.918 5.438 10.23 8.685 16.886 8.685h.001c2.879 0 5.693-.592 8.362-1.76l52.89-23.138a14.985 14.985 0 0 0 5.063-3.626L336.771 73.176c16.166-17.697 14.919-45.247-2.783-61.418zM130.381 234.247l10.719-32.134.904-.99 20.316 18.556-.904.99-31.035 13.578zm184.24-181.304L182.553 197.53l-20.316-18.556L294.305 34.386c2.583-2.828 6.118-4.386 9.954-4.386 3.365 0 6.588 1.252 9.082 3.53l.419.383c5.484 5.009 5.87 13.546.861 19.03z"
                                data-original="#000000" />
                                <path
                                d="M303.85 138.388c-8.284 0-15 6.716-15 15v127.347c0 21.034-17.113 38.147-38.147 38.147H68.904c-21.035 0-38.147-17.113-38.147-38.147V100.413c0-21.034 17.113-38.147 38.147-38.147h131.587c8.284 0 15-6.716 15-15s-6.716-15-15-15H68.904C31.327 32.266.757 62.837.757 100.413v180.321c0 37.576 30.571 68.147 68.147 68.147h181.798c37.576 0 68.147-30.571 68.147-68.147V153.388c.001-8.284-6.715-15-14.999-15z"
                                data-original="#000000" />
                            </svg>
                            </button>
                            <button title="Delete" className="cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-red-500 hover:fill-red-700" viewBox="0 0 24 24">
                                <path
                                d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                                data-original="#000000" />
                                <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                                data-original="#000000" />
                            </svg>
                            </button>
                        </div>
                        </td>
                    </tr>

                    </tbody>
                </table>
            </div>

          </div>

          <div id="settingContent" className="tab-content max-w-2xl hidden mt-8">
              <h4 className="text-base font-semibold text-slate-600">Setting</h4>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Sed auctor auctor arcu, at fermentum dui.
                  Maecenas vestibulum a turpis in lacinia.
                  Proin aliquam turpis at erat venenatis malesuada.
                  Sed semper, justo vitae consequat fermentum, felis diam posuere ante, sed fermentum quam justo in dui.
              </p>
          </div>
      </div>
  );
}
