#!/bin/bash

# ========================================
# 用户研究网站部署脚本
# ========================================

echo "🚀 用户研究网站部署脚本"
echo "========================"

# 检查是否提供了GitHub用户名和仓库名
if [ -z "$1" ] || [ -z "$2" ]; then
    echo ""
    echo "用法: ./deploy.sh <GitHub用户名> <仓库名>"
    echo "示例: ./deploy.sh myusername llmscene-user-study"
    echo ""
    exit 1
fi

GITHUB_USER=$1
REPO_NAME=$2
REPO_URL="https://github.com/$GITHUB_USER/$REPO_NAME.git"

echo ""
echo "📋 部署信息:"
echo "   GitHub用户: $GITHUB_USER"
echo "   仓库名称: $REPO_NAME"
echo "   仓库URL: $REPO_URL"
echo ""

# 进入项目目录
cd "$(dirname "$0")"

# 检查git是否已初始化
if [ ! -d ".git" ]; then
    echo "📁 初始化Git仓库..."
    git init
fi

# 添加所有文件
echo "📦 添加文件到Git..."
git add .

# 提交
echo "💾 提交更改..."
git commit -m "User study website - $(date '+%Y-%m-%d %H:%M:%S')" 2>/dev/null || echo "   (没有新的更改需要提交)"

# 检查remote是否存在
if git remote | grep -q "origin"; then
    echo "🔄 更新远程仓库地址..."
    git remote set-url origin $REPO_URL
else
    echo "🔗 添加远程仓库..."
    git remote add origin $REPO_URL
fi

# 推送
echo "☁️  推送到GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "✅ 部署完成!"
echo ""
echo "📝 后续步骤:"
echo "   1. 确保GitHub仓库已创建且为Public"
echo "   2. 在仓库Settings → Pages中启用GitHub Pages"
echo "   3. 选择main分支和/(root)目录"
echo "   4. 等待几分钟后访问:"
echo "      https://$GITHUB_USER.github.io/$REPO_NAME/user-study-web/"
echo ""
echo "📊 不要忘记配置Google Sheets:"
echo "   1. 创建Google表格并获取ID"
echo "   2. 部署Google Apps Script"
echo "   3. 更新 user-study-web/config.js 中的 GOOGLE_SCRIPT_URL"
echo ""
