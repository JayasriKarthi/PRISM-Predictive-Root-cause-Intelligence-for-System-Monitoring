"use client"

import { useState, useEffect } from "react"
import { Users, Plus, Edit2, Trash2, CheckCircle, XCircle, ArrowLeft, Loader } from "lucide-react"
import { useSRE } from "../context/sre-context"

interface SREManagementPageProps {
  onNavigate?: (page: string) => void
}

export function SREManagementPage({ onNavigate }: SREManagementPageProps) {
  const { sres, isLoading, error, loadSREs, addSRE, updateSRE, deleteSRE, toggleSREStatus, clearError } = useSRE()
  const [showAddModal, setShowAddModal] = useState(false)
  const [newSRE, setNewSRE] = useState({ name: "", email: "", system: "" })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<{ name: string; email: string; assignedSystem: string } | null>(null)
  const [isAddingLoading, setIsAddingLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  // Load SREs on mount
  useEffect(() => {
    loadSREs()
  }, [loadSREs])

  const handleBack = () => {
    clearError()
    if (onNavigate) {
      onNavigate("home")
    }
  }

  const handleAddSRE = async () => {
    clearError()
    if (!newSRE.name || !newSRE.email) return

    setIsAddingLoading(true)
    const success = await addSRE({
      name: newSRE.name,
      email: newSRE.email,
      assignedSystem: newSRE.system || "Unassigned",
      status: "active",
    })

    setIsAddingLoading(false)
    if (success) {
      setNewSRE({ name: "", email: "", system: "" })
      setShowAddModal(false)
      setSuccessMessage("SRE added successfully")
      setTimeout(() => setSuccessMessage(""), 3000)
    }
  }

  const handleDeleteSRE = async (id: string) => {
    clearError()
    const success = await deleteSRE(id)
    if (success) {
      setSuccessMessage("SRE deleted successfully")
      setTimeout(() => setSuccessMessage(""), 3000)
    }
  }

  const handleToggleStatus = async (id: string) => {
    clearError()
    await toggleSREStatus(id)
  }

  const handleEditStart = (sre: any) => {
    setEditingId(sre.id)
    setEditData({
      name: sre.name,
      email: sre.email,
      assignedSystem: sre.assignedSystem,
    })
  }

  const handleEditSave = async () => {
    if (!editingId || !editData) return

    clearError()
    const success = await updateSRE(editingId, editData)
    if (success) {
      setEditingId(null)
      setEditData(null)
      setSuccessMessage("SRE updated successfully")
      setTimeout(() => setSuccessMessage(""), 3000)
    }
  }

  const handleEditCancel = () => {
    setEditingId(null)
    setEditData(null)
    clearError()
  }

  const handleCloseModal = () => {
    setShowAddModal(false)
    setNewSRE({ name: "", email: "", system: "" })
    clearError()
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] hover:from-[#C4B5FD] hover:to-[#A78BFA] text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50"
              disabled={isLoading}
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <div className="bg-gradient-to-r from-[#A78BFA] via-[#C4B5FD] to-[#8B5CF6] rounded-2xl p-8 shadow-2xl border-4 border-white/20 hover:shadow-[0_0_30px_rgba(167,139,250,0.5)] transition-all duration-300">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 flex items-center gap-4 drop-shadow-2xl tracking-tight">
                <Users className="w-12 h-12" />
                SRE Management
              </h1>
              <p className="text-white text-xl font-semibold drop-shadow-lg">Manage and monitor all SRE team members</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] hover:from-[#C4B5FD] hover:to-[#A78BFA] text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
            Add SRE
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 font-medium">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 font-medium">{error}</div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl border border-border p-6 hover:border-primary hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <p className="text-body text-sm mb-2 font-medium">Total SREs</p>
            <p className="text-3xl font-bold text-heading">{sres.length}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6 hover:border-primary hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <p className="text-body text-sm mb-2 font-medium">Active</p>
            <p className="text-3xl font-bold text-primary">{sres.filter((s) => s.status === "active").length}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6 hover:border-primary hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <p className="text-body text-sm mb-2 font-medium">Inactive</p>
            <p className="text-3xl font-bold text-secondary">{sres.filter((s) => s.status === "inactive").length}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6 hover:border-primary hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <p className="text-body text-sm mb-2 font-medium">Systems Managed</p>
            <p className="text-3xl font-bold text-primary">{new Set(sres.map((s) => s.assignedSystem)).size}</p>
          </div>
        </div>

        {/* SRE Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-hover border-b border-border">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-heading">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-heading">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-heading">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-heading">Assigned System</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-heading">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && sres.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-body">
                      <div className="flex items-center justify-center gap-2">
                        <Loader className="w-4 h-4 animate-spin text-primary" />
                        Loading SREs...
                      </div>
                    </td>
                  </tr>
                ) : sres.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-body">
                      No SREs found. Add one to get started.
                    </td>
                  </tr>
                ) : (
                  sres.map((sre) => (
                    <tr key={sre.id} className="border-b border-border hover:bg-hover transition-colors">
                      <td className="px-6 py-4 text-heading font-medium">{sre.name}</td>
                      <td className="px-6 py-4 text-body">{sre.email}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(sre.id)}
                          disabled={isLoading}
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold transition-all disabled:opacity-50 ${
                            sre.status === "active"
                              ? "bg-hover border border-primary text-primary hover:bg-primary/10"
                              : "bg-disabled-bg border border-border text-disabled-text hover:bg-hover"
                          }`}
                        >
                          {sre.status === "active" ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                          {sre.status.charAt(0).toUpperCase() + sre.status.slice(1)}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-body">{sre.assignedSystem}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditStart(sre)}
                            disabled={isLoading}
                            className="p-2 hover:bg-hover rounded-lg transition-all text-primary hover:text-secondary disabled:opacity-50"
                            title="Edit SRE"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSRE(sre.id)}
                            disabled={isLoading}
                            className="p-2 hover:bg-red-50 rounded-lg transition-all text-red-500 hover:text-red-600 disabled:opacity-50"
                            title="Delete SRE"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add SRE Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-2xl border border-border p-6 max-w-md w-full shadow-2xl">
              <h2 className="text-xl font-bold text-heading mb-4">Add New SRE</h2>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-heading mb-2">Name</label>
                  <input
                    type="text"
                    value={newSRE.name}
                    onChange={(e) => setNewSRE({ ...newSRE, name: e.target.value })}
                    placeholder="Enter name"
                    disabled={isAddingLoading}
                    className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-body hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-heading mb-2">Email</label>
                  <input
                    type="email"
                    value={newSRE.email}
                    onChange={(e) => setNewSRE({ ...newSRE, email: e.target.value })}
                    placeholder="Enter email"
                    disabled={isAddingLoading}
                    className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-body hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-heading mb-2">Assigned System</label>
                  <select
                    value={newSRE.system}
                    onChange={(e) => setNewSRE({ ...newSRE, system: e.target.value })}
                    disabled={isAddingLoading}
                    className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
                  >
                    <option value="">Select a system</option>
                    <option value="Server 1">Server 1</option>
                    <option value="Server 2">Server 2</option>
                    <option value="Server 3">Server 3</option>
                    <option value="Database Cluster">Database Cluster</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCloseModal}
                  disabled={isAddingLoading}
                  className="flex-1 px-4 py-2 bg-disabled-bg hover:bg-hover text-body border border-border rounded-lg transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSRE}
                  disabled={!newSRE.name || !newSRE.email || isAddingLoading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] hover:from-[#C4B5FD] hover:to-[#A78BFA] text-white rounded-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  {isAddingLoading && <Loader className="w-4 h-4 animate-spin" />}
                  {isAddingLoading ? "Adding..." : "Add SRE"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit SRE Modal */}
        {editingId !== null && editData && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-2xl border border-border p-6 max-w-md w-full shadow-2xl">
              <h2 className="text-xl font-bold text-heading mb-4">Edit SRE</h2>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-heading mb-2">Name</label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    placeholder="Enter name"
                    disabled={isLoading}
                    className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-body hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-heading mb-2">Email</label>
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    placeholder="Enter email"
                    disabled={isLoading}
                    className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-body hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-heading mb-2">Assigned System</label>
                  <select
                    value={editData.assignedSystem}
                    onChange={(e) => setEditData({ ...editData, assignedSystem: e.target.value })}
                    disabled={isLoading}
                    className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
                  >
                    <option value="">Select a system</option>
                    <option value="Server 1">Server 1</option>
                    <option value="Server 2">Server 2</option>
                    <option value="Server 3">Server 3</option>
                    <option value="Database Cluster">Database Cluster</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleEditCancel}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-disabled-bg hover:bg-hover text-body border border-border rounded-lg transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] hover:from-[#C4B5FD] hover:to-[#A78BFA] text-white rounded-lg transition-all font-semibold disabled:opacity-50 flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  {isLoading && <Loader className="w-4 h-4 animate-spin" />}
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
