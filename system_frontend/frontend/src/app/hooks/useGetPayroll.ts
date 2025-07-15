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

const useGetPagIbig = () => {
    return useQuery({
    queryKey: ["pagibig"],
    queryFn: () => fetcher("/payroll/pagibig/all/")
  });
}

const useGetPhilhealth = () => {
    return useQuery({
    queryKey: ["philhealth"],
    queryFn: () => fetcher("/payroll/philhealth/all/")
  });
}

const useGetBir = () => {
    return useQuery({
    queryKey: ["bir"],
    queryFn: () => fetcher("/payroll/bir/all/")
  });
}

export const GetPayrollRecord = () => {
    return {
        useGetSSS,
        useGetPagIbig,
        useGetPhilhealth,
        useGetBir
    }
}