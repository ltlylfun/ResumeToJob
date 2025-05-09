const { execSync } = require("child_process");

console.log("开始安装Electron依赖...");

try {
  // 清理可能存在的缓存
  console.log("清理缓存...");
  execSync("npm cache clean --force", { stdio: "inherit" });

  // 使用淘宝镜像安装electron相关包
  console.log("安装electron...");
  execSync(
    "npm install electron@25.2.0 --save-dev --registry=https://registry.npmmirror.com/ --electron-mirror=https://npmmirror.com/mirrors/electron/",
    { stdio: "inherit" }
  );

  console.log("安装electron-builder...");
  execSync(
    "npm install electron-builder@24.4.0 --save-dev --registry=https://registry.npmmirror.com/",
    { stdio: "inherit" }
  );

  console.log("安装其他依赖...");
  execSync(
    "npm install concurrently wait-on --save-dev --registry=https://registry.npmmirror.com/",
    { stdio: "inherit" }
  );

  console.log("所有Electron依赖安装完成！✅");
} catch (error) {
  console.error("安装过程中出错: ", error);
  process.exit(1);
}
