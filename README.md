<div align="center">
  <img src="public\logo-500.png" alt="ResumeToJob Logo" width="200" />
</div>

# ResumeToJob | 简历制作网站

<div align="center">
  <img src="public/assets/screenshot1.png" alt="ResumeToJob Screenshot" width="800" />
</div>

<div align="center">

## [English](#english-version) | [简体中文](#chinese-version)

## 🔗

#### [网站无法访问？没 🪜，等了好久还是无法访问，想本地部署，看此小白教程](DEPLOYMENT_TUTORIAL.md)

#### [有 🪜，但还有问题？提交 Issue，帮助我们改进](https://github.com/ltlylfun/ResumeToJob/issues)

<p align="center">
  <a href="https://github.com/ltlylfun/ResumeToJob/stargazers">
    <img alt="GitHub stars" src="https://img.shields.io/github/stars/ltlylfun/ResumeToJob?style=for-the-badge&logo=github&color=FFB33A">
  </a>
  <a href="https://github.com/ltlylfun/ResumeToJob/network/members">
    <img alt="GitHub forks" src="https://img.shields.io/github/forks/ltlylfun/ResumeToJob?style=for-the-badge&logo=github&color=22BB88">
  </a>
  <a href="https://github.com/ltlylfun/ResumeToJob/issues">
    <img alt="GitHub issues" src="https://img.shields.io/github/issues/ltlylfun/ResumeToJob?style=for-the-badge&logo=github&color=FF6B6B">
  </a>
  <a href="https://github.com/ltlylfun/ResumeToJob/blob/main/LICENSE">
    <img alt="GitHub license" src="https://img.shields.io/github/license/ltlylfun/ResumeToJob?style=for-the-badge&logo=github&color=45AAF2">
  </a>
</p>

<div align="center">
  <img src="https://moe-counter.glitch.me/get/@ltlylfun-ResumeToJob?theme=rule34" alt="Moe Counter" />
</div>

</div>

---

<a id="chinese-version"></a>

## 📋 简体中文

### 🚀 项目简介

ResumeToJob 是一个免费开源的在线简历制作工具，帮助求职者快速创建专业、美观的简历。支持多种模板选择、实时编辑、PDF 导出等功能，同时保护您的隐私数据安全。

### ✨ 主要特性

- 🎨 多种精美简历模板
- 📱 响应式设计，支持移动端和桌面端
- 🔒 注重隐私，所有数据存储在本地
- 📤 一键导出 PDF 格式简历
- 🌏 支持中英文界面
- 🖥️ 实时预览编辑效果
- ✏️ 支持 Markdown 格式，让内容编辑更简单
- 📁 简历管理功能，支持多份简历创建、切换、克隆和导入导出

### 📝 Markdown 格式支持

<div align="center">
  <img src="public/assets/screenshot2_zh.png" alt="Markdown支持演示" width="800" />
</div>

本项目支持 Markdown 格式，让您更轻松地编辑简历内容：

- **无序列表**：输入 `- ` 或 `* ` 创建无序列表（注意后面的空格）
- **有序列表**：输入 `1. ` 创建有序列表（注意后面的空格）
- **粗体文本**：输入 `**文本**` 或 `__文本__` 创建粗体文本

### 📁 简历管理功能

ResumeToJob 提供强大的简历管理功能，让您轻松管理多份简历：

- **创建多份简历**：为不同岗位创建专门的简历版本
- **快速切换**：在多份简历间一键切换
- **克隆复制**：基于现有简历快速创建新版本
- **导入导出**：支持本地备份和恢复所有简历数据
- **搜索功能**：通过关键词快速找到目标简历
- **编辑管理**：随时修改简历标题和描述信息

在简历编辑界面点击"简历管理"按钮即可访问这些功能。

### 📤 简历导入导出功能

ResumeToJob 提供便捷的简历导入导出功能，让您轻松管理和分享简历数据：

- **导出功能**：将您的所有简历数据导出为 JSON 文件，方便备份和迁移
- **导入功能**：从之前导出的 JSON 文件中恢复简历数据
- **跨设备使用**：通过导入导出功能实现简历在不同设备间的迁移
- **数据分享**：可以将简历数据分享给他人

点击简历管理按钮即可看到导入与导出功能。出于无账号登录即使用以及保护隐私的出发点，未来不会更新数据跨设备同步功能，不过可以通过导入导出分享来实现跨设备使用。

### 🔄 恢复默认功能

如果您遇到以下情况，可以使用恢复默认功能：

- **清空所有记录**：当您需要重新开始，清除所有已保存的简历数据
- **数据兼容性问题**：网站升级后，如果出现数据不兼容的情况，点击此按钮可以初始化数据
- **重置到初始状态**：恢复到网站的默认设置和示例简历

⚠️ **注意**：此操作将清除所有本地保存的简历数据，请在使用前确保已导出重要的简历文件。

