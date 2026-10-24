
import React from 'react';
import { BookingData, BookingMode } from '../types';
import { RESORT_DETAILS, BASE_FREE_ACTIVITIES } from '../constants';
import { MapPin, Phone, Mail, Coffee, Info, Activity, AlertTriangle, XCircle, Utensils } from 'lucide-react';

interface BillPreviewProps {
  data: BookingData;
  isPdf?: boolean;
}

const BillPreview: React.FC<BillPreviewProps> = ({ data, isPdf = false }) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const [yyyy, mm, dd] = parts;
      return `${dd}/${mm}/${yyyy}`;
    }
    return dateStr;
  };

  const getDayName = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const [yyyy, mm, dd] = parts.map(Number);
      const date = new Date(yyyy, mm - 1, dd);
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    }
    return '';
  };

  const balance = data.roomRent - data.advanceCollected;
  const isPaidInFull = balance === 0;

  const LogoContainer = ({ size = 45 }: { size?: number }) => (
    <div 
      data-pdf-logo="true"
      style={{ 
        backgroundColor: '#FFFFFF', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'flex-start',
        height: `${size}px`,
        overflow: 'hidden',
        border: 'none'
      }} 
      className="shrink-0"
    >
      <img 
        src="/logo.png" 
        alt="Dreamy Vacations Logo" 
        loading="eager"
        style={{ 
          height: `${size}px`, 
          width: 'auto', 
          objectFit: 'contain', 
          display: 'block'
        }}
      />
    </div>
  );

  const pagePadding = isPdf ? 'p-[15mm]' : 'p-6 md:p-12';
  const pageHeight = isPdf ? 'min-h-[297mm]' : 'min-h-screen';
  const pageWidth = isPdf ? 'w-[210mm]' : 'w-full';
  const gridLayout = isPdf ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2';
  const sectionGap = isPdf ? 'gap-10' : 'gap-8 md:gap-12';

  return (
    <div className={`bill-container bg-white text-black text-[13px] leading-relaxed ${isPdf ? 'w-[210mm]' : 'w-full'}`}>
      {/* PAGE 1 */}
      <div className={`page ${pageWidth} ${pagePadding} ${pageHeight} flex flex-col border-b border-[#E0E0E0] last:border-0 print:border-0 break-after-page bg-white mx-auto`}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-black pb-6 mb-8 w-full gap-4">
          <div className="flex flex-col gap-4">
            <LogoContainer size={110} />
            <div>
              <p className="max-w-[280px] text-black font-semibold text-[11px] leading-tight">
                {RESORT_DETAILS.address}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end w-full sm:w-auto">
            <div className="bg-white p-4 border-2 border-black rounded-lg min-w-full sm:min-w-[180px]">
              <p className="text-black uppercase text-[10px] font-bold tracking-widest mb-1 leading-none">Booking ID</p>
              <p className="text-xl font-mono font-bold text-black leading-none">{data.bookingId}</p>
            </div>
          </div>
        </div>

        <div className={`grid ${gridLayout} ${sectionGap} mb-8`}>
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-black font-bold uppercase tracking-wider text-xs border-b border-[#E0E0E0] pb-1">Guest Information</h3>
              <div className="p-4 bg-white border border-[#E0E0E0] rounded-xl">
                <span className="text-black font-normal block mb-0.5 text-[11px] uppercase tracking-tighter">Guest Name</span>
                <span className="text-lg font-bold text-black">{data.guestName}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white border border-[#E0E0E0] rounded-xl">
                  <span className="text-black font-normal block mb-0.5 text-[11px] uppercase tracking-tighter">Check-in Date</span>
                  <span className="font-bold block text-sm text-black">{formatDate(data.checkInDate)}</span>
                  <span className="text-[10px] font-bold text-black uppercase">{getDayName(data.checkInDate)}</span>
                </div>
                <div className="p-3 bg-white border border-[#E0E0E0] rounded-xl">
                  <span className="text-black font-normal block mb-0.5 text-[11px] uppercase tracking-tighter">Check-out Date</span>
                  <span className="font-bold block text-sm text-black">{formatDate(data.checkOutDate)}</span>
                  <span className="text-[10px] font-bold text-black uppercase">{getDayName(data.checkOutDate)}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 md:gap-6 mt-2 px-4 py-3 border border-[#E0E0E0] rounded-lg bg-zinc-50/50">
                <div className="flex flex-col">
                  <span className="font-bold text-[10px] uppercase text-black">Check-in Time</span>
                  <span className="text-[11px] text-black">12:00 PM</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[10px] uppercase text-black">Check-out Time</span>
                  <span className="text-[11px] text-black">Until 11:00 AM</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-black font-bold uppercase tracking-wider text-xs border-b border-[#E0E0E0] pb-1">Accommodation Details</h3>
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-3 bg-white border border-[#E0E0E0] rounded-xl">
                  <span className="text-black font-normal block mb-0.5 text-[11px] uppercase tracking-tighter">Room Type</span>
                  <span className="font-bold text-[11px] leading-tight block text-black">{data.roomType}</span>
                </div>
                <div className="p-3 bg-white border border-[#E0E0E0] rounded-xl">
                  <span className="text-black font-normal block mb-0.5 text-[11px] uppercase tracking-tighter">Reservation</span>
                  <span className="font-bold text-black">{data.reservation}</span>
                </div>
                <div className="p-3 bg-white border border-[#E0E0E0] rounded-xl">
                  <span className="text-black font-normal block mb-0.5 text-[11px] uppercase tracking-tighter">Adults</span>
                  <span className="font-bold text-black">{data.adults}</span>
                </div>
                <div className="p-3 bg-white border border-[#E0E0E0] rounded-xl">
                  <span className="text-black font-normal block mb-0.5 text-[11px] uppercase tracking-tighter">Children</span>
                  <span className="font-bold text-black">{data.children}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border-2 border-black flex flex-col justify-between h-fit md:h-full">
            <div className="space-y-4">
              <h3 className="text-black font-bold uppercase tracking-wider text-xs pb-1 border-b border-[#E0E0E0]">Payment Summary</h3>
              
              {/* Pricing Details */}
              {data.bookingMode && (
                <div className="text-[11px] font-medium text-black/80 space-y-1.5 py-1">
                  {data.bookingMode === BookingMode.PER_PERSON && (
                    <div className="pt-0.5 space-y-1.5">
                      <p className="flex justify-between items-center">
                        <span>Rate per Adult: ₹{data.amtPerAdult.toLocaleString('en-IN')} × {data.adults}</span>
                        <span className="font-semibold text-black text-right tabular-nums">₹{(data.adults * data.amtPerAdult).toLocaleString('en-IN')}</span>
                      </p>
                      {data.children > 0 && (
                        <p className="flex justify-between items-center">
                          <span>Rate per Child: ₹{data.amtPerChild.toLocaleString('en-IN')} × {data.children}</span>
                          <span className="font-semibold text-black text-right tabular-nums">₹{(data.children * data.amtPerChild).toLocaleString('en-IN')}</span>
                        </p>
                      )}
                      {!!(data.numExtraRooms && data.pricePerExtraRoom) && (
                        <p className="flex justify-between items-center">
                          <span>Extra Rooms: ₹{data.pricePerExtraRoom.toLocaleString('en-IN')} × {data.numExtraRooms}</span>
                          <span className="font-semibold text-black text-right tabular-nums">₹{(data.numExtraRooms * data.pricePerExtraRoom).toLocaleString('en-IN')}</span>
                        </p>
                      )}
                      <p className="flex justify-between items-center pt-1 border-t border-black/10">
                        <span>Stay Duration:</span>
                        <span className="font-semibold text-black text-right">{data.numNights} Night{data.numNights > 1 ? 's' : ''}</span>
                      </p>
                    </div>
                  )}

                  {data.bookingMode === BookingMode.PER_ROOM && (
                    <div className="pt-0.5 space-y-1.5">
                      <p className="flex justify-between items-center">
                        <span>Room Rate:</span>
                        <span className="font-semibold text-black text-right tabular-nums">₹{data.amtPerRoom.toLocaleString('en-IN')}</span>
                      </p>
                      <p className="flex justify-between items-center">
                        <span>Rooms Booked:</span>
                        <span className="font-semibold text-black text-right">{data.numRooms}</span>
                      </p>
                      {!!(data.numExtraPersons && data.pricePerExtraPerson) && (
                        <p className="flex justify-between items-center">
                          <span>Extra Persons: ₹{data.pricePerExtraPerson.toLocaleString('en-IN')} × {data.numExtraPersons}</span>
                          <span className="font-semibold text-black text-right tabular-nums">₹{(data.numExtraPersons * data.pricePerExtraPerson).toLocaleString('en-IN')}</span>
                        </p>
                      )}
                      <p className="flex justify-between items-center pt-1 border-t border-black/10">
                        <span>Stay Duration:</span>
                        <span className="font-semibold text-black text-right">{data.numNights} Night{data.numNights > 1 ? 's' : ''}</span>
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between items-center text-base pt-1 border-t border-black/10">
                <span className="text-black font-normal">Subtotal:</span>
                <span className="font-bold text-black text-right tabular-nums">₹{data.roomRent.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-base">
                <span className="text-black font-normal">Advance Paid:</span>
                <span className="font-bold text-black text-right tabular-nums">₹{data.advanceCollected.toLocaleString('en-IN')}</span>
              </div>
              <div className="h-0.5 bg-[#E0E0E0] my-4" />
              <div className={`p-4 rounded-xl flex flex-col items-center justify-center text-center text-white ${isPaidInFull ? 'bg-[#2E7D32]' : 'bg-[#C62828]'}`}>
                <span className="text-[10px] uppercase font-bold tracking-widest opacity-90 mb-1">{isPaidInFull ? 'Status' : 'Balance Payable'}</span>
                <span className="text-2xl font-bold">{isPaidInFull ? 'FULL PAYMENT DONE' : `₹${balance.toLocaleString('en-IN')}`}</span>
              </div>
              <div className="pt-2 text-center">
                <span className="text-black text-xs font-normal">Booked via: <span className="font-bold">{data.platform}</span></span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-black font-bold uppercase tracking-wider text-xs border-b border-[#E0E0E0] pb-1">Contact & Location</h3>
              <div className="space-y-2 text-black font-bold pt-2">
                 <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-black shrink-0 mt-0.5" />
                  <a href={RESORT_DETAILS.googleMaps} target="_blank" rel="noopener noreferrer" className="hover:text-black underline transition-colors text-[11px]">{RESORT_DETAILS.address}</a>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <Phone className="w-4 h-4 text-black shrink-0" />
                  <span>{RESORT_DETAILS.phone.join(', ')}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <Mail className="w-4 h-4 text-black shrink-0" />
                  <span>{RESORT_DETAILS.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PAGE 2 */}
      <div className={`page ${pageWidth} ${pagePadding} ${pageHeight} flex flex-col border-b border-[#E0E0E0] last:border-0 print:border-0 break-after-page bg-white mx-auto`}>
        <header className="mb-10 flex flex-wrap justify-between items-center border-b-2 pb-4 border-black gap-2">
           <div className="flex items-center gap-4">
             <LogoContainer />
             <h2 className="text-2xl font-serif font-bold text-black uppercase">Policies & Activities</h2>
           </div>
           <span className="text-black font-bold text-[10px] tracking-widest">{data.bookingId} - PAGE 2</span>
        </header>

        <div className={`grid ${gridLayout} ${sectionGap} md:gap-12`}>
          <div className="space-y-6">
            {/* Conditional Evening Snacks */}
            {data.includeSnacks && (
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-black">
                  <Coffee className="w-5 h-5" />
                  <h3 className="font-bold uppercase tracking-widest text-sm underline decoration-2">Complimentary Evening Snacks</h3>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E0E0E0] shadow-sm">
                  <p className="font-bold text-black text-base mb-1">5 PM – 6 PM</p>
                  <div className="grid grid-cols-1 gap-y-1.5 pt-1">
                    {[...(data.snacksItems || []), ...(data.snacksCustomItems || [])].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                        <span className="font-bold text-black text-[11px]">{item}</span>
                      </div>
                    ))}
                    {[...(data.snacksItems || []), ...(data.snacksCustomItems || [])].length === 0 && <span className="text-[11px] italic text-[#666]">No items selected</span>}
                  </div>
                  <p className="mt-2 text-[10px] text-black italic font-bold leading-tight">* Extra snacks available at extra cost. Please inform before check-in or before 2 PM.</p>
                </div>
              </section>
            )}

            <section className="space-y-3">
              <div className="flex items-center gap-2 text-black">
                <Info className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-widest text-sm">Dining Information</h3>
              </div>
              <div className="space-y-2">
                {!data.includeBreakfast && (
                  <div className="bg-white p-3 rounded-xl border border-[#E0E0E0] shadow-sm">
                    <p className="font-bold text-black text-[11px]">Breakfast: Available on request. Please inform us by 9 PM the previous night.</p>
                  </div>
                )}
                {!data.includeLunch && (
                  <div className="bg-white p-3 rounded-xl border border-[#E0E0E0] shadow-sm">
                    <p className="font-bold text-black text-[11px]">Lunch: Available on request. Please inform us in the morning.</p>
                  </div>
                )}
                {!data.includeDinner && (
                  <div className="bg-white p-3 rounded-xl border border-[#E0E0E0] shadow-sm">
                    <p className="font-bold text-black text-[11px]">Dinner: Available on request. Please inform us by 6 PM.</p>
                  </div>
                )}
                {data.includeBreakfast && data.includeLunch && data.includeDinner && (
                  <div className="bg-white p-3 rounded-xl border border-[#E0E0E0] shadow-sm">
                    <p className="text-black text-[11px] font-bold">Dining hours: Breakfast 8:30 AM – 9:30 AM, Lunch 1:00 PM – 2:30 PM, Dinner 8:00 PM – 9:00 PM</p>
                  </div>
                )}
              </div>
            </section>

            {/* Conditional Complimentary Breakfast */}
            {data.includeBreakfast && (
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-black">
                  <Utensils className="w-5 h-5" />
                  <h3 className="font-bold uppercase tracking-widest text-sm underline decoration-2">Complimentary Breakfast (8:30 AM – 9:30 AM)</h3>
                </div>
                <div className="grid grid-cols-2 gap-y-1.5 pt-1 px-1">
                  {[...(data.breakfastItems || []), ...(data.breakfastCustomItems || [])].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                      <span className="font-bold text-black text-[11px]">{item}</span>
                    </div>
                  ))}
                  {[...(data.breakfastItems || []), ...(data.breakfastCustomItems || [])].length === 0 && <span className="text-[11px] italic text-[#666]">No items selected</span>}
                </div>
              </section>
            )}

            {/* Conditional Complimentary Lunch */}
            {data.includeLunch && (
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-black">
                  <Utensils className="w-5 h-5" />
                  <h3 className="font-bold uppercase tracking-widest text-sm underline decoration-2">Complimentary Lunch (1:00 PM – 2:30 PM)</h3>
                </div>
                <div className="grid grid-cols-2 gap-y-1.5 pt-1 px-1">
                  {[...(data.lunchItems || []), ...(data.lunchCustomItems || [])].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                      <span className="font-bold text-black text-[11px]">{item}</span>
                    </div>
                  ))}
                  {[...(data.lunchItems || []), ...(data.lunchCustomItems || [])].length === 0 && <span className="text-[11px] italic text-[#666]">No items selected</span>}
                </div>
              </section>
            )}

            {/* Conditional Complimentary Dinner */}
            {data.includeDinner && (
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-black">
                  <Utensils className="w-5 h-5" />
                  <h3 className="font-bold uppercase tracking-widest text-sm underline decoration-2">Complimentary Dinner (8:00 PM – 9:00 PM)</h3>
                </div>
                <div className="grid grid-cols-2 gap-y-1.5 pt-1 px-1">
                  {[...(data.dinnerItems || []), ...(data.dinnerCustomItems || [])].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                      <span className="font-bold text-black text-[11px]">{item}</span>
                    </div>
                  ))}
                  {[...(data.dinnerItems || []), ...(data.dinnerCustomItems || [])].length === 0 && <span className="text-[11px] italic text-[#666]">No items selected</span>}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-6">
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-black">
                <Activity className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-widest text-sm">Paid Activities</h3>
              </div>
              <div className="space-y-2.5">
                <div className="bg-white p-4 rounded-xl border-2 border-black">
                  <div className="flex justify-between items-center gap-4">
                    <div className="text-left">
                      <p className="font-bold text-black text-sm">Outdoor BBQ</p>
                      <p className="text-black text-[10px] italic font-bold">Weather dependent. Prior notice required.</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-black font-bold text-xl tabular-nums">₹900</p>
                      <p className="text-[9px] text-black font-bold uppercase tracking-wider">PER 1 KG CHICKEN</p>
                    </div>
                  </div>
                </div>

                {!data.complimentaryActivities?.includes('Swimming Pool') && (
                  <div className="bg-white p-3 rounded-xl border border-black/20">
                    <div className="flex justify-between items-center gap-4">
                      <p className="font-bold text-black text-sm text-left">Swimming Pool</p>
                      <div className="text-right shrink-0">
                        <p className="text-black font-bold text-base tabular-nums">₹200</p>
                        <p className="text-[9px] text-black font-bold uppercase tracking-wider">PER PERSON</p>
                      </div>
                    </div>
                  </div>
                )}

                {!data.complimentaryActivities?.includes('Rain Dance with Music') && (
                  <div className="bg-white p-3 rounded-xl border border-black/20">
                    <div className="flex justify-between items-center gap-4">
                      <p className="font-bold text-black text-sm text-left">Rain Dance with Music</p>
                      <div className="text-right shrink-0">
                        <p className="text-black font-bold text-base tabular-nums">₹150</p>
                        <p className="text-[9px] text-black font-bold uppercase tracking-wider">PER PERSON</p>
                      </div>
                    </div>
                  </div>
                )}

                {!data.complimentaryActivities?.includes('Bonfire with Music') && (
                  <div className="bg-white p-3 rounded-xl border border-black/20">
                    <div className="flex justify-between items-center gap-4">
                      <p className="font-bold text-black text-sm text-left">Bonfire with Music</p>
                      <div className="text-right shrink-0">
                        <p className="text-black font-bold text-base tabular-nums">₹2,000</p>
                        <p className="text-[9px] text-black font-bold uppercase tracking-wider">PER BOOKING</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2 text-black">
                <Activity className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-widest text-sm">Free Activities</h3>
              </div>
              <div className="bg-white p-4 rounded-xl border border-[#E0E0E0] shadow-sm grid grid-cols-1 gap-y-1">
                {[
                  ...(data.complimentaryActivities?.includes('Swimming Pool') ? ['Swimming Pool'] : []),
                  ...(data.complimentaryActivities?.includes('Bonfire with Music') ? ['Bonfire with Music'] : []),
                  ...(data.complimentaryActivities?.includes('Rain Dance with Music') ? ['Rain Dance with Music'] : []),
                  ...BASE_FREE_ACTIVITIES
                ].map(activity => (
                  <div key={activity} className="flex items-center gap-2.5 py-1 border-b border-[#E0E0E0] last:border-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                    <span className="text-black font-bold text-[11px]">{activity}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* PAGE 3 */}
      <div className={`page ${pageWidth} ${pagePadding} ${pageHeight} flex flex-col border-b border-[#E0E0E0] last:border-0 print:border-0 bg-white mx-auto`}>
        <header className="mb-10 flex flex-wrap justify-between items-center border-b-2 pb-4 border-black gap-2">
           <div className="flex items-center gap-4">
             <LogoContainer />
             <h2 className="text-2xl font-serif font-bold text-black uppercase">Terms & Cancellation</h2>
           </div>
           <span className="text-black font-bold text-[10px] tracking-widest">{data.bookingId} - PAGE 3</span>
        </header>
        <div className="space-y-12 max-w-2xl">
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-black">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold uppercase tracking-widest text-sm">Resort Rules</h3>
            </div>
            <ul className="space-y-4">
              {[
                { n: 1, t: "Noise Regulation", d: "All lights and music must be turned off by 10:00 PM. Silence is mandatory after this time as per local regulations." },
                { n: 2, t: "Eco-Friendly Environment", d: "The resort is located within a coconut estate. Guests are requested to respect the local flora and fauna." },
                { n: 3, t: "Property & Linen Damage", d: "Any damage to resort property, including furniture, fixtures, linens, or bedding, will be charged to the guest." },
                { n: 4, t: "Vomiting & Excessive Cleaning", d: "Vomiting or any incident requiring excessive cleaning will attract cleaning or replacement charges if damage occurs." },
                { n: 5, t: "Swimming Pool & Music Timing", d: "Swimming pool access is permitted until 10:00 PM. Music near the swimming pool area is allowed only until 9:00 PM." },
                { n: 6, t: "Balance Payment at Check-in", d: "The remaining balance amount must be settled at the time of check-in." }
              ].map(rule => (
                <li key={rule.n} className="flex gap-4 p-5 bg-white border border-[#E0E0E0] rounded-xl shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shrink-0 font-bold text-sm">{rule.n}</div>
                  <div>
                    <p className="font-bold text-sm text-black">{rule.t}</p>
                    <p className="text-black font-normal text-[11px] leading-relaxed mt-1">{rule.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-black">
              <XCircle className="w-5 h-5" />
              <h3 className="font-bold uppercase tracking-widest text-sm">Cancellation Policy</h3>
            </div>
            <div className="bg-white border-l-8 border-black p-6 border-y border-r border-[#E0E0E0] rounded-r-xl shadow-sm space-y-1.5">
              <p className="text-black font-bold text-[12px]">Cancellation 7 days before arrival: Refundable.</p>
              <p className="text-black font-bold text-[12px]">Cancellation 5 days before arrival: 50% refund.</p>
              <p className="text-black font-bold text-[12px]">Cancellation 1 day before arrival: Non-refundable.</p>
            </div>
          </section>
        </div>
        <div className="mt-auto pt-20 text-center">
           <div className="w-20 h-0.5 bg-black mx-auto mb-4" />
           <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-black mb-2 opacity-80">Thank you for choosing</p>
           <p className="font-serif text-3xl font-bold text-black uppercase tracking-tighter">Dreamy Vacations</p>
           <p className="text-black text-[11px] mt-6 font-bold opacity-60">This is a system generated document. Signature not required.</p>
        </div>
      </div>
    </div>
  );
};

export default BillPreview;
