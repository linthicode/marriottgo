import React from 'react';

export default function LocationActivities({ 
  activities, 
  completedActivities, 
  onToggleActivity, 
  totalXP 
}) {
  if (!activities || activities.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          Location Activities
        </h3>
        <div className="flex items-center gap-2 bg-gradient-to-r from-[#a11d2b] to-[#8B1523] text-white px-4 py-2 rounded-full shadow-md">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span className="font-bold">{totalXP} XP</span>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Complete these fun activities to earn experience points!
      </p>

      <div className="space-y-3">
        {activities.map((activity) => {
          const isCompleted = completedActivities.has(activity.id);
          return (
            <button
              key={activity.id}
              onClick={() => onToggleActivity(activity.id)}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                isCompleted
                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-400 shadow-md'
                  : 'bg-white hover:bg-amber-50 border-2 border-amber-200 hover:border-amber-300 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  isCompleted
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-300 bg-white'
                }`}>
                  {isCompleted && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-2xl">{activity.icon}</span>
                <span className={`font-medium text-left ${
                  isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'
                }`}>
                  {activity.name}
                </span>
              </div>
              <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-bold text-sm ${
                isCompleted
                  ? 'bg-green-500 text-white'
                  : 'bg-amber-200 text-amber-900'
              }`}>
                <span>+{activity.xp}</span>
                <span className="text-xs">XP</span>
              </div>
            </button>
          );
        })}
      </div>

      {completedActivities.size > 0 && (
        <div className="mt-4 p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border-2 border-green-300">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">
              🎉 {activities.filter(a => completedActivities.has(a.id)).length} / {activities.length} completed
            </span>
            <span className="text-lg font-bold text-green-700">
              {totalXP} Total XP!
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

