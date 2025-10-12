import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import LocationActivities from './LocationActivities';

export default function LocationDetailsModal({ 
  open, 
  onClose, 
  marker,
  completedActivities,
  onToggleActivity,
  getTotalXP,
  onAddExperience
}) {
  if (!marker) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ m: 0, p: 2, bgcolor: '#a11d2b', color: 'white' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">
              {marker.type === 'hotel' ? '🏨' : '📍'}
            </span>
            <div>
              <h2 className="text-2xl font-bold">{marker.title}</h2>
              <p className="text-rose-100 text-sm">{marker.description}</p>
            </div>
          </div>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        <div>
          {/* Image */}
          <div className="relative h-64 overflow-hidden">
            <img 
              src={marker.image} 
              alt={marker.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-lg">
              <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-bold text-gray-900">{marker.rating}</span>
              <span className="text-gray-600 text-sm">({marker.reviews} reviews)</span>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 space-y-6">
            {/* Description */}
            <div>
              <p className="text-gray-700 leading-relaxed">{marker.details}</p>
            </div>

            {/* Price Range (for hotels) */}
            {marker.priceRange && (
              <div className="flex items-center gap-2 text-gray-700">
                <svg className="w-5 h-5 text-[#a11d2b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">Price Range:</span>
                <span className="text-[#a11d2b] font-bold text-lg">{marker.priceRange}</span>
              </div>
            )}

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#a11d2b] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">Address</p>
                  <p className="text-sm text-gray-900">{marker.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#a11d2b] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">Phone</p>
                  <p className="text-sm text-gray-900">{marker.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 md:col-span-2">
                <svg className="w-5 h-5 text-[#a11d2b] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">Hours</p>
                  <p className="text-sm text-gray-900">{marker.hours}</p>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#a11d2b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Amenities & Features
              </h3>
              <div className="flex flex-wrap gap-2">
                {marker.amenities.map((amenity, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-[#a11d2b]/10 to-[#8B1523]/10 text-[#a11d2b] border border-[#a11d2b]/20"
                  >
                    ✓ {amenity}
                  </span>
                ))}
              </div>
            </div>

            {/* Location Activities - XP System */}
            <LocationActivities 
              activities={marker.activities}
              completedActivities={completedActivities}
              onToggleActivity={onToggleActivity}
              totalXP={getTotalXP()}
            />

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button 
                onClick={onAddExperience}
                className="flex-1 bg-gradient-to-r from-[#a11d2b] to-[#8B1523] hover:from-[#8B1523] hover:to-[#a11d2b] text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Experience
              </button>
              {marker.type === 'hotel' && (
                <button className="flex-1 bg-white border-2 border-[#a11d2b] text-[#a11d2b] hover:bg-[#a11d2b] hover:text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Book Now
                </button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

