import PropTypes from "prop-types";

import { ChevronLeft, ChevronRight  } from "lucide-react";

import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  startOfWeek,
  endOfWeek,
  format
} from 'date-fns';


// 📆 Main Page Component
export default function EventGrid({events, currentDate}) {

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const daysToDisplay = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  return (

    <>
              <div className='flex items-start justify-between w-full px-5 border-b-2 border-gray-200 pb-2'>
                <div className='flex items-center gap-2'>
                  <div className='text-2xl font-medium'>{format(currentDate, "MMMM yyyy")}</div>
                  <div className='p-1 shadow-lg text-xs font-medium w-min rounded-md'>{format(currentDate, "EEEE")}</div>
                  <div className='flex gap-2 items-center'>
                    <ChevronLeft className='cursor-pointer'/>
                    <ChevronRight  className='cursor-pointer'/>
                  </div>
                </div>
                <div className='flex gap-2 bg-gray-100 p-1 rounded'>
                  <div className="rounded-md bg-white cursor-pointer py-1 font-medium text-xs px-2">Day</div>
                  <div className="rounded-md bg-white cursor-pointer py-1 font-medium text-xs px-2">Week</div>
                  <div className="rounded-md bg-white cursor-pointer py-1 font-medium text-xs px-2">Month</div>
                </div>
              </div>

              <div>
                <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium bg-gray-100 text-gray-900 p-2 border-y-none border-x-2 border-gray-200">
                  {["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"].map((day, index) => (
                    <div key={index + day}>{day}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 text-sm border border-gray-200">
                  {daysToDisplay.map((day, index) => {
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const isToday = isSameDay(day, currentDate);

                    const matchedEvent = events.find(event =>
                      isSameDay(new Date(event.date), day)
                    );

                    let eventColor = "";
                    if (matchedEvent) {
                      const eventDate = new Date(matchedEvent.date);
                      if (isSameDay(eventDate, currentDate)) {
                        eventColor = "green";
                      } else if (eventDate > currentDate) {
                        eventColor = "purple";
                      } else if (eventDate < currentDate) {
                        eventColor = "red";
                      }
                    }

                    return (
                      <div
                        key={index}
                        className="aspect-square flex flex-col items-center p-1 justify-center text-right border border-gray-100 relative"
                      >
                        <div
                          className={`text-xs font-medium absolute top-1 right-1 ${
                            isCurrentMonth ? "text-gray-700" : "text-gray-400"
                          } ${isToday ? "rounded-3xl w-6 h-6 flex items-center justify-center bg-green-500 text-white" : ""}`}
                        >
                          {format(day, "d")}
                        </div>

                        {matchedEvent && (
                          <div
                            className={`text-xs text-center font-medium w-full px-1 py-0.5 rounded-md border
                            ${
                              eventColor === "green"
                                ? "text-green-600 border-green-600 bg-green-50"
                                : eventColor === "purple"
                                ? "text-purple-600 border-purple-600 bg-purple-50"
                                : "text-red-600 border-red-600 bg-red-50"
                            }`}
                          >
                            {matchedEvent.title}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

    </>
  );
}

EventGrid.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string,
      title: PropTypes.string,
    })
  ).isRequired,
  currentDate: PropTypes.instanceOf(Date).isRequired,
};
