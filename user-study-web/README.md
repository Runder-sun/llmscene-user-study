# 3D室内场景生成用户研究 - 部署指南

## 📋 概述

本项目是一个基于 GitHub Pages 的用户研究网站，用于评估不同AI方法生成的3D室内场景质量。数据通过 Google Sheets API 存储。

## 🚀 部署步骤

### 第一步：创建 Google Sheets 和 Apps Script

1. **创建 Google 表格**
   - 打开 [Google Sheets](https://sheets.google.com)
   - 创建新表格，命名为 "User Study Results"
   - 复制表格URL中的ID（`https://docs.google.com/spreadsheets/d/[这里是ID]/edit`）

2. **创建 Google Apps Script**
   - 打开 [Google Apps Script](https://script.google.com)
   - 点击 "新建项目"
   - 将 `google-apps-script.js` 文件的内容复制进去
   - 将 `SPREADSHEET_ID` 替换为您的表格ID
   - 保存项目（Ctrl+S）

3. **部署 Web App**
   - 点击右上角 "部署" → "新建部署"
   - 选择类型："Web应用"
   - 配置：
     - 描述：User Study API
     - 执行身份：我自己
     - 访问权限：**任何人**（重要！）
   - 点击 "部署"
   - 复制生成的 Web App URL

4. **更新配置文件**
   - 打开 `config.js`
   - 将 `GOOGLE_SCRIPT_URL` 替换为您的 Web App URL

### 第二步：创建 GitHub 仓库并部署

1. **创建 GitHub 仓库**
   ```bash
   # 进入项目目录
   cd /home/v-yangzhao4/projects/llmscene/baseline/figures/user\ study
   
   # 初始化git仓库
   git init
   
   # 添加所有文件
   git add .
   
   # 提交
   git commit -m "Initial commit: User study website"
   ```

2. **推送到 GitHub**
   - 在 GitHub 上创建新仓库（如 `llmscene-user-study`）
   - **重要**：仓库必须设为 **Public** 才能使用免费的 GitHub Pages
   
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/llmscene-user-study.git
   git branch -M main
   git push -u origin main
   ```

3. **启用 GitHub Pages**
   - 进入仓库 Settings → Pages
   - Source：选择 "Deploy from a branch"
   - Branch：选择 `main`，文件夹选择 `/ (root)`
   - 点击 Save
   - 等待几分钟后，网站将在 `https://YOUR_USERNAME.github.io/llmscene-user-study/user-study-web/` 可用

### 第三步：测试

1. 访问您的 GitHub Pages 网站
2. 完成一次完整的评估流程
3. 检查 Google Sheets 中是否收到数据

## 📁 文件结构

```
user study/
├── bedroom/
│   ├── prompt33/
│   └── prompt36/
├── board_game_room/
├── diningroom/
├── gym/
├── livingroom/
├── office/
├── poolroom/
├── studyroom/
└── user-study-web/          # 网站文件
    ├── index.html           # 主页面
    ├── style.css            # 样式
    ├── config.js            # 配置文件
    ├── script.js            # 主逻辑
    ├── placeholder.png      # 占位图
    ├── google-apps-script.js # Google Apps Script代码
    └── README.md            # 本文档
```

## ⚙️ 配置说明

### config.js 配置项

| 配置项 | 说明 |
|--------|------|
| `GOOGLE_SCRIPT_URL` | Google Apps Script Web App URL |
| `sceneTypes` | 场景类型及显示名称 |
| `prompts` | 每个场景类型的prompt列表 |
| `methods` | 方法列表及显示名称（A-E匿名） |
| `promptsPerSession` | 每次评估的场景数量（默认5） |
| `imageBasePath` | 图片相对路径 |

### 修改方法名称

为保证评估的公平性，方法名已匿名为 Method A-E。如需显示真实名称，修改 `config.js`：

```javascript
methods: {
    'holodeck': 'Holodeck',
    'idesign': 'IDesign',
    'layoutgpt': 'LayoutGPT',
    'layoutvlm': 'LayoutVLM',
    'ours': 'Ours'
}
```

## 📊 数据分析

### 自动生成统计

1. 打开 Google Apps Script 项目
2. 选择函数 `calculateStatistics`
3. 点击运行
4. 查看 Google Sheets 中的"统计结果"表

### 数据格式

**原始数据表**：每行一个用户提交
- 会话ID、提交时间、用时
- 5个场景的类型、Prompt、物理排序、视觉排序

**详细数据表**：每行一个场景评估
- 便于按场景类型、Prompt筛选分析

**统计结果表**：
- 每个方法的平均排名（越低越好）
- 样本数量

## 🔧 故障排除

### 图片无法加载
- 检查图片路径是否正确
- 确保所有图片都已上传到GitHub
- 检查文件名大小写是否匹配

### 数据无法提交
- 检查 `GOOGLE_SCRIPT_URL` 是否正确
- 确保 Google Apps Script 已部署为"任何人"可访问
- 检查浏览器控制台是否有错误

### GitHub Pages 404错误
- 等待几分钟让 Pages 构建完成
- 确保访问正确的URL路径
- 检查仓库是否为 Public

## 📧 联系方式

如有问题，请联系研究团队。

---

**最后更新**: 2026年1月22日
