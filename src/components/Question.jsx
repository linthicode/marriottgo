import React from "react";

// A small reusable question renderer. Supports types: text, multiple-choice, multi-select
export default function Question({ question, value, onChange }) {
  if (!question) return null;

  function renderInput() {
    switch (question.type) {
      case "multiple-choice":
        return (
          <div className="flex flex-col gap-3">
            {question.options.map((opt) => (
              <label 
                key={opt.id} 
                className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-[#a11d2b] hover:bg-rose-50 transition-all group"
              >
                <input
                  type="radio"
                  name={question.id}
                  value={opt.id}
                  checked={value === opt.id}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-5 h-5 text-[#a11d2b] focus:ring-[#a11d2b]"
                />
                <span className="font-medium text-gray-700 group-hover:text-[#a11d2b]">{opt.label}</span>
              </label>
            ))}
          </div>
        );
      case "multi-select":
        return (
          <div className="flex flex-col gap-3">
            {question.options.map((opt) => (
              <label 
                key={opt.id} 
                className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-[#a11d2b] hover:bg-rose-50 transition-all group"
              >
                <input
                  type="checkbox"
                  value={opt.id}
                  checked={Array.isArray(value) && value.includes(opt.id)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    const prev = Array.isArray(value) ? value.slice() : [];
                    if (checked) prev.push(opt.id);
                    else {
                      const idx = prev.indexOf(opt.id);
                      if (idx >= 0) prev.splice(idx, 1);
                    }
                    onChange(prev);
                  }}
                  className="w-5 h-5 text-[#0891B2] focus:ring-[#0891B2] rounded"
                />
                <span className="font-medium text-gray-700 group-hover:text-[#a11d2b]">{opt.label}</span>
              </label>
            ))}
          </div>
        );
      case "interest-ratings":
        // value is expected to be an object: { [optionId]: 'low'|'medium'|'high' }
        return (
          <div className="flex flex-col gap-4">
            {question.options.map((opt) => (
              <div key={opt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="font-medium text-gray-700 flex-1">{opt.label}</div>
                <div className="flex gap-2">
                  {[
                    { id: "low", label: "Low", color: "bg-yellow-100 text-yellow-700 border-yellow-300" },
                    { id: "medium", label: "Medium", color: "bg-orange-100 text-orange-700 border-orange-300" },
                    { id: "high", label: "High", color: "bg-red-100 text-red-700 border-red-300" },
                  ].map((r) => (
                    <label 
                      key={r.id} 
                      className={`px-4 py-2 rounded-lg border-2 cursor-pointer transition-all ${
                        value && value[opt.id] === r.id 
                          ? r.color + ' font-semibold' 
                          : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`${question.id}-${opt.id}`}
                        value={r.id}
                        checked={value && value[opt.id] === r.id}
                        onChange={() => {
                          const prev = value && typeof value === "object" ? { ...value } : {};
                          prev[opt.id] = r.id;
                          onChange(prev);
                        }}
                        className="hidden"
                      />
                      <span className="text-sm">{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      case "text":
      default:
        return (
            <textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-[#a11d2b] focus:ring-2 focus:ring-[#a11d2b]/20 transition-all resize-none"
            placeholder={question.placeholder || "Write your answer..."}
          />
        );
    }
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className="w-8 h-8 bg-gradient-to-r from-[#a11d2b] to-[#8B1523] text-white rounded-full flex items-center justify-center text-sm">
          ?
        </span>
        {question.prompt}
      </h3>
      {renderInput()}
    </div>
  );
}
