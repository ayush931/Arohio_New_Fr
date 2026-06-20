import { useMemo, useState } from "react";
import {
  FaFolderOpen,
  FaPlus,
} from "react-icons/fa";
import SectionHeader from "../../components/dashboard/SectionHeader";
import FeatureCardsss from "../../components/dashboard/Featurecards";
import FilesTable from "../../components/dashboard/TableProcessing";

export default function DashboardProjects() {
  const projectCards = useMemo(
    () => [
      {
        id: "p1",
        title: "Marketing Campaign 2024",
        files: 12,
        date: "Sep 13, 2025",
        active: true,
        badges: [],
      },
      {
        id: "p2",
        title: "Product Launch Q3",
        files: 8,
        date: "Aug 22, 2025",
        badges: [{ label: "Planning", type: "planning" }],
      },
      {
        id: "p3",
        title: "Client Onboarding",
        files: 5,
        date: "Jul 15, 2025",
        badges: [
          { label: "Active", type: "active" },
          { label: "New", type: "new" },
        ],
      },
      {
        id: "p4",
        title: "Internal Training Materials",
        files: 15,
        date: "Jun 30, 2025",
        badges: [],
      },
    ],
    []
  );

  const [activeProject] = useState(projectCards[0]);

  const files = useMemo(
    () => [
      { id: "f1", name: "Campaign_Brief_v3.pdf", size: "1.2 MB", meta: "Uploaded by Jane Doe", status: "Approved" },
      { id: "f2", name: "Social_Media_Assets.pdf", size: "5.8 MB", meta: "Uploaded by John Smith", status: "Reviewed" },
      { id: "f3", name: "Ad_Copy_Final.pdf", size: "450 KB", meta: "Uploaded by Jane Doe", status: "Processing" },
    ],
    []
  );

  return (
    <div className="px-4 py-4 bg-[#f6f8fb] min-h-screen text-left">

      <SectionHeader
        title="Projects & Folders"
        description="Keep your PDFs organized with folders, tags, and quick filters."
        buttonText="New Project"
        buttonIcon={<FaPlus />}
        onButtonClick={() => console.log("clicked")}
      />

      <div className="grid gap-[14px] md:grid-cols-2 xl:grid-cols-4 mb-6">
        {projectCards.map((p) => (
          <FeatureCardsss
            key={p.id}
            icon={FaFolderOpen}
            title={p.title}
            files={p.files}
            date={p.date}
            badges={p.badges}
            active={p.active}
          />
        ))}
      </div>

      <div className="text-[0.95rem] text-[#94a3b8] mb-3">
        Projects <span className="mx-1">›</span>
        <span className="text-[#0f172a] font-semibold">{activeProject.title}</span>
      </div>

      <div className="grid lg:grid-cols-12 gap-4">

        <div className="lg:col-span-8">
          <FilesTable files={files} />
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white border border-[#e7edf4] rounded-[4px] p-3 sticky top-4">

            <div className="text-[14px] font-semibold text-[#0f172a] mb-2">
              Folder Info
            </div>

            <div className="text-[12px] text-[#64748b] font-bold mb-1">
              Description
            </div>
            <div className="flex items-center gap-2 bg-[#f8fafc] border border-[#e5e7eb] rounded-[3px] px-3 py-2 text-[#1f2937] font-semibold text-[14px]">
              All assets for the 2024 marketing campaign.
            </div>

            <div className="text-[12px] text-[#64748b] font-bold mt-3 mb-1">
              Created Date
            </div>
            <div className="flex items-center gap-2 bg-[#f8fafc] border border-[#e5e7eb] rounded-[3px] px-3 py-2 text-[#1f2937] font-semibold text-[14px]">
              January 15, 2024
            </div>

            <div className="text-[12px] text-[#64748b] font-bold mt-3 mb-1">
              Tags
            </div>
            <div className="flex gap-2 flex-wrap mb-2">
              <span className="flex items-center gap-1 border border-[#e7edf4] bg-[#f7fafc] rounded-full px-3 py-1 text-[#1f2937] font-bold text-[12px]">
                campaign
              </span>
              <span className="flex items-center gap-1 border border-[#e7edf4] bg-[#f7fafc] rounded-full px-3 py-1 text-[#1f2937] font-bold text-[12px]">
                2024
              </span>
              <span className="flex items-center gap-1 border border-[#e7edf4] bg-[#f7fafc] rounded-full px-3 py-1 text-[#1f2937] font-bold text-[12px]">
                social
              </span>
            </div>

            <div className="text-[12px] text-[#64748b] font-bold mt-2 mb-1">
              Members
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center border border-[#e7edf4] bg-[#f7fafc] rounded-full px-3 py-1 text-[#1f2937] font-bold text-[12px]">S</span>
              <span className="flex items-center justify-center border border-[#e7edf4] bg-[#f7fafc] rounded-full px-3 py-1 text-[#1f2937] font-bold text-[12px]">J</span>
              <span className="flex items-center justify-center border border-[#e7edf4] bg-[#f7fafc] rounded-full px-3 py-1 text-[#1f2937] font-bold text-[12px]">M</span>
              <button className="border border-[#e7edf4] bg-white rounded-[3px] px-3 py-2 text-[#64748b]">
                <FaPlus />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}