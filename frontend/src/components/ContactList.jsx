import React, { useState } from 'react'
import ContactCard from './ContactCard'

export default function ContactList({ contacts, onContactSelect }) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full min-w-0">
      {/* Search Input */}
      <div className="mb-6 min-w-0">
        <input
          type="text"
          placeholder="Search contacts by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto min-w-0">
        {filteredContacts.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-max">
            {filteredContacts.map((contact, idx) => (
              <ContactCard
                key={idx}
                name={contact.name}
                topics={contact.topics}
                lastMet={contact.lastMet}
                followUp={contact.followUp}
                onClick={() => onContactSelect(contact)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No contacts found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  )
}
