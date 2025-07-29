import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../server/instance_axios";

const fetcher = (url: string) =>
    axiosInstance.get(url).then((res) => res.data);


const useGetStampings = () => {
    return useQuery({
    queryKey: ["stammps"],
    queryFn: () =>  fetcher("/company/stamping/")
  });
}

const fetchPDFBlob = (url: string) =>
  axiosInstance
    .get(url, { responseType: "blob" })  // 👈 important
    .then((res) => URL.createObjectURL(res.data));

const useGetPDFTemplate = () => {
    return useQuery({
    queryKey: ["template"],
    queryFn: () =>  fetchPDFBlob("/company/stamping/pdf/")
  });
}

export const GetCompanyRecord = () => {
    return {
       useGetStampings,
       useGetPDFTemplate
    }
}