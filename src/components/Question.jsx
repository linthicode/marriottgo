import React from "react";

// A small reusable question renderer. Supports types: text, multiple-choice, multi-select
export default function Question({ question, value, onChange }) {
  if (!question) return null;

  function renderInput() {
    switch (question.type) {
      case "multiple-choice":
        return (
          <div className="flex flex-col gap-2">
            {question.options.map((opt) => (
              <label key={opt.id} className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name={question.id}
                  value={opt.id}
                  checked={value === opt.id}
                  onChange={(e) => onChange(e.target.value)}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        );
      case "multi-select":
        return (
          <div className="flex flex-col gap-2">
            {question.options.map((opt) => (
              <label key={opt.id} className="inline-flex items-center gap-2">
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
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        );
      case "interest-ratings":
        // value is expected to be an object: { [optionId]: 'low'|'medium'|'high' }
        return (
          <div className="flex flex-col gap-3">
            {question.options.map((opt) => (
              <div key={opt.id} className="flex items-center gap-4">
                <div className="w-48">{opt.label}</div>
                <div className="flex gap-2">
                  {[
                    { id: "low", label: "Low" },
                    { id: "medium", label: "Medium" },
                    { id: "high", label: "High" },
                  ].map((r) => (
                    <label key={r.id} className="inline-flex items-center gap-2">
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
            className="w-full border rounded p-2"
            placeholder={question.placeholder || "Write your answer..."}
          />
        );
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h3 className="text-lg font-medium mb-2">{question.prompt}</h3>
      {renderInput()}
    </div>
  );
}
