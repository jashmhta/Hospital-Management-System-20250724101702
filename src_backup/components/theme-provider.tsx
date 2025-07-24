import "react"
import * as React

}

"use client";

export const _ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  return <NextThemesProvider {...props}>{children}>;
