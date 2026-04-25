export type AdminNavItem = {
  href: string;
  label: string;
};

/** Dashboard is exact `/` only; other items match prefix for nested routes. */
export function isNavActive(pathname: string, item: AdminNavItem): boolean {
  if (item.href === "/") return pathname === "/";
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export const adminNav: AdminNavItem[] = [
  { href: "/", label: "Dashboard" },
  { href: "/projects", label: "Projects" },
];
