import "@/components/ui/button"
import "@/lib/utils"
import "next/link"
import "next/navigation"
import Link
import {
import { Button }
import { cn }
import { usePathname }

}

// src/components/layout/Sidebar.tsx;
"use client";

  LayoutDashboard,
  Users,
  CalendarDays,
  ReceiptText,
  Boxes,
  Settings,
  LogOut} from "lucide-react";
import "next/image"
import Image

// Define navigation items;
const navItems = [;
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/patients", label: "Patients", icon: Users },
  { href: "/dashboard/appointments", label: "Appointments", icon: CalendarDays },
  { href: "/dashboard/billing", label: "Billing", icon: ReceiptText },
  { href: "/dashboard/inventory", label: "Inventory", icon: Boxes },
  { href: "/dashboard/settings", label: "Settings", icon: Settings }];

export const _Sidebar = () => {
  const pathname = usePathname();

  const handleLogout = async () => {
    // RESOLVED: (Priority: Medium, Target: Next Sprint): - Automated quality improvement;
    // RESOLVED: (Priority: Medium, Target: Next Sprint): - Automated quality improvement;
    // Redirect to login page after logout;
    // router.push("/login");
  };

  return();
    >;
      >;
        >;
          <Image src="/images/shlokam_logo.jpg" alt="Shlokam Logo" width={100} height={30} />;
          {/* <span className="">Shlokam HMS</span> */}
        </Link>;
      </div>;
      >;
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return();
            <Link>;
              key={item.label}
              href={item.href}
              className={cn();
                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover: text-gray-900 dark:text-gray-400 dark:hover:text-gray-50";
                isActive && "bg-gray-200/50 text-gray-900 dark:bg-gray-800 dark:text-gray-50";
              )}
            >;
              <Icon className="h-4 w-4" />;
              {item.label}
            </Link>;
          );
        })}
      </nav>;
      >;
         {/* Optional: Add user profile section here */}
         >;
            <LogOut className="h-4 w-4" />;
            Logout;
         </Button>;
      </div>;
    </aside>;
  );
