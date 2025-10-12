
import React, { useEffect, useState } from "react";

const marriottRed = "#b41f3a";
const spaImages = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80"
];
const testimonies = [
  {
    user: "@desertfan",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    comment: "The Desert Spa was a dream! The hot stone massage was the best I've ever had."
  },
  {
    user: "@relaxingnomad",
    avatar: "https://randomuser.me/api/portraits/men/35.jpg",
    comment: "Loved the aromatherapy and the tranquil desert views. Will return!"
  },
  {
    user: "@wellnessqueen",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    comment: "Perfect for a girls' weekend. The staff made us feel like royalty."
  },
  {
    user: "@traveldad",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    comment: "Great amenities and super clean. The sauna was my favorite."
  },
  {
    user: "@sunseeker",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    comment: "The facial left my skin glowing. Highly recommend the spa packages!"
  },
  {
    user: "@luxurylover",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    comment: "Impeccable service and a beautiful setting. Five stars!"
  },
  {
    user: "@wellnessaddict",
    avatar: "https://randomuser.me/api/portraits/men/18.jpg",
    comment: "The yoga class at sunrise was magical."
  },
  {
    user: "@palmspringsgal",
    avatar: "https://randomuser.me/api/portraits/women/33.jpg",
    comment: "Loved the eucalyptus steam room. So refreshing!"
  },
  {
    user: "@retreatguru",
    avatar: "https://randomuser.me/api/portraits/men/28.jpg",
    comment: "A must-visit for anyone in Palm Desert."
  },
  {
    user: "@relaxrepeat",
    avatar: "https://randomuser.me/api/portraits/women/25.jpg",
    comment: "The best spa experience I’ve had in years."
  }
];
const activities = [
  {
    name: "Golf at Desert Springs",
    img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=120&q=80",
    desc: "Play on championship courses surrounded by stunning desert scenery."
  },
  {
    name: "Poolside Cabanas",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=120&q=80",
    desc: "Relax in private cabanas with poolside service and refreshing drinks."
  },
  {
    name: "Fine Dining at Rockwood Grill",
    img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=120&q=80",
    desc: "Enjoy gourmet cuisine and local flavors in an elegant setting."
  },
  {
    name: "Tennis Courts",
    img: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=120&q=80",
    desc: "Challenge friends or join a clinic on our well-maintained courts."
  },
  {
    name: "Guided Desert Hikes",
    img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=120&q=80",
    desc: "Explore the beauty of the desert with expert-led hiking tours."
  },
  {
    name: "JW Marriott Spa Rituals",
    img: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=120&q=80",
    desc: "Signature spa treatments exclusive to JW Marriott guests."
  },
  {
    name: "Mixology Classes at The Lobby Bar",
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=120&q=80",
    desc: "Learn to craft cocktails with Marriott’s expert mixologists."
  },
  {
    name: "Family Movie Nights",
    img: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b41?auto=format&fit=crop&w=120&q=80",
    desc: "Enjoy outdoor movies under the stars, perfect for all ages."
  },
  {
    name: "Desert Bike Rentals",
    img: "https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=120&q=80",
    desc: "Rent a bike and explore scenic desert trails around the resort."
  }
];
const nearby = [
  {
    name: "Palm Desert Art Museum",
    img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=120&q=80",
    desc: "A vibrant museum featuring contemporary and classic art in the heart of Palm Desert."
  },
  {
    name: "El Paseo Shopping District",
    img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=120&q=80",
    desc: "A premier shopping destination with boutiques, galleries, and fine dining."
  },
  {
    name: "Joshua Tree National Park (45 min drive)",
    img: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=120&q=80",
    desc: "Famous for its stunning rock formations and iconic Joshua trees, ideal for hiking and stargazing."
  },
  {
    name: "Indian Wells Tennis Garden",
    img: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=120&q=80",
    desc: "World-class tennis venue hosting major tournaments and events."
  },
  {
    name: "Palm Springs Air Museum",
    img: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b41?auto=format&fit=crop&w=120&q=80",
    desc: "Aviation history museum with vintage aircraft and interactive exhibits."
  },
  {
    name: "Coachella Valley Preserve",
    img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=120&q=80",
    desc: "Nature preserve with scenic trails, wildlife, and palm oases."
  }
];

