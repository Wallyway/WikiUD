// "use client";
import { notFound } from "next/navigation"
import { getCurrentUser } from "@/lib/session"
import { SiteFooter } from "@/components/site-footer"
import { UserAccountNav } from "@/components/user-account-nav"
import { LoggedInNav } from "@/components/loggedin-nav"
import { ModeToggle } from "@/components/toggle"
import { BGPattern } from "@/components/ui/bg-pattern"
import MobileNav from "@/components/mobile-nav"

{/* @ts-ignore */ }

export const dynamic = 'force-dynamic'
interface DashboardLayoutProps {
  children?: React.ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await getCurrentUser()

  if (!user) {
    return notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">

      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center py-4 justify-between">
          <MobileNav />
          <LoggedInNav />
          <div className="flex items-center gap-4 mx-2">
            <ModeToggle />
            <UserAccountNav
              user={{
                name: user.name,
                image: user.image,
                email: user.email,
              }}
            />

          </div>
        </div>

      </header>
      <main className="flex w-full flex-1 flex-col justify-center">
        <BGPattern mask="fade-edges" size={32} fill="hsl(var(--muted))" />
        {children}
      </main>
      {/* </div> */}
      <SiteFooter className="border-t" />

    </div>
  )
}