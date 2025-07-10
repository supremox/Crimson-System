import { InputNumber } from 'antd'
import React from 'react'

export default function Contribution() {
  return (
    <div>
        {/* <div className="flex flex-col rounded-lg p-4 shadow-lg mt-5 bg-white gap-2">
            <div className="flex flex-row gap-3">
                <span className="flex text-lg text-white font-semibold bg-blue-950 rounded-lg p-4 shadow-lg h-9 w-28 items-center justify-center">SSS</span>
                <InputNumber min={1} max={10} defaultValue={3} className='h-10' />
            </div>

            <div className="flex flex-row gap-3">
                <span className="flex text-lg text-white font-semibold bg-blue-950 rounded-lg p-4 shadow-lg h-9 w-28 items-center justify-center">Pag-Ibig</span>
                <InputNumber min={1} max={10} defaultValue={3} className='h-10' />
            </div>

            <div className="flex flex-row gap-3">
                <span className="flex text-lg text-white font-semibold bg-blue-950 rounded-lg p-4 shadow-lg h-9 w-28 items-center justify-center">Philhealth</span>
                <InputNumber min={1} max={10} defaultValue={3} className='h-10' />
            </div>
        </div> */}

        <div className="grid grid-cols-5 grid-rows-5 gap-2 rounded-lg p-4 shadow-lg mt-5 bg-white">
            <div className="col-start-1 row-start-2">
                <span className="flex text-lg text-white font-semibold bg-blue-950 rounded-lg p-4 shadow-lg h-9 w-28 items-center justify-center">SSS</span>
            </div>
            <div className="col-start-1 row-start-3">
                <span className="flex text-lg text-white font-semibold bg-blue-950 rounded-lg p-4 shadow-lg h-9 w-28 items-center justify-center">Pag-Ibig</span>
            </div>
            <div className="col-start-1 row-start-4">
                <span className="flex text-lg text-white font-semibold bg-blue-950 rounded-lg p-4 shadow-lg h-9 w-28 items-center justify-center">Philhealth</span>
            </div>
            <div className="col-start-2 row-start-1">
                <span className="flex text-lg text-white font-semibold bg-blue-950 rounded-lg p-4 shadow-lg h-9 w-28 items-center justify-center">Threshold</span>
            </div>
            <div className="col-start-3 row-start-1">
                <span className="flex text-lg text-white font-semibold bg-blue-950 rounded-lg p-4 shadow-lg h-9 w-28 items-center justify-center">Threshold</span>
            </div>
            <div className="col-start-4 row-start-1">
                <span className="flex text-lg text-white font-semibold bg-blue-950 rounded-lg p-4 shadow-lg h-9 w-28 items-center justify-center">Threshold</span>
            </div>
        </div>
    </div>
  )
}
