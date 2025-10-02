import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";

interface Lead {
  id: string;
  content: string;
  value: number;
  contact: string;
}

interface Columns {
  [key: string]: Lead[];
}

const initialColumns: Columns = {
  "New": [
    { id: "1", content: "Lead #101 - Tech Startup", value: 15000, contact: "john@techstartup.com" },
    { id: "2", content: "Lead #102 - E-commerce Store", value: 8500, contact: "sarah@ecommerce.com" }
  ],
  "Contacted": [
    { id: "3", content: "Lead #103 - Marketing Agency", value: 12000, contact: "mike@agency.com" }
  ],
  "Qualified": [
    { id: "4", content: "Lead #104 - SaaS Company", value: 25000, contact: "lisa@saas.com" }
  ],
  "Proposal": [
    { id: "5", content: "Lead #105 - Consulting Firm", value: 18000, contact: "david@consulting.com" }
  ],
  "Closed": []
};

export default function Leads() {
  const [columns, setColumns] = useState<Columns>(initialColumns);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLead, setNewLead] = useState({
    content: "",
    value: 0,
    contact: ""
  });

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    if (source.droppableId === destination.droppableId) {
      // Reordering within the same column
      const column = [...columns[source.droppableId]];
      const [moved] = column.splice(source.index, 1);
      column.splice(destination.index, 0, moved);
      
      setColumns({
        ...columns,
        [source.droppableId]: column
      });
    } else {
      // Moving between columns
      const sourceColumn = [...columns[source.droppableId]];
      const destColumn = [...columns[destination.droppableId]];
      const [moved] = sourceColumn.splice(source.index, 1);
      destColumn.splice(destination.index, 0, moved);
      
      setColumns({
        ...columns,
        [source.droppableId]: sourceColumn,
        [destination.droppableId]: destColumn
      });
    }
  };

  const addLead = () => {
    if (newLead.content && newLead.contact) {
      const lead: Lead = {
        id: Date.now().toString(),
        content: newLead.content,
        value: newLead.value,
        contact: newLead.contact
      };
      
      setColumns({
        ...columns,
        "New": [lead, ...columns["New"]]
      });
      
      setNewLead({ content: "", value: 0, contact: "" });
      setShowAddForm(false);
    }
  };

  const deleteLead = (leadId: string, columnId: string) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      setColumns({
        ...columns,
        [columnId]: columns[columnId].filter(lead => lead.id !== leadId)
      });
    }
  };

  const getTotalValue = (columnName: string) => {
    return columns[columnName].reduce((sum, lead) => sum + lead.value, 0);
  };

  const getColumnColor = (columnName: string) => {
    const colors = {
      "New": "#3b82f6",
      "Contacted": "#f59e0b", 
      "Qualified": "#8b5cf6",
      "Proposal": "#06b6d4",
      "Closed": "#10b981"
    };
    return colors[columnName as keyof typeof colors] || "#6b7280";
  };

  return (
    <div>
      <h1>
        Lead Pipeline 
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          style={{ marginLeft: '1rem', fontSize: '1rem' }}
        >
          {showAddForm ? "❌ Cancel" : "➕ Add Lead"}
        </button>
      </h1>

      {showAddForm && (
        <div className="user-list" style={{ marginBottom: '2rem' }}>
          <h2>Add New Lead</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr', gap: '1rem', marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Lead description (e.g., Lead #106 - Company Name)"
              value={newLead.content}
              onChange={(e) => setNewLead({ ...newLead, content: e.target.value })}
              style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc' }}
            />
            <input
              type="number"
              placeholder="Deal Value ($)"
              value={newLead.value || ''}
              onChange={(e) => setNewLead({ ...newLead, value: parseInt(e.target.value) || 0 })}
              style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc' }}
            />
            <input
              type="email"
              placeholder="Contact Email"
              value={newLead.contact}
              onChange={(e) => setNewLead({ ...newLead, contact: e.target.value })}
              style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc' }}
            />
          </div>
          <button onClick={addLead}>➕ Add Lead</button>
        </div>
      )}

      <div style={{ marginBottom: '2rem' }}>
        <div className="cards">
          {Object.entries(columns).map(([columnName, leads]) => (
            <div key={columnName} className="card">
              <h2>{columnName}</h2>
              <p>{leads.length} leads</p>
              <div style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.5rem' }}>
                Total: ${getTotalValue(columnName).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
          {Object.entries(columns).map(([columnId, leads]) => (
            <Droppable droppableId={columnId} key={columnId}>
              {(provided, snapshot) => (
                <div
                  className="kanban-column"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    backgroundColor: snapshot.isDraggingOver ? '#f8fafc' : 'white',
                    border: snapshot.isDraggingOver ? `2px dashed ${getColumnColor(columnId)}` : '1px solid #e2e8f0'
                  }}
                >
                  <h3 style={{ 
                    backgroundColor: getColumnColor(columnId),
                    color: 'white',
                    margin: '-1.5rem -1.5rem 1rem -1.5rem',
                    padding: '1rem'
                  }}>
                    {columnId} ({leads.length})
                    <div style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '0.25rem' }}>
                      ${getTotalValue(columnId).toLocaleString()}
                    </div>
                  </h3>
                  
                  {leads.map((lead, index) => (
                    <Draggable key={lead.id} draggableId={lead.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          className="kanban-item"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            transform: snapshot.isDragging 
                              ? `${provided.draggableProps.style?.transform} rotate(5deg)`
                              : provided.draggableProps.style?.transform,
                            boxShadow: snapshot.isDragging 
                              ? '0 8px 25px rgba(0,0,0,0.2)' 
                              : '0 2px 8px rgba(0,0,0,0.1)',
                            borderLeftColor: getColumnColor(columnId)
                          }}
                        >
                          <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                            {lead.content}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem' }}>
                            💰 ${lead.value.toLocaleString()}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem' }}>
                            📧 {lead.contact}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => deleteLead(lead.id, columnId)}
                              style={{
                                background: '#ef4444',
                                color: 'white',
                                border: 'none',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px',
                                fontSize: '0.7rem',
                                cursor: 'pointer'
                              }}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}