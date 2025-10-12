import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const ACTIVITIES = [
  { id: "nature", name: "nature" },
  { id: "museums", name: "museums" },
  { id: "theatres and entertainments", name: "theatres and entertainments" },
  { id: "urban_ nvironment", name: "urban environment" },
  { id: "historic", name: "historic" },
  { id: "religion", name: "religion" },
  { id: "architecture", name: "architecture" },
  { id: "industrial facilities", name: "industrial facilities" },
  { id: "amusements", name: "amusements" },
  { id: "sport", name: "sport" },
  { id: "adult", name: "adult" },
  { id: "shops", name: "shops" },
  { id: "foods", name: "foods" },
];

const fallbackHotels = [
  { id: "none", name: "Select", address: "", lat: 0, lng: 0 },
  {
    "id": 1,
    "name": "Marriott Marquis New York",
    "address": "1535 Broadway, New York, NY 10036, USA",
    "lat": 40.7586,
    "lng": -73.9864
  },
  {  
    "id": 2,
    "name": "San Francisco Marriott Marquis",
    "address": "780 Mission St, San Francisco, CA 94103, USA",
    "lat": 37.7850,
    "lng": -122.4039
  },
  {  
    "id": 3,
    "name": "Courtyard by Marriott Blacksburg",
    "address": "105 Southpark Dr, Blacksburg, VA 24060, USA",
    "lat": 37.1997,
    "lng": -80.4183
  },
  {  
    "id": 4,
    "name": "Bethesda Marriott",
    "address": "780 Mission St, San Francisco, CA 94103, USA",
    "lat": 39.0163742,
    "lng": -77.2558084
  },
  {  
    "id": 5,
    "name": "Marriott Orlando Downtown",
    "address": "400 W Livingston St, Orlando, FL 32801, USA",
    "lat": 28.5402,
    "lng": -81.3792
  },
  {  
    "id": 6,
    "name": "Dallas Marriott Downtown",
    "address": "650 N Pearl St, Dallas, TX 75201, USA",
    "lat": 32.7854,
    "lng": -96.7992
  },
  {  
    "id": 7,
    "name": "Hyderabad Marriott Hotel & Convention Centre",
    "address": "Tank Bund Rd, opposite Hussain Sagar, Bhagyalaxmi Nagar, Lake, Hyderabad, Telangana 500080, India",
    "lat": 17.423858,
    "lng": 78.478497
  },
  {"id": 8,
    "name": "Other",
    "address": ""
  }
];

const KEY = "mm_posts_v1";

// Dummy user info (replace with props/context as needed)
const user = {
  id: "u1",
  handle: "Username",
  avatar: "/react.svg",
};

