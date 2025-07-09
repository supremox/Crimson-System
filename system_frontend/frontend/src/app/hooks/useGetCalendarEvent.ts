import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../server/instance_axios";

const fetcher = (url: string) =>
    axiosInstance.get(url).then((res) => res.data);

const useGetCalendarEvents = () => {
    return useQuery({
    queryKey: ["calendar-events"],
    queryFn: () =>  fetcher("/calendar/event/")
  });
}

const useGetLeaves = () => {
    return useQuery({
    queryKey: ["leave"],
    queryFn: () =>  fetcher("/calendar/leave/all/")
  });
}

const useGetLeaveDetail = (id: number) => {
    return useQuery({
    queryKey: ["leave-detail", id],
    queryFn: () =>  fetcher(`/calendar/leave/detail/${id}/`),
    enabled: !!id // false
  });
}

const useGetShifts = () => {
    return useQuery({
    queryKey: ["shifts"],
    queryFn: () =>  fetcher("/calendar/shift/all/")
  });
}

const useGetShiftDetail = (id: number) => {
    return useQuery({
    queryKey: ["shift-detail", id],
    queryFn: () =>  fetcher(`/calendar/shift/detail/${id}/`),
    enabled: !!id // false
  });
}

export const GetCalendarEventsRecord = () => {
    return {
        useGetCalendarEvents,
        useGetLeaves,
        useGetLeaveDetail,
        useGetShifts,
        useGetShiftDetail
    }
}