### 🤝 参与贡献

我们欢迎社区贡献者参与项目开发，特别是添加新的简历模板。请查看 [模板贡献指南](TEMPLATE_CONTRIBUTION.md) 了解如何创建和提交您的模板。

### 🔗 在线使用

访问 [https://resumetojob.ltlyl.fun/](https://resumetojob.ltlyl.fun/) 立即体验

备用链接：[https://resume-to-job.vercel.app/](https://resume-to-job.vercel.app/)

### 💻 本地开发

```bash
# 克隆项目
git clone https://github.com/ltlylfun/ResumeToJob.git

# 进入项目目录
cd ResumeToJob

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

启动后，访问 http://localhost:3000 查看网站

### 🛠️ 技术栈

- Next.js
- React
- TypeScript
- Tailwind CSS
- Redux Toolkit
- React PDF

### 📄 许可证

本项目使用 [AGPL-3.0 license](LICENSE)。

### 🙏 致谢

特别感谢项目 [open-resume](https://github.com/xitanggg/open-resume) 的创建者和所有贡献者。这个二次开发项目基于他们的杰出工作。

---

<a id="english-version"></a>

## 📋 English

### 🚀 Project Introduction

ResumeToJob is a free open-source online resume builder that helps job seekers quickly create professional, beautiful resumes. It supports multiple templates, real-time editing, PDF export, and ensures your privacy data security.

### ✨ Key Features

- 🎨 Multiple beautiful resume templates
- 📱 Responsive design for both mobile and desktop
- 🔒 Privacy-focused with all data stored locally
- 📤 One-click PDF export
- 🌏 Multi-language interface (English & Chinese)
- 🖥️ Real-time preview of edits
- ✏️ Markdown format support for easier content editing
- 📁 Resume management with support for creating, switching, cloning, and importing/exporting multiple resumes

### 📝 Markdown Format Support

<div align="center">
  <img src="public/assets/screenshot2_en.png" alt="Markdown Support Demo" width="800" />
</div>

This project supports Markdown format to make resume content editing easier:

- **Unordered lists**: Type `- ` or `* ` to create unordered lists (note the space after)
- **Ordered lists**: Type `1. ` to create ordered lists (note the space after)
- **Bold text**: Type `**text**` or `__text__` to create bold text

### 📁 Resume Management

ResumeToJob provides powerful resume management features to help you organize multiple resumes:

- **Create Multiple Resumes**: Build dedicated resume versions for different positions
- **Quick Switching**: Seamlessly switch between multiple resumes with one click
- **Clone Resumes**: Quickly create new versions based on existing resumes
- **Import/Export**: Support local backup and restore of all resume data
- **Search Function**: Find target resumes quickly using keywords
- **Edit Management**: Modify resume titles and descriptions anytime

Access these features by clicking the "Manager Resumes" button in the resume editor.

### 📤 Resume Import/Export Feature

ResumeToJob provides convenient resume import and export functionality for easy data management and sharing:

- **Export Feature**: Export all your resume data as a JSON file for backup and migration
- **Import Feature**: Restore resume data from previously exported JSON files
- **Cross-Device Usage**: Transfer resumes between different devices using import/export functionality
- **Data Sharing**: Share resume data with others

Click the "Manager Resumes" button to access the import and export functions. For the sake of no-account login usage and privacy protection, we will not update cross-device data synchronization features in the future. However, cross-device usage can be achieved through import/export sharing.

### 🔄Reset to Default

You can use the reset to default function in the following situations:

- **Clear All Records**: When you need to start over and clear all saved resume data
- **Data Compatibility Issues**: If data incompatibility occurs after website upgrades, click this button to initialize the data
- **Reset to Initial State**: Restore to the website's default settings and sample resume

⚠️ **Warning**: This operation will clear all locally saved resume data. Please ensure you have exported important resume files before using this feature.

### 🤝 Contribute

We welcome community contributors to participate in project development, especially adding new resume templates. Check out the [Template Contribution Guide](TEMPLATE_CONTRIBUTION.md) to learn how to create and submit your templates.

### 🔗 Online Usage

Visit [https://resumetojob.ltlyl.fun/](https://resumetojob.ltlyl.fun/) to get started

Alternative link: [https://resume-to-job.vercel.app/](https://resume-to-job.vercel.app/)

### 💻 Local Development

```bash
# Clone the repository
git clone https://github.com/ltlylfun/ResumeToJob.git

# Navigate to project directory
cd ResumeToJob

# Install dependencies
npm install

# Start development server
npm run dev
```

After starting, visit http://localhost:3000 to view the website

### 🛠️ Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Redux Toolkit
- React PDF

### 📄 License

This project is licensed under the [AGPL-3.0 license](LICENSE).

### 🙏 Acknowledgements

Special thanks to the creators and contributors of [open-resume](https://github.com/xitanggg/open-resume). This derivative project is based on their outstanding work.
