import React, { useState, useRef } from 'react'
import ContactList from '../components/ContactList'
import ContactDetailPanel from '../components/ContactDetailPanel'
import { contacts as mockContacts } from '../mockData'

export default function Dashboard() {
  const DEFAULT_LEFT_PANEL_WIDTH = 384
  const MIN_LEFT_PANEL_WIDTH = 250
  const MIN_DETAIL_PANEL_WIDTH = 320
  const DIVIDER_WIDTH = 4
  const MAIN_GAP_TOTAL = 48
  const DESKTOP_BREAKPOINT = 1024
  const [contacts] = useState(mockContacts)
  const [selectedContact, setSelectedContact] = useState(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [leftPanelWidth, setLeftPanelWidth] = useState(DEFAULT_LEFT_PANEL_WIDTH) // w-96 = 384px
  const [sidebarWidth, setSidebarWidth] = useState(240) // w-60 = 240px
  const [isResizing, setIsResizing] = useState(false)
  const [isSidebarResizing, setIsSidebarResizing] = useState(false)
  const mainRef = useRef(null)
  const isDetailVisible = Boolean(selectedContact && isPanelOpen)

  const isDesktopViewport = () => window.innerWidth >= DESKTOP_BREAKPOINT

  const getMaxLeftWidth = () => {
    if (!mainRef.current) return MIN_LEFT_PANEL_WIDTH

    const mainRect = mainRef.current.getBoundingClientRect()
    const styles = window.getComputedStyle(mainRef.current)
    const paddingLeft = parseFloat(styles.paddingLeft || '0')
    const paddingRight = parseFloat(styles.paddingRight || '0')
    const innerContentWidth = Math.max(0, mainRect.width - paddingLeft - paddingRight)

    return Math.max(
      MIN_LEFT_PANEL_WIDTH,
      innerContentWidth - MIN_DETAIL_PANEL_WIDTH - DIVIDER_WIDTH - MAIN_GAP_TOTAL
    )
  }

  const handleResizeStart = (e) => {
    setIsResizing(true)
    e.preventDefault()
  }

  const handleSidebarResizeStart = (e) => {
    setIsSidebarResizing(true)
    e.preventDefault()
  }

  const handleMouseMove = (e) => {
    if (isSidebarResizing) {
      const newWidth = e.clientX
      if (newWidth > 150 && newWidth < 400) {
        setSidebarWidth(newWidth)
      }
    }
    if (isResizing && isDesktopViewport() && isDetailVisible && mainRef.current) {
      const mainRect = mainRef.current.getBoundingClientRect()
      const maxLeftWidth = getMaxLeftWidth()
      const newWidth = e.clientX - mainRect.left - MAIN_GAP_TOTAL / 2

      if (newWidth >= MIN_LEFT_PANEL_WIDTH && newWidth <= maxLeftWidth) {
        setLeftPanelWidth(newWidth)
      }
    }
  }

  const handleMouseUp = () => {
    setIsResizing(false)
    setIsSidebarResizing(false)
  }

  const handleContactSelect = (contact) => {
    if (isDesktopViewport() && mainRef.current) {
      const mainRect = mainRef.current.getBoundingClientRect()
      const maxLeftWidth = getMaxLeftWidth()
      const preferredLeftWidth = Math.max(MIN_LEFT_PANEL_WIDTH, Math.floor(mainRect.width * 0.62))
      const nextLeftWidth = Math.min(preferredLeftWidth, maxLeftWidth)
      setLeftPanelWidth(nextLeftWidth)
    }

    setSelectedContact(contact)
    setIsPanelOpen(true)
  }

  const handleBack = () => {
    setSelectedContact(null)
    setIsPanelOpen(false)
  }

  React.useEffect(() => {
    const handleDocumentMouseMove = (e) => {
      handleMouseMove(e)
    }

    const handleDocumentMouseUp = (e) => {
      handleMouseUp()
    }

    if (isResizing || isSidebarResizing) {
      document.addEventListener('mousemove', handleDocumentMouseMove)
      document.addEventListener('mouseup', handleDocumentMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleDocumentMouseMove)
      document.removeEventListener('mouseup', handleDocumentMouseUp)
    }
  }, [isResizing, isSidebarResizing])

  React.useLayoutEffect(() => {
    if (!isDetailVisible || !mainRef.current) return

    const clampLeftPanelWidth = () => {
      if (!isDesktopViewport()) return
      if (!mainRef.current) return
      const mainRect = mainRef.current.getBoundingClientRect()
      const maxLeftWidth = getMaxLeftWidth()
      const preferredLeftWidth = Math.max(MIN_LEFT_PANEL_WIDTH, Math.floor(mainRect.width * 0.62))

      setLeftPanelWidth((prev) => {
        // Keep the center panel dominant by default when opening details.
        if (prev === DEFAULT_LEFT_PANEL_WIDTH) {
          return Math.min(preferredLeftWidth, maxLeftWidth)
        }

        // Recover from previously shrunken mobile-derived widths.
        if (prev < preferredLeftWidth) {
          return Math.min(preferredLeftWidth, maxLeftWidth)
        }

        return Math.max(MIN_LEFT_PANEL_WIDTH, Math.min(prev, maxLeftWidth))
      })
    }

    clampLeftPanelWidth()
    window.addEventListener('resize', clampLeftPanelWidth)

    return () => {
      window.removeEventListener('resize', clampLeftPanelWidth)
    }
  }, [isDetailVisible])

  React.useEffect(() => {
    if (selectedContact) return
    setIsPanelOpen(false)
  }, [selectedContact])

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside
        className="bg-white border-r h-screen flex flex-col justify-between fixed top-0 left-0"
        style={{ width: `${sidebarWidth}px` }}
      >
        <div>
          <div className="p-6">
            <div className="text-xl font-bold mb-6">MyApp</div>
            <nav>
              <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 20h14a1 1 0 001-1v-6a4 4 0 00-4-4H8a4 4 0 00-4 4v6a1 1 0 001 1z" />
                </svg>
                <span>Contacts</span>
              </a>
            </nav>
          </div>
        </div>

        <div className="p-6 border-t">
          <div className="flex items-center gap-3">
            <img src="https://via.placeholder.com/40" alt="avatar" className="w-10 h-10 rounded-full" />
            <div>
              <div className="font-medium">Andy</div>
              <div className="text-sm text-gray-500">View profile</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Sidebar Resize Handle */}
      <div
        className="w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize transition-colors fixed top-0 h-screen z-40"
        style={{ left: `${sidebarWidth}px` }}
        onMouseDown={handleSidebarResizeStart}
      />

      <main
        ref={mainRef}
        className="flex-1 p-8 flex flex-col lg:flex-row gap-6 overflow-hidden"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        {/* Left Panel - Contact List */}
        <div
          className={`w-full min-w-0 ${selectedContact ? 'hidden lg:block' : 'block'} ${!isDetailVisible ? 'lg:flex-1' : 'lg:flex-shrink-0'}`}
          style={{ width: isDetailVisible ? `${leftPanelWidth}px` : 'auto' }}
        >
          <h1 className="text-2xl font-semibold mb-6">Contacts</h1>
          <ContactList contacts={contacts} onContactSelect={handleContactSelect} />
        </div>

        {/* Resizable Divider - Large screens only, when panel is open */}
        {isDetailVisible && (
          <div
            className="hidden lg:block w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize transition-colors"
            onMouseDown={handleResizeStart}
          />
        )}

        {/* Right Panel - Contact Details or Empty State */}
        {/* Small screens: toggle view */}
        <div className={`w-full min-w-0 lg:hidden ${selectedContact ? 'block' : 'hidden'}`}>
          {selectedContact ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <button
                onClick={handleBack}
                className="mb-4 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                ← Back
              </button>
              <ContactDetailPanel contact={selectedContact} />
            </div>
          ) : null}
        </div>

        {/* Large screens: flexible detail panel */}
        {isDetailVisible && (
          <div className="hidden lg:flex flex-col flex-1 min-w-[320px] bg-white rounded-lg shadow-lg border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
              <h2 className="font-semibold text-gray-800">
                {selectedContact ? selectedContact.name : 'Details'}
              </h2>
              <button
                onClick={() => setIsPanelOpen(false)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-4 min-w-0">
              {selectedContact ? (
                <ContactDetailPanel contact={selectedContact} />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-gray-300 mx-auto mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-gray-500 text-sm font-medium">Select a contact</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
