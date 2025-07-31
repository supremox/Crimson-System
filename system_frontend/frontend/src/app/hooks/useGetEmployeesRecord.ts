import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../server/instance_axios";

const fetcher = (url: string) =>
    axiosInstance.get(url).then((res) => res.data);

const useGetEmployeeUser = () => {
    return useQuery({
    queryKey: ["user"],
    queryFn: () => fetcher("/auth/userv2/me/"),
  });
}

const useGetUsers = () => {
    return useQuery({
    queryKey: ["accounts"],
    queryFn: () => fetcher("/auth/userv2/all/"),
  });
}

const useGetEmployees = () => {
    return useQuery({
    queryKey: ["employees"],
    queryFn: () => fetcher("/employee/name/"),
  });
}

const useGetDepartments = () => {
    return useQuery({
    queryKey: ["departments"],
    queryFn: () => fetcher("/employee/departments/names/")
  });
}

const useGetDepartmentPosition = (selectedDepartment: string | null) => {
    return useQuery({
        queryKey: ['department-position', { department: selectedDepartment }],
        queryFn: () => 
            fetcher(`/employee/department/positions/?department_name=${selectedDepartment}`),
        enabled: !!selectedDepartment // false
    })
}

const useGetLeaves = () => {
    return useQuery({
        queryKey: ["leave"],
        queryFn: () => fetcher("/employee/leave/1/"),
    });
}

const useGetPosition = () => {
    return useQuery({
    queryKey: ["position"],
    queryFn: () => fetcher("/employee/position/names/"),
  });
}

const useGetShift = () => {
    return useQuery({
    queryKey: ["shift"],
    queryFn: () => fetcher("/employee/shifts/names/"),
  });
}

const useGetIncentives = () => {
    return useQuery({
        queryKey: ["incentive"],
        queryFn: () => fetcher("/employee/incentives/name/")
    });
}

const useGetEmployeeDetail = (id: number) => {
    return useQuery({
        queryKey: ['empoloyee', id],
        queryFn: () => fetcher(`/employee/detailed/${id}/`)
    })
}   

export const GetEmployeesRecord = () => {
    return {
        useGetEmployees,
        useGetDepartments,
        useGetDepartmentPosition,
        useGetPosition,
        useGetShift,
        useGetLeaves,
        useGetIncentives,
        useGetEmployeeDetail,
        useGetEmployeeUser,
        useGetUsers
    }
}
