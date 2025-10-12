
import React, { useEffect, useState } from "react";

const primaryColor = "#a11d2b";
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
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  const fetchRecommendations = async (postId) => {
    if (!postId) return;
    
    setLoadingRecommendations(true);
    try {
      const response = await fetch(`http://localhost:5000/api/recs/from-post/${postId}`);
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.top_four || []);
      } else {
        console.warn('Failed to fetch recommendations:', response.statusText);
        setRecommendations([]);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setRecommendations([]);
    } finally {
      setLoadingRecommendations(false);
    }
  };

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

      // Fetch AI recommendations if we have a post ID
      if (d.postId) {
        fetchRecommendations(d.postId);
      }

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
    <div className="max-w-4xl mx-auto my-8 bg-white rounded-3xl shadow-2xl overflow-hidden">
      {/* Hero Section */}
      <div className="relative h-80 overflow-hidden">
        <img 
          src={item.img} 
          alt={item.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">{item.title}</h1>
          <p className="text-xl text-white/90">{item.subtitle}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Description */}
        <p className="text-lg text-gray-700 leading-relaxed mb-8">{item.desc}</p>

        {/* Book Now Button */}
        <a
          href={item.bookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-gradient-to-r from-[#a11d2b] to-[#8B1523] hover:from-[#8B1523] hover:to-[#a11d2b] text-white font-bold text-lg py-4 rounded-xl text-center shadow-lg hover:shadow-xl transition-all duration-200 mb-8 no-underline"
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Book Your Stay Now
          </span>
        </a>

        {/* Testimonials */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <svg className="w-7 h-7 text-[#a11d2b]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
            </svg>
            What Guests Are Saying
          </h2>
          <p className="text-gray-600 mb-6">Real reviews from our valued guests</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(item.testimonies || []).slice(0, 4).map((t, i) => (
              <div key={i} className="bg-gradient-to-br from-rose-50 to-white border-2 border-[#a11d2b]/20 rounded-xl p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <img 
                    src={t.avatar} 
                    alt={t.user} 
                    className="w-10 h-10 rounded-full border-2 border-[#a11d2b] object-cover" 
                  />
                  <span className="font-bold text-[#a11d2b]">{t.user}</span>
                  <div className="ml-auto flex">
                    {[...Array(5)].map((_, idx) => (
                      <svg key={idx} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{t.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        {recommendations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <svg className="w-7 h-7 text-[#a11d2b]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              AI-Powered Recommendations
            </h2>
            <p className="text-gray-600 mb-6">Personalized suggestions based on your preferences</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((rec, i) => (
                <div key={i} className="bg-gradient-to-br from-[#a11d2b]/5 to-white border-2 border-[#a11d2b]/20 rounded-xl p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#a11d2b] to-[#8B1523] rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-sm">{rec}</div>
                      <div className="text-xs text-gray-600">Recommended for you</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading Recommendations */}
        {loadingRecommendations && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <svg className="w-7 h-7 text-[#a11d2b]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              AI-Powered Recommendations
            </h2>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <svg className="animate-spin w-5 h-5 text-[#a11d2b]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-gray-600">Finding personalized recommendations...</span>
            </div>
          </div>
        )}

        {/* Activities & Nearby */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Activities */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-[#B81843]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
              Activities & Amenities
            </h3>
            <div className="space-y-2">
              {(item.activities || []).slice(0, 6).map((a) => (
                <div key={a.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200">
                  <img 
                    src={a.img} 
                    alt={a.name} 
                    className="w-12 h-12 object-cover rounded-lg border-2 border-[#a11d2b]/30" 
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-sm">{a.name}</div>
                    <div className="text-xs text-gray-600">{a.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nearby */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-[#B81843]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Nearby Attractions
            </h3>
            <div className="space-y-2">
              {(item.nearby || []).slice(0, 6).map((n) => (
                <div key={n.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200">
                  {n.img ? (
                    <img 
                      src={n.img} 
                      alt={n.name} 
                      className="w-12 h-12 object-cover rounded-lg border-2 border-[#a11d2b]/30" 
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-[#a11d2b] to-[#8B1523] rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-sm">{n.name}</div>
                    {n.desc && <div className="text-xs text-gray-600">{n.desc}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
