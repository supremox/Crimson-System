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

export const GetCalendarEventsRecord = () => {
    return {
        useGetCalendarEvents
    }
}