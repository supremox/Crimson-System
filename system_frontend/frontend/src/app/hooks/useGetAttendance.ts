import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../server/instance_axios";

const fetcher = (url: string) =>
    axiosInstance.get(url).then((res) => res.data);

const useGetAttendance = () => {
    return useQuery({
    queryKey: ["attendance"],
    queryFn: () =>  fetcher("/attendance/all/"),
    
  });
}

const useGetUserAttendance = () => {
    return useQuery({
    queryKey: ["user_attendance"],
    queryFn: () =>  fetcher("/attendance/user/")
  });
}


const useGetDayRecord = (
  selectedDay: string | null,
  employee_id: string,
  options = {}
) => {
  return useQuery({
    queryKey: ['day-record', { day: selectedDay, emp: employee_id }],
    queryFn: () =>
      fetcher(`/attendance/day/record/${employee_id}/${selectedDay}`),
    enabled: false, // default is disabled (lazy loading)
    ...options,     // allow override from component
  });
};


export const GetAttendanceRecord = () => {
    return {
        useGetAttendance,
        useGetUserAttendance,
        useGetDayRecord
    }
}