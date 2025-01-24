"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface DataPoint {
  symbol: string
  name: string
  value: number
  change: number
  updateTime: string
  volume?: number
  turnover?: number
  history?: {
    time: string
    value: number
  }[]
}

const addMockHistory = (data: DataPoint[]): DataPoint[] => {
  return data.map(item => ({
    ...item,
    volume: Math.floor(Math.random() * 1000000),
    turnover: Math.random() * 100,
    history: Array.from({ length: 7 }, (_, i) => ({
      time: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
      value: item.value * (1 + (Math.random() - 0.5) * 0.1)
    })).reverse()
  }))
}

const MOCK_INDUSTRY_DATA: DataPoint[] = addMockHistory([
  { symbol: "CSI300", name: "沪深300", value: 3500.21, change: 1.2, updateTime: "2024-01-23 15:00:00" },
  { symbol: "CSI500", name: "中证500", value: 5600.45, change: -0.8, updateTime: "2024-01-23 15:00:00" },
])

const MOCK_ETF_DATA: DataPoint[] = addMockHistory([
  { symbol: "510300", name: "沪深300ETF", value: 3.521, change: 1.1, updateTime: "2024-01-23 15:00:00" },
  { symbol: "510500", name: "中证500ETF", value: 5.678, change: -0.7, updateTime: "2024-01-23 15:00:00" },
])

const MOCK_STOCK_DATA: DataPoint[] = addMockHistory([
  { symbol: "AAPL", name: "Apple Inc.", value: 185.92, change: 1.5, updateTime: "2024-01-23 15:00:00" },
  { symbol: "MSFT", name: "Microsoft Corporation", value: 397.58, change: 0.8, updateTime: "2024-01-23 15:00:00" },
])

const COLORS = ['#10B981', '#EF4444']

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("industry")
  const [searchQuery, setSearchQuery] = useState("")
  const [symbolFilter, setSymbolFilter] = useState<string>("all")

  useEffect(() => {
    setMounted(true)
  }, [])

  // 在组件挂载前返回null或加载状态
  if (!mounted) {
    return null
  }

  const getFilteredData = (data: DataPoint[]) => {
    return data.filter(item => {
      if (symbolFilter !== "all" && item.symbol !== symbolFilter) return false
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !item.symbol.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
  }

  const handleExportData = (data: DataPoint[]) => {
    const filteredData = getFilteredData(data)

    // 准备CSV数据
    const headers = ['代码', '名称', '最新值', '涨跌幅', '成交量', '换手率', '更新时间']
    const csvContent = [
      headers.join(','),
      ...filteredData.map(item => [
        item.symbol,
        item.name,
        item.value.toFixed(2),
        `${item.change > 0 ? '+' : ''}${item.change.toFixed(2)}%`,
        item.volume?.toString() || '0',
        `${item.turnover?.toFixed(2) || '0'}%`,
        item.updateTime
      ].join(','))
    ].join('\n')

    // 创建Blob对象
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    // 创建下载链接
    const link = document.createElement('a')
    link.href = url
    link.download = `${activeTab}_data_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const renderDataTable = (data: DataPoint[]) => {
    const filteredData = getFilteredData(data)
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExportData(data)}
          >
            <Download className="w-4 h-4 mr-2" />
            导出数据
          </Button>
        </div>
        <div className="border rounded-lg">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted">
                <th className="p-4 text-left">代码</th>
                <th className="p-4 text-left">名称</th>
                <th className="p-4 text-right">最新值</th>
                <th className="p-4 text-right">涨跌幅</th>
                <th className="p-4 text-left">更新时间</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.symbol} className="border-b">
                  <td className="p-4">{item.symbol}</td>
                  <td className="p-4">{item.name}</td>
                  <td className="p-4 text-right">{item.value.toFixed(2)}</td>
                  <td className={cn(
                    "p-4 text-right",
                    item.change > 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {item.change > 0 ? "+" : ""}{item.change.toFixed(2)}%
                  </td>
                  <td className="p-4">{item.updateTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  const getSymbolOptions = () => {
    let data: DataPoint[] = []
    switch (activeTab) {
      case "industry":
        data = MOCK_INDUSTRY_DATA
        break
      case "etf":
        data = MOCK_ETF_DATA
        break
      case "stock":
        data = MOCK_STOCK_DATA
        break
    }
    return data.map(item => ({
      value: item.symbol,
      label: `${item.symbol} - ${item.name}`
    }))
  }

  const renderCharts = (data: DataPoint[]) => {
    const filteredData = getFilteredData(data)
    const upDownData = [
      { name: '上涨', value: filteredData.filter(item => item.change > 0).length },
      { name: '下跌', value: filteredData.filter(item => item.change < 0).length }
    ]

    return (
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">7日走势</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredData[0]?.history || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#3B82F6" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">涨跌分布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={upDownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {upDownData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderStats = (data: DataPoint[]) => {
    const filteredData = getFilteredData(data)
    const totalVolume = filteredData.reduce((sum, item) => sum + (item.volume || 0), 0)
    const avgTurnover = filteredData.reduce((sum, item) => sum + (item.turnover || 0), 0) / filteredData.length

    return (
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">数据总数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredData.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">上涨数量</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {filteredData.filter(item => item.change > 0).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总成交量</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(totalVolume / 10000).toFixed(2)}万
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均换手率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {avgTurnover.toFixed(2)}%
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Data Overview</h1>
        <Button
          variant="outline"
          onClick={() => {
            let data: DataPoint[] = []
            switch (activeTab) {
              case "industry":
                data = MOCK_INDUSTRY_DATA
                break
              case "etf":
                data = MOCK_ETF_DATA
                break
              case "stock":
                data = MOCK_STOCK_DATA
                break
            }
            handleExportData(data)
          }}
        >
          <Download className="w-4 h-4 mr-2" />
          Export All Data
        </Button>
      </div>

      <Tabs defaultValue="industry" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="industry">Industry Index</TabsTrigger>
            <TabsTrigger value="etf">ETF Data</TabsTrigger>
            <TabsTrigger value="stock">Stock Data</TabsTrigger>
          </TabsList>

          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="搜索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[200px]"
              />
            </div>
            <Select value={symbolFilter} onValueChange={setSymbolFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="选择标的" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                {getSymbolOptions().map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="industry">
          {renderStats(MOCK_INDUSTRY_DATA)}
          {renderCharts(MOCK_INDUSTRY_DATA)}
          {renderDataTable(MOCK_INDUSTRY_DATA)}
        </TabsContent>

        <TabsContent value="etf">
          {renderStats(MOCK_ETF_DATA)}
          {renderCharts(MOCK_ETF_DATA)}
          {renderDataTable(MOCK_ETF_DATA)}
        </TabsContent>

        <TabsContent value="stock">
          {renderStats(MOCK_STOCK_DATA)}
          {renderCharts(MOCK_STOCK_DATA)}
          {renderDataTable(MOCK_STOCK_DATA)}
        </TabsContent>
      </Tabs>
    </div>
  )
}
