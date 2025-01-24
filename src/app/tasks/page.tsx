"use client"

import { useState } from "react"
import {
  PlayCircle,
  StopCircle,
  RefreshCw,
  CheckCircle2,
  History,
  Trash2,
  Plus,
  Search,
  UserPlus,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface AlertContact {
  name: string
  email: string
  type: "email" | "sms" | "webhook"
}

interface Task {
  id: string
  name: string
  type: "industry" | "etf" | "stock"
  status: "running" | "stopped" | "error" | "completed"
  lastRun: string
  nextRun: string
  progress?: {
    current: number
    total: number
    currentSymbol?: string
  }
  config: {
    interval: number
    symbols?: string[]
    alertContacts: AlertContact[]
  }
}

interface DataItem {
  symbol: string
  name: string
  value: number
  change: number
  isAbnormal: boolean
  correctedValue?: number
  pe?: number
  pe_percentile?: number
  pb?: number
  pb_percentile?: number
  ps?: number
  ps_percentile?: number
  dividend_yield?: number
  dividend_yield_percentile?: number
  market_cap?: number
  volume?: number
  revenue_yoy?: number
  smart_valuation?: "低估" | "合理" | "高估"
}

interface ReviewTask {
  taskId: string
  createdAt: string
}

const STOCKS = [
  { value: "AAPL", label: "Apple Inc." },
  { value: "MSFT", label: "Microsoft Corporation" },
  { value: "GOOGL", label: "Alphabet Inc." },
  { value: "AMZN", label: "Amazon.com, Inc." },
  { value: "META", label: "Meta Platforms, Inc." },
  { value: "TSLA", label: "Tesla, Inc." },
  { value: "NVDA", label: "NVIDIA Corporation" },
  { value: "JPM", label: "JPMorgan Chase & Co." },
  { value: "BAC", label: "Bank of America Corp." },
  { value: "WMT", label: "Walmart Inc." },
  { value: "PG", label: "Procter & Gamble Co." },
  { value: "JNJ", label: "Johnson & Johnson" },
  { value: "UNH", label: "UnitedHealth Group Inc." },
  { value: "HD", label: "The Home Depot, Inc." },
  { value: "MA", label: "Mastercard Inc." },
  { value: "INTC", label: "Intel Corporation" },
  { value: "VZ", label: "Verizon Communications Inc." },
  { value: "DIS", label: "The Walt Disney Company" },
  { value: "ADBE", label: "Adobe Inc." },
  { value: "NFLX", label: "Netflix, Inc." }
]

const MOCK_INDUSTRY_DATA = [
  { symbol: "TECH", name: "科技行业", value: 2345.67, change: 2.3 },
  { symbol: "FIN", name: "金融行业", value: 1876.54, change: -1.2 },
  { symbol: "HEALTH", name: "医疗健康", value: 3456.78, change: 1.5 },
  { symbol: "CONS", name: "消费品", value: 1234.56, change: 0.8 },
  { symbol: "ENERGY", name: "能源行业", value: 2789.12, change: -0.7 },
  { symbol: "MATER", name: "原材料", value: 1567.89, change: 1.1 },
  { symbol: "INDUS", name: "工业制造", value: 2123.45, change: -0.5 },
  { symbol: "REAL", name: "房地产", value: 1890.23, change: -1.8 },
  { symbol: "TELE", name: "电信服务", value: 1678.90, change: 0.6 },
  { symbol: "UTIL", name: "公用事业", value: 1456.78, change: 0.3 }
]

const MOCK_ETF_DATA = [
  { symbol: "SPY", name: "标普500ETF", value: 456.78, change: 1.2 },
  { symbol: "QQQ", name: "纳斯达克100", value: 378.90, change: 2.1 },
  { symbol: "IWM", name: "罗素2000", value: 189.45, change: -0.8 },
  { symbol: "EEM", name: "新兴市场", value: 42.31, change: -1.5 },
  { symbol: "VGK", name: "欧洲股市", value: 58.67, change: 0.7 },
  { symbol: "FXI", name: "中国大型股", value: 28.45, change: 1.6 },
  { symbol: "GLD", name: "黄金ETF", value: 178.90, change: -0.4 },
  { symbol: "TLT", name: "长期国债", value: 98.76, change: -0.9 },
  { symbol: "VNQ", name: "房地产ETF", value: 84.52, change: -1.1 },
  { symbol: "XLE", name: "能源行业ETF", value: 76.89, change: 0.5 }
]

export default function TasksPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "industry-task",
      name: "Industry Index Data",
      type: "industry",
      status: "stopped",
      lastRun: "-",
      nextRun: "-",
      config: {
        interval: 60,
        alertContacts: [
          {
            name: "Default User",
            email: "default@example.com",
            type: "email"
          }
        ]
      }
    },
    {
      id: "etf-task",
      name: "ETF Data",
      type: "etf",
      status: "stopped",
      lastRun: "-",
      nextRun: "-",
      config: {
        interval: 60,
        alertContacts: [
          {
            name: "Default User",
            email: "default@example.com",
            type: "email"
          }
        ]
      }
    },
    {
      id: "stock-task-tech",
      name: "Tech Stock Data",
      type: "stock",
      status: "stopped",
      lastRun: "-",
      nextRun: "-",
      config: {
        interval: 60,
        symbols: ["AAPL", "MSFT", "GOOGL", "META", "NVDA", "INTC", "ADBE"],
        alertContacts: [
          {
            name: "Default User",
            email: "default@example.com",
            type: "email"
          }
        ]
      }
    },
    {
      id: "stock-task-finance",
      name: "Finance Stock Data",
      type: "stock",
      status: "stopped",
      lastRun: "-",
      nextRun: "-",
      config: {
        interval: 60,
        symbols: ["JPM", "BAC", "MA"],
        alertContacts: [
          {
            name: "Default User",
            email: "default@example.com",
            type: "email"
          }
        ]
      }
    },
    {
      id: "stock-task-retail",
      name: "Retail Consumer Data",
      type: "stock",
      status: "stopped",
      lastRun: "-",
      nextRun: "-",
      config: {
        interval: 60,
        symbols: ["AMZN", "WMT", "HD", "DIS", "NFLX"],
        alertContacts: [
          {
            name: "默认用户",
            email: "default@example.com",
            type: "email"
          }
        ]
      }
    },
    {
      id: "stock-task-healthcare",
      name: "Healthcare Data",
      type: "stock",
      status: "stopped",
      lastRun: "-",
      nextRun: "-",
      config: {
        interval: 60,
        symbols: ["JNJ", "UNH", "PG"],
        alertContacts: [
          {
            name: "Default User",
            email: "default@example.com",
            type: "email"
          }
        ]
      }
    }
  ])
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [newTaskName, setNewTaskName] = useState("")
  const [selectedType, setSelectedType] = useState<string>("")
  const [updateInterval, setUpdateInterval] = useState<number>(5)
  const [selectedStocks, setSelectedStocks] = useState<string[]>([])
  const [alertContacts, setAlertContacts] = useState<AlertContact[]>([
    { name: "Default User", email: "default@example.com", type: "email" }
  ])
  const [newContactName, setNewContactName] = useState("")
  const [newContactEmail, setNewContactEmail] = useState("")

  const filteredTasks = tasks.filter(task => {
    if (typeFilter !== "all" && task.type !== typeFilter) return false
    if (statusFilter !== "all" && task.status !== statusFilter) return false
    if (searchQuery && !task.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "running":
        return <Badge variant="success"><PlayCircle className="w-4 h-4 mr-1" /> 运行中</Badge>
      case "stopped":
        return <Badge variant="secondary"><StopCircle className="w-4 h-4 mr-1" /> 已停止</Badge>
      case "error":
        return <Badge variant="destructive"><RefreshCw className="w-4 h-4 mr-1" /> 错误</Badge>
      case "completed":
        return <Badge variant="success"><CheckCircle2 className="w-4 h-4 mr-1" /> 已完成</Badge>
      default:
        return null
    }
  }

  const handleAddContact = () => {
    if (!newContactName || !newContactEmail) return

    setAlertContacts(prev => [
      ...prev,
      {
        name: newContactName,
        email: newContactEmail,
        type: "email"
      }
    ])

    setNewContactName("")
    setNewContactEmail("")
  }

  const handleRemoveContact = (index: number) => {
    setAlertContacts(prev => prev.filter((_, i) => i !== index))
  }

  const handleCreateTask = () => {
    if (!newTaskName || !selectedType) return

    const newTask: Task = {
      id: `${selectedType}-${Date.now()}`,
      name: newTaskName,
      type: selectedType as Task["type"],
      status: "stopped",
      lastRun: "-",
      nextRun: "-",
      config: {
        interval: updateInterval,
        alertContacts,
        ...(selectedType === "stock" ? { symbols: selectedStocks } : {})
      }
    }

    setTasks(prev => [...prev, newTask])
    setNewTaskName("")
    setSelectedType("")
    setUpdateInterval(5)
    setSelectedStocks([])
    setAlertContacts([{ name: "默认用户", email: "default@example.com", type: "email" }])
    setIsCreating(false)
  }

  const generateMockData = (type: string, symbol?: string) => {
    const getRandomChange = () => (Math.random() * 6 - 3).toFixed(2)
    const isAbnormal = Math.random() < 0.2

    if (type === "industry") {
      const baseData = MOCK_INDUSTRY_DATA[Math.floor(Math.random() * MOCK_INDUSTRY_DATA.length)]
      return {
        ...baseData,
        change: Number(getRandomChange()),
        isAbnormal,
        pe: Math.random() * 30 + 10,
        pb: Math.random() * 5 + 1,
        ps: Math.random() * 8 + 2,
        dividend_yield: Math.random() * 5,
        market_cap: Math.random() * 1000000000000,
        volume: Math.floor(Math.random() * 10000000),
        revenue_yoy: Number((Math.random() * 40 - 20).toFixed(2))
      }
    } else if (type === "etf") {
      const baseData = MOCK_ETF_DATA[Math.floor(Math.random() * MOCK_ETF_DATA.length)]
      return {
        ...baseData,
        change: Number(getRandomChange()),
        isAbnormal,
        pe: Math.random() * 25 + 12,
        pb: Math.random() * 4 + 1.2,
        ps: Math.random() * 6 + 1.5,
        dividend_yield: Math.random() * 4,
        market_cap: Math.random() * 500000000000,
        volume: Math.floor(Math.random() * 5000000),
        revenue_yoy: Number((Math.random() * 30 - 15).toFixed(2))
      }
    }

    let name = ""
    if (symbol) {
      const stock = STOCKS.find(s => s.value === symbol)
      name = stock ? stock.label : symbol
    } else if (type === "industry") {
      const industries = ["科技", "金融", "医疗", "消费", "能源", "工业", "原材料", "公用事业", "房地产", "通信"]
      name = industries[Math.floor(Math.random() * industries.length)] + "行业指数"
    } else if (type === "etf") {
      const etfTypes = ["科技", "医疗", "金融", "消费", "能源", "中小企业", "创新", "价值", "成长", "红利"]
      name = etfTypes[Math.floor(Math.random() * etfTypes.length)] + "ETF"
    }

    const generatePercentile = () => Math.random() * 100
    const pe = type === "industry" ? Math.random() * 30 + 10 : Math.random() * 50 + 15
    const pb = type === "industry" ? Math.random() * 5 + 1 : Math.random() * 10 + 2
    const ps = type === "industry" ? Math.random() * 3 + 1 : Math.random() * 15 + 3
    const dividend_yield = Math.random() * 5

    const calculateSmartValuation = (pe_percentile: number, pb_percentile: number): "低估" | "合理" | "高估" => {
      const avgPercentile = (pe_percentile + pb_percentile) / 2
      if (avgPercentile < 30) return "低估"
      if (avgPercentile > 70) return "高估"
      return "合理"
    }

    const pe_percentile = generatePercentile()
    const pb_percentile = generatePercentile()

    const baseData: DataItem = {
      symbol: symbol || `${type.toUpperCase()}-${Math.floor(Math.random() * 100)}`,
      name,
      value: Math.random() * 5000 + 3000,
      change: Number(getRandomChange()),
      isAbnormal,
      pe,
      pe_percentile,
      pb,
      pb_percentile,
      ps,
      ps_percentile: generatePercentile(),
      dividend_yield,
      dividend_yield_percentile: generatePercentile(),
      smart_valuation: calculateSmartValuation(pe_percentile, pb_percentile)
    }

    if (type === "stock") {
      return {
        ...baseData,
        market_cap: Math.random() * 1000000000000,
        volume: Math.floor(Math.random() * 10000000),
        revenue_yoy: Number((Math.random() * 40 - 20).toFixed(2)),
      }
    }

    return baseData
  }

  const handleStartTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return

    let total = 0
    if (task.type === "industry") total = 10
    else if (task.type === "etf") total = 20
    else if (task.type === "stock" && task.config.symbols) total = task.config.symbols.length

    const resultData: DataItem[] = []
    let currentIndex = 0

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: "running",
          lastRun: new Date().toLocaleString(),
          nextRun: new Date(Date.now() + t.config.interval * 60000).toLocaleString(),
          progress: {
            current: 0,
            total,
            currentSymbol: task.type === "stock" ? task.config.symbols?.[0] : undefined
          }
        }
      }
      return t
    }))

    const interval = setInterval(() => {
      if (currentIndex >= total) {
        clearInterval(interval)
        setTasks(prev => prev.map(task => {
          if (task.id === taskId) {
            const reviewId = `review-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
            const reviewTask = {
              id: reviewId,
              taskId: task.id,
              taskName: task.name,
              type: task.type,
              status: "pending",
              createdAt: new Date().toISOString(),
              data: resultData
            }

            const currentReviews = JSON.parse(localStorage.getItem("reviews") || "[]") as ReviewTask[]
            const isDuplicate = currentReviews.some((review: ReviewTask) =>
              review.taskId === task.id &&
              new Date(review.createdAt).getTime() === new Date(reviewTask.createdAt).getTime()
            )

            if (!isDuplicate) {
              localStorage.setItem("reviews", JSON.stringify([...currentReviews, reviewTask]))
            }

            return {
              ...task,
              status: "completed" as const,
              progress: undefined
            }
          }
          return task
        }))
        return
      }

      const symbol = task.type === "stock" ? task.config.symbols?.[currentIndex] : undefined
      const newData = generateMockData(task.type, symbol)
      resultData.push(newData)

      setTasks(prev => prev.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            progress: {
              current: currentIndex + 1,
              total,
              currentSymbol: task.type === "stock" ? task.config.symbols?.[currentIndex + 1] : undefined
            }
          }
        }
        return t
      }))

      currentIndex++
    }, 2000)
  }

  const handleStopTask = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          status: "stopped",
          progress: undefined
        }
      }
      return task
    }))
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Task Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage data pull tasks, configure update frequency and notification settings
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Create New Task
        </Button>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search Tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="running">Running</SelectItem>
              <SelectItem value="stopped">Stopped</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Type Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="industry">Industry Index</SelectItem>
              <SelectItem value="etf">ETF Data</SelectItem>
              <SelectItem value="stock">Stock Data</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 桌面端显示表格 */}
      <div className="hidden md:block border rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted">
              <th className="p-4 text-left">Task Name</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Last Run</th>
              <th className="p-4 text-left">Next Run</th>
              <th className="p-4 text-left">Update Frequency</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id} className="border-b">
                <td className="p-4">{task.name}</td>
                <td className="p-4">{task.type}</td>
                <td className="p-4">
                  {getStatusBadge(task.status)}
                  {task.progress && (
                    <div className="mt-2">
                      <Progress value={(task.progress.current / task.progress.total) * 100} />
                      <p className="text-sm text-muted-foreground mt-1">
                        {task.progress.currentSymbol ? `Processing: ${task.progress.currentSymbol}` : null}
                        {task.progress.current}/{task.progress.total}
                      </p>
                    </div>
                  )}
                </td>
                <td className="p-4">{task.lastRun}</td>
                <td className="p-4">{task.nextRun}</td>
                <td className="p-4">{task.config.interval} minutes</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {task.status === "running" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStopTask(task.id)}
                      >
                        <StopCircle className="w-4 h-4 mr-2" />
                        Stop
                      </Button>
                    ) : task.status === "completed" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push("/reviews")}
                      >
                        <History className="w-4 h-4 mr-2" />
                        View Approval
                      </Button>
                    ) : task.status === "stopped" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartTask(task.id)}
                      >
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Start
                      </Button>
                    ) : null}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 移动端显示卡片 */}
      <div className="grid gap-3 md:hidden">
        {filteredTasks.map((task) => (
          <div key={task.id} className="border rounded-lg p-3 space-y-3">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium line-clamp-1">{task.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{task.type}</p>
                </div>
                {getStatusBadge(task.status)}
              </div>
            </div>

            {task.progress && (
              <div className="space-y-2 bg-muted/50 p-2 rounded">
                <Progress value={(task.progress.current / task.progress.total) * 100} />
                <p className="text-sm text-muted-foreground">
                  {task.progress.currentSymbol && (
                    <span className="block">Processing: {task.progress.currentSymbol}</span>
                  )}
                  <span>Progress: {task.progress.current}/{task.progress.total}</span>
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm py-2 border-y">
              <div>
                <p className="text-muted-foreground text-xs">Last Run</p>
                <p className="font-medium">{task.lastRun}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Next Run</p>
                <p className="font-medium">{task.nextRun}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground text-xs">Update Frequency</p>
                <p className="font-medium">{task.config.interval} minutes</p>
              </div>
            </div>

            <div className="flex gap-2">
              {task.status === "running" ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStopTask(task.id)}
                  className="flex-1"
                >
                  <StopCircle className="w-4 h-4 mr-1.5" />
                  Stop
                </Button>
              ) : task.status === "completed" ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/reviews")}
                  className="flex-1"
                >
                  <History className="w-4 h-4 mr-1.5" />
                  View Approval
                </Button>
              ) : task.status === "stopped" ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStartTask(task.id)}
                  className="flex-1"
                >
                  <PlayCircle className="w-4 h-4 mr-1.5" />
                  Start
                </Button>
              ) : null}
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteTask(task.id)}
                className="flex-1"
              >
                <Trash2 className="w-4 h-4 mr-1.5" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-[95vw] w-full sm:max-w-2xl max-h-[85vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl">Create New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm">Task Name</Label>
              <Input
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="Please enter the task name"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm">Task Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Please select the task type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="industry">Industry Index</SelectItem>
                  <SelectItem value="etf">ETF Data</SelectItem>
                  <SelectItem value="stock">Stock Data</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm">Update Frequency (minutes)</Label>
              <Input
                type="number"
                value={updateInterval}
                onChange={(e) => setUpdateInterval(Number(e.target.value))}
                min={1}
              />
            </div>

            {selectedType === "stock" && (
              <div className="space-y-1.5">
                <Label className="text-sm">Select Stocks</Label>
                <Command className="border rounded-md">
                  <CommandInput placeholder="Search Stocks..." />
                  <CommandList className="max-h-[150px] sm:max-h-[200px]">
                    <CommandEmpty>No stocks found</CommandEmpty>
                    <CommandGroup>
                      {STOCKS.map(stock => (
                        <CommandItem
                          key={stock.value}
                          onSelect={() => {
                            setSelectedStocks(prev => {
                              const isSelected = prev.includes(stock.value);
                              if (isSelected) {
                                return prev.filter(s => s !== stock.value);
                              }
                              return [...prev, stock.value];
                            });
                          }}
                          className="py-2"
                        >
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "flex h-4 w-4 items-center justify-center border rounded",
                              selectedStocks.includes(stock.value) ? "bg-primary border-primary text-primary-foreground" : "border-input"
                            )}>
                              {selectedStocks.includes(stock.value) && "✓"}
                            </div>
                            <span>{stock.label}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
                {selectedStocks.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedStocks.map(stockValue => {
                      const stock = STOCKS.find(s => s.value === stockValue);
                      return (
                        <Badge
                          key={stockValue}
                          variant="secondary"
                          className="cursor-pointer py-1"
                          onClick={() => setSelectedStocks(prev => prev.filter(s => s !== stockValue))}
                        >
                          {stock?.label}
                          <X className="w-3 h-3 ml-1" />
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label className="text-sm">Notification Contacts</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddContact}
                  disabled={!newContactName || !newContactEmail}
                >
                  <UserPlus className="w-4 h-4 mr-1.5" />
                  Add Contact
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Input
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  placeholder="Name"
                />
                <Input
                  value={newContactEmail}
                  onChange={(e) => setNewContactEmail(e.target.value)}
                  placeholder="Email"
                />
              </div>
              <div className="space-y-2 mt-2">
                {alertContacts.map((contact, index) => (
                  <div key={index} className="flex justify-between items-center p-2 border rounded bg-muted/50">
                    <div>
                      <p className="font-medium text-sm">{contact.name}</p>
                      <p className="text-xs text-muted-foreground">{contact.email}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveContact(index)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4 sticky bottom-0 bg-background">
              <Button
                variant="outline"
                onClick={() => setIsCreating(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateTask}
                disabled={!newTaskName || !selectedType}
                className="flex-1"
              >
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}