export default function ModalBook() {
  const [item, setItem] = useState({
    title: "The Desert Spa",
    subtitle: "at JW Marriott",
    img: spaImages[0],
    desc: "A sanctuary of tranquility offering massages, aromatherapy, and more. Perfect for anyone seeking relaxation and luxury in the desert.",
    bookUrl: "https://www.marriott.com/en-us/hotels/ctdca-jw-marriott-desert-springs-resort-and-spa/overview/",
    testimonies,
    activities,
    nearby,
  });

  useEffect(() => {
    function handler(e) {
      const d = (e && e.detail) || {};
      setItem((prev) => ({
        ...prev,
        title: d.hotelName || d.title || prev.title,
        subtitle: d.subtitle || prev.subtitle,
        img: d.img || prev.img,
        desc: d.desc || prev.desc,
        bookUrl: d.bookUrl || prev.bookUrl,
        testimonies: d.testimonies || prev.testimonies,
        activities: d.activities || prev.activities,
        nearby: d.nearby || prev.nearby,
      }));

      // If the event contained an address or location, attempt to fetch nearby POIs
      const address = d.address || d.location || d.addressString;
      const lat = d.lat;
      const lon = d.lon;
      if (address || (lat && lon)) {
        // run async fetch (fire-and-forget)
        (async () => {
          try {
            const geocacheKey = `geo_cache:${address || `${lat},${lon}`}`;
            const cached = (() => {
              try {
                const raw = localStorage.getItem(geocacheKey);
                if (!raw) return null;
                const parsed = JSON.parse(raw);
                // TTL 24 hours
                if (Date.now() - (parsed.ts || 0) > 24 * 60 * 60 * 1000) return null;
                return parsed;
              } catch { return null; }
            })();

            let center = null;
            if (cached && cached.center) center = cached.center;
            else {
              if (lat && lon) center = { lat, lon };
              else {
                // geocode via Nominatim
                const q = encodeURIComponent(address || "");
                const nomUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${q}`;
                const nomRes = await fetch(nomUrl, { headers: { "Accept": "application/json" } });
                const nomJson = await nomRes.json();
                if (Array.isArray(nomJson) && nomJson.length > 0) {
                  center = { lat: parseFloat(nomJson[0].lat), lon: parseFloat(nomJson[0].lon) };
                }
              }
              if (center) {
                try { localStorage.setItem(geocacheKey, JSON.stringify({ ts: Date.now(), center })); } catch {}
              }
            }

            if (!center) return;

            // Overpass: search for common POI types near the location within radius
            const radius = 2000; // meters
            // query for tourism, leisure, amenity, historic, shop, sport, entertainment
            const overpassQuery = `[
out:json][timeout:25];(
  node(around:${radius},${center.lat},${center.lon})["tourism"];
  way(around:${radius},${center.lat},${center.lon})["tourism"];
  node(around:${radius},${center.lat},${center.lon})["leisure"];
  way(around:${radius},${center.lat},${center.lon})["leisure"];
  node(around:${radius},${center.lat},${center.lon})["amenity"];
  way(around:${radius},${center.lat},${center.lon})["amenity"];
  node(around:${radius},${center.lat},${center.lon})["historic"];
  way(around:${radius},${center.lat},${center.lon})["historic"];
  node(around:${radius},${center.lat},${center.lon})["shop"];
  way(around:${radius},${center.lat},${center.lon})["shop"];
  node(around:${radius},${center.lat},${center.lon})["sport"];
  way(around:${radius},${center.lat},${center.lon})["sport"];
);
out center 20;`;

            const overpassUrl = `https://overpass-api.de/api/interpreter`;
            const overpassRes = await fetch(overpassUrl, {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
              body: `data=${encodeURIComponent(overpassQuery)}`,
            });
            const overpassJson = await overpassRes.json();
            const elements = overpassJson.elements || [];

            // Map elements to simplified nearby items and dedupe by name
            const mapped = [];
            const seen = new Set();
            for (const el of elements) {
              const tags = el.tags || {};
              const name = tags.name || tags['brand'] || tags['operator'] || tags['amenity'] || tags['tourism'] || tags['leisure'] || tags['shop'] || ('poi-' + (el.id || ''));
              if (!name) continue;
              if (seen.has(name)) continue;
              seen.add(name);
              const latE = el.lat || (el.center && el.center.lat);
              const lonE = el.lon || (el.center && el.center.lon);
              const dist = latE && lonE && center ? Math.sqrt(Math.pow((latE - center.lat), 2) + Math.pow((lonE - center.lon),2)) : null;
              mapped.push({ name, img: null, desc: tags['description'] || tags['note'] || '', lat: latE, lon: lonE, distance: dist });
              if (mapped.length >= 8) break;
            }

            // cache results
            try { localStorage.setItem(geocacheKey, JSON.stringify({ ts: Date.now(), center, results: mapped })); } catch {}

            // update modal item nearby
            setItem((prev) => ({ ...prev, nearby: mapped }));
          } catch (err) {
            console.error('Nearby fetch error', err);
          }
        })();
      }
    }

    window.addEventListener("openModalBook", handler);
    return () => window.removeEventListener("openModalBook", handler);
  }, []);

  return (
    <div style={{
      width: 800,
      minHeight: 'auto',
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 4px 24px rgba(180,31,58,0.12)",
      border: `2px solid ${marriottRed}`,
      padding: 25,
      position: "relative",
      margin: "40px auto"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
        <img src={item.img} alt={item.title} style={{ width: 70, height: 70, objectFit: "cover", borderRadius: 10, border: `1.5px solid ${marriottRed}` }} />
        <div>
          <div style={{ color: marriottRed, fontWeight: 700, fontSize: 18 }}>{item.title}</div>
          <div style={{ color: marriottRed, fontWeight: 500, fontSize: 13 }}>{item.subtitle}</div>
        </div>
      </div>
      <div style={{ color: "#222", fontSize: 14, marginBottom: 10 }}>{item.desc}</div>
      <a
        href={item.bookUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          background: marriottRed,
          color: "#fff",
          fontWeight: 700,
          fontSize: 15,
          border: "none",
          borderRadius: 8,
          padding: "8px 18px",
          marginBottom: 14,
          cursor: "pointer",
          width: "100%",
          textAlign: "center",
          textDecoration: "none"
        }}
      >
        Book Now
      </a>
      <div style={{ fontWeight: 700, color: marriottRed, fontSize: 16, marginBottom: 2 }}>What Are People Yappin' About?</div>
      <div style={{ color: "#444", fontSize: 13, marginBottom: 6 }}>
        Check out the latest buzz and real testimonies from Marriott patrons at the Desert Spa.
      </div>
      <div style={{ display: "flex", flexDirection: "row", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
        {(item.testimonies || []).slice(0, 4).map((t, i) => (
          <div key={i} style={{ background: "#fff8fa", border: `1px solid ${marriottRed}`, borderRadius: 8, padding: 6, flex: "1 1 45%", minWidth: 300 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
              <img src={t.avatar} alt={t.user} style={{ width: 24, height: 24, borderRadius: "50%", border: `1px solid ${marriottRed}` }} />
              <span style={{ color: marriottRed, fontWeight: 600, fontSize: 12 }}>{t.user}</span>
            </div>
            <div style={{ color: "#222", fontSize: 11 }}>{t.comment}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, color: marriottRed, fontSize: 14, marginBottom: 4 }}>Other Activities</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {(item.activities || []).slice(0, 4).map((a) => (
              <div key={a.name} style={{ display: "flex", alignItems: "center", gap: 4, background: "#fff8fa", border: `1px solid ${marriottRed}`, borderRadius: 6, padding: 3, width: "48%" }}>
                <img src={a.img} alt={a.name} style={{ width: 20, height: 20, objectFit: "cover", borderRadius: 3, border: `1px solid ${marriottRed}` }} />
                <span style={{ color: marriottRed, fontWeight: 500, fontSize: 11 }}>{a.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, marginLeft: 16 }}>
          <div style={{ fontWeight: 600, color: marriottRed, fontSize: 14, marginBottom: 4 }}>Nearby</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {(item.nearby || []).slice(0, 3).map((n) => (
              <div key={n.name} style={{ display: "flex", alignItems: "center", gap: 4, background: "#fff8fa", border: `1px solid ${marriottRed}`, borderRadius: 6, padding: 3, width: "48%" }}>
                <img src={n.img} alt={n.name} style={{ width: 20, height: 20, objectFit: "cover", borderRadius: 3, border: `1px solid ${marriottRed}` }} />
                <span style={{ color: marriottRed, fontWeight: 500, fontSize: 11 }}>{n.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
