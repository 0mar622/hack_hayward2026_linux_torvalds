import React, { useState } from 'react'

export default function ContactDetailPanel({ contact }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(contact.suggestedMessage)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full min-w-0">
      {/* Contact Header */}
      <div className="mb-6 min-w-0">
        <h2 className="text-2xl font-bold text-gray-900 break-words">{contact.name}</h2>
        <div className="flex flex-wrap gap-2 mt-2 min-w-0">
          {contact.topics.map((topic, idx) => (
            <span
              key={idx}
              className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full truncate"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* Metadata */}
      <div className="border-t border-b py-4 mb-6">
        <div className="flex justify-between text-sm">
          <div>
            <p className="text-gray-500">Last met</p>
            <p className="font-medium text-gray-900">{contact.lastMet}</p>
          </div>
          <div>
            <p className="text-gray-500">Follow-up</p>
            <p className="font-medium text-amber-900">{contact.followUp}</p>
          </div>
        </div>
      </div>

      {/* Conversation Summary */}
      <div className="mb-6 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Conversation Summary</h3>
        <textarea
          readOnly
          value={contact.conversationSummary}
          className="flex-1 w-full p-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm resize-none focus:outline-none min-w-0 overflow-x-hidden"
        />
      </div>

      {/* Suggested Message */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Suggested Follow-up Message</h3>
        <div className="bg-green-50 border border-green-300 rounded-lg p-4 min-w-0">
          <p className="text-gray-800 text-sm whitespace-pre-wrap mb-4 break-words">{contact.suggestedMessage}</p>
          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              copied
                ? 'bg-green-600 text-white'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  )
}
