"use client";
import { useEffect, useState } from "react";
import { LOCAL_STORAGE_KEY } from "../lib/redux/local-storage";

/**
 * localStorage 调试组件
 * 用于检测和显示 localStorage 的状态
 * 只在开发环境下显示
 */
export const LocalStorageDebugger = () => {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [storageSize, setStorageSize] = useState<number | null>(null);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  useEffect(() => {
    // 检测 localStorage 是否可用
    try {
      const testKey = "__test_storage__";
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      setIsAvailable(true);

      // 检测当前存储的数据大小
      const currentData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (currentData) {
        const size = new Blob([currentData]).size;
        setStorageSize(size);
      }

      // 添加页面关闭事件监听，确保数据在页面关闭前保存
      const handleBeforeUnload = () => {
        console.info("页面即将关闭，确保数据已保存");
        // 此处我们不能做任何异步操作，因为beforeunload事件不支持
        // 但可以作为一个提示，告知用户页面即将关闭

        // 验证localStorage中是否有数据
        const finalCheck = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!finalCheck) {
          console.warn("警告：在页面关闭前未检测到储存的数据！");
        }
      };

      window.addEventListener("beforeunload", handleBeforeUnload);
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    } catch (e) {
      setIsAvailable(false);
    }

    // 监听存储变化
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_KEY) {
        setLastSaved(new Date().toLocaleTimeString());
        if (e.newValue) {
          const size = new Blob([e.newValue]).size;
          setStorageSize(size);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // 创建一个定时器，定期检查localStorage
    const interval = setInterval(() => {
      const currentData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (currentData) {
        const size = new Blob([currentData]).size;
        setStorageSize(size);
        setLastSaved(new Date().toLocaleTimeString());
      }
    }, 5000); // 每5秒检查一次

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // 在生产环境中不显示
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div className="fixed bottom-0 right-0 z-50 m-4 w-80 rounded-lg bg-white p-4 shadow-lg">
      <h3 className="mb-2 text-lg font-bold">localStorage 状态</h3>
      <div className="space-y-1">
        <p>
          状态:{" "}
          {isAvailable === null ? (
            "检测中..."
          ) : isAvailable ? (
            <span className="font-semibold text-green-600">可用</span>
          ) : (
            <span className="font-semibold text-red-600">不可用</span>
          )}
        </p>
        {storageSize !== null && (
          <p>
            数据大小:{" "}
            <span
              className={
                storageSize > 4 * 1024 * 1024
                  ? "font-semibold text-yellow-600"
                  : "font-normal"
              }
            >
              {(storageSize / 1024).toFixed(1)} KB
            </span>
          </p>
        )}
        {lastSaved && (
          <p>
            最后保存: <span className="font-normal">{lastSaved}</span>
          </p>
        )}
        <div className="mt-2">
          <button
            onClick={() => {
              try {
                localStorage.removeItem(LOCAL_STORAGE_KEY);
                setStorageSize(0);
                setLastSaved(null);
                alert("已清除应用数据");
                window.location.reload();
              } catch (e) {
                alert("清除数据失败");
              }
            }}
            className="mt-1 rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
          >
            清除数据
          </button>
          <button
            onClick={() => {
              try {
                const data = localStorage.getItem(LOCAL_STORAGE_KEY);
                if (data) {
                  const blob = new Blob([data], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "resume-data-backup.json";
                  a.click();
                  URL.revokeObjectURL(url);
                }
              } catch (e) {
                alert("导出数据失败");
              }
            }}
            className="ml-2 mt-1 rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
          >
            导出数据
          </button>
        </div>
      </div>
    </div>
  );
};
