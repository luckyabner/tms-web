"use client";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export function useNextAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({
    empId: null,
    name: null,
    phone: null,
    empType: null,
  });

  useEffect(() => {
    const storedUserInfo = Cookies.get("tms_userinfo");

    if (storedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(storedUserInfo);
        setUserInfo(parsedUserInfo);
      } catch (error) {
        console.error("解析用户信息失败:", error);
      }
    }
  }, []);

  const login = async (loginData) => {
    try {
      const { token, empId, name, phone, empType } = loginData;

      // 通过API设置httpOnly cookie，使用axios
      await axios.post(
        "/api/auth/set-cookie",
        { token },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // 存储用户信息到客户端cookie
      const userInfoData = { empId, name, phone, empType };

      Cookies.set("tms_userinfo", JSON.stringify(userInfoData), { expires: 7 });

      setIsLoggedIn(true);
      setUserInfo(userInfoData);
    } catch (error) {
      console.error("设置cookie失败:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // 通过API删除httpOnly cookie，使用axios
      await axios.post("/api/auth/clear-cookie");

      // 删除客户端cookie
      Cookies.remove("tms_userinfo");

      setIsLoggedIn(false);
      setUserInfo({
        empId: null,
        name: null,
        phone: null,
        empType: null,
      });
    } catch (error) {
      console.error("清除cookie失败:", error);
      throw error;
    }
  };

  return {
    isLoggedIn,
    userInfo,
    login,
    logout,
  };
}
