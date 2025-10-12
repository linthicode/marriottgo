import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import Sidebar from '../components/Sidebar';
import LocationDetailsModal from '../components/map/LocationDetailsModal';
import ModalPost from '../components/ModalPost';
import { sampleMarkers } from '../data/mapLocations';
import L from 'leaflet';

// Fix for default marker icon in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icon for hotels
const hotelIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom icon for attractions
const attractionIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle map clicks
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });
  return null;
}

export default function MapPage() {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [clickedLocation, setClickedLocation] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [completedActivities, setCompletedActivities] = useState(new Set());
  const [showPostModal, setShowPostModal] = useState(false);
  const [prefillData, setPrefillData] = useState(null);

  const handleMapClick = (latlng) => {
    setClickedLocation(latlng);
    console.log('Map clicked at:', latlng);
  };

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const toggleActivity = (activityId) => {
    setCompletedActivities(prev => {
      const newSet = new Set(prev);
      if (newSet.has(activityId)) {
        newSet.delete(activityId);
      } else {
        newSet.add(activityId);
      }
      return newSet;
    });
  };

  const getTotalXP = () => {
    if (!selectedMarker?.activities) return 0;
    return selectedMarker.activities
      .filter(activity => completedActivities.has(activity.id))
      .reduce((sum, activity) => sum + activity.xp, 0);
  };

  const handleAddExperience = () => {
    if (!selectedMarker) return;

    // Get completed activities
    const completed = selectedMarker.activities?.filter(activity => 
      completedActivities.has(activity.id)
    ) || [];

    // Build description from completed activities
    let description = `Visited ${selectedMarker.title}`;
    if (completed.length > 0) {
      description += `\n\nCompleted activities (${getTotalXP()} XP earned):\n`;
      completed.forEach((activity, index) => {
        description += `${activity.icon} ${activity.name} (+${activity.xp} XP)\n`;
      });
    }

    // Set prefill data
    const prefill = {
      title: selectedMarker.title,
      address: selectedMarker.address,
      description: description.trim(),
      rating: selectedMarker.rating || 0,
    };

    // Close location modal first
    setDialogOpen(false);
    
    // Small delay to ensure modal closes before opening new one
    setTimeout(() => {
      setPrefillData(prefill);
      setShowPostModal(true);
    }, 100);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <div className="flex-none sticky top-0 h-screen">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#a11d2b] to-[#8B1523] text-white py-4 px-8 shadow-lg">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-1">Explore the Map</h1>
            <p className="text-rose-100 text-base">Discover hotels and attractions around you</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Legend */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Map Legend</h2>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-md"></div>
                <span className="text-gray-700 font-medium">Hotels</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-md"></div>
                <span className="text-gray-700 font-medium">Attractions</span>
              </div>
            </div>
            {clickedLocation && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Last clicked: <span className="font-mono text-[#a11d2b]">
                    {clickedLocation.lat.toFixed(4)}, {clickedLocation.lng.toFixed(4)}
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Map */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200" style={{ height: '600px' }}>
            <MapContainer
              center={[37.2296, -80.4139]} // Blacksburg, VA
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              <MapClickHandler onMapClick={handleMapClick} />

              {sampleMarkers.map((marker) => (
                <Marker
                  key={marker.id}
                  position={marker.position}
                  icon={marker.type === 'hotel' ? hotelIcon : attractionIcon}
                  eventHandlers={{
                    click: () => {
                      handleMarkerClick(marker);
                    },
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold text-gray-900 mb-1">{marker.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{marker.description}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        marker.type === 'hotel' 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {marker.type === 'hotel' ? '🏨 Hotel' : '📍 Attraction'}
                      </span>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Selected Marker Details */}
          {selectedMarker && (
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl shadow-lg p-6 mt-6 border-2 border-[#a11d2b]/30">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedMarker.title}</h2>
                  <p className="text-gray-700 mb-3">{selectedMarker.description}</p>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                      selectedMarker.type === 'hotel' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {selectedMarker.type === 'hotel' ? '🏨 Hotel' : '📍 Attraction'}
                    </span>
                    <span className="text-sm text-gray-600 font-mono">
                      {selectedMarker.position[0].toFixed(4)}, {selectedMarker.position[1].toFixed(4)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMarker(null)}
                  className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-6 h-6 text-[#a11d2b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              How to Use
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-[#a11d2b] font-bold">•</span>
                <span>Click on any marker to view details in a popup</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#a11d2b] font-bold">•</span>
                <span>Use your mouse wheel to zoom in and out</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#a11d2b] font-bold">•</span>
                <span>Click and drag to pan around the map</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#a11d2b] font-bold">•</span>
                <span>Red markers indicate hotels, blue markers indicate attractions</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal Dialog for Marker Details - Only show when not showing post modal */}
      {!showPostModal && (
        <LocationDetailsModal
          open={dialogOpen}
          onClose={handleCloseDialog}
          marker={selectedMarker}
          completedActivities={completedActivities}
          onToggleActivity={toggleActivity}
          getTotalXP={getTotalXP}
          onAddExperience={handleAddExperience}
        />
      )}

      {/* Post Creation Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="w-full max-w-3xl">
            <ModalPost 
              onCancel={() => {
                setShowPostModal(false);
                setPrefillData(null);
              }} 
              onCreate={(post) => {
                // Post is already saved to localStorage by ModalPost component
                console.log('Post created from MapPage:', post);
                setShowPostModal(false);
                setPrefillData(null);
              }}
              prefillData={prefillData}
            />
          </div>
        </div>
      )}
    </div>
  );
}
