"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export type ThemeProviderProps = React.ComponentPropsWithoutRef<typeof NextThemesProvider>

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}