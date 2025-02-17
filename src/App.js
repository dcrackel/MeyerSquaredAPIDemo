import React, { useState, useEffect } from "react";
import { getAuthToken } from "./authService";
import "./App.css";

const API_URL = "https://meyer-squared-95db07154bdc.herokuapp.com/api/v1";
const EVENT_ID = 25; // Change to actual event ID

function App() {
  const [email, setEmail] = useState("");
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [club, setClub] = useState("");
  const [pronouns, setPronouns] = useState("He/Him");
  const [personId, setPersonId] = useState(0);
  const [clubs, setClubs] = useState([]); // Store clubs

  // Fetch clubs on page load
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const token = await getAuthToken();
        const response = await fetch(`${API_URL}/club/`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) throw new Error("Failed to fetch clubs");

        const data = await response.json();
        setClubs(data); // Store clubs
      } catch (err) {
        console.error("Error fetching clubs:", err);
      }
    };

    fetchClubs();
  }, []);

  // Lookup person by email
  const lookupPerson = async () => {
    if (!email) return;

    setLoading(true);
    setError("");
    setPerson(null);

    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_URL}/person/email/${email}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) throw new Error("User not found. Please enter details.");

      const data = await response.json();
      setPerson(data);
      setPersonId(data.PersonId || 0);
      setDisplayName(data.DisplayName || "");
      setFirstName(data.FirstName || "");
      setLastName(data.LastName || "");
      setClub(data.ClubId || ""); // Set clubId if found
      setPronouns(data.Pronouns || "He/Him");
    } catch (err) {
      setError(err.message);
      setPersonId(0);
      setDisplayName("");
      setFirstName("");
      setLastName("");
      setClub("");
      setPronouns("He/Him");
    } finally {
      setLoading(false);
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      PersonId: personId,
      Email: email,
      DisplayName: displayName,
      Pronouns: pronouns,
      FirstName: firstName,
      LastName: lastName,
      ClubId: club || null
    };

    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_URL}/event/${EVENT_ID}/addPersonFromThridParty`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Error submitting registration.");

      alert("Registration successful!");
      setEmail("");
      setPerson(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
      <div className="container">
        <h2>Event Registration</h2>
        <form onSubmit={handleSubmit}>
          <label>Email:</label>
          <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={lookupPerson}
              required
          />

          {loading && <p className="loading">Looking up user...</p>}
          {error && <p className="error">{error}</p>}

          <label>Display Name:</label>
          <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
          />

          <label>First Name:</label>
          <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
          />

          <label>Last Name:</label>
          <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
          />

          <label>Club:</label>
          <select value={club} onChange={(e) => setClub(e.target.value)} required>
            <option value="">Select a Club</option>
            {clubs.map((club) => (
                <option key={club.ClubId} value={club.ClubId}>
                  {club.Name}
                </option>
            ))}
          </select>

          <label>Pronouns:</label>
          <select value={pronouns} onChange={(e) => setPronouns(e.target.value)}>
            <option value="He/Him">He/Him</option>
            <option value="She/Her">She/Her</option>
            <option value="They/Them">They/Them</option>
          </select>

          <button type="submit">Register</button>
        </form>
      </div>
  );
}

export default App;
