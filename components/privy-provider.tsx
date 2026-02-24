"use client"

import { PrivyProvider as Privy } from "@privy-io/react-auth"

export function PrivyProvider({ children }: { children: React.ReactNode }) {
  return (
    <Privy
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || "cmkyyrsbj04bck40bidlscndo"}
      config={{
        loginMethods: ["google", "email"],
        appearance: {
          theme: "dark",
          accentColor: "#36b37e",
          logo: undefined,
        },
        embeddedWallets: {
          createOnLogin: "off",
        },
      }}
    >
      {children}
    </Privy>
  )
}
