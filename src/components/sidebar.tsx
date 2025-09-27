"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Package,
  Settings,
  BarChart3,
  Shield,
  Building2,
  MapPin,
  Truck,
  Anchor,
  Globe,
  Building,
  Tag,
  Layers,
  Plus,
  Book,
  DollarSign,
  User,
  Key,
  Clock,
  Currency,
  CurrencyIcon,
  Ship,
  ContainerIcon,
  DockIcon,
  Luggage,
} from "lucide-react";
import { useRouter, useParams, usePathname } from "next/navigation";
import { TbBasket, TbDashboard } from "react-icons/tb";

interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
  href?: string;
}

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  theme?: "default" | "legacy-dark";
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

// Sidebar dimensions optimized for QuickBooks-style layout
const SIDEBAR_DIMENSIONS = {
  expanded: 200,
  collapsed: 56,
  mobile: 280,
} as const;

// Animation configurations for consistent timing
const ANIMATIONS = {
  sidebar: { duration: 0.28, ease: [0.4, 0, 0.2, 1] },
  submenu: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
  chevron: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
  indicator: { type: "spring", stiffness: 300, damping: 30 },
  backdrop: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
} as const;

export function Sidebar({
  isCollapsed,
  theme = "default",
  isMobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(["setup"])
  );

  const menuItems: MenuItem[] = [
    // DASHBOARD
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <TbDashboard className="w-4 h-4" />,
      href: "/dashboard",
    },
    {
      id: "setup",
      label: "Setup",
      icon: <Settings className="w-4 h-4" />,
      children: [
        {
          id: "Company Profile",
          label: "Company Profile",
          href: "/setup/company-profile",
          icon: <Building2 className="w-3 h-3" />,
        },
        // ITEM SETUP
        {
          id: "item-setup",
          label: "Item Setup",
          icon: <Package className="w-4 h-4" />,
          children: [
            {
              id: "product",
              label: "Product",
              href: "/setup/item-setup/product",
              icon: <Package className="w-3 h-3" />,
            },
            {
              id: "item-type",
              label: "Item Type",
              href: "/setup/item-setup/item-type",
              icon: <Tag className="w-3 h-3" />,
            },
            {
              id: "item-category",
              label: "Item Category",
              href: "/setup/item-setup/item-category",
              icon: <Layers className="w-3 h-3" />,
            },
            {
              id: "uom",
              label: "UOM",
              href: "/setup/item-setup/uom",
              icon: <Plus className="w-3 h-3" />,
            },
            {
              id: "final-destination",
              label: "Final Destination",
              href: "/setup/item-setup/final-destination",
              icon: <MapPin className="w-3 h-3" />,
            },
            {
              id: "port-of-discharge",
              label: "Port of Discharge",
              href: "/setup/item-setup/port-of-discharge",
              icon: <Anchor className="w-3 h-3" />,
            },
          ],
        },
        // ACCOUNTS
        {
          id: "accounts",
          label: "Accounts",
          icon: <Book className="w-4 h-4" />,
          children: [
            {
              id: "currency",
              label: "Currency",
              href: "/setup/accounts/currency",
              icon: <DollarSign className="w-3 h-3" />,
            },
            {
              id: "customer",
              label: "Customer",
              href: "/setup/accounts/customer",
              icon: <User className="w-3 h-3" />,
            },
            {
              id: "vendor",
              label: "Vendor",
              href: "/setup/accounts/vendor",
              icon: <Truck className="w-3 h-3" />,
            },
          ],
        },
        // GENERAL SETUP
        {
          id: "general-setup",
          label: "General Setup",
          icon: <Settings className="w-4 h-4" />,
          children: [
            {
              id: "country",
              label: "Country",
              href: "/setup/general-setup/country",
              icon: <Globe className="w-3 h-3" />,
            },
            {
              id: "city",
              label: "City",
              href: "/setup/general-setup/city",
              icon: <Building className="w-3 h-3" />,
            },
            {
              id: "shipping",
              label: "Shipping Line",
              href: "/setup/general-setup/shipping-line",
              icon: <Ship className="w-3 h-3" />,
            },
            {
              id: "consignee",
              label: "Consignee",
              href: "/setup/general-setup/consignee",
              icon: <User className="w-3 h-3" />,
            },
            {
              id: "status",
              label: "Shipping Status",
              href: "/setup/general-setup/shipping-status",
              icon: <User className="w-3 h-3" />,
            },
          ],
        },
      ],
    },
    // ENTRY
    {
      id: "entry",
      label: "Entry",
      icon: <Plus className="w-4 h-4" />,
      href: "/entry",
      children: [
        {
          id: "scm",
          label: "SCM",
          icon: <TbBasket className="w-3 h-3" />,
          children: [
            {
              id: "purchase",
              label: "Purchase",
              icon: <CurrencyIcon className="w-3 h-3" />,
              children: [
                {
                  id: "purchase-order",
                  label: "Purchase Order",
                  href: "/entry/scm/purchase/purchase-order",
                  icon: <Book className="w-3 h-3" />,
                },
                {
                  id: "in-transit",
                  label: "In Transit",
                  href: "/entry/scm/purchase/in-transit",
                  icon: <ContainerIcon className="w-3 h-3" />,
                },
                {
                  id: "telex-status",
                  label: "Telex Status",
                  href: "/entry/scm/purchase/telex-status",
                  icon: <DockIcon className="w-3 h-3" />,
                },
                {
                  id: "inventory-onboard",
                  label: "Inventory Onboard",
                  href: "/entry/scm/purchase/inventory-onboard",
                  icon: <Luggage className="w-3 h-3" />,
                },
                {
                  id: "goods-receipt",
                  label: "Goods Receipt",
                  href: "/goods-receipt",
                  icon: <Package className="w-3 h-3" />,
                },
                {
                  id: "purchase-invoice",
                  label: "Purchase Invoice",
                  href: "/purchase-invoice",
                  icon: <Truck className="w-3 h-3" />,
                },
              ],
            },
            {
              id: "sale",
              label: "Sale",
              icon: <Currency className="w-3 h-3" />,
            },
            {
              id: "inventory",
              label: "Inventory",
              icon: <TbBasket className="w-3 h-3" />,
            },
          ],
        },
      ],
    },
    // REPORT
    {
      id: "report",
      label: "Report",
      icon: <BarChart3 className="w-4 h-4" />,
      href: "/report",
    },
    // SECURITY
    {
      id: "security",
      label: "Security",
      icon: <Shield className="w-4 h-4" />,
      children: [
        {
          id: "user-type",
          label: "User Type",
          href: "/user-type",
          icon: <User className="w-3 h-3" />,
        },
        {
          id: "create-user",
          label: "Create User",
          href: "/create-user",
          icon: <User className="w-3 h-3" />,
        },
        {
          id: "audit-log",
          label: "Audit Log",
          href: "/audit-log",
          icon: <Clock className="w-3 h-3" />,
        },
        {
          id: "change-password",
          label: "Change Password",
          href: "/change-password",
          icon: <Key className="w-3 h-3" />,
        },
      ],
    },
  ];

  // Add router for navigation
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const currentUser = params?.user || "default-user"; // Get user from URL params

  // Function to determine if an item is active based on current pathname
  const isItemActive = (item: MenuItem): boolean => {
    if (!item.href) return false;
    const expectedPath = `/${currentUser}${item.href}`;
    return pathname === expectedPath;
  };

  // Function to find active item from current pathname
  const findActiveItem = (items: MenuItem[]): string | null => {
    for (const item of items) {
      if (isItemActive(item)) {
        return item.id;
      }
      if (item.children) {
        const activeChild = findActiveItem(item.children);
        if (activeChild) return activeChild;
      }
    }
    return null;
  };

  const activeItem = findActiveItem(menuItems) || "dashboard";

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const isExpanded = expandedItems.has(item.id);
    const isActive = isItemActive(item);
    const hasChildren = Boolean(item.children?.length);

    // Dynamic styling based on hierarchy level
    const menuItemStyles = {
      padding: level === 0 ? "pl-3" : level === 1 ? "pl-5" : "pl-7",
      textSize: level === 0 ? "text-sm" : level === 1 ? "text-sm" : "text-xs",
    };

    const handleMenuClick = () => {
      if (hasChildren) {
        toggleExpanded(item.id);
      } else {
        // Navigate if href is provided
        if (item.href) {
          // Create dynamic route with user parameter
          const dynamicRoute = `/${currentUser}${item.href}`;
          router.push(dynamicRoute);
          // Close mobile sidebar after navigation
          if (onMobileClose) {
            onMobileClose();
          }
        }
      }
    };

    return (
      <div key={item.id} className="w-full">
        <motion.button
          onClick={handleMenuClick}
          className={`
            w-full flex items-center justify-between py-2.5 px-2 ${
              menuItemStyles.padding
            }
            text-left rounded-lg transition-all duration-150 ease-in-out group
            ${
              isActive
                ? "bg-blue-600 text-white font-semibold shadow-sm"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }
            ${menuItemStyles.textSize} relative
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.1 }}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {item.icon && (
              <span
                className={`flex-shrink-0 ${
                  isActive
                    ? "text-white"
                    : "text-gray-400 group-hover:text-gray-200"
                }`}
              >
                {item.icon}
              </span>
            )}
            {!isCollapsed && (
              <span className="font-medium truncate">{item.label}</span>
            )}
          </div>
          {!isCollapsed && hasChildren && (
            <motion.span
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={ANIMATIONS.chevron}
              className="flex-shrink-0 ml-2"
            >
              <ChevronRight
                className={`w-4 h-4 transition-colors duration-150 ${
                  isActive
                    ? "text-white"
                    : "text-gray-400 group-hover:text-gray-200"
                }`}
              />
            </motion.span>
          )}

          {/* Active indicator */}
          {isActive && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute left-0 top-0 w-1 h-full bg-blue-400 rounded-r-sm"
              initial={false}
              transition={ANIMATIONS.indicator}
            />
          )}
        </motion.button>

        {/* Submenu */}
        <AnimatePresence>
          {!isCollapsed && hasChildren && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={ANIMATIONS.submenu}
              className="overflow-hidden"
            >
              <div className="py-1 space-y-1">
                {item.children?.map((child) =>
                  renderMenuItem(child, level + 1)
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tooltip for collapsed state */}
        {isCollapsed && (
          <div className="absolute left-full top-0 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-gray-700">
            {item.label}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 border-l border-b border-gray-700 rotate-45"></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={ANIMATIONS.backdrop}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed
            ? SIDEBAR_DIMENSIONS.collapsed
            : SIDEBAR_DIMENSIONS.expanded,
        }}
        transition={ANIMATIONS.sidebar}
        className={`
          bg-[#282828] border-r border-gray-200 h-screen flex flex-col
          shadow-lg shrink-0 relative
          ${theme === "default" ? "bg-gray-800 text-white border-gray-700" : ""}
          lg:flex
          ${isMobileOpen ? "flex fixed top-0 left-0 z-50" : "hidden lg:flex"}
        `}
        style={{
          width: isMobileOpen ? SIDEBAR_DIMENSIONS.mobile : undefined,
        }}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-600 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <h2 className="text-lg font-semibold text-white truncate">
                    PolyTex
                  </h2>
                  <p className="text-xs text-gray-400 truncate">Supply Chain</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-2 overflow-y-auto sidebar-scroll">
          <nav className="space-y-1 px-2">
            {menuItems.map((item) => renderMenuItem(item))}
          </nav>
        </div>

        {/* Footer */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="p-4 border-t border-gray-600 flex-shrink-0"
            >
              <div className="text-xs text-gray-400 text-center w-full">
                <div className="truncate">PolyTex Supply Chain Management</div>
                <span className="text-[10px] opacity-75 block mt-1">
                  v1.0.0
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>
    </>
  );
}
