"use client";

import { App } from "antd";
import Login from "./components/login";
import LoginPage from "./components/login_v2";

export default function Home() {
  return (
    <main>
      <App>
        <LoginPage />
      </App>   
    </main>
  )
}
