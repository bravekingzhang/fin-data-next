金融数据拉取
你现在是一个资深的数据产品专家，现在需要写一份清晰，详细的金融数据拉取及管理系统的产品设计
一、数据提取
1.1 美股行业及大盘择时指标
交易时间	行业（大盘）指数	指标及数据库对应字段
	S5COND.SPI
可选消费行业	PE（pe_ttm）
PB （pb_lyr）
PS（ps_ttm）
股息率（dividendvield2）
	S5MATR.SPI
基础材料行业
	SPF.SPI：金融行业
	SPN.SPI：能源行业
	S5INDU.SPI：工业行业
	NDX.GI：纳斯达克100指数
	DJI.GI：道琼斯工业指数
	SPX.GI：标普500指数
路径：发现--代码生成器--日期序列--左侧范围框查找或在右下角输入框输入，再找出上述指标，并导出近10年的数据
更新频率：美股交易日收盘后
1.2 ETF产品数据
交易时间	产品代码	基金成立日
fund_steupdate	开盘价
close	最高价
high	最低价
low	前收盘价
pre_close	成交量
volume


产品代码包括：XLE.P 、VDE.P 、IEO.BAT 、XLB.P 、VAW.P 、PICK.BAT 、XLI.P 、VIS.P 、ITA.BAT 、XLY.P 、VCR.P
PEJ.P 、XLF.P 、VFH.P 、KBE.P 、SPY.P 、DIA.P 、QQQ.O
ps.需要分别导出前复权或后复权
更新频率：美股交易日收盘后
1.3 美股个股数据
交易时间	股票代码	上市日期
ipo_date	总市值
mkt_cap_ard	开盘价
close	最高价
high	最低价
low	前收盘价
pre_close	成交量
volume	市盈率
pe_ttm	股息率
dividendvield2	营业收入（同比增长率）
yoy_or


ps.需要分别导出前复权或后复权
更新频率：美股交易日收盘后
二、数据加工
2.1 针对1.1中的指标数据做百分位处理，计算近5年百分位
交易时间	行业（大盘）指数	市盈率PE	市盈率百分位	市净率PB	市净率百分位	市销率PS	市销率百分位	股息率	股息率百分位	智能估值
	S5COND.SPI
	S5MATR.SPI
	SPF.SPI
	SPN.SPI
	S5INDU.SPI
	NDX.GI
	DJI.GI
	SPX.GI

2.2 针对1.2的数据计算收益率
交易时间	产品代码	近1月收益率	近3月收益率	近6月收益率	近1年收益率	近1年超额收益率	近2年超额收益率	近3年超额收益率




