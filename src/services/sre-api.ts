export interface SRE {
  id: string
  name: string
  email: string
  assignedSystem: string
  status: "active" | "inactive"
  createdAt: string
}

export interface SystemManagement {
  id: string
  name: string
  status: "operational" | "degraded" | "down"
  lastUpdated: string
  description: string
}

// Mock SRE database
const mockSREs: SRE[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    assignedSystem: "Payment System",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    assignedSystem: "Auth Service",
    status: "active",
    createdAt: new Date().toISOString(),
  },
]

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
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockSREs])
      }, 300)
    })
  },

  addSRE: async (sre: Omit<SRE, "id" | "createdAt">): Promise<{ success: boolean; data?: SRE; message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!sre.name || !sre.email) {
          resolve({ success: false, message: "Name and email are required" })
          return
        }

        if (!sre.email.includes("@")) {
          resolve({ success: false, message: "Invalid email format" })
          return
        }

        const newSRE: SRE = {
          ...sre,
          id: String(mockSREs.length + 1),
          createdAt: new Date().toISOString(),
        }

        mockSREs.push(newSRE)
        resolve({ success: true, data: newSRE, message: "SRE added successfully" })
      }, 400)
    })
  },

  updateSRE: async (
    id: string,
    updates: Partial<Omit<SRE, "id" | "createdAt">>,
  ): Promise<{ success: boolean; data?: SRE; message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockSREs.findIndex((s) => s.id === id)
        if (index === -1) {
          resolve({ success: false, message: "SRE not found" })
          return
        }

        mockSREs[index] = { ...mockSREs[index], ...updates }
        resolve({ success: true, data: mockSREs[index], message: "SRE updated successfully" })
      }, 400)
    })
  },

  deleteSRE: async (id: string): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockSREs.findIndex((s) => s.id === id)
        if (index === -1) {
          resolve({ success: false, message: "SRE not found" })
          return
        }

        mockSREs.splice(index, 1)
        resolve({ success: true, message: "SRE deleted successfully" })
      }, 400)
    })
  },

  toggleSREStatus: async (id: string): Promise<{ success: boolean; data?: SRE; message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sre = mockSREs.find((s) => s.id === id)
        if (!sre) {
          resolve({ success: false, message: "SRE not found" })
          return
        }

        sre.status = sre.status === "active" ? "inactive" : "active"
        resolve({ success: true, data: sre, message: `SRE status changed to ${sre.status}` })
      }, 400)
    })
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
