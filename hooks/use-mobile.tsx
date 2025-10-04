"use client"

import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    // Set initial state using media query result (more reliable on mobile browsers)
    setIsMobile(mql.matches)

    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
    }

    // Safari compatibility: addEventListener is preferred, but addListener exists on older engines
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", onChange)
      return () => mql.removeEventListener("change", onChange)
    } else {
      // @ts-ignore - older Safari
      mql.addListener(onChange)
      return () => {
        // @ts-ignore - older Safari
        mql.removeListener(onChange)
      }
    }
  }, [])

  return !!isMobile
}
