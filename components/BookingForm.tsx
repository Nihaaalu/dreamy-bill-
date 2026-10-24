
import React, { useRef, useState } from 'react';
import { BookingData, RoomType, BookingPlatform, BookingMode } from '../types';
import { ROOM_TYPES, PLATFORMS, BREAKFAST_MENU, LUNCH_MENU, DINNER_MENU, EVENING_SNACKS_MENU } from '../constants';
import { User, Calendar, CreditCard, ExternalLink, AlertCircle, Clock, Utensils, Plus, X, Circle, CheckCircle2, Activity } from 'lucide-react';

interface BookingFormProps {
  data: BookingData;
  onChange: (data: BookingData) => void;
  onSubmit: () => void;
}

const formatDateToDisplay = (isoStr: string) => {
  if (!isoStr) return '';
  const parts = isoStr.split('-');
  if (parts.length === 3) {
    const [yyyy, mm, dd] = parts;
    return `${dd}/${mm}/${yyyy}`;
  }
  return isoStr;
};

interface DatePickerFieldProps {
  label: string;
  name: string;
  value: string;
  required?: boolean;
  min?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: React.ReactNode;
  labelClasses: string;
  inputClasses: string;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  name,
  value,
  required = false,
  min,
  onChange,
  error,
  labelClasses,
  inputClasses
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (inputRef.current) {
      try {
        if ('showPicker' in inputRef.current) {
          inputRef.current.showPicker();
        } else {
          inputRef.current.focus();
        }
      } catch (_) {
        inputRef.current.focus();
      }
    }
  };

  return (
    <div className="space-y-1">
      <label className={labelClasses}>{label}</label>
      <div onClick={handleClick} className="relative cursor-pointer group">
        <div className={`${inputClasses} flex items-center justify-between pointer-events-none group-hover:border-white/50 transition-colors`}>
          <span className={value ? "text-white font-medium" : "text-[#AAAAAA]"}>
            {value ? formatDateToDisplay(value) : "DD/MM/YYYY"}
          </span>
          <Calendar className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
        </div>
        <input
          ref={inputRef}
          type="date"
          name={name}
          required={required}
          min={min}
          value={value}
          onChange={onChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
      </div>
      {error}
    </div>
  );
};

