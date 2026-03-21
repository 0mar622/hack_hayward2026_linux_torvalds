import React from 'react'

export default function Dashboard() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-60 bg-white border-r h-screen flex flex-col justify-between fixed">
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

      <main className="flex-1 ml-60 p-8">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        <div className="grid gap-6">
          <div className="bg-white p-6 rounded-lg shadow">Main content area</div>
        </div>
      </main>
    </div>
  )
}
