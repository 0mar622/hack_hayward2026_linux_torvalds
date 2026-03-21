import React from 'react'

export default function ContactCard({ name, topics, lastMet, followUp, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* Name - Prominent */}
      <h3 className="text-lg font-semibold text-gray-900 mb-3 break-words">{name}</h3>

      {/* Topics - Pill Badges */}
      <div className="flex flex-wrap gap-2 mb-3 min-w-0">
        {topics.map((topic, idx) => (
          <span
            key={idx}
            className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full truncate"
          >
            {topic}
          </span>
        ))}
      </div>

      {/* Last Met - Muted Text */}
      <p className="text-sm text-gray-500 mb-3 break-words">Last met: {lastMet}</p>

      {/* Follow-up - Highlighted Reminder */}
      <div className="bg-amber-50 border-l-4 border-amber-400 pl-3 py-2 min-w-0">
        <p className="text-sm font-medium text-amber-900 break-words">Follow-up: {followUp}</p>
      </div>
    </div>
  )
}
