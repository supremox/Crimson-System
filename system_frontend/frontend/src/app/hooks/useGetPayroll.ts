import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../server/instance_axios";

const fetcher = (url: string) =>
    axiosInstance.get(url).then((res) => res.data);

const useGetSSS = () => {
    return useQuery({
    queryKey: ["sss"],
    queryFn: () => fetcher("/payroll/sss/all/")
  });
}

export const GetPayrollRecord = () => {
    return {
        useGetSSS
    }
}