export default function ModalPost({ hotels = fallbackHotels, onCancel, onCreate }) {
  const nav = useNavigate();

  // store hotelId as a string so it matches the string value returned by <select>
  const [hotelId, setHotelId] = useState(String(hotels[0]?.id ?? "none"));
  const [desc, setDesc] = useState("");
  const [expTitle, setExpTitle] = useState("");
  const [activityId, setActivityId] = useState(ACTIVITIES[0]?.id || "none");
  const [activityTags, setActivityTags] = useState([]);
  const [photos, setPhotos] = useState([]);
  // Address should represent the event/attraction location (not the hotel's address)
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({ title: "", address: "" });
  const titleRef = useRef();
  const addressRef = useRef();
  const fileInputRef = useRef();

  const closeToDashboard = () => {
    if (onCancel) onCancel();
    try { nav("/dashboard"); } catch {}
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readers).then(imgs => setPhotos(imgs));
  };

  const onDone = (e) => {
    e.preventDefault();
    // validate required fields
    const nextErrors = { title: "", address: "" };
    if (!expTitle || !expTitle.trim()) nextErrors.title = "Please provide a title for the experience.";
    if (!address || !address.trim()) nextErrors.address = "Please provide the address of the event/attraction.";
    setErrors(nextErrors);
    if (nextErrors.title) {
      try { titleRef.current?.focus(); } catch {}
      return;
    }
    if (nextErrors.address) {
      try { addressRef.current?.focus(); } catch {}
      return;
    }

    // find by comparing stringified ids because <select> returns strings
    const hotel = hotels.find(h => String(h.id) === String(hotelId)) || { id: "none", name: "", address: "" };
    const post = {
      id: (crypto?.randomUUID?.() || `${Date.now()}`),
      user,
      hotelId: hotel.id,
      hotelName: hotel.name,
<<<<<<< HEAD
      experienceTitle: expTitle,
      address,
=======
      hotelAddress: hotel.address,
>>>>>>> 2845c110c5174bc836758ffaa0b2a0dc0169ad0c
      activityTags: activityTags,
      caption: desc,
      photos,
      likes: 0,
      comments: 0,
      createdAt: Date.now(),
    };

    try {
      const prev = JSON.parse(localStorage.getItem(KEY) || "[]");
      localStorage.setItem(KEY, JSON.stringify([post, ...prev]));
    } catch {}

    if (onCreate) onCreate(post);
    closeToDashboard();
  };

  return (
    <div className="grid place-items-center min-h-screen">
      <form
        onSubmit={onDone}
        style={{
          position: "relative",
          width: 720,
          maxHeight: "80vh",
          overflowY: "auto",
          background: "white",
          color: "#111",
          borderRadius: 12,
          padding: 32,
          boxShadow: "0 8px 24px rgba(0,0,0,.15)",
        }}
      >
        {/* X button (top-left) */}
        <button
          type="button"
          aria-label="Close"
          onClick={closeToDashboard}
          style={{
            position: "absolute",
            left: 12,
            top: 12,
            background: "transparent",
            border: "none",
            fontSize: 28,
            lineHeight: 1,
            cursor: "pointer",
          }}
        >
          ×
        </button>

        {/* Header: avatar + username (top-right) */}
        <div style={{
          position: "absolute",
          right: 24,
          top: 18,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}>
          <img src={user.avatar} width="32" height="32" alt="avatar" style={{ borderRadius: "999px" }} />
          <span style={{ fontWeight: 600 }}>{user.handle}</span>
        </div>

        {/* Photo uploader */}
        <label className="block mt-6 mb-1">Upload photos</label>
        <div className="mb-3 p-3 rounded-lg bg-gray-100 flex items-center gap-2 w-fit">
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={handlePhotoChange}
            className="bg-gray-100"
          />
        </div>
        <div className="flex gap-2 mb-3">
          {photos.map((src, i) => (
            <img key={i} src={src} alt={`upload-${i}`} className="w-16 h-16 object-cover rounded-lg" />
          ))}
        </div>

        {/* Hotel dropdown */}
        <label className="block mt-3 mb-1 text-gray-700">Where did you stay?</label>
        <select
          value={hotelId}
          onChange={(e) => {
            const val = e.target.value;
            setHotelId(val);
            // DO NOT overwrite the event/attraction address here; users will enter the
            // specific address where they attended the activity.
          }}
          className="w-[300px] border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
        >
          {hotels.map((h) => (
            <option key={h.id} value={String(h.id)}>
              {h.name}
            </option>
          ))}
        </select>
        
        {/* Activities dropdown + tags */}
        {/* Experience title */}
        <label className="block mt-6 mb-1 text-gray-700">Experience title</label>
        <input
          ref={titleRef}
          value={expTitle}
          onChange={(e) => setExpTitle(e.target.value)}
          placeholder="Name your experience (e.g. Morning Yoga at the Rooftop)"
          className="w-[480px] border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
        />
        {errors.title && <div style={{ color: "#b81843", marginTop: 6, fontSize: 13 }}>{errors.title}</div>}

        {/* Address input */}
        <label className="block mt-3 mb-1 text-gray-700">Address of the event/attraction (where you spent your time)</label>
        <input
          ref={addressRef}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Street, City, Country"
          className="w-[480px] border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
        />
        {errors.address && <div style={{ color: "#b81843", marginTop: 6, fontSize: 13 }}>{errors.address}</div>}

        <label className="block mt-6 mb-1 text-gray-700">What did you do?</label>
        <div className="flex items-center gap-2">
          <select
            value={activityId}
            onChange={(e) => setActivityId(e.target.value)}
            className="w-[220px] border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            {ACTIVITIES.filter(a => hotelId === 'none' || !a.hotelIds || a.hotelIds.length === 0 || a.hotelIds.includes(hotelId)).map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => {
              if (!activityId || activityId === "none") return;
              const found = ACTIVITIES.find((a) => a.id === activityId);
              if (!found) return;
              setActivityTags((prev) => (prev.includes(found.name) ? prev : [...prev, found.name]));
            }}
            className="px-3 py-2 bg-gray-100 rounded-md text-sm"
          >
            Add
          </button>
        </div>
        {/* show selected activity tags */}
        {activityTags.length > 0 && (
          <div className="flex gap-2 mt-2">
            {activityTags.map((t) => (
              <span key={t} className="flex items-center gap-2 bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm">
                <span>{t}</span>
                <button
                  type="button"
                  onClick={() => setActivityTags((prev) => prev.filter((x) => x !== t))}
                  className="text-xs font-bold"
                  aria-label={`Remove ${t}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        <label className="block mt-6 mb-1 text-gray-700">Description</label>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Describe your experience"
          rows={4}
          className="w-[480px] border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-black-300"
        />

        {/* Post */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-[80px] h-10 rounded-lg text-white shadow-md"
            style={{ backgroundColor: "#b81843" }}
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
}
