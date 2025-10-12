import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { geocode } from "../helper/geoapify";
import { AuthContext } from "../auth/AuthProvider";
import { createPost } from "../api/posts";
import Avatar from '@mui/material/Avatar';
import PersonIcon from '@mui/icons-material/Person';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const ACTIVITIES = [
  { id: "nature", name: "nature" },
  { id: "museums", name: "museums" },
  { id: "theatres_and_entertainments", name: "theatres_and_entertainments" },
  { id: "urban_environment", name: "urban_environment" },
  { id: "historic", name: "historic" },
  { id: "religion", name: "religion" },
  { id: "architecture", name: "architecture" },
  { id: "industrial_facilities", name: "industrial_facilities" },
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



export default function ModalPost({ hotels = fallbackHotels, onCancel, onCreate, prefillData }) {
  const nav = useNavigate();
  const { user: authUser } = useContext(AuthContext);

  // while auth state is being determined, show a small placeholder to avoid blank modal
  if (authUser === undefined) {
    return (
      <div className="grid place-items-center min-h-screen">
        <div className="p-6 bg-white rounded shadow">Checking session…</div>
      </div>
    );
  }

  // if user is not authenticated, redirect to login
  if (authUser === null) {
    try { nav("/login"); } catch {}
    return null;
  }

  // store hotelId as a string so it matches the string value returned by <select>
  const [hotelId, setHotelId] = useState(String(hotels[0]?.id ?? "none"));
  const [desc, setDesc] = useState(prefillData?.description || "");
  const [expTitle, setExpTitle] = useState(prefillData?.title || "");
  const [activityId, setActivityId] = useState(ACTIVITIES[0]?.id || "none");
  const [activityTags, setActivityTags] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [rating, setRating] = useState(prefillData?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  // Address should represent the event/attraction location (not the hotel's address)
  const [address, setAddress] = useState(prefillData?.address || "");
  const [errors, setErrors] = useState({ title: "", address: "", hotel: "", activities: "" });
  const [addressCoords, setAddressCoords] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);
  const titleRef = useRef();
  const addressRef = useRef();
  const hotelRef = useRef();
  const activitySelectRef = useRef();
  const fileInputRef = useRef();
  const [showSnackbar, setShowSnackbar] = useState(false);

  const closeToDashboard = () => {
    if (onCancel) {
      onCancel();
    } else {
      // Only navigate if no onCancel callback is provided (standalone usage)
      try { nav("/dashboard"); } catch {}
    }
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

  // Geoapify autocomplete helpers
  const fetchAddressSuggestions = async (q) => {
    if (!q) {
      setSuggestions([]);
      setLoadingSuggestions(false);
      return;
    }
    setLoadingSuggestions(true);
    try {
      const data = await geocode(q);
      const items = (data?.features || []).map((f) => ({
        formatted: f.properties?.formatted || f.properties?.address_line1 || "",
        lat: f.geometry?.coordinates?.[1] ?? null,
        lon: f.geometry?.coordinates?.[0] ?? null,
        raw: f,
      }));
      setSuggestions(items);
    } catch (err) {
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
      setShowSuggestions(true);
    }
  };

  const handleAddressChange = (e) => {
    const val = e.target.value;
    setAddress(val);
    setAddressCoords(null);
    setShowSuggestions(Boolean(val));
    // clear address error while typing
    setErrors((prev) => ({ ...prev, address: "" }));
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchAddressSuggestions(val), 350);
  };

  const selectSuggestion = (s) => {
    if (!s) return;
    setAddress(s.formatted || "");
    if (s.lat != null && s.lon != null) setAddressCoords({ lat: s.lat, lng: s.lon });
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const onDone = async (e) => {
    e.preventDefault();
    // validate required fields
    const nextErrors = { title: "", address: "", hotel: "", activities: "" };
    if (!hotelId || hotelId === 'none') nextErrors.hotel = "Please select where you stayed.";
    if (!expTitle || !expTitle.trim()) nextErrors.title = "Please provide a title for the experience.";
    if (!address || !address.trim()) nextErrors.address = "Please provide the address of the event/attraction.";
    if (!activityTags || activityTags.length === 0) nextErrors.activities = "Please add at least one activity.";
    setErrors(nextErrors);
    // focus the first field with an error (hotel -> title -> address -> activities)
    if (nextErrors.hotel) {
      try { hotelRef.current?.focus(); } catch {}
      return;
    }
    if (nextErrors.title) {
      try { titleRef.current?.focus(); } catch {}
      return;
    }
    if (nextErrors.address) {
      try { addressRef.current?.focus(); } catch {}
      return;
    }
    if (nextErrors.activities) {
      try { activitySelectRef.current?.focus(); } catch {}
      return;
    }

    // find by comparing stringified ids because <select> returns strings
    const hotel = hotels.find(h => String(h.id) === String(hotelId)) || { id: "none", name: "", address: "" };

    // Transform data to match Supabase schema
    const postData = {
      user_id: authUser.id,
      hotel_id: hotel.id,
      hotel_name: hotel.name,
      hotel_address: hotel.address,
      experience_title: expTitle,
      address: address,
      address_lat: addressCoords?.lat || null,
      address_lng: addressCoords?.lng || null,
      rating: rating,
      activity_tags: activityTags,
      caption: desc,
      photos: photos,
    };

    try {
      // Save to Supabase
      const { data, error } = await createPost(postData);
      
      if (error) {
        console.error("Failed to save post to Supabase:", error);
        // Show error message to user
        setShowSnackbar(true);
        return;
      }

      // Transform Supabase response back to frontend format for compatibility
      const post = {
        id: data.id,
        user: {
          id: authUser.id,
          handle: authUser.user_metadata?.username || authUser.email,
          avatar: authUser.user_metadata?.avatar_url || authUser.avatar || null,
        },
        hotelId: data.hotel_id,
        hotelName: data.hotel_name,
        hotelAddress: data.hotel_address,
        experienceTitle: data.experience_title,
        address: data.address,
        rating: data.rating,
        addressCoords: data.address_lat && data.address_lng ? { lat: data.address_lat, lng: data.address_lng } : null,
        activityTags: data.activity_tags,
        caption: data.caption,
        photos: data.photos,
        likes: data.likes,
        comments: data.comments,
        createdAt: new Date(data.created_at).getTime(),
      };

      if (onCreate) onCreate(post);
      
      // Show success snackbar
      setShowSnackbar(true);
      
      // Close modal after a short delay to let user see the snackbar
      setTimeout(() => {
        closeToDashboard();
      }, 1500);
    } catch (error) {
      console.error("Unexpected error saving post:", error);
      // Show error message to user
      setShowSnackbar(true);
    }
  };

  // Standalone variables (for easy access at the end of the component)
  // 1) hotel name the user picked
  const HOTEL_NAME_SELECTED = (hotels.find((h) => String(h.id) === String(hotelId))?.name) || "";

  // 2) experience title string
  const EXPERIENCE_TITLE_STRING = expTitle || "";

  // 3) address string for the event/attraction
  const EVENT_ADDRESS_STRING = address || "";

  // 4) rating integer: -1 if no rating provided, otherwise 1-5
  const RATING_INT = typeof rating === 'number' && rating > 0 ? Math.min(5, Math.max(1, Math.floor(rating))) : -1;

  // 4) tag index array (0/1) according to the mapping provided
  {/*I think the array works as intended, create an array and fill in int 1 into the end related to the tag*/}
  const TAG_INDEX_MAP = {
    "nature": 0,
    "museums": 1,
    "theatres_and_entertainments": 2,
    "urban_environment": 3,
    "historic": 4,
    "religion": 5,
    "architecture": 6,
    "industrial_facilities": 7,
    "amusements": 8,
    "sport": 9,
    "adult": 10,
    "shops": 11,
    "foods": 12,
  };
{/*Note: arr is the array with which tag the user added to their post*/}
  const TAG_INDEX_ARRAY = (() => {
    const arr = new Array(Object.keys(TAG_INDEX_MAP).length).fill(0);
    if (!Array.isArray(activityTags)) return arr;
    activityTags.forEach((t) => {
      if (!t) return;
      // normalize tag to match keys (replace spaces with underscores and lowercase)
      const key = String(t).trim().toLowerCase().replace(/\s+/g, "_");
      const idx = TAG_INDEX_MAP[key];
      if (typeof idx === "number") arr[idx] = 1;
    });
    return arr;
  })();

  return (
    <>
      <div className="grid place-items-center min-h-screen p-4">
        <form
          onSubmit={onDone}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
        >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-[#a11d2b] to-[#8B1523] text-white px-8 py-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                aria-label="Close"
                onClick={closeToDashboard}
                className="hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div>
                <h2 className="text-2xl font-bold">Create New Experience</h2>
                <p className="text-rose-100 text-sm">Share your amazing travel story</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {(authUser?.user_metadata?.avatar_url || authUser?.avatar) ? (
                <img 
                  src={authUser?.user_metadata?.avatar_url || authUser?.avatar} 
                  width="40" 
                  height="40" 
                  alt="avatar" 
                  className="rounded-full border-2 border-white/30 shadow-lg object-cover" 
                />
              ) : (
                <Avatar 
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    bgcolor: 'white',
                    color: '#a11d2b',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <PersonIcon sx={{ fontSize: 28 }} />
                </Avatar>
              )}
              <span className="font-semibold">{authUser?.user_metadata?.username || authUser?.email || 'Username'}</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8 space-y-6">
          {/* Photo uploader */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Upload Photos
              </span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-[#a11d2b] transition-colors bg-gray-50 hover:bg-gray-100">
              <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                onChange={handlePhotoChange}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center gap-2">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm text-gray-600 font-medium">Click to upload or drag and drop</span>
                <span className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</span>
              </label>
            </div>
            {photos.length > 0 && (
              <div className="grid grid-cols-4 gap-3 mt-4">
                {photos.map((src, i) => (
                  <div key={i} className="relative group">
                    <img 
                      src={src} 
                      alt={`upload-${i}`} 
                      className="w-full h-24 object-cover rounded-lg shadow-md border-2 border-gray-200" 
                    />
                    <button
                      type="button"
                      onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hotel dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Where did you stay?
                <span className="text-red-600" aria-hidden="true">*</span>
              </span>
            </label>
            <select
              ref={hotelRef}
              value={hotelId}
              onChange={(e) => {
                const val = e.target.value;
                setHotelId(val);
                setErrors((prev) => ({ ...prev, hotel: "" }));
              }}
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white text-gray-800 shadow-sm focus:outline-none focus:border-[#a11d2b] focus:ring-2 focus:ring-[#a11d2b]/20 transition-all"
            >
              {hotels.map((h) => (
                <option key={h.id} value={String(h.id)}>
                  {h.name}
                </option>
              ))}
            </select>
            {errors.hotel && <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.hotel}
            </p>}
          </div>
        
          {/* Experience title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Experience Title
                <span className="text-red-600" aria-hidden="true">*</span>
              </span>
            </label>
            <input
              ref={titleRef}
              value={expTitle}
              onChange={(e) => { setExpTitle(e.target.value); setErrors((prev) => ({ ...prev, title: "" })); }}
              placeholder="Name your experience (e.g. Morning Yoga at the Rooftop)"
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white text-gray-800 focus:outline-none focus:border-[#B81843] focus:ring-2 focus:ring-[#B81843]/20 transition-all"
            />
            {errors.title && <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.title}
            </p>}
          </div>

          {/* Address input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Event Location
                <span className="text-red-600" aria-hidden="true">*</span>
              </span>
            </label>
            <div className="relative">
              <input
                ref={addressRef}
                value={address}
                onChange={handleAddressChange}
                onFocus={() => setShowSuggestions(Boolean(address))}
                placeholder="Street, City, Country"
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white text-gray-800 focus:outline-none focus:border-[#B81843] focus:ring-2 focus:ring-[#B81843]/20 transition-all"
                aria-autocomplete="list"
              />
              {showSuggestions && (suggestions.length > 0 || loadingSuggestions) && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white border-2 border-gray-200 rounded-xl z-40 max-h-60 overflow-y-auto shadow-xl">
                  {loadingSuggestions && (
                    <div className="p-4 text-gray-500 flex items-center gap-2">
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Searching...
                    </div>
                  )}
                  {suggestions.map((s, i) => (
                    <div
                      key={i}
                      onMouseDown={(ev) => { ev.preventDefault(); selectSuggestion(s); }}
                      className="p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        <span className="text-sm text-gray-700">{s.formatted}</span>
                      </div>
                    </div>
                  ))}
                  {!loadingSuggestions && suggestions.length === 0 && (
                    <div className="p-4 text-gray-500 text-sm">No suggestions found</div>
                  )}
                </div>
              )}
            </div>
            {errors.address && <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.address}
            </p>}
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Rate Your Experience
              </span>
            </label>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl" role="radiogroup" aria-label="Rating">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                  aria-checked={rating === n}
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  className="bg-transparent border-none cursor-pointer text-3xl p-2 transition-transform hover:scale-110"
                  style={{ color: (hoverRating || rating) >= n ? "#b81843" : "#d1d5db" }}
                >
                  {(hoverRating || rating) >= n ? "★" : "☆"}
                </button>
              ))}
              <span className="ml-2 text-sm font-medium text-gray-700 px-3 py-1 bg-white rounded-full">
                {rating ? `${rating} / 5` : "No rating"}
              </span>
            </div>
          </div>

          {/* Activities */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                What Did You Do?
                <span className="text-red-600" aria-hidden="true">*</span>
              </span>
            </label>
            <div className="flex gap-2">
              <select
                ref={activitySelectRef}
                value={activityId}
                onChange={(e) => { setActivityId(e.target.value); setErrors((prev) => ({ ...prev, activities: "" })); }}
                className="flex-1 border-2 border-gray-300 rounded-xl px-4 py-3 bg-white text-gray-800 shadow-sm focus:outline-none focus:border-[#a11d2b] focus:ring-2 focus:ring-[#a11d2b]/20 transition-all"
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
                  setErrors((prev) => ({ ...prev, activities: "" }));
                }}
                className="px-6 py-3 bg-[#a11d2b] hover:bg-[#8B1523] text-white rounded-xl font-medium transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add
              </button>
            </div>
            {/* Selected activity tags */}
            {activityTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {activityTags.map((t) => (
                  <span key={t} className="flex items-center gap-2 bg-gradient-to-r from-[#a11d2b] to-[#8B1523] text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-shadow">
                    <span>#{t}</span>
                    <button
                      type="button"
                      onClick={() => setActivityTags((prev) => prev.filter((x) => x !== t))}
                      className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                      aria-label={`Remove ${t}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
            {errors.activities && <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.activities}
            </p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
                Tell Your Story
              </span>
            </label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Share the details of your amazing experience..."
              rows={5}
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white text-gray-800 focus:outline-none focus:border-[#a11d2b] focus:ring-2 focus:ring-[#a11d2b]/20 transition-all resize-none"
            />
          </div>
        </div>

        {/* Footer with action buttons */}
        <div className="sticky bottom-0 bg-gray-50 px-8 py-6 border-t border-gray-200 rounded-b-2xl flex items-center justify-between">
          <button
            type="button"
            onClick={closeToDashboard}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-[#a11d2b] to-[#8B1523] hover:from-[#8B1523] hover:to-[#a11d2b] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span>Publish Experience</span>
          </button>
        </div>
      </form>
    </div>

    {/* Success Snackbar */}
    <Snackbar 
      open={showSnackbar} 
      autoHideDuration={4000} 
      onClose={() => setShowSnackbar(false)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert 
        onClose={() => setShowSnackbar(false)} 
        severity="success" 
        sx={{ 
          width: '100%',
          backgroundColor: '#a11d2b',
          color: 'white',
          '& .MuiAlert-icon': {
            color: 'white'
          }
        }}
      >
        Post successfully created!
      </Alert>
    </Snackbar>
  </>
  );
}
