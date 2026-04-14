import { useState, useEffect } from "react";
import { getProfile } from "../api";

const SECTIONS = [
  {
    title: "Basic Info",
    fields: [
      ["first_name", "First Name"],
      ["last_name", "Last Name"],
      ["email", "Email"],
      ["phone_number", "Phone"],
      ["dob", "Date of Birth"],
      ["gender", "Gender"],
      ["height", "Height (cm)"],
      ["weight", "Weight (kg)"],
      ["waist", "Waist (cm)"],
      ["locale", "Locale"],
    ],
  },
  {
    title: "Lifestyle",
    fields: [
      ["activity_level", "Activity Level"],
      ["consume_alcohol", "Alcohol"],
      ["smoke_status", "Smoking"],
      ["sleep_quality", "Sleep Quality"],
      ["meals_per_day", "Meals/Day"],
      ["snacks_count", "Snacks/Day"],
    ],
  },
  {
    title: "Medical",
    fields: [
      ["type_of_diabetes", "Diabetes Type"],
      ["has_medication", "On Medication"],
      ["drug_allergies", "Drug Allergies"],
      ["medical_conditions", "Medical Conditions"],
      ["food_allergies", "Food Allergies"],
    ],
  },
];

function getValue(data, key) {
  if (data == null) return "—";

  // Check top-level
  if (data[key] !== undefined && data[key] !== null) {
    const val = data[key];
    if (typeof val === "boolean") return val ? "Yes" : "No";
    if (Array.isArray(val)) return val.length > 0 ? val.join(", ") : "—";
    return String(val);
  }

  // Check nested objects (lifestyle, medical history, etc.)
  const nested = [
    "daily_activity",
    "alcohol_consumption",
    "smoking_habit",
    "sleep_habit",
    "eating_habit",
    "diabetic_history",
    "current_medication",
    "medical_history",
  ];
  for (const sub of nested) {
    if (data[sub] && data[sub][key] !== undefined && data[sub][key] !== null) {
      const val = data[sub][key];
      if (typeof val === "boolean") return val ? "Yes" : "No";
      if (Array.isArray(val)) return val.length > 0 ? val.join(", ") : "—";
      return String(val);
    }
  }

  // Check array fields (drug_allergies, food_allergies)
  if (key === "drug_allergies" && data.drug_allergies) {
    const names = data.drug_allergies.map((a) => a.allergy_name || a);
    return names.length > 0 ? names.join(", ") : "—";
  }
  if (key === "food_allergies" && data.food_allergies) {
    const names = data.food_allergies.map((a) => a.allergy_name || a);
    return names.length > 0 ? names.join(", ") : "—";
  }
  if (key === "medical_conditions" && data.medical_history) {
    const mh = data.medical_history;
    if (mh.medical_conditions) return mh.medical_conditions;
    if (mh.conditions) return Array.isArray(mh.conditions) ? mh.conditions.join(", ") : mh.conditions;
  }

  return "—";
}

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);
    setError("");
    try {
      const res = await getProfile();
      setProfile(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return (
      <div className="profile-page">
        <div className="profile-loading">Loading profile...</div>
      </div>
    );
  if (error)
    return (
      <div className="profile-page">
        <div className="profile-error">
          <p>{error}</p>
          <button className="refresh-btn" onClick={loadProfile}>Retry</button>
        </div>
      </div>
    );
  if (!profile)
    return (
      <div className="profile-page">
        <p>No profile data</p>
      </div>
    );

  const initials = `${(profile.first_name || "?")[0]}${(profile.last_name || "?")[0]}`.toUpperCase();

  return (
    <div className="profile-page">
      <div className="profile-hero">
        <div className="profile-avatar">{initials}</div>
        <div className="profile-hero-info">
          <h2>{profile.first_name || ""} {profile.last_name || ""}</h2>
          <span className="profile-phone">{profile.phone_number || ""}</span>
        </div>
        <button className="refresh-btn" onClick={loadProfile}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          Refresh
        </button>
      </div>

      {SECTIONS.map((section) => (
        <div key={section.title} className="profile-section">
          <h3>{section.title}</h3>
          <div className="profile-grid">
            {section.fields.map(([key, label]) => {
              const val = getValue(profile, key);
              const isEmpty = val === "\u2014";
              return (
                <div key={key} className={`profile-field ${isEmpty ? "empty" : ""}`}>
                  <span className="field-label">{label}</span>
                  <span className="field-value">{val}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
