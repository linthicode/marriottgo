import React from "react";

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

export default function PostCard({ post }) {
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

  const marriottRed = "#b81f3a";
  const photos = Array.isArray(sample.photos)
    ? sample.photos
    : sample.photos
    ? [sample.photos]
    : [];
  const dummyImage = photos[0] || "/images/dummy.jpg";
  const hotelName = sample.hotelName || "Hotel";
  // prefer hotelAddress when available for subheading
  const hotelAddress = sample.hotelAddress || sample.hotelName || "";
  const activityTags = Array.isArray(sample.activityTags)
    ? sample.activityTags
    : [];
  const caption = sample.caption || "";
  const createdAt = sample.createdAt || Date.now();
  const userHandle = sample.user?.handle;
  // some posts use `avatar` instead of `image` on user
  const pfpImage = sample.user?.avatar || sample.user?.image;

  const handleHotelNameClick = () => {
    window.dispatchEvent(
      new CustomEvent("openModalBook", { detail: { hotelName } })
    );
  };

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "40px auto",
        background: "#fff",
        borderRadius: 16,
        border: `2px solid ${marriottRed}`,
        padding: 28,
        position: "relative",
      }}
    >
      {/* Header: Hotel Name and optional user info */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span
            onClick={handleHotelNameClick}
            style={{
              color: marriottRed,
              fontWeight: 700,
              fontSize: 24,
              textDecoration: "none",
              lineHeight: 1.1,
              cursor: "pointer",
            }}
          >
            {hotelName}
          </span>
          {hotelAddress && (
            <span
              style={{
                color: marriottRed,
                fontWeight: 500,
                fontSize: 16,
                marginTop: 0,
              }}
            >
              {hotelAddress}
            </span>
          )}
        </div>

        {userHandle && pfpImage && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                fontWeight: 500,
                color: marriottRed,
                fontSize: 15,
              }}
            >
              @{userHandle}
            </span>
            <div style={{ position: "relative", display: "inline-block" }}>
              <img
                src={pfpImage}
                alt="Profile"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  border: `2.5px solid ${marriottRed}`,
                  objectFit: "cover",
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Experience Image */}
      <div
        style={{
          marginTop: 18,
          width: "calc(100% + 56px)",
          marginLeft: -28,
          marginRight: -28,
        }}
      >
        <img
          src={dummyImage}
          alt="Experience"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            objectFit: "contain",
            borderRadius: "0px 0px 0px 0px",
          }}
        />
      </div>

      {/* Date and Activity Tag below image, aligned */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        <span
          style={{
            color: marriottRed,
            fontSize: 13,
            fontWeight: 600,
            background: "#f5e1e6",
            borderRadius: 12,
            padding: "4px 12px",
          }}
        >
          {fmtDate(createdAt)}
        </span>
        {activityTags.length > 0 && (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {activityTags.map((t) => (
              <span
                key={t}
                style={{
                  background: marriottRed,
                  color: "#fff",
                  borderRadius: 12,
                  padding: "4px 12px",
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: 18,
          color: "#222",
          fontSize: 16,
          fontWeight: 400,
          lineHeight: 1.5,
          border: `1.5px solid ${marriottRed}`,
          borderRadius: 10,
          padding: "16px 14px",
          background: "#fff8fa",
        }}
      >
        {caption}
      </div>
    </div>
  );
}