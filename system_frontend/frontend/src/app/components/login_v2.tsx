import React from 'react'
import { Form, Input, Button, Typography, message } from "antd";
import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import axiosInstance from "../../../server/instance_axios";
import Head from "next/head";
import { setToken } from '../../../server/setToken';

const { Title } = Typography;

export default function LoginPage() {
  const router = useRouter();

  const onFinish = (values: any) => {
    // console.log("Login values:", values);
    axiosInstance.post("/auth/login/", values)
    .then((res) => {
        setToken("accessToken", res.data.access);
        setToken("refreshToken", res.data.refresh);
        router.push("/dashboard");
    })
    .catch(() => {
    alert("Invalid login");
    });
  };

  return (
    <>
        <Head>
            <title>Login</title>
        </Head>
        <div className="flex items-center justify-center min-h-screen" 
            style={{ 
                backgroundImage: "url('/img/login_bg.jpg')",  
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover", 
            }}
        >
            <div className="flex flex-row gap-0">

                <img
                  src="/img/emp_character.png"
                  alt="Login illustration"
                  className="object-contain relative z-10 w-80 h-80 mt-7 mr-3"
                />
                <div className='w-96 p-8 mt-12'>
                    <div className="text-center mb-6">
                        <Title level={3}>Crimson System</Title>
                    </div>

                    <Form
                        name="login"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        layout="vertical"
                        >
                        <Form.Item
                            name="email"
                            rules={[{ required: true, message: "Please input your Email!" }]}
                        >
                            <Input prefix={<MailOutlined />} placeholder="Email" className='h-10' style={{borderRadius: 50}} />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: "Please input your password!" }]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Password" className='h-10' style={{borderRadius: 50}}/>
                        </Form.Item>

                        <Form.Item className='w-40 shadow-2xl' style={{borderRadius:50}}>
                            <button
                                type="submit"
                                className="w-full bg-blue-500 hover:bg-blue-900 ml-20 text-white py-2 rounded-full font-bold transition duration-300"
                            >
                                Login
                            </button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    </>
  );
}
