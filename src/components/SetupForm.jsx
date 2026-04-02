import { useState } from 'react';

const SetupForm = ({ initialData, onStart }) => {
  const [data, setData] = useState(initialData);

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...data.members];
    newMembers[index][field] = value;
    setData({ ...data, members: newMembers });
  };

  const addMember = () => {
    if (data.members.length < 4) {
      setData({ ...data, members: [...data.members, { name: '', regNo: '' }] });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onStart(data);
  };

  return (
    <div className="card">
      <h2 style={{color: 'var(--primary)'}}>Business Plan Setup</h2>
      <p style={{marginBottom: '2rem'}}>IIITH SGSS Course Project</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Project Name</label>
          <input 
            type="text" 
            placeholder="Enter your startup/project name" 
            value={data.name}
            onChange={(e) => setData({...data, name: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Team Members (max 4)</label>
          {data.members.map((member, index) => (
            <div key={index} style={{display: 'flex', gap: '1rem', marginBottom: '1rem'}}>
              <input 
                type="text" 
                placeholder={`Name ${index + 1}`} 
                value={member.name}
                onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                style={{flex: 2}}
              />
              <input 
                type="text" 
                placeholder="Reg No" 
                value={member.regNo}
                onChange={(e) => handleMemberChange(index, 'regNo', e.target.value)}
                style={{flex: 1}}
              />
            </div>
          ))}
          {data.members.length < 4 && (
            <button type="button" className="btn-text" onClick={addMember}>
              + Add Member
            </button>
          )}
        </div>

        <div className="form-group">
          <label>Display Metric</label>
          <select 
            value={data.displayMetric} 
            onChange={(e) => setData({...data, displayMetric: e.target.value})}
          >
            <option value="Lakhs (L)">Lakhs (L)</option>
            <option value="Crores (Cr)">Crores (Cr)</option>
            <option value="Thousands (K)">Thousands (K)</option>
            <option value="Actual (₹)">Actual (₹)</option>
          </select>
        </div>

        <div className="info-note">
          <strong>Note:</strong> Rate fields accept actual currency values (e.g., ₹5000). Calculated amounts display in your chosen metric.
        </div>

        <button type="submit" className="btn btn-primary">
          Start Planning →
        </button>
      </form>
    </div>
  );
};

export default SetupForm;
