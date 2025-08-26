import Link from "next/link";
import { SVGProps } from "react";

const styles = {
  layout: "h-screen grid grid-cols-[240px_1fr]",
  sidebar: "border-r bg-gray-100/40 dark:bg-gray-800/40",
  sidebarContent: "flex h-full max-h-screen flex-col gap-2",
  header: "flex h-[60px] items-center border-b px-6",
  headerLink: "flex items-center gap-2 font-semibold",
  headerIcon: "h-6 w-6",
  headerText: "",
  navigation: "flex-1 overflow-auto py-2",
  navGrid: "grid items-start px-4 text-sm font-medium",
  navLink:
    "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
  navIcon: "h-4 w-4",
  main: "flex flex-col overflow-scroll",
};

export default function DashboardLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <div className={styles.layout}>
      <nav className={styles.sidebar}>
        <div className={styles.sidebarContent}>
          <div className={styles.header}>
            <Link className={styles.headerLink} href="/dashboard">
              <LayoutDashboardIcon className={styles.headerIcon} />
              <span className={styles.headerText}>Dashboard</span>
            </Link>
          </div>
          <div className={styles.navigation}>
            <nav className={styles.navGrid}>
              <Link className={styles.navLink} href="/dashboard/summaries">
                <ViewIcon className={styles.navIcon} />
                Summaries
              </Link>

              <Link className={styles.navLink} href="/dashboard/account">
                <UsersIcon className={styles.navIcon} />
                Account
              </Link>
            </nav>
          </div>
        </div>
      </nav>
      <main className={styles.main}>{children}</main>
    </div>
  );
}

function LayoutDashboardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}

function PieChartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  );
}

function UsersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ViewIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12s2.545-5 7-5c4.454 0 7 5 7 5s-2.546 5-7 5c-4.455 0-7-5-7-5z" />
      <path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
      <path d="M21 17v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2" />
      <path d="M21 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2" />
    </svg>
  );
}