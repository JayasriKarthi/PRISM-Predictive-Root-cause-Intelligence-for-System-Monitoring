import axios from "axios"

const API_BASE_URL = "http://localhost:8000"

export interface SRE {
  id: string
  name: string
  email: string
  assignedSystem: string
  status: "active" | "inactive"
  createdAt: string
}

// Backend API response format
interface BackendSREResponse {
  id: number
  name: string
  email: string
  status: string
  assigned_system: string | null
}

// Backend API request format
interface BackendSRECreate {
  name: string
  email: string
  status?: string
  assigned_system?: string | null
}

export interface SystemManagement {
  id: string
  name: string
  status: "operational" | "degraded" | "down"
  lastUpdated: string
  description: string
}

// Helper function to convert backend format to frontend format
const mapBackendToFrontend = (backendSRE: BackendSREResponse): SRE => {
  return {
    id: String(backendSRE.id),
    name: backendSRE.name,
    email: backendSRE.email,
    assignedSystem: backendSRE.assigned_system || "Unassigned",
    status: backendSRE.status === "active" ? "active" : "inactive",
    createdAt: new Date().toISOString(), // Backend doesn't return createdAt, so we use current time
  }
}

// Helper function to convert frontend format to backend format
const mapFrontendToBackend = (frontendSRE: Omit<SRE, "id" | "createdAt">): BackendSRECreate => {
  return {
    name: frontendSRE.name,
    email: frontendSRE.email,
    status: frontendSRE.status || "active",
    assigned_system: frontendSRE.assignedSystem === "Unassigned" ? null : frontendSRE.assignedSystem,
  }
}

const mockSystems: SystemManagement[] = [
  {
    id: "1",
    name: "Payment System",
    status: "operational",
    lastUpdated: new Date().toISOString(),
    description: "Handles all payment transactions",
  },
  {
    id: "2",
    name: "Auth Service",
    status: "operational",
    lastUpdated: new Date().toISOString(),
    description: "Manages user authentication and authorization",
  },
  {
    id: "3",
    name: "Database Cluster",
    status: "operational",
    lastUpdated: new Date().toISOString(),
    description: "Primary data storage and replication",
  },
]

// SRE Management API
export const sreAPI = {
  getAllSREs: async (): Promise<SRE[]> => {
    try {
      const response = await axios.get<BackendSREResponse[]>(`${API_BASE_URL}/sre`)
      return response.data.map(mapBackendToFrontend)
    } catch (error) {
      console.error("Error fetching SREs:", error)
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || "Failed to fetch SREs")
      }
      throw new Error("Failed to fetch SREs")
    }
  },

  addSRE: async (sre: Omit<SRE, "id" | "createdAt">): Promise<{ success: boolean; data?: SRE; message: string }> => {
    try {
      if (!sre.name || !sre.email) {
        return { success: false, message: "Name and email are required" }
      }

      const backendData = mapFrontendToBackend(sre)
      const response = await axios.post<BackendSREResponse>(`${API_BASE_URL}/sre`, backendData)
      const frontendSRE = mapBackendToFrontend(response.data)

      return { success: true, data: frontendSRE, message: "SRE added successfully" }
    } catch (error) {
      console.error("Error adding SRE:", error)
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.detail || "Failed to add SRE"
        return { success: false, message: errorMessage }
      }
      return { success: false, message: "Failed to add SRE" }
    }
  },

  updateSRE: async (
    id: string,
    updates: Partial<Omit<SRE, "id" | "createdAt">>,
  ): Promise<{ success: boolean; data?: SRE; message: string }> => {
    try {
      const backendData: Partial<BackendSRECreate> = {}
      if (updates.name) backendData.name = updates.name
      if (updates.email) backendData.email = updates.email
      if (updates.status) backendData.status = updates.status
      if (updates.assignedSystem !== undefined) {
        backendData.assigned_system = updates.assignedSystem === "Unassigned" ? null : updates.assignedSystem
      }

      const response = await axios.put<BackendSREResponse>(`${API_BASE_URL}/sre/${id}`, backendData)
      const frontendSRE = mapBackendToFrontend(response.data)

      return { success: true, data: frontendSRE, message: "SRE updated successfully" }
    } catch (error) {
      console.error("Error updating SRE:", error)
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.detail || "Failed to update SRE"
        return { success: false, message: errorMessage }
      }
      return { success: false, message: "Failed to update SRE" }
    }
  },

  deleteSRE: async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      await axios.delete(`${API_BASE_URL}/sre/${id}`)
      return { success: true, message: "SRE deleted successfully" }
    } catch (error) {
      console.error("Error deleting SRE:", error)
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.detail || "Failed to delete SRE"
        return { success: false, message: errorMessage }
      }
      return { success: false, message: "Failed to delete SRE" }
    }
  },

  toggleSREStatus: async (id: string): Promise<{ success: boolean; data?: SRE; message: string }> => {
    try {
      const response = await axios.patch<BackendSREResponse>(`${API_BASE_URL}/sre/${id}/status`)
      const frontendSRE = mapBackendToFrontend(response.data)

      return { success: true, data: frontendSRE, message: `SRE status changed to ${frontendSRE.status}` }
    } catch (error) {
      console.error("Error toggling SRE status:", error)
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.detail || "Failed to toggle SRE status"
        return { success: false, message: errorMessage }
      }
      return { success: false, message: "Failed to toggle SRE status" }
    }
  },
}

// System Management API
export const systemAPI = {
  getAllSystems: async (): Promise<SystemManagement[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockSystems])
      }, 300)
    })
  },

  addSystem: async (
    system: Omit<SystemManagement, "id" | "lastUpdated">,
  ): Promise<{ success: boolean; data?: SystemManagement; message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!system.name || !system.description) {
          resolve({ success: false, message: "Name and description are required" })
          return
        }

        const newSystem: SystemManagement = {
          ...system,
          id: String(mockSystems.length + 1),
          lastUpdated: new Date().toISOString(),
        }

        mockSystems.push(newSystem)
        resolve({ success: true, data: newSystem, message: "System added successfully" })
      }, 400)
    })
  },

  updateSystem: async (
    id: string,
    updates: Partial<Omit<SystemManagement, "id" | "lastUpdated">>,
  ): Promise<{ success: boolean; data?: SystemManagement; message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockSystems.findIndex((s) => s.id === id)
        if (index === -1) {
          resolve({ success: false, message: "System not found" })
          return
        }

        mockSystems[index] = {
          ...mockSystems[index],
          ...updates,
          lastUpdated: new Date().toISOString(),
        }
        resolve({ success: true, data: mockSystems[index], message: "System updated successfully" })
      }, 400)
    })
  },

  deleteSystem: async (id: string): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockSystems.findIndex((s) => s.id === id)
        if (index === -1) {
          resolve({ success: false, message: "System not found" })
          return
        }

        mockSystems.splice(index, 1)
        resolve({ success: true, message: "System deleted successfully" })
      }, 400)
    })
  },
}
