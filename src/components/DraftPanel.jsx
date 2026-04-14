import StateIndicator from "./StateIndicator";

const FIELD_LABELS = {
  first_name: "First Name",
  last_name: "Last Name",
  email: "Email",
  dob: "Date of Birth",
  gender: "Gender",
  height: "Height (cm)",
  weight: "Weight (kg)",
  waist: "Waist (cm)",
  profile_picture: "Profile Picture",
  locale: "Locale",
  activity_level: "Activity Level",
  consume_alcohol: "Alcohol",
  smoke_status: "Smoking",
  sleep_quality: "Sleep Quality",
  meals_per_day: "Meals/Day",
  snacks_count: "Snacks/Day",
  food_allergies: "Food Allergies",
  type_of_diabetes: "Diabetes Type",
  has_medication: "On Medication",
  drug_allergies: "Drug Allergies",
  medical_conditions: "Medical Conditions",
};

export default function DraftPanel({ state, draftChanges, appliedChanges }) {
  const changes = appliedChanges || draftChanges;
  const isApplied = !!appliedChanges;

  return (
    <div className="draft-panel">
      <div className="draft-header">
        <h3>{isApplied ? "Applied Changes" : "Draft Changes"}</h3>
        <StateIndicator state={state} />
      </div>

      {changes && Object.keys(changes).length > 0 ? (
        <div className="draft-list">
          {Object.entries(changes).map(([field, value]) => (
            <div key={field} className={`draft-item ${isApplied ? "applied" : ""}`}>
              <span className="draft-field">
                {isApplied && <span className="check">&#10003;</span>}
                {FIELD_LABELS[field] || field}
              </span>
              <span className="draft-value">{String(value)}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="draft-empty">
          {state === "collecting"
            ? 'Tell the agent what to update. e.g. "Change my height to 175 cm"'
            : "No changes pending"}
        </p>
      )}
    </div>
  );
}
