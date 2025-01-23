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

export default function TasksPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "industry-task",
      name: "行业指数数据",
      type: "industry",
      status: "stopped",
      lastRun: "-",
      nextRun: "-",
      config: {
        interval: 60,
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
      id: "etf-task",
      name: "ETF数据",
      type: "etf",
      status: "stopped",
      lastRun: "-",
      nextRun: "-",
      config: {
        interval: 60,
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
      id: "stock-task-tech",
      name: "科技股数据",
      type: "stock",
      status: "stopped",
      lastRun: "-",
      nextRun: "-",
      config: {
        interval: 60,
        symbols: ["AAPL", "MSFT", "GOOGL", "META", "NVDA", "INTC", "ADBE"],
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
      id: "stock-task-finance",
      name: "金融股数据",
      type: "stock",
      status: "stopped",
      lastRun: "-",
      nextRun: "-",
      config: {
        interval: 60,
        symbols: ["JPM", "BAC", "MA"],
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
      id: "stock-task-retail",
      name: "零售消费数据",
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
      name: "医疗保健数据",
      type: "stock",
      status: "stopped",
      lastRun: "-",
      nextRun: "-",
      config: {
        interval: 60,
        symbols: ["JNJ", "UNH", "PG"],
        alertContacts: [
          {
            name: "默认用户",
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
    { name: "默认用户", email: "default@example.com", type: "email" }
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

  const generateMockData = (type: string, symbol?: string): DataItem => {
    const baseValue = type === "industry" ? Math.random() * 5000 + 3000 :
                     type === "etf" ? Math.random() * 100 + 50 :
                     Math.random() * 1000 + 100

    const change = (Math.random() - 0.5) * (
      type === "industry" ? 5 :
      type === "etf" ? 3 :
      10
    )

    const isAbnormal = Math.random() < (
      type === "industry" ? 0.1 :
      type === "etf" ? 0.15 :
      0.2
    )

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
      value: baseValue,
      change,
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
        revenue_yoy: (Math.random() - 0.3) * 100,
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
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">任务管理</h1>
          <p className="text-sm text-muted-foreground">
            管理数据拉取任务，配置更新频率和通知设置
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          新建任务
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex items-center gap-2 flex-1">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="搜索任务..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="状态筛选" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="running">运行中</SelectItem>
            <SelectItem value="stopped">已停止</SelectItem>
            <SelectItem value="error">错误</SelectItem>
            <SelectItem value="completed">已完成</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="类型筛选" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部类型</SelectItem>
            <SelectItem value="industry">行业指数</SelectItem>
            <SelectItem value="etf">ETF数据</SelectItem>
            <SelectItem value="stock">股票数据</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted">
              <th className="p-4 text-left">任务名称</th>
              <th className="p-4 text-left">类型</th>
              <th className="p-4 text-left">状态</th>
              <th className="p-4 text-left">上次运行</th>
              <th className="p-4 text-left">下次运行</th>
              <th className="p-4 text-left">更新频率</th>
              <th className="p-4 text-left">操作</th>
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
                        {task.progress.currentSymbol ? `处理: ${task.progress.currentSymbol}` : null}
                        {task.progress.current}/{task.progress.total}
                      </p>
                    </div>
                  )}
                </td>
                <td className="p-4">{task.lastRun}</td>
                <td className="p-4">{task.nextRun}</td>
                <td className="p-4">{task.config.interval}分钟</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {task.status === "running" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStopTask(task.id)}
                      >
                        <StopCircle className="w-4 h-4 mr-2" />
                        停止
                      </Button>
                    ) : task.status === "completed" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push("/reviews")}
                      >
                        <History className="w-4 h-4 mr-2" />
                        查看审批
                      </Button>
                    ) : task.status === "stopped" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartTask(task.id)}
                      >
                        <PlayCircle className="w-4 h-4 mr-2" />
                        启动
                      </Button>
                    ) : null}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      删除
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新建任务</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>任务名称</Label>
              <Input
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="请输入任务名称"
              />
            </div>

            <div className="space-y-2">
              <Label>任务类型</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择任务类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="industry">行业指数</SelectItem>
                  <SelectItem value="etf">ETF数据</SelectItem>
                  <SelectItem value="stock">股票数据</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>更新频率（分钟）</Label>
              <Input
                type="number"
                value={updateInterval}
                onChange={(e) => setUpdateInterval(Number(e.target.value))}
                min={1}
              />
            </div>

            {selectedType === "stock" && (
              <div className="space-y-2">
                <Label>选择股票</Label>
                <Command className="border rounded-md">
                  <CommandInput placeholder="搜索股票..." />
                  <CommandList>
                    <CommandEmpty>未找到股票</CommandEmpty>
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
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedStocks.map(stockValue => {
                      const stock = STOCKS.find(s => s.value === stockValue);
                      return (
                        <Badge
                          key={stockValue}
                          variant="secondary"
                          className="cursor-pointer"
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

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>通知联系人</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddContact}
                  disabled={!newContactName || !newContactEmail}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  添加联系人
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  placeholder="姓名"
                />
                <Input
                  value={newContactEmail}
                  onChange={(e) => setNewContactEmail(e.target.value)}
                  placeholder="邮箱"
                />
              </div>
              <div className="space-y-2">
                {alertContacts.map((contact, index) => (
                  <div key={index} className="flex justify-between items-center p-2 border rounded">
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-muted-foreground">{contact.email}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveContact(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsCreating(false)}
              >
                取消
              </Button>
              <Button
                onClick={handleCreateTask}
                disabled={!newTaskName || !selectedType}
              >
                创建
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}