"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { axiosInstance, setUser } from "@/common/lib";
import { API_EMPLOYEE_LOGIN_USERNAME } from "@/common/models/auth";
import type { EmployeeLoginUsernameResponse, EUserRole } from "@/common/models/auth";

export const employeePasswordLoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});
export type EmployeePasswordLoginFormData = z.infer<typeof employeePasswordLoginSchema>;

export const useEmployeePasswordLogin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const methods = useForm<EmployeePasswordLoginFormData>({
    resolver: zodResolver(employeePasswordLoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = methods.handleSubmit(async (data) => {
    setError("");
    setLoading(true);
    try {
      const res = await axiosInstance.post<EmployeeLoginUsernameResponse>(
        API_EMPLOYEE_LOGIN_USERNAME.buildUrlPath(),
        { username: data.username, password: data.password }
      );
      const { token, role, employee } = res.data;
      setUser({ token, role: role as EUserRole, email: employee.email, employee });
      toast.success(`Welcome back, ${employee.name}!`);
      router.push("/employee/tasks");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? "Invalid username or password");
    } finally {
      setLoading(false);
    }
  });

  return {
    methods,
    loading,
    error,
    onSubmit,
  };
};
