import React from "react";
import { useState } from 'react'
import { useForm } from "react-hook-form";
import { AuthActions } from "../auth/utils";
import { useRouter } from "next/navigation";

import { MailOutlined} from '@ant-design/icons'
import { LockOutlined } from '@ant-design/icons'
import Head from 'next/head'

import Link from "next/link";

type FormData = {
    email:string;
    password: string;
}

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<FormData>();

    const router = useRouter();

    const { login } = AuthActions();

    const onSubmit = (data: FormData) => {
        login(data.email, data.password)
            .then(() => {
                router.push("dashboard/");
            })
            .catch((err) => {
                // Try to extract error message from backend
                const detail = err?.response?.data?.detail || "Login failed";
                setError("root", { type: "manual", message: detail });
            });
    };

    return (
  <>
      <Head>
        <title>Login</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-pink-100" style={{ backgroundImage: "url('/img/background.jpg')" }}>
        <div className="flex w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Left Side */}
          <div className="w-full md:w-1/2 p-10">
            <h2 className="text-red-950 font-bold text-center text-xl mb-2">Crimson System</h2>
            <hr></hr>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-5">
              <div className="relative">
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-950 pointer-events-none">
                 <MailOutlined className="text-xl text-red-950" style={{ fontSize: 20 }} />
                </span>
                <input
                  type="email"
                  id="email"
                  {...register("email", { required: true })}
                  // onChange={(e) => setUsername(e.target.value)}
                  placeholder="Email ID"
                  className="w-full pl-4 pr-10 py-3 rounded-full text-red-950 placeholder-red-950 border border-red-950 focus:outline-none focus:ring-2 focus:ring-white/60 shadow"
                  required
                />
              </div>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  {...register("password", { required: true })}
                  placeholder="Password"
                  className="w-full pl-4 pr-10 py-3 rounded-full text-red-950 placeholder-red-950 border border-red-950 focus:outline-none focus:ring-2 focus:ring-white/60 shadow"
                  required
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-950 pointer-events-none">
                  <LockOutlined className="text-xl text-red-950" style={{ fontSize: 20 }} />
                </span>
              </div>
              <hr></hr>
              <button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-900 text-white py-2 rounded-full font-bold transition duration-300"
              >
                LOGIN
              </button>
            </form>

          </div>

          {/* Right Side (Image) */}
          <div className="hidden md:flex w-1/2 items-center justify-center p-0">
            <div className="flex flex-1 h-full w-full rounded-l-3xl items-center justify-center bg-cover bg-center"style={{ backgroundImage: "url('/img/bgpic.jpg')" }}>
              <div className="relative flex bg-black opacity-70 items-center h-full w-full rounded-l-3xl justify-center">
                <span className="absolute inset-0 bg-black opacity-80 rounded-full w-full h-full"></span>
                <img src="/img/logo.png" alt="Login illustration" className="max-h-80 object-contain relative z-10 w-40 h-40" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
      );
};

export default Login;

