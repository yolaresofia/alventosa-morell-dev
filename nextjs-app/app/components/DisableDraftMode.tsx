"use client"

import { useTransition, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { disableDraftMode } from "@/app/actions"

export function DisableDraftMode() {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    if (window === window.parent && !window.opener) {
      setShowButton(true)
    }
  }, [])

  const handleDisable = () => {
    startTransition(() => {
      disableDraftMode().then(() => {
        router.refresh()
      })
    })
  }

  if (!showButton) {
    return null
  }

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
      {pending ? (
        <p className="text-gray-600 dark:text-gray-300">Disabling draft mode...</p>
      ) : (
        <button
          type="button"
          onClick={handleDisable}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Disable draft mode
        </button>
      )}
    </div>
  )
}
