// ========================================
// Google Apps Script 代码
// 将此代码复制到 Google Apps Script 中
// ========================================

// 配置：Google Sheets ID（创建表格后填入）
const SPREADSHEET_ID = '12OPgQXM1NIQhqCceQwrn1J6ZIOeTgBSDEcyCb1JtfoY';

// 处理POST请求
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    saveToSheet(data);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 处理GET请求（用于测试）
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'User Study API is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// 保存数据到Google Sheets
function saveToSheet(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // 获取或创建"原始数据"表
  let rawSheet = ss.getSheetByName('原始数据');
  if (!rawSheet) {
    rawSheet = ss.insertSheet('原始数据');
    // 添加表头
    rawSheet.appendRow([
      '会话ID', '提交时间', '用时(秒)', 
      '场景1-类型', '场景1-Prompt', '场景1-物理排序', '场景1-视觉排序',
      '场景2-类型', '场景2-Prompt', '场景2-物理排序', '场景2-视觉排序',
      '场景3-类型', '场景3-Prompt', '场景3-物理排序', '场景3-视觉排序',
      '场景4-类型', '场景4-Prompt', '场景4-物理排序', '场景4-视觉排序',
      '场景5-类型', '场景5-Prompt', '场景5-物理排序', '场景5-视觉排序'
    ]);
  }
  
  // 构建数据行
  const row = [
    data.sessionId,
    data.timestamp,
    data.duration
  ];
  
  // 添加每个场景的数据
  data.results.forEach(result => {
    row.push(result.sceneType);
    row.push(result.promptId);
    row.push(result.physicsRanking.join(' > '));
    row.push(result.visualRanking.join(' > '));
  });
  
  rawSheet.appendRow(row);
  
  // 同时保存详细数据用于统计
  saveDetailedData(ss, data);
}

// 保存详细数据便于统计分析
function saveDetailedData(ss, data) {
  let detailSheet = ss.getSheetByName('详细数据');
  if (!detailSheet) {
    detailSheet = ss.insertSheet('详细数据');
    detailSheet.appendRow([
      '会话ID', '提交时间', '场景类型', 'Prompt ID',
      '物理-排名1', '物理-排名2', '物理-排名3', '物理-排名4', '物理-排名5',
      '视觉-排名1', '视觉-排名2', '视觉-排名3', '视觉-排名4', '视觉-排名5'
    ]);
  }
  
  data.results.forEach(result => {
    const row = [
      data.sessionId,
      data.timestamp,
      result.sceneType,
      result.promptId
    ];
    
    // 物理排序
    result.physicsRanking.forEach(method => row.push(method));
    
    // 视觉排序
    result.visualRanking.forEach(method => row.push(method));
    
    detailSheet.appendRow(row);
  });
}

// 计算统计结果（可手动运行）
function calculateStatistics() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const detailSheet = ss.getSheetByName('详细数据');
  
  if (!detailSheet) {
    Logger.log('详细数据表不存在');
    return;
  }
  
  const data = detailSheet.getDataRange().getValues();
  if (data.length <= 1) {
    Logger.log('没有数据');
    return;
  }
  
  const methods = ['holodeck', 'idesign', 'layoutgpt', 'layoutvlm', 'ours'];
  const physicsScores = {};
  const visualScores = {};
  
  methods.forEach(m => {
    physicsScores[m] = [];
    visualScores[m] = [];
  });
  
  // 跳过表头
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    
    // 物理排序（列4-8）
    for (let j = 4; j <= 8; j++) {
      const method = row[j];
      if (methods.includes(method)) {
        physicsScores[method].push(j - 3);  // 排名1-5
      }
    }
    
    // 视觉排序（列9-13）
    for (let j = 9; j <= 13; j++) {
      const method = row[j];
      if (methods.includes(method)) {
        visualScores[method].push(j - 8);  // 排名1-5
      }
    }
  }
  
  // 创建或更新统计表
  let statsSheet = ss.getSheetByName('统计结果');
  if (statsSheet) {
    ss.deleteSheet(statsSheet);
  }
  statsSheet = ss.insertSheet('统计结果');
  
  // 表头
  statsSheet.appendRow(['方法', '物理-平均排名', '物理-样本数', '视觉-平均排名', '视觉-样本数']);
  
  // 统计数据
  methods.forEach(method => {
    const physicsAvg = physicsScores[method].length > 0 
      ? (physicsScores[method].reduce((a, b) => a + b, 0) / physicsScores[method].length).toFixed(3)
      : 'N/A';
    const visualAvg = visualScores[method].length > 0
      ? (visualScores[method].reduce((a, b) => a + b, 0) / visualScores[method].length).toFixed(3)
      : 'N/A';
    
    statsSheet.appendRow([
      method,
      physicsAvg,
      physicsScores[method].length,
      visualAvg,
      visualScores[method].length
    ]);
  });
  
  Logger.log('统计完成！');
}
