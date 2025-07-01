import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../server/instance_axios";

const fetcher = (url: string) =>
    axiosInstance.get(url).then((res) => res.data);

const useGetAttendance = () => {
    return useQuery({
    queryKey: ["attendance"],
    queryFn: () =>  fetcher("/attendance/all/")
  });
}

const useGetDayRecord = (selectedDay: string | null, employee_id: string) => {
    return useQuery({
        queryKey: ['department-position', { day: selectedDay, emp: employee_id }],
        queryFn: () => 
            fetcher(`/attendance/day/record/${employee_id}/${selectedDay}`),
        enabled: !!selectedDay // false
    })
}

export const GetAttendanceRecord = () => {
    return {
        useGetAttendance,
        useGetDayRecord
    }
}