"use client"

import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  ListTodo,
  ClipboardCheck,
  Settings,
  Menu,
  X
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    setMounted(true)

    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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

  const SidebarContent = () => (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Akulaku Financial Data Platform
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
  )

  // 在组件挂载前返回空内容或加载状态
  if (!mounted) {
    return null
  }

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden fixed top-3 left-4 z-50 bg-background"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <div className="flex justify-between items-center p-4 border-b">
            <SheetTitle>Akulaku Financial Data Platform</SheetTitle>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </SheetTrigger>
          </div>
          <SidebarContent />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div className={cn("pb-12 w-72 border-r min-h-screen hidden md:block", className)}>
      <SidebarContent />
    </div>
  )
}