const BookingForm: React.FC<BookingFormProps> = ({ data, onChange, onSubmit }) => {
  const [customBreakfast, setCustomBreakfast] = useState('');
  const [customLunch, setCustomLunch] = useState('');
  const [customDinner, setCustomDinner] = useState('');
  const [customSnacks, setCustomSnacks] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? parseFloat(value) || 0 : value;
    onChange({ ...data, [name]: val });
  };

  const handleBookingModeSelect = (mode: BookingMode) => {
    onChange({ ...data, bookingMode: mode });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    onChange({ ...data, [name]: checked });
  };

  const toggleItem = (listName: 'breakfastItems' | 'lunchItems' | 'dinnerItems' | 'snacksItems', item: string) => {
    const current = data[listName] || [];
    if (current.includes(item)) {
      onChange({ ...data, [listName]: current.filter(i => i !== item) });
    } else {
      onChange({ ...data, [listName]: [...current, item] });
    }
  };

  const addCustomItem = (
    listName: 'breakfastCustomItems' | 'lunchCustomItems' | 'dinnerCustomItems' | 'snacksCustomItems', 
    value: string, 
    setter: (v: string) => void
  ) => {
    if (!value.trim()) return;
    onChange({ ...data, [listName]: [...(data[listName] || []), value.trim()] });
    setter('');
  };

  const removeCustomItem = (
    listName: 'breakfastCustomItems' | 'lunchCustomItems' | 'dinnerCustomItems' | 'snacksCustomItems', 
    index: number
  ) => {
    const newList = [...(data[listName] || [])];
    newList.splice(index, 1);
    onChange({ ...data, [listName]: newList });
  };

  const toggleActivity = (activity: string) => {
    const current = data.complimentaryActivities || [];
    if (current.includes(activity)) {
      onChange({ ...data, complimentaryActivities: current.filter(a => a !== activity) });
    } else {
      onChange({ ...data, complimentaryActivities: [...current, activity] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.roomType) {
      alert("Please select a Room Type (Room or Cottage).");
      return;
    }
    if (data.numNights <= 0 && data.checkInDate && data.checkOutDate) {
      alert("Check-out date must be after Check-in date.");
      return;
    }
    onSubmit();
  };

  const inputClasses = "w-full bg-[#111111] border border-[#2A2A2A] focus:border-white focus:ring-1 focus:ring-white rounded-xl px-4 py-3 outline-none transition-all text-white placeholder:text-[#AAAAAA] input-shadow";
  const labelClasses = "text-sm font-bold text-[#E0E0E0] ml-1 block mb-1";
  const sectionHeaderClasses = "text-white font-bold uppercase tracking-wider text-sm flex items-center gap-2 border-b border-[#2A2A2A] pb-2 mb-6";
  const iconColor = "#FFFFFF";

  const isInvalidDateRange = data.checkInDate && data.checkOutDate && data.numNights <= 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-12 bg-[#000000] border border-[#2A2A2A] p-6 md:p-10 rounded-2xl shadow-sm">
      {/* Booking Mode Selector */}
      <section className="space-y-6">
        <h2 className={sectionHeaderClasses}>
          <CreditCard className="w-4 h-4" color={iconColor} /> Booking Type
        </h2>
        <div className="flex flex-wrap gap-4">
          {[
            { id: BookingMode.PER_ROOM, label: 'Per Room Booking' },
            { id: BookingMode.PER_PERSON, label: 'Per Person Booking' }
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => handleBookingModeSelect(mode.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl border transition-all ${
                data.bookingMode === mode.id 
                ? 'bg-white text-black border-white font-bold' 
                : 'bg-[#111111] text-white border-[#2A2A2A] hover:border-white/50'
              }`}
            >
              {data.bookingMode === mode.id ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
              {mode.label}
            </button>
          ))}
        </div>
      </section>

      {data.bookingMode !== BookingMode.NONE && (
        <div className="animate-fadeIn space-y-12">
          {/* Guest & Dates */}
          <section className="space-y-6">
            <h2 className={sectionHeaderClasses}>
              <User className="w-4 h-4" color={iconColor} /> Guest & Booking Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className={labelClasses}>Guest Name</label>
                <input required type="text" name="guestName" value={data.guestName} onChange={handleChange} placeholder="Full name of guest" className={inputClasses} />
              </div>
              <DatePickerField
                label="Booking Date"
                name="bookingDate"
                required
                value={data.bookingDate}
                onChange={handleChange}
                labelClasses={labelClasses}
                inputClasses={inputClasses}
              />
              <DatePickerField
                label="Check-in Date"
                name="checkInDate"
                required
                value={data.checkInDate}
                onChange={handleChange}
                labelClasses={labelClasses}
                inputClasses={inputClasses}
              />
              <DatePickerField
                label="Check-out Date"
                name="checkOutDate"
                required
                value={data.checkOutDate}
                onChange={handleChange}
                labelClasses={labelClasses}
                inputClasses={inputClasses}
                error={
                  isInvalidDateRange && (
                    <div className="flex items-center gap-1.5 text-red-400 text-[11px] font-bold mt-1 ml-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Check-out must be after Check-in date
                    </div>
                  )
                }
              />
            </div>

            <div className="bg-[#0F0F0F] border border-[#2A2A2A] p-4 rounded-xl flex flex-wrap gap-8 items-center shadow-sm">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-white/60" />
                <div>
                  <p className="text-[10px] font-bold text-[#E0E0E0] uppercase tracking-widest">Check-in Time</p>
                  <p className="text-sm font-bold text-white">12:00 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-white/60" />
                <div>
                  <p className="text-[10px] font-bold text-[#E0E0E0] uppercase tracking-widest">Check-out Time</p>
                  <p className="text-sm font-bold text-white">Until 11:00 AM</p>
                </div>
              </div>
            </div>
          </section>

          {/* Room & Occupancy */}
          <section className="space-y-6">
            <h2 className={sectionHeaderClasses}>
              <Calendar className="w-4 h-4" color={iconColor} /> Room & Occupancy
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className={labelClasses}>Room Type</label>
                <select required name="roomType" value={data.roomType} onChange={handleChange} className={inputClasses}>
                  <option value="" className="bg-[#111111]">Select Room Type</option>
                  {ROOM_TYPES.map(type => <option key={type} value={type} className="bg-[#111111]">{type}</option>)}
                </select>
              </div>

              {data.roomType === RoomType.ROOM && (
                <div className="space-y-1">
                  <label className={labelClasses}>Number of Rooms</label>
                  <input required type="number" name="numRooms" value={data.numRooms} onChange={handleChange} min="1" className={inputClasses} />
                </div>
              )}

              {data.roomType === RoomType.COTTAGE && (
                <div className="space-y-1">
                  <label className={labelClasses}>Number of Cottages</label>
                  <input required type="number" name="numCottages" value={data.numCottages ?? 1} onChange={handleChange} min="1" className={inputClasses} />
                </div>
              )}

              {data.roomType === RoomType.COTTAGE_PLUS_ROOM && (
                <>
                  <div className="space-y-1">
                    <label className={labelClasses}>Number of Rooms</label>
                    <input required type="number" name="numRooms" value={data.numRooms} onChange={handleChange} min="1" className={inputClasses} />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClasses}>Number of Cottages</label>
                    <input required type="number" name="numCottages" value={data.numCottages ?? 1} onChange={handleChange} min="1" className={inputClasses} />
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className={labelClasses}>Adults</label>
                  <input type="number" name="adults" value={data.adults} onChange={handleChange} min="1" className={inputClasses} />
                </div>
                <div className="space-y-1">
                  <label className={labelClasses}>Children</label>
                  <input type="number" name="children" value={data.children} onChange={handleChange} min="0" className={inputClasses} />
                </div>
              </div>
            </div>
          </section>

          {/* Complimentary Activities */}
          <section className="space-y-6">
            <h2 className={sectionHeaderClasses}>
              <Activity className="w-4 h-4" color={iconColor} /> Complimentary Activities
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: 'Swimming Pool', label: 'Swimming Pool' },
                { id: 'Bonfire with Music', label: 'Bonfire with Music' },
                { id: 'Rain Dance with Music', label: 'Rain Dance with Music' }
              ].map((act) => {
                const isChecked = data.complimentaryActivities?.includes(act.id);
                return (
                  <label
                    key={act.id}
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-white/10 border-white text-white font-bold'
                        : 'bg-[#0F0F0F] border-[#2A2A2A] text-[#AAAAAA] hover:border-white/40'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={!!isChecked}
                      onChange={() => toggleActivity(act.id)}
                      className="w-5 h-5 rounded border-[#2A2A2A] bg-[#111111] text-white focus:ring-white focus:ring-offset-black"
                    />
                    <span className="text-sm">{act.label}</span>
                  </label>
                );
              })}
            </div>
          </section>

          {/* Meal Selection */}
          <section className="space-y-10">
            <h2 className={sectionHeaderClasses}>
              <Utensils className="w-4 h-4" color={iconColor} /> Meal Selection
            </h2>
            <div className="space-y-12">
              {/* Breakfast */}
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group w-fit">
                  <input type="checkbox" name="includeBreakfast" checked={data.includeBreakfast} onChange={handleCheckboxChange} className="w-5 h-5 rounded border-[#2A2A2A] bg-[#111111] text-white focus:ring-white focus:ring-offset-black" />
                  <span className="text-white font-bold group-hover:text-white/80 transition-colors">Complimentary Breakfast</span>
                </label>
                {data.includeBreakfast && (
                  <div className="pl-8 space-y-4 animate-fadeIn">
                    <div>
                      <p className={labelClasses}>Select Predefined Items:</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 bg-[#0F0F0F] p-4 rounded-xl border border-[#2A2A2A]">
                        {BREAKFAST_MENU.map(item => (
                          <label key={item} className="flex items-center gap-2 cursor-pointer text-xs group">
                            <input type="checkbox" checked={data.breakfastItems?.includes(item)} onChange={() => toggleItem('breakfastItems', item)} className="w-4 h-4 rounded border-[#2A2A2A] bg-black text-white focus:ring-white" />
                            <span className={`${data.breakfastItems?.includes(item) ? 'text-white font-bold' : 'text-[#AAAAAA]'} transition-colors`}>{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className={labelClasses}>Add Custom Items:</p>
                      <div className="flex gap-2">
                        <input type="text" value={customBreakfast} onChange={(e) => setCustomBreakfast(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomItem('breakfastCustomItems', customBreakfast, setCustomBreakfast))} placeholder="Type custom food name..." className={inputClasses} />
                        <button type="button" onClick={() => addCustomItem('breakfastCustomItems', customBreakfast, setCustomBreakfast)} className="px-4 bg-white text-black rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center shrink-0">
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {(data.breakfastCustomItems || []).map((item, idx) => (
                          <span key={idx} className="bg-white/10 border border-white/20 text-white text-[11px] px-3 py-1 rounded-full flex items-center gap-2">
                            {item} <button type="button" onClick={() => removeCustomItem('breakfastCustomItems', idx)} className="hover:text-red-400 transition-colors"><X className="w-3 h-3" /></button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Lunch */}
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group w-fit">
                  <input type="checkbox" name="includeLunch" checked={data.includeLunch} onChange={handleCheckboxChange} className="w-5 h-5 rounded border-[#2A2A2A] bg-[#111111] text-white focus:ring-white focus:ring-offset-black" />
                  <span className="text-white font-bold group-hover:text-white/80 transition-colors">Complimentary Lunch</span>
                </label>
                {data.includeLunch && (
                  <div className="pl-8 space-y-4 animate-fadeIn">
                    <div>
                      <p className={labelClasses}>Select Predefined Items:</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 bg-[#0F0F0F] p-4 rounded-xl border border-[#2A2A2A]">
                        {LUNCH_MENU.map(item => (
                          <label key={item} className="flex items-center gap-2 cursor-pointer text-xs group">
                            <input type="checkbox" checked={data.lunchItems?.includes(item)} onChange={() => toggleItem('lunchItems', item)} className="w-4 h-4 rounded border-[#2A2A2A] bg-black text-white focus:ring-white" />
                            <span className={`${data.lunchItems?.includes(item) ? 'text-white font-bold' : 'text-[#AAAAAA]'} transition-colors`}>{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className={labelClasses}>Add Custom Items:</p>
                      <div className="flex gap-2">
                        <input type="text" value={customLunch} onChange={(e) => setCustomLunch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomItem('lunchCustomItems', customLunch, setCustomLunch))} placeholder="Type custom lunch dish..." className={inputClasses} />
                        <button type="button" onClick={() => addCustomItem('lunchCustomItems', customLunch, setCustomLunch)} className="px-4 bg-white text-black rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center shrink-0">
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {(data.lunchCustomItems || []).map((item, idx) => (
                          <span key={idx} className="bg-white/10 border border-white/20 text-white text-[11px] px-3 py-1 rounded-full flex items-center gap-2">
                            {item} <button type="button" onClick={() => removeCustomItem('lunchCustomItems', idx)} className="hover:text-red-400 transition-colors"><X className="w-3 h-3" /></button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
          {/* Dinner */}
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer group w-fit">
              <input type="checkbox" name="includeDinner" checked={data.includeDinner} onChange={handleCheckboxChange} className="w-5 h-5 rounded border-[#2A2A2A] bg-[#111111] text-white focus:ring-white focus:ring-offset-black" />
              <span className="text-white font-bold group-hover:text-white/80 transition-colors">Complimentary Dinner</span>
            </label>
            {data.includeDinner && (
              <div className="pl-8 space-y-4 animate-fadeIn">
                <div>
                  <p className={labelClasses}>Select Predefined Items:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 bg-[#0F0F0F] p-4 rounded-xl border border-[#2A2A2A]">
                    {DINNER_MENU.map(item => (
                      <label key={item} className="flex items-center gap-2 cursor-pointer text-xs group">
                        <input type="checkbox" checked={data.dinnerItems.includes(item)} onChange={() => toggleItem('dinnerItems', item)} className="w-4 h-4 rounded border-[#2A2A2A] bg-black text-white focus:ring-white" />
                        <span className={`${data.dinnerItems.includes(item) ? 'text-white font-bold' : 'text-[#AAAAAA]'} transition-colors`}>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className={labelClasses}>Add Custom Items:</p>
                  <div className="flex gap-2">
                    <input type="text" value={customDinner} onChange={(e) => setCustomDinner(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomItem('dinnerCustomItems', customDinner, setCustomDinner))} placeholder="Type custom food name..." className={inputClasses} />
                    <button type="button" onClick={() => addCustomItem('dinnerCustomItems', customDinner, setCustomDinner)} className="px-4 bg-white text-black rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center shrink-0">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {data.dinnerCustomItems.map((item, idx) => (
                      <span key={idx} className="bg-white/10 border border-white/20 text-white text-[11px] px-3 py-1 rounded-full flex items-center gap-2">
                        {item} <button type="button" onClick={() => removeCustomItem('dinnerCustomItems', idx)} className="hover:text-red-400 transition-colors"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Evening Snacks */}
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer group w-fit">
              <input type="checkbox" name="includeSnacks" checked={data.includeSnacks} onChange={handleCheckboxChange} className="w-5 h-5 rounded border-[#2A2A2A] bg-[#111111] text-white focus:ring-white focus:ring-offset-black" />
              <span className="text-white font-bold group-hover:text-white/80 transition-colors">Complimentary Evening Snacks</span>
            </label>
            {data.includeSnacks && (
              <div className="pl-8 space-y-4 animate-fadeIn">
                <div>
                  <p className={labelClasses}>Select Predefined Items:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 bg-[#0F0F0F] p-4 rounded-xl border border-[#2A2A2A]">
                    {EVENING_SNACKS_MENU.map(item => (
                      <label key={item} className="flex items-center gap-2 cursor-pointer text-xs group">
                        <input type="checkbox" checked={data.snacksItems.includes(item)} onChange={() => toggleItem('snacksItems', item)} className="w-4 h-4 rounded border-[#2A2A2A] bg-black text-white focus:ring-white" />
                        <span className={`${data.snacksItems.includes(item) ? 'text-white font-bold' : 'text-[#AAAAAA]'} transition-colors`}>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className={labelClasses}>Add Custom Items:</p>
                  <div className="flex gap-2">
                    <input type="text" value={customSnacks} onChange={(e) => setCustomSnacks(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomItem('snacksCustomItems', customSnacks, setCustomSnacks))} placeholder="Type custom snack name..." className={inputClasses} />
                    <button type="button" onClick={() => addCustomItem('snacksCustomItems', customSnacks, setCustomSnacks)} className="px-4 bg-white text-black rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center shrink-0">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {data.snacksCustomItems.map((item, idx) => (
                      <span key={idx} className="bg-white/10 border border-white/20 text-white text-[11px] px-3 py-1 rounded-full flex items-center gap-2">
                        {item} <button type="button" onClick={() => removeCustomItem('snacksCustomItems', idx)} className="hover:text-red-400 transition-colors"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Payment Details */}
      <section className="space-y-6">
        <h2 className={sectionHeaderClasses}>
          <CreditCard className="w-4 h-4" color={iconColor} /> Payment & Calculations
        </h2>
        
        <div className="space-y-6 bg-[#0F0F0F] p-6 rounded-2xl border border-[#2A2A2A]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {data.bookingMode === BookingMode.PER_PERSON && (
              <>
                <div className="space-y-1">
                  <label className={labelClasses}>Adult Price (₹)</label>
                  <input type="number" name="amtPerAdult" value={data.amtPerAdult} onChange={handleChange} className={inputClasses} placeholder="Enter rate..." />
                </div>
                <div className="space-y-1">
                  <label className={labelClasses}>Children Price (₹)</label>
                  <input type="number" name="amtPerChild" value={data.amtPerChild} onChange={handleChange} className={inputClasses} placeholder="Enter rate..." />
                </div>
              </>
            )}
            {data.bookingMode === BookingMode.PER_ROOM && (
              <div className="space-y-1">
                <label className={labelClasses}>Price Per Room (₹)</label>
                <input type="number" name="amtPerRoom" value={data.amtPerRoom} onChange={handleChange} className={inputClasses} placeholder="Enter rate..." />
              </div>
            )}
          </div>

          {data.bookingMode === BookingMode.PER_PERSON && (
            <div className="pt-4 border-t border-[#2A2A2A] space-y-4 animate-fadeIn">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Extra Rooms (Optional)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className={labelClasses}>Number of Extra Rooms</label>
                  <input type="number" name="numExtraRooms" value={data.numExtraRooms || ''} onChange={handleChange} min="0" className={inputClasses} placeholder="0" />
                </div>
                <div className="space-y-1">
                  <label className={labelClasses}>Price Per Extra Room (₹)</label>
                  <input type="number" name="pricePerExtraRoom" value={data.pricePerExtraRoom || ''} onChange={handleChange} min="0" className={inputClasses} placeholder="0" />
                </div>
              </div>
            </div>
          )}

          {data.bookingMode === BookingMode.PER_ROOM && (
            <div className="pt-4 border-t border-[#2A2A2A] space-y-4 animate-fadeIn">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Extra Persons (Optional)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className={labelClasses}>Number of Extra Persons</label>
                  <input type="number" name="numExtraPersons" value={data.numExtraPersons || ''} onChange={handleChange} min="0" className={inputClasses} placeholder="0" />
                </div>
                <div className="space-y-1">
                  <label className={labelClasses}>Price Per Extra Person (₹)</label>
                  <input type="number" name="pricePerExtraPerson" value={data.pricePerExtraPerson || ''} onChange={handleChange} min="0" className={inputClasses} placeholder="0" />
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#2A2A2A]">
            <div className="space-y-1">
              <label className={labelClasses}>Advance Paid (₹)</label>
              <input required type="number" name="advanceCollected" value={data.advanceCollected} onChange={handleChange} className={inputClasses} />
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Booking Platform</label>
              <select name="platform" value={data.platform} onChange={handleChange} className={inputClasses}>
                {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl border-2 bg-[#111111] border-white text-white shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#AAAAAA]">Total Amount:</span>
            <span className="text-xl font-bold">₹ {data.roomRent}</span>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#AAAAAA]">Balance Amount:</span>
            <span className="text-2xl font-black">{data.roomRent - data.advanceCollected === 0 ? 'FULL PAYMENT DONE' : `₹ ${data.roomRent - data.advanceCollected}`}</span>
          </div>
        </div>
      </section>

      <div className="pt-8">
        <button type="submit" className="w-full md:w-auto px-12 py-4 bg-white text-black font-black rounded-xl transition-all shadow-md flex items-center justify-center gap-3 hover:bg-[#E0E0E0] hover:scale-[1.02] active:scale-100">
          Generate Bill Preview <ExternalLink className="w-5 h-5" />
        </button>
      </div>
    </div>
    )}
    </form>
  );
};

export default BookingForm;
