# 🚀 快速部署指南

## 第一步：配置 Google Sheets（5分钟）

### 1.1 创建表格
1. 打开 https://sheets.google.com
2. 新建表格，命名为 "User Study Results"
3. 复制URL中的表格ID：
   ```
   https://docs.google.com/spreadsheets/d/[复制这段ID]/edit
   ```

### 1.2 创建 Apps Script
1. 打开 https://script.google.com
2. 新建项目
3. 复制 `user-study-web/google-apps-script.js` 的内容
4. 替换第5行的 `YOUR_SPREADSHEET_ID_HERE` 为您的表格ID
5. Ctrl+S 保存

### 1.3 部署 Web App
1. 点击 **部署** → **新建部署**
2. 类型选择 **Web应用**
3. 设置：
   - 执行身份：**我自己**
   - 访问权限：**任何人** ⚠️ 重要！
4. 点击部署，复制生成的URL

### 1.4 更新配置
编辑 `user-study-web/config.js`：
```javascript
const GOOGLE_SCRIPT_URL = '粘贴您的Web App URL';
```

---

## 第二步：部署到 GitHub Pages（5分钟）

### 方式A：使用部署脚本
```bash
cd "/home/v-yangzhao4/projects/llmscene/baseline/figures/user study"
./deploy.sh 您的GitHub用户名 llmscene-user-study
```

### 方式B：手动部署
```bash
cd "/home/v-yangzhao4/projects/llmscene/baseline/figures/user study"
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/您的用户名/llmscene-user-study.git
git branch -M main
git push -u origin main
```

### 启用 GitHub Pages
1. 进入仓库 **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main** / **/ (root)**
4. 点击 **Save**

---

## 第三步：分享链接

等待2-3分钟后，您的网站将在以下地址可用：
```
https://您的用户名.github.io/llmscene-user-study/user-study-web/
```

分享这个链接给参与者即可！

---

## 📊 查看结果

1. 打开您的 Google 表格
2. 查看自动创建的"原始数据"和"详细数据"表
3. 运行 Apps Script 中的 `calculateStatistics()` 函数生成统计

---

## ⚠️ 常见问题

| 问题 | 解决方案 |
|------|----------|
| 图片不显示 | 检查图片文件是否已推送到GitHub |
| 数据未保存 | 确认Apps Script部署为"任何人"可访问 |
| 404错误 | 等待GitHub Pages构建完成（约2分钟） |
| 权限错误 | 重新部署Apps Script，选择正确的权限 |

---

**创建时间**: 2026-01-22
