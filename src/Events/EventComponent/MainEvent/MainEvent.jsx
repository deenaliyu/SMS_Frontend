import PropTypes from "prop-types";
import { Search, Calendar, List, SquarePen, ArrowDown } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MainEvent({events}) {

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const numberOfPages = Math.max(1, Math.ceil(events.length / itemsPerPage));

  function handleNextClick() {
    if(currentPage < numberOfPages) {
      setCurrentPage((prev) => prev + 1);
    }
  }
  function handlePreviousClick() {
    if(currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  function handleCalendarClick() {
    navigate("/events/calendar", { state: { events } });
  }


  return(
    <>
      <div className="flex flex-col min-h-screen">
        <div className="p-3 bg-white border border-gray-100">
          <div className="flex flex-col gap-4">
            <h1 className="font-bold text-xl">Event</h1>
          </div>
        </div>
        <div className="p-3 border border-gray-100 rounded bg-white ">
          <div>
            <h1 className="text-lg font-bold">Event List</h1>
              <div className="flex items-center justify-between mt-1">
                <div className="relative w-full max-w-xs">
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full pl-5 pr-10 py-1 rounded border border-gray-300 focus:outline-none"
                  />
                  <Search className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 w-5 h-5 cursor-pointer" />
                </div>

                <div className="flex items-center">
                  <div className="hover:bg-green-700 bg-green-600 cursor-pointer text-black p-2 rounded">
                    <List className="h-5 w-5"/>
                  </div>
                  <div className="bg-white px-6 py-2 cursor-pointer">
                    <Calendar
                      className="text-gray-500 hover:text-gray-600"
                      onClick={handleCalendarClick} />
                  </div>
                  <div className="py-2 px-7 hover:bg-green-700 bg-green-600 cursor-pointer font-medium rounded-md"
                  onClick={() => navigate("/events/add")}
                  >Add Event</div>
                </div>
              </div>
            </div>

          </div>

          <div className="border border-gray-100 p-1 bg-white rounded-t-md">
            <div>
              <table className="w-full border-collapse border border-gray-100 m-0 rounded-t-md">
                <thead>
                  <tr className="border border-gray-100">
                    <th className="text-left p-2">
                      <div className="text-xs font-bold flex items-center gap-1">
                        <p>S/N </p>
                        <ArrowDown className="w-4 h-4"/>
                      </div>
                    </th>
                    <th className="text-center text-xs  p-2 font-bold">Event Title</th>
                    <th className="text-center text-xs  p-2 font-bold">Date</th>
                    <th className="text-center text-xs  p-2 font-bold">Time</th>
                    <th className="text-center text-xs  p-2 font-bold">Location</th>
                    <th className="text-center text-xs  p-2 font-bold">Description</th>
                    <th className="text-center text-xs  p-2 font-bold">Organizer</th>
                    <th className="text-center text-xs  p-2 font-bold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {events.slice(indexOfFirstItem, indexOfLastItem).map((event, index) => (
                    <tr
                      key={event.id}
                      className={`border ${
                        index % 2 === 0 && "bg-gray-100"
                      }`}
                    >
                      <td className="px-2 py-5 text-xs text-center text-gray-600 border border-white border-l-gray-100">
                        {event.id}
                      </td>
                      <td className="px-2 py-5 text-xs text-center text-gray-600 border border-white">
                        {event.title}
                      </td>
                      <td className="border border-white text-center px-2 py-5 text-xs text-gray-600">
                        {event.date}
                      </td>
                      <td className="border border-white text-center px-2 py-5 text-xs text-gray-600">
                        {event.time}
                      </td>
                      <td className="border border-white text-center px-2 py-5 text-xs text-gray-600">
                        {event.location}
                      </td>
                      <td className="border border-white text-center px-2 py-5 text-xs text-gray-600">
                        {event.description}
                      </td>
                      <td className="border border-white text-center px-2 py-5 text-xs text-gray-600">
                        {event.organizer}
                      </td>
                      <td className="text-center px-2 py-5 text-xs text-gray-600 border border-white border-r-gray-100">
                        <div className="flex justify-center items-center gap-3 cursor-pointer">
                          <SquarePen className="w-5 h-5" />
                          <button className="text-green-500 border border-green-500 rounded-md  hover:bg-green-500 hover:text-white py-1 px-4 cursor-pointer">View</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="border border-gray-100 m-0 p-1 rounded-b-md flex items-center justify-between" >
                <div className="flex gap-3 items-center">
                  <button className="py-1 px-4 text-green-500 border border-green-500 rounded-md  hover:bg-green-500 hover:text-white cursor-pointer" onClick={handlePreviousClick}>Previous</button>
                  <button className="py-1 px-4 text-green-500 border border-green-500 rounded-md  hover:bg-green-500 hover:text-white cursor-pointer" onClick={handleNextClick}>Next</button>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">{`page ${currentPage} of ${numberOfPages}`}</p>
                </div>
              </div>
            </div>
          </div>
      </div>
    </>
  )
}

MainEvent.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      title: PropTypes.string,
      date: PropTypes.string,
      time: PropTypes.string,
      location: PropTypes.string,
      description: PropTypes.string,
      organizer: PropTypes.string
    })
  ).isRequired
};


