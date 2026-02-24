"use client"

import { PrivyProvider } from "@privy-io/react-auth"

export function RegenmonPrivyProvider({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId="cmkyyrsbj04bck40bidlscndo"
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#ff8c00",
        },
        loginMethods: ["email", "google"],
      }}
    >
      {children}
    </PrivyProvider>
  )
}
