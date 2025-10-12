"use client"

import React from "react"
import { Menu, Search, Sun, Moon, Bell } from "lucide-react"
import { useTheme } from "@/components/theme/ThemeProvider"

type HeaderProps = {
	onMenuToggle?: () => void
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { theme, toggle } = useTheme()

	return (
		<div className="flex h-16 items-center gap-4 px-4 md:px-6">
			{/* hamburguesa: visible en pantallas < lg */}
			<button
				type="button"
				aria-label="Toggle menu"
				onClick={onMenuToggle}
				className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-slate-100 h-10 w-10 lg:hidden"
			>
				<Menu className="h-5 w-5 text-slate-700 dark:text-slate-200" />
			</button>

			{/* Search: ocupa el espacio disponible, en pantallas pequeñas muestra solo icono y se expande en focus */}
			<div className="flex-1 max-w-xl">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-400" />
					<input
						type="search"
						aria-label="Buscar productos, pedidos, clientes"
						placeholder="Buscar productos, pedidos, clientes..."
						className="flex h-10 w-full rounded-md border px-3 py-2 text-sm placeholder:text-muted-foreground pl-10 bg-slate-50 border-slate-200 focus:bg-white focus:border-cyan-500 transition-all dark:bg-slate-800 dark:border-slate-700 dark:focus:bg-slate-900"
					/>
				</div>
			</div>

			{/* Right controls */}
			<div className="flex items-center gap-2">
				{/* theme toggle */}
				<button
					type="button"
					aria-label="Toggle theme"
					onClick={toggle}
					className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring h-10 w-10 hover:bg-slate-100 dark:hover:bg-slate-700"
				>
					{theme === "dark" ? <Sun className="h-5 w-5 text-slate-100" /> : <Moon className="h-5 w-5 text-slate-700" />}
				</button>

				{/* notifications */}
				<button
					type="button"
					aria-label="Notifications"
					className="relative inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring h-10 w-10 hover:bg-slate-100 dark:hover:bg-slate-700"
				>
					<Bell className="h-5 w-5 text-slate-700 dark:text-slate-200" />
					<span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
				</button>

				{/* profile */}
				<button
					type="button"
					className="inline-flex items-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring h-10 px-3 py-2 gap-2 hover:bg-slate-100 dark:hover:bg-slate-700"
				>
					<div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-semibold">U</div>
					<div className="hidden md:block text-left">
						<p className="text-sm font-medium text-slate-900 dark:text-slate-100">Usuario</p>
						<p className="text-xs text-slate-500 dark:text-slate-400">admin@ejemplo.com</p>
					</div>
				</button>
			</div>
		</div>
	)
}

export default Header
