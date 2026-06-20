import React from "react";
import {
  FaFilePdf,
  FaTrash,
  FaDownload,
} from "react-icons/fa";

export default function FilesTable({ files = [] }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-md overflow-hidden">
      <table className="w-full border-separate border-spacing-y-2">
        <tbody>
          {files.map((f) => (
            <tr key={f.id} className="bg-white border border-neutral-200 rounded-md hover:shadow-sm transition">
              <td className="px-3 py-3 w-[36px]">
                <input
                  type="checkbox"
                  className="w-4 h-4 border border-neutral-300 rounded-sm appearance-none cursor-pointer relative checked:bg-emerald-500 checked:border-emerald-500 after:content-['✓'] after:text-white after:text-[10px] after:absolute after:top-0 after:left-[3px] after:opacity-0 checked:after:opacity-100"
                />
              </td>

              <td className="px-3 py-3 w-[42px] text-neutral-500">
                <FaFilePdf />
              </td>

              <td className="px-3 py-3 min-w-[240px]">
                <div className="text-sm font-medium text-neutral-900 truncate">
                  {f.name}
                </div>
                <div className="text-xs text-neutral-500">
                  {f.size} • {f.meta}
                </div>
              </td>

              <td className="px-3 py-3 w-[140px]">
                <span className="inline-block text-[11px] font-medium px-3 py-[3px] rounded-full bg-neutral-100 text-neutral-600">
                  File
                </span>
              </td>

              <td className="px-3 py-3 text-right min-w-[180px]">
                <div className="flex justify-end gap-2">
                  <button className="border border-neutral-200 px-3 py-1 text-xs font-medium rounded-md flex items-center gap-1 hover:bg-neutral-100">
                    <FaDownload /> Download
                  </button>
                  <button className="border border-neutral-200 px-3 py-1 text-xs font-medium rounded-md flex items-center gap-1 hover:bg-neutral-100">
                    <FaTrash /> Remove
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}