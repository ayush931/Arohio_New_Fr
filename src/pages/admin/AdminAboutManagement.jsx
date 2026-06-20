import React, { useEffect, useState } from "react";
import { FiEdit2, FiTrash2, FiPlus, FiChevronDown } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function AdminAboutManagement() {
  const API_BASE = `${import.meta.env.VITE_API_BASE}/about`;
  const [about, setAbout] = useState({ hero: {}, sections: [] });
  const [mode, setMode] = useState("list");
  const [selected, setSelected] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [search, setSearch] = useState("");

  const empty = {
    id: "",
    order: 0,
    type: "card",
    layout: "",
    icon: "",
    eyebrow: "",
    title: "",
    subtitle: "",
    body: "",
    bullets: [],
    chips: [],
    image: { url: "", alt: "" },
    cards: [],
    members: [],
    visible: true,
  };
  const [edit, setEdit] = useState(empty);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      setAbout(data);
    } catch {
      toast.error("Load failed");
    }
  };

  const openEdit = (s) => {
    setSelected(s || null);
    setMode("edit");
    setEdit(
      s
        ? JSON.parse(JSON.stringify(s))
        : { ...empty, order: about.sections.length + 1 }
    );
  };

  const back = () => {
    setMode("list");
    setSelected(null);
    setEdit(empty);
  };

  const onSave = async () => {
    try {
      const url = selected?.id
        ? `${API_BASE}/sections/${selected.id}`
        : `${API_BASE}/sections`;
      const method = selected?.id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(edit),
      });
      if (!res.ok) throw new Error();
      const saved = await res.json();
      if (selected?.id) {
        setAbout((prev) => ({
          ...prev,
          sections: prev.sections.map((x) => (x.id === saved.id ? saved : x)),
        }));
        toast.success("Section updated");
      } else {
        setAbout((prev) => ({
          ...prev,
          sections: [saved, ...prev.sections],
        }));
        toast.success("Section created");
      }
      back();
    } catch {
      toast.error("Save failed");
    }
  };

  const onDelete = async (s) => {
    if (!window.confirm("Delete this section?")) return;
    try {
      const res = await fetch(`${API_BASE}/sections/${s.id}`, {
        method: "DELETE",
      });
      if (!res.ok && res.status !== 204) throw new Error();
      setAbout((prev) => ({
        ...prev,
        sections: prev.sections.filter((x) => x.id !== s.id),
      }));
      toast.success("Section deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const items = Array.from(about.sections);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setAbout((prev) => ({ ...prev, sections: items }));
    try {
      await fetch(`${API_BASE}/sections/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: items.map((i) => i.id) }),
      });
      toast.success("Order saved");
    } catch {
      toast.error("Failed to save order");
    }
  };

  const filtered = about.sections.filter(
    (s) =>
      (s.title || "").toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase())
  );

  // helpers
  const updateArrayField = (field, index, value) => {
    setEdit((s) => {
      const arr = [...(s[field] || [])];
      arr[index] = value;
      return { ...s, [field]: arr };
    });
  };
  const addArrayItem = (field, emptyVal) => {
    setEdit((s) => ({
      ...s,
      [field]: [...(s[field] || []), emptyVal],
    }));
  };
  const removeArrayItem = (field, index) => {
    setEdit((s) => {
      const arr = [...(s[field] || [])];
      arr.splice(index, 1);
      return { ...s, [field]: arr };
    });
  };

  return (
    <div className="container-fluid py-2 text-start" style={{ maxWidth: "1200px" }}>
      <ToastContainer position="top-right" newestOnTop />

      {mode === "list" && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <h1 className="h5 fw-bold mb-0">About-Us Sections</h1>
              <p className="text-muted small mb-0">
                Manage your About page sections below.
              </p>
            </div>
            <button
              className="btn d-inline-flex align-items-center gap-2"
              style={{ backgroundColor: "#21c7b8", color: "#fff" }}
              onClick={() => openEdit(null)}
            >
              <FiPlus /> New Section
            </button>
          </div>

          <input
            type="text"
            className="form-control mb-2"
            placeholder="Search sections…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="card shadow-sm">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="sections">
                {(provided) => (
                  <table
                    className="table table-hover mb-0 w-100"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: "10%" }}>Order</th>
                        <th style={{ width: "15%" }}>ID</th>
                        <th style={{ width: "25%" }}>Title</th>
                        <th style={{ width: "15%" }}>Type</th>
                        <th style={{ width: "10%" }}>Visible</th>
                        <th style={{ width: "25%" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((s, index) => (
                        <Draggable key={s.id} draggableId={s.id} index={index}>
                          {(prov) => (
                            <tr
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              {...prov.dragHandleProps}
                              className="align-middle"
                            >
                              <td className="d-none d-md-table-cell">
                                {s.order || index + 1}
                              </td>
                              <td className="d-none d-md-table-cell">{s.id}</td>
                              <td className="d-none d-md-table-cell">
                                {s.title || "—"}
                              </td>
                              <td className="d-none d-md-table-cell">{s.type}</td>
                              <td className="d-none d-md-table-cell">
                                {s.visible ? "Yes" : "No"}
                              </td>
                              <td className="d-none d-md-table-cell">
                                <button
                                  className="btn btn-sm btn-outline-success me-2"
                                  onClick={() => openEdit(s)}
                                >
                                  <FiEdit2 />
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => onDelete(s)}
                                >
                                  <FiTrash2 />
                                </button>
                              </td>

                              {/* mobile collapsed row */}
                              <td colSpan={6} className="d-md-none">
                                <div
                                  className="d-flex justify-content-between align-items-center"
                                  onClick={() =>
                                    setExpanded((prev) => ({
                                      ...prev,
                                      [s.id]: !prev[s.id],
                                    }))
                                  }
                                  style={{ cursor: "pointer" }}
                                >
                                  <div className="fw-semibold">
                                    {s.title || s.id}
                                  </div>
                                  <FiChevronDown
                                    className={expanded[s.id] ? "rotate-180" : ""}
                                  />
                                </div>
                                {expanded[s.id] && (
                                  <div className="mt-2 small">
                                    <div>Type: {s.type}</div>
                                    <div>
                                      Visible: {s.visible ? "Yes" : "No"}
                                    </div>
                                    <div className="mt-1">
                                      <button
                                        className="btn btn-sm btn-outline-success me-2"
                                        onClick={() => openEdit(s)}
                                      >
                                        <FiEdit2 />
                                      </button>
                                      <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => onDelete(s)}
                                      >
                                        <FiTrash2 />
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </td>
                            </tr>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {filtered.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-muted py-3">
                            No sections
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </>
      )}

      {mode === "edit" && (
        <div className="card shadow-sm p-4 mt-2">
          <h5 className="fw-bold mb-3">
            {selected ? "Edit Section" : "New Section"}
          </h5>

          {/* simple fields two per row */}
          <div className="row">
            {["id", "order", "type", "layout", "icon", "eyebrow", "title", "subtitle", "body"].map(
              (field, idx) => (
                <div className="col-md-6 mb-3" key={field}>
                  <label className="form-label fw-semibold text-capitalize">
                    {field}
                  </label>
                  <input
                    className="form-control"
                    value={edit[field] ?? ""}
                    onChange={(e) =>
                      setEdit((s) => ({ ...s, [field]: e.target.value }))
                    }
                  />
                </div>
              )
            )}
          </div>

          {/* bullets dynamic */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Bullets</label>
            {edit.bullets?.map((b, idx) => (
              <div key={idx} className="d-flex mb-1 gap-2">
                <input
                  className="form-control"
                  value={b}
                  onChange={(e) =>
                    updateArrayField("bullets", idx, e.target.value)
                  }
                />
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => removeArrayItem("bullets", idx)}
                >
                  &times;
                </button>
              </div>
            ))}
            <button
              className="btn btn-sm btn-secondary mt-1"
              onClick={() => addArrayItem("bullets", "")}
            >
              + Add Bullet
            </button>
          </div>

          {/* chips dynamic */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Chips</label>
            {edit.chips?.map((c, idx) => (
              <div key={idx} className="d-flex mb-1 gap-2">
                <input
                  className="form-control"
                  value={c}
                  onChange={(e) =>
                    updateArrayField("chips", idx, e.target.value)
                  }
                />
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => removeArrayItem("chips", idx)}
                >
                  &times;
                </button>
              </div>
            ))}
            <button
              className="btn btn-sm btn-secondary mt-1"
              onClick={() => addArrayItem("chips", "")}
            >
              + Add Chip
            </button>
          </div>

          {/* image */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Image URL</label>
              <input
                className="form-control"
                value={edit.image?.url || ""}
                onChange={(e) =>
                  setEdit((s) => ({
                    ...s,
                    image: { ...s.image, url: e.target.value },
                  }))
                }
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Image Alt</label>
              <input
                className="form-control"
                value={edit.image?.alt || ""}
                onChange={(e) =>
                  setEdit((s) => ({
                    ...s,
                    image: { ...s.image, alt: e.target.value },
                  }))
                }
              />
            </div>
          </div>

          {/* cards */}
          {edit.type === "card_grid" && (
            <div className="mb-3">
              <label className="form-label fw-semibold">Cards</label>
              {edit.cards?.map((card, idx) => (
                <div key={idx} className="border p-2 mb-2 rounded">
                  <input
                    className="form-control mb-1"
                    placeholder="Title"
                    value={card.title || ""}
                    onChange={(e) =>
                      updateArrayField("cards", idx, {
                        ...card,
                        title: e.target.value,
                      })
                    }
                  />
                  <textarea
                    className="form-control mb-1"
                    placeholder="Description"
                    value={card.description || ""}
                    onChange={(e) =>
                      updateArrayField("cards", idx, {
                        ...card,
                        description: e.target.value,
                      })
                    }
                  />
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => removeArrayItem("cards", idx)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                className="btn btn-sm btn-secondary"
                onClick={() =>
                  addArrayItem("cards", { title: "", description: "" })
                }
              >
                + Add Card
              </button>
            </div>
          )}

          {/* members */}
          {edit.type === "team_grid" && (
            <div className="mb-3">
              <label className="form-label fw-semibold">Members</label>
              {edit.members?.map((m, idx) => (
                <div key={idx} className="border p-2 mb-2 rounded">
                  <input
                    className="form-control mb-1"
                    placeholder="Name"
                    value={m.name || ""}
                    onChange={(e) =>
                      updateArrayField("members", idx, {
                        ...m,
                        name: e.target.value,
                      })
                    }
                  />
                  <input
                    className="form-control mb-1"
                    placeholder="Role"
                    value={m.role || ""}
                    onChange={(e) =>
                      updateArrayField("members", idx, {
                        ...m,
                        role: e.target.value,
                      })
                    }
                  />
                  <input
                    className="form-control mb-1"
                    placeholder="Avatar URL"
                    value={m.avatar || ""}
                    onChange={(e) =>
                      updateArrayField("members", idx, {
                        ...m,
                        avatar: e.target.value,
                      })
                    }
                  />
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => removeArrayItem("members", idx)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                className="btn btn-sm btn-secondary"
                onClick={() =>
                  addArrayItem("members", { name: "", role: "", avatar: "" })
                }
              >
                + Add Member
              </button>
            </div>
          )}

          <div className="form-check form-switch mb-4">
            <input
              className="form-check-input"
              type="checkbox"
              checked={edit.visible}
              onChange={(e) =>
                setEdit((s) => ({ ...s, visible: e.target.checked }))
              }
            />
            <label className="form-check-label">Visible</label>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn"
              style={{ backgroundColor: "#21c7b8", color: "#fff" }}
              onClick={onSave}
            >
              Save
            </button>
            <button className="btn btn-secondary" onClick={back}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
