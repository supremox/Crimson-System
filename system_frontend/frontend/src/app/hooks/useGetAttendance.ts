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

export const GetAttendanceRecord = () => {
    return {
        useGetAttendance
    }
}