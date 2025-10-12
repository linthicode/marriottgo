import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthProvider";
import Avatar from '@mui/material/Avatar';
import PersonIcon from '@mui/icons-material/Person';

function fmtDate(ts) {
  try {
    const d = new Date(ts);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  } catch {
    return "";
  }
}

function getRelativeTime(ts) {
  try {
    const now = new Date();
    const date = new Date(ts);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
    if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
    return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
  } catch {
    return "";
  }
}

export default function PostCard({ post }) {
  const navigate = useNavigate();
  const sample = post || {
    id: "1",
    hotelName: "Marriot Hotel",
    photos: ["/images/dummy.jpg"],
    activityTags: ["Spa"],
    caption: "This is a sample post",
    createdAt: Date.now(),
    user: {
      handle: "sampleuser",
      image: "/images/dummy-profile.jpg",
    },
  };

  const primaryColor = "#a11d2b";
  const photos = Array.isArray(sample.photos)
    ? sample.photos
    : sample.photos
    ? [sample.photos]
    : [];
  const dummyImage = photos[0] || "/images/dummy.jpg";
  const hasPhoto = !!photos[0];
  function initials(name) {
    if (!name) return "";
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  function titleCase(str) {
    if (!str) return "";
    return str
      .toString()
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  }
  const hotelName = sample.hotelName || "Hotel";
  // prefer hotelAddress when available for subheading
  const hotelAddress = sample.hotelAddress || sample.hotelName || "";
  const experienceTitle = sample.experienceTitle || hotelName;
  const eventAddress = sample.address || sample.location || "";
  const displayTitle = titleCase(experienceTitle);
  const bookUrl = sample.bookUrl;
  const activityTags = Array.isArray(sample.activityTags)
    ? sample.activityTags
    : [];
  const rating = typeof sample.rating === 'number' ? sample.rating : 0;
  const caption = sample.caption || "";
  const createdAt = sample.createdAt || Date.now();
  const { user: authUser } = useContext(AuthContext);
  // prefer the user embedded on the post, otherwise fall back to the logged-in user
  const displayUser = sample.user || authUser || null;
  const userHandle =
    displayUser?.handle || displayUser?.user_metadata?.username || displayUser?.email || "";
  // handle multiple possible avatar fields
  const pfpImage =
    displayUser?.avatar ||
    displayUser?.image ||
    displayUser?.user_metadata?.avatar_url ||
    displayUser?.user_metadata?.avatar ||
    null;

  const handleHotelNameClick = () => {
    window.dispatchEvent(
      new CustomEvent("openModalBook", {
        detail: {
          hotelName,
          title: experienceTitle,
          subtitle: sample.user?.location || hotelName,
          img: photos[0] || undefined,
          desc: caption || undefined,
          bookUrl: sample.bookUrl || undefined,
          activities: sample.activities || undefined,
          nearby: sample.nearby || undefined,
            address: eventAddress || undefined,
            experienceTitle: experienceTitle,
          testimonies: sample.testimonies || undefined,
        },
      })
    );
  };

  return (
    <article className="max-w-2xl mx-auto mb-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="p-6 pb-0">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {pfpImage ? (
              <img 
                src={pfpImage} 
                alt={userHandle} 
                className="w-12 h-12 rounded-full border-2 border-[#a11d2b]/20 object-cover shadow-md"
              />
            ) : (
              <Avatar 
                sx={{ 
                  width: 48, 
                  height: 48, 
                  bgcolor: '#a11d2b',
                  border: '2px solid rgba(161, 29, 43, 0.2)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              >
                <PersonIcon sx={{ fontSize: 32 }} />
              </Avatar>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900">{userHandle}</span>
                <svg className="w-4 h-4 text-[#a11d2b]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-sm text-gray-500" title={fmtDate(createdAt)}>
                {getRelativeTime(createdAt)}
              </div>
            </div>
          </div>
          
          {/* Rating */}
          {rating > 0 && (
            <div className="flex items-center gap-1 bg-gradient-to-r from-[#a11d2b] to-[#8B1523] text-white px-3 py-1.5 rounded-full shadow-md">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-bold text-sm">{rating}/5</span>
            </div>
          )}
        </div>

        {/* Title and Location */}
        <div className="mb-4">
          <div className="flex items-start gap-2">
            <h2 
              onClick={handleHotelNameClick}
              className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-[#a11d2b] transition-colors leading-tight flex-1"
            >
              {displayTitle}
            </h2>
            {eventAddress && (
              <div className="flex items-center gap-1.5 text-gray-600 mt-1">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm whitespace-nowrap">{eventAddress}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Experience Image */}
      {hasPhoto && (
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
          <img
            src={dummyImage}
            alt={hotelName}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Description */}
        {caption && (
          <p className="text-gray-700 text-base leading-relaxed mb-4">
            {caption}
          </p>
        )}

        {/* Activity Tags */}
        {activityTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {activityTags.map((t, i) => (
              <span 
                key={t + i} 
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#a11d2b]/10 text-[#a11d2b] hover:bg-[#a11d2b]/20 transition-colors"
              >
                #{String(t).replace(/\s+/g, '')}
              </span>
            ))}
          </div>
        )}

        {/* Book Experience Button */}
        <div className="pt-4 border-t border-gray-100">
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent("openModalBook", { detail: { hotelName, experienceTitle, img: photos[0], desc: caption, bookUrl, activities: sample.activities, nearby: sample.nearby, address: eventAddress } }));
              try { navigate('/ModalBook'); } catch {}
            }}
            className="w-full bg-gradient-to-r from-[#a11d2b] to-[#8B1523] hover:from-[#8B1523] hover:to-[#a11d2b] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Book Experience</span>
          </button>
        </div>
      </div>
    </article>
  );
}