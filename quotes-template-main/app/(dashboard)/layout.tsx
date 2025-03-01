// "use client";
import { notFound } from "next/navigation"


import { getCurrentUser } from "@/lib/session"
import { MainNav } from "@/components/main-nav"

import { SiteFooter } from "@/components/site-footer"
import { UserAccountNav } from "@/components/user-account-nav"
import { getAuthSession } from "@/lib/auth"
import Link from "@/node_modules/next/link"
import { buttonVariants } from "@/components/ui/button"
import { LoggedInNav } from "@/components/loggedin-nav"
import { ModeToggle } from "@/components/toggle"

{/* @ts-ignore */}

interface DashboardLayoutProps {
  children?: React.ReactNode
}

export default async function DashboardLayout({ 
  children, 
}: DashboardLayoutProps) {
  const user = await getCurrentUser()
  const session = await getAuthSession();

  if (!user) {
    return notFound()
  }

  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center py-4 justify-between">
          <LoggedInNav/>
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
          {children}
        </main>
      {/* </div> */}
      <SiteFooter className="border-t" />
  
      </div>
  )
}