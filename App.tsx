
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BookingData, RoomType, BookingPlatform, BookingMode } from './types';
import { ROOM_TYPES } from './constants';
import BookingForm from './components/BookingForm';
import BillPreview from './components/BillPreview';
import { Eye, Printer, PlusCircle, LayoutDashboard, Loader2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const App: React.FC = () => {
  const [bookingData, setBookingData] = useState<BookingData>({
    bookingId: '',
    guestName: '',
    bookingDate: new Date().toISOString().split('T')[0],
    checkInDate: '',
    checkOutDate: '',
    numRooms: 1,
    numCottages: 1,
    numNights: 0,
    reservation: '',
    roomType: '', 
    adults: 2,
    children: 0,
    roomRent: 0,
    advanceCollected: 0,
    platform: BookingPlatform.DIRECT,
    includeBreakfast: false,
    breakfastItems: [],
    breakfastCustomItems: [],
    includeLunch: false,
    lunchItems: [],
    lunchCustomItems: [],
    includeDinner: false,
    dinnerItems: [],
    dinnerCustomItems: [],
    includeSnacks: false,
    snacksItems: [],
    snacksCustomItems: [],
    complimentaryActivities: [],
    // New fields
    bookingMode: BookingMode.NONE,
    amtPerAdult: 0,
    amtPerChild: 0,
    amtPerRoom: 0,
    amtPerCottage: 0,
    numExtraRooms: 0,
    pricePerExtraRoom: 0,
    numExtraPersons: 0,
    pricePerExtraPerson: 0,
  });

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!bookingData.bookingId) {
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      setBookingData(prev => ({ ...prev, bookingId: `DV-${timestamp}-${random}` }));
    }
  }, []);

  // DERIVED VALUES RULE: Compute numNights, reservation, and roomRent INLINE.
  let nights = 0;
  let resStr = '';
  if (bookingData.checkInDate && bookingData.checkOutDate) {
    const startParts = bookingData.checkInDate.split('-').map(Number);
    const endParts = bookingData.checkOutDate.split('-').map(Number);
    if (startParts.length === 3 && endParts.length === 3) {
      const start = new Date(startParts[0], startParts[1] - 1, startParts[2]);
      const end = new Date(endParts[0], endParts[1] - 1, endParts[2]);
      const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      nights = diff > 0 ? diff : (bookingData.checkInDate === bookingData.checkOutDate ? 1 : 0);
      if (nights > 0) {
        const nightsPart = `${nights} Night${nights > 1 ? 's' : ''}`;
        let accomPart = '';
        if (bookingData.roomType === RoomType.COTTAGE) {
          const cCount = bookingData.numCottages ?? 1;
          accomPart = `, ${cCount} Cottage${cCount > 1 ? 's' : ''}`;
        } else if (bookingData.roomType === RoomType.COTTAGE_PLUS_ROOM) {
          const rCount = bookingData.numRooms || 1;
          const cCount = bookingData.numCottages ?? 1;
          accomPart = `, ${rCount} Room${rCount > 1 ? 's' : ''}, ${cCount} Cottage${cCount > 1 ? 's' : ''}`;
        } else if (bookingData.roomType === RoomType.ROOM) {
          const rCount = bookingData.numRooms || 1;
          accomPart = `, ${rCount} Room${rCount > 1 ? 's' : ''}`;
        } else if (bookingData.bookingMode === BookingMode.PER_ROOM) {
          const rCount = bookingData.numRooms || 1;
          accomPart = `, ${rCount} Room${rCount > 1 ? 's' : ''}`;
        }
        resStr = `${nightsPart}${accomPart}`;
      }
    }
  }

  // Payment Calculation Logic
  let calculatedRent = 0;
  if (bookingData.bookingMode === BookingMode.PER_PERSON) {
    const adultPrice = Number(bookingData.amtPerAdult) || 0;
    const childPrice = Number(bookingData.amtPerChild) || 0;
    const genericPersonPrice = Number((bookingData as any).amtPerPerson ?? (bookingData as any).pricePerPerson) || 0;

    const baseCost = genericPersonPrice > 0
      ? ((Number(bookingData.adults) || 0) + (Number(bookingData.children) || 0)) * genericPersonPrice
      : ((Number(bookingData.adults) || 0) * adultPrice) + ((Number(bookingData.children) || 0) * childPrice);

    const extraRooms = Number(bookingData.numExtraRooms) || 0;
    const extraRoomPrice = Number(bookingData.pricePerExtraRoom) || 0;
    const extraRoomsCost = (extraRooms > 0 && extraRoomPrice > 0) ? (extraRooms * extraRoomPrice) : 0;

    calculatedRent = baseCost + extraRoomsCost;
  } else if (bookingData.bookingMode === BookingMode.PER_ROOM) {
    let baseCost = 0;
    const pricePerRoom = Number(bookingData.amtPerRoom) || 0;
    const pricePerCottage = Number(
      bookingData.amtPerCottage !== undefined && bookingData.amtPerCottage !== null && bookingData.amtPerCottage !== 0 && (bookingData.amtPerCottage as any) !== ''
        ? bookingData.amtPerCottage
        : ((bookingData as any).pricePerCottage !== undefined && (bookingData as any).pricePerCottage !== null && (bookingData as any).pricePerCottage !== 0 && (bookingData as any).pricePerCottage !== ''
          ? (bookingData as any).pricePerCottage
          : bookingData.amtPerRoom)
    ) || 0;

    if (bookingData.roomType === RoomType.COTTAGE) {
      const cottageCount = Number(bookingData.numCottages !== undefined && bookingData.numCottages !== null && (bookingData.numCottages as any) !== '' ? bookingData.numCottages : 1) || 0;
      baseCost = cottageCount * (pricePerCottage || pricePerRoom);
    } else if (bookingData.roomType === RoomType.COTTAGE_PLUS_ROOM) {
      const roomCount = Number(bookingData.numRooms) || 0;
      const cottageCount = Number(bookingData.numCottages !== undefined && bookingData.numCottages !== null && (bookingData.numCottages as any) !== '' ? bookingData.numCottages : 1) || 0;
      baseCost = (roomCount * pricePerRoom) + (cottageCount * pricePerCottage);
    } else if (bookingData.roomType === RoomType.ROOM) {
      const roomCount = Number(bookingData.numRooms) || 0;
      baseCost = roomCount * pricePerRoom;
    } else {
      const unitCount = Number(bookingData.numRooms || bookingData.numCottages || 1) || 0;
      baseCost = unitCount * pricePerRoom;
    }

    const extraPersons = Number(bookingData.numExtraPersons) || 0;
    const extraPersonPrice = Number(bookingData.pricePerExtraPerson) || 0;
    const extraPersonsCost = (extraPersons > 0 && extraPersonPrice > 0) ? (extraPersons * extraPersonPrice) : 0;

    calculatedRent = baseCost + extraPersonsCost;
  } else {
    calculatedRent = Number(bookingData.roomRent) || 0;
  }

  const activeBookingData: BookingData = {
    ...bookingData,
    numNights: nights,
    reservation: resStr,
    roomRent: calculatedRent
  };

  const handleGeneratePdf = async () => {
    setIsGenerating(true);
    const hiddenHost = document.createElement('div');
    Object.assign(hiddenHost.style, {
      position: 'absolute',
      left: '-9999px',
      top: '0',
      width: '210mm',
      backgroundColor: '#FFFFFF',
      zIndex: '-1000'
    });
    document.body.appendChild(hiddenHost);

    const root = createRoot(hiddenHost);
    await new Promise<void>((resolve) => {
      root.render(<BillPreview data={activeBookingData} isPdf={true} />);
      // Increased timeout to ensure static logo.png is fully loaded before capture
      setTimeout(resolve, 1500);
    });

    try {
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
      const pdfWidth = 210; 
      const pdfHeight = 297; 
      const billPages = hiddenHost.querySelectorAll('.page');

      for (let i = 0; i < billPages.length; i++) {
        const page = billPages[i] as HTMLElement;
        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: '#FFFFFF',
          width: 794,
          windowWidth: 794, 
          imageTimeout: 15000
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.90);
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      }
      pdf.save(`DreamyVacations_${activeBookingData.bookingId}.pdf`);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Error generating the PDF.');
    } finally {
      root.unmount();
      document.body.removeChild(hiddenHost);
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-12 overflow-x-hidden">
      <header className="no-print sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-[#2A2A2A] px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-y-4 w-full">
        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-black border border-white p-1.5 rounded">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <span className="font-serif text-lg sm:text-xl tracking-tight text-white font-bold uppercase">
            DreamyVacations
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            disabled={isGenerating}
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-transparent border border-white text-white hover:bg-white hover:text-black transition-all text-xs sm:text-sm font-medium disabled:opacity-50 whitespace-nowrap"
          >
            {isPreviewMode ? <PlusCircle className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {isPreviewMode ? "Edit Details" : "Preview Bill"}
          </button>
          
          {isPreviewMode && (
            <button
              disabled={isGenerating}
              onClick={handleGeneratePdf}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white border border-white text-black hover:bg-zinc-200 transition-all text-xs sm:text-sm font-medium shadow-sm disabled:opacity-50 whitespace-nowrap"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
              {isGenerating ? "Generating..." : "Download PDF"}
            </button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 mt-8">
        {!isPreviewMode ? (
          <div className="max-w-4xl mx-auto animate-fadeIn">
            <div className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2 text-white uppercase tracking-tight">Booking Information</h1>
              <p className="text-[#AAAAAA] text-sm">Enter the required guest and stay details below.</p>
            </div>
            <BookingForm 
              data={activeBookingData} 
              onChange={(newData) => setBookingData(newData)} 
              onSubmit={() => setIsPreviewMode(true)}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center animate-fadeIn">
            <div className="bill-wrapper w-full max-w-4xl shadow-2xl border border-[#2A2A2A] rounded-lg overflow-hidden bg-white text-black">
              <BillPreview data={activeBookingData} isPdf={false} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
