"use client"

import { createContext, useContext, type ReactNode, useState, useCallback } from "react"
import { sreAPI, systemAPI, type SRE, type SystemManagement } from "../services/sre-api"

interface SREContextType {
  sres: SRE[]
  systems: SystemManagement[]
  isLoading: boolean
  error: string | null
  loadSREs: () => Promise<void>
  loadSystems: () => Promise<void>
  addSRE: (sre: Omit<SRE, "id" | "createdAt">) => Promise<boolean>
  updateSRE: (id: string, updates: Partial<Omit<SRE, "id" | "createdAt">>) => Promise<boolean>
  deleteSRE: (id: string) => Promise<boolean>
  toggleSREStatus: (id: string) => Promise<boolean>
  addSystem: (system: Omit<SystemManagement, "id" | "lastUpdated">) => Promise<boolean>
  updateSystem: (id: string, updates: Partial<Omit<SystemManagement, "id" | "lastUpdated">>) => Promise<boolean>
  deleteSystem: (id: string) => Promise<boolean>
  clearError: () => void
}

const SREContext = createContext<SREContextType | undefined>(undefined)

export function SREProvider({ children }: { children: ReactNode }) {
  const [sres, setSREs] = useState<SRE[]>([])
  const [systems, setSystems] = useState<SystemManagement[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => setError(null), [])

  const loadSREs = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await sreAPI.getAllSREs()
      setSREs(data)
    } catch (err) {
      setError("Failed to load SREs")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadSystems = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await systemAPI.getAllSystems()
      setSystems(data)
    } catch (err) {
      setError("Failed to load systems")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addSRE = useCallback(async (sre: Omit<SRE, "id" | "createdAt">): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await sreAPI.addSRE(sre)
      if (response.success && response.data) {
        setSREs((prev) => [...prev, response.data!])
        return true
      } else {
        setError(response.message)
        return false
      }
    } catch (err) {
      setError("Failed to add SRE")
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateSRE = useCallback(
    async (id: string, updates: Partial<Omit<SRE, "id" | "createdAt">>): Promise<boolean> => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await sreAPI.updateSRE(id, updates)
        if (response.success && response.data) {
          setSREs((prev) => prev.map((s) => (s.id === id ? response.data! : s)))
          return true
        } else {
          setError(response.message)
          return false
        }
      } catch (err) {
        setError("Failed to update SRE")
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  const deleteSRE = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await sreAPI.deleteSRE(id)
      if (response.success) {
        setSREs((prev) => prev.filter((s) => s.id !== id))
        return true
      } else {
        setError(response.message)
        return false
      }
    } catch (err) {
      setError("Failed to delete SRE")
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const toggleSREStatus = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await sreAPI.toggleSREStatus(id)
      if (response.success && response.data) {
        setSREs((prev) => prev.map((s) => (s.id === id ? response.data! : s)))
        return true
      } else {
        setError(response.message)
        return false
      }
    } catch (err) {
      setError("Failed to toggle SRE status")
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addSystem = useCallback(async (system: Omit<SystemManagement, "id" | "lastUpdated">): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await systemAPI.addSystem(system)
      if (response.success && response.data) {
        setSystems((prev) => [...prev, response.data!])
        return true
      } else {
        setError(response.message)
        return false
      }
    } catch (err) {
      setError("Failed to add system")
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateSystem = useCallback(
    async (id: string, updates: Partial<Omit<SystemManagement, "id" | "lastUpdated">>): Promise<boolean> => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await systemAPI.updateSystem(id, updates)
        if (response.success && response.data) {
          setSystems((prev) => prev.map((s) => (s.id === id ? response.data! : s)))
          return true
        } else {
          setError(response.message)
          return false
        }
      } catch (err) {
        setError("Failed to update system")
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  const deleteSystem = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await systemAPI.deleteSystem(id)
      if (response.success) {
        setSystems((prev) => prev.filter((s) => s.id !== id))
        return true
      } else {
        setError(response.message)
        return false
      }
    } catch (err) {
      setError("Failed to delete system")
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <SREContext.Provider
      value={{
        sres,
        systems,
        isLoading,
        error,
        loadSREs,
        loadSystems,
        addSRE,
        updateSRE,
        deleteSRE,
        toggleSREStatus,
        addSystem,
        updateSystem,
        deleteSystem,
        clearError,
      }}
    >
      {children}
    </SREContext.Provider>
  )
}

export function useSRE() {
  const context = useContext(SREContext)
  if (context === undefined) {
    throw new Error("useSRE must be used within SREProvider")
  }
  return context
}
