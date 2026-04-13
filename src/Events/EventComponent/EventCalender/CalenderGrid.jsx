// ./CalendarGrid.jsx
import React from 'react';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  startOfWeek,
  endOfWeek,
  format,
  addMonths
} from 'date-fns';
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarGrid({ currentDate, setCurrentDate, onDateSelect }) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const daysToDisplay = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  function handleNextClick() {
    setCurrentDate(prev => addMonths(prev, 1));
  }

  function handleBackClick() {
    setCurrentDate(prev => addMonths(prev, -1));
  }

  return (
    <div className='w-60'>
      <div className="flex items-center justify-between mb-4">
        <ChevronLeft className='cursor-pointer' onClick={handleBackClick} />
        <div>{format(currentDate, "MMMM yyyy")}</div>
        <ChevronRight className='cursor-pointer' onClick={handleNextClick} />
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-gray-600">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => <div key={i}>{day}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-medium">
        {daysToDisplay.map((date) => {
          const isCurrentDay = format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
          const isCurrentMonth = isSameMonth(date, currentDate);

          return (
            <div
              key={date.toISOString()}
              className={`px-2 py-1 cursor-pointer ${
                !isCurrentMonth && 'text-gray-400'
              } ${
                isCurrentDay ? 'bg-green-500 font-medium text-green-800 rounded-full w-6 h-6' : ''
              }`}
              onClick={() => onDateSelect(date)}
            >
              {format(date, 'd')}
            </div>
          );
        })}
      </div>

      <div className='mt-8'>
        <h1 className='font-bold text-sm mb-4'>Event Colors</h1>
        <div className='flex gap-2 mb-3 items-center'>
          <div className='w-4 h-4 bg-green-600 rounded-full'></div>
          <p className='font-medium text-sm'>Present Event</p>
        </div>
        <div className='flex gap-2 mb-3 items-center'>
          <div className='w-4 h-4 bg-purple-600 rounded-full'></div>
          <p className='font-medium text-sm'>Upcoming Event</p>
        </div>
        <div className='flex gap-2 mb-3 items-center'>
          <div className='w-4 h-4 bg-red-600 rounded-full'></div>
          <p className='font-medium text-sm'>Past Event</p>
        </div>
      </div>
    </div>
  );
}
