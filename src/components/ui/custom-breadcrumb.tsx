import React from "react"
import { ChevronRight, Home } from "lucide-react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface CustomBreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export const CustomBreadcrumb: React.FC<CustomBreadcrumbProps> = ({ items, className = "" }) => {
  const { t } = useTranslation()

  return (
    <nav className={`flex items-center space-x-1 text-sm text-muted-foreground ${className}`}>
      <Link
        to="/"
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
        <span className="ml-1">{t('common.home')}</span>
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-4 w-4" />
          {item.href && index < items.length - 1 ? (
            <Link
              to={item.href}
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}