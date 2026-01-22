// ========================================
// Google Apps Script 代码
// 将此代码复制到 Google Apps Script 中
// ========================================

// 配置：Google Sheets ID（创建表格后填入）
const SPREADSHEET_ID = '12OPgQXM1NIQhqCceQwrn1J6ZIOeTgBSDEcyCb1JtfoY';

// 方法列表（固定顺序，便于统计）
const METHODS = ['holodeck', 'idesign', 'layoutgpt', 'layoutvlm', 'ours'];

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

// 将排名数组转换为各方法的排名数字
// 输入: ['layoutgpt', 'layoutvlm', 'ours', 'idesign', 'holodeck'] (从好到差)
// 输出: {holodeck: 5, idesign: 4, layoutgpt: 1, layoutvlm: 2, ours: 3}
function rankingToScores(rankingArray) {
  const scores = {};
  rankingArray.forEach((method, index) => {
    scores[method] = index + 1;  // 排名1=最好, 5=最差
  });
  return scores;
}

// 保存数据到Google Sheets
function saveToSheet(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // ===== 表1: 原始数据（每个用户一行，保留原始排序字符串供参考） =====
  let rawSheet = ss.getSheetByName('原始数据');
  if (!rawSheet) {
    rawSheet = ss.insertSheet('原始数据');
    rawSheet.appendRow([
      '会话ID', '提交时间', '用时(秒)', 
      '场景1-类型', '场景1-Prompt', '场景1-物理排序', '场景1-视觉排序',
      '场景2-类型', '场景2-Prompt', '场景2-物理排序', '场景2-视觉排序',
      '场景3-类型', '场景3-Prompt', '场景3-物理排序', '场景3-视觉排序',
      '场景4-类型', '场景4-Prompt', '场景4-物理排序', '场景4-视觉排序',
      '场景5-类型', '场景5-Prompt', '场景5-物理排序', '场景5-视觉排序'
    ]);
  }
  
  const row = [data.sessionId, data.timestamp, data.duration];
  data.results.forEach(result => {
    row.push(result.sceneType);
    row.push(result.promptId);
    row.push(result.physicsRanking.join(' > '));
    row.push(result.visualRanking.join(' > '));
  });
  rawSheet.appendRow(row);
  
  // ===== 表2: 统计用数据（每个场景一行，每个方法单独一列记录排名数字） =====
  saveStatisticsData(ss, data);
}

// 保存便于统计的数据格式
function saveStatisticsData(ss, data) {
  let statsSheet = ss.getSheetByName('统计数据');
  if (!statsSheet) {
    statsSheet = ss.insertSheet('统计数据');
    // 表头：每个方法两列（物理排名、视觉排名）
    statsSheet.appendRow([
      '会话ID', '提交时间', '场景类型', 'Prompt ID',
      'holodeck_物理', 'holodeck_视觉',
      'idesign_物理', 'idesign_视觉',
      'layoutgpt_物理', 'layoutgpt_视觉',
      'layoutvlm_物理', 'layoutvlm_视觉',
      'ours_物理', 'ours_视觉'
    ]);
  }
  
  data.results.forEach(result => {
    const physicsScores = rankingToScores(result.physicsRanking);
    const visualScores = rankingToScores(result.visualRanking);
    
    const row = [
      data.sessionId,
      data.timestamp,
      result.sceneType,
      result.promptId
    ];
    
    // 按固定顺序添加每个方法的排名
    METHODS.forEach(method => {
      row.push(physicsScores[method] || '');
      row.push(visualScores[method] || '');
    });
    
    statsSheet.appendRow(row);
  });
}

// 计算统计结果（可手动运行）
function calculateStatistics() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const statsSheet = ss.getSheetByName('统计数据');
  
  if (!statsSheet) {
    Logger.log('统计数据表不存在');
    return;
  }
  
  const data = statsSheet.getDataRange().getValues();
  if (data.length <= 1) {
    Logger.log('没有数据');
    return;
  }
  
  // 初始化统计
  const physicsScores = {};
  const visualScores = {};
  METHODS.forEach(m => {
    physicsScores[m] = [];
    visualScores[m] = [];
  });
  
  // 跳过表头，统计数据
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    // 列4-13: holodeck_物理, holodeck_视觉, idesign_物理, idesign_视觉, ...
    METHODS.forEach((method, idx) => {
      const physicsCol = 4 + idx * 2;
      const visualCol = 5 + idx * 2;
      if (row[physicsCol]) physicsScores[method].push(row[physicsCol]);
      if (row[visualCol]) visualScores[method].push(row[visualCol]);
    });
  }
  
  // 创建或更新结果表
  let resultSheet = ss.getSheetByName('统计结果');
  if (resultSheet) {
    ss.deleteSheet(resultSheet);
  }
  resultSheet = ss.insertSheet('统计结果');
  
  // 表头
  resultSheet.appendRow(['方法', '物理-平均排名', '物理-样本数', '视觉-平均排名', '视觉-样本数', '综合-平均排名']);
  
  // 统计数据
  METHODS.forEach(method => {
    const physicsAvg = physicsScores[method].length > 0 
      ? (physicsScores[method].reduce((a, b) => a + b, 0) / physicsScores[method].length)
      : null;
    const visualAvg = visualScores[method].length > 0
      ? (visualScores[method].reduce((a, b) => a + b, 0) / visualScores[method].length)
      : null;
    const overallAvg = (physicsAvg && visualAvg) ? ((physicsAvg + visualAvg) / 2) : null;
    
    resultSheet.appendRow([
      method,
      physicsAvg ? physicsAvg.toFixed(3) : 'N/A',
      physicsScores[method].length,
      visualAvg ? visualAvg.toFixed(3) : 'N/A',
      visualScores[method].length,
      overallAvg ? overallAvg.toFixed(3) : 'N/A'
    ]);
  });
  
  Logger.log('统计完成！');
}
