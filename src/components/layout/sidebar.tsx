"use client"

import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  ListTodo,
  ClipboardCheck,
  Settings,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname()

  const routes = [
    {
      label: "数据概览",
      icon: LayoutDashboard,
      href: "/",
      color: "text-sky-500"
    },
    {
      label: "任务管理",
      icon: ListTodo,
      href: "/tasks",
      color: "text-violet-500"
    },
    {
      label: "数据审批",
      icon: ClipboardCheck,
      href: "/reviews",
      color: "text-green-500"
    },
    {
      label: "系统设置",
      icon: Settings,
      href: "/settings",
      color: "text-gray-500"
    }
  ]

  return (
    <div className={cn("pb-12 min-h-screen", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">
            金融数据平台
          </h2>
          <div className="space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                  pathname === route.href ? "text-primary bg-primary/10" : "text-muted-foreground",
                )}
              >
                <div className="flex items-center flex-1">
                  <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                  {route.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 