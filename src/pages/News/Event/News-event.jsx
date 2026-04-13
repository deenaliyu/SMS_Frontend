import React from 'react';
import HeroSection from '../../../components/HeroSection';

const events = [
  {
    month: 'March',
    date: '15',
    title: 'Parent-Teacher Conference',
    description:
      "Meet with your child's teachers to discuss their progress, goals and academic achievements. This is a valuable opportunity for parents to connect with teachers and support their child's learning journey.",
    time: '<strong>Time:</strong> 9:00 AM - 12:00PM',
  },
  {
    month: 'March',
    date: '15',
    title: 'Science Fair Exhibition',
    description:
      'Join us for an interactive showcase of the creative and innovative projects of our students. From biology experiments to engineering challenges, explore the wonders of science and celebrate our students.',
    time: '<strong>Time:</strong> 9:00 AM - 12:00PM',
  },
];

const NewsEvents = () => {
  return (
    <div>
      <HeroSection
        image="/news.png"
        title="News & Events"
        text="Welcome to the WiSchool News & Events page! Stay up-to-date with the latest happenings, announcements, and exciting events from our school community. Whether it's academic achievements, cultural celebrations, or extracurricular activities, you'll find all the news and updates right here."
      />

      <header
        className="bg-cover bg-center h-100 md:h-125 sm:h-120 text-white relative"
        style={{
          backgroundImage:
            'url(https://res.cloudinary.com/dtz4rslmb/image/upload/v1738800216/hd_image_1_nvzlqa.png)',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div>
          <div className="absolute top-[80px] sm:top-[120px] md:top-[157px] left-[32px] sm:left-[42px] md:left-[65.07px]">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-[poppins]">
              News & Events
            </h1>
            <p className="mt-2 text-[18px] sm:text-[19px] md:text-[24px] font-[poppins]">
              Welcome to the WiSchool News & Events page! Stay up-to-date with
              the latest happenings, announcements, and exciting events from our
              school community. Whether it's academic achievements, cultural
              celebrations, or extracurricular activities, you'll find all the
              news and updates right here.
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="p-6 rounded-lg">
          <div className="mt-6">
            <div className="ml-2 max-w-[1000px] flex items-center">
              <div
                className="flex-1 flex items-center py-4 h-10.5"
                style={{
                  background: 'rgb(240, 240, 240)',
                  border: '1px solid rgb(231, 227, 227)',
                  borderRadius: '5px 0 0 5px',
                }}
              >
                <button className="h-7 pl-2.5 pr-3.5">
                  <img
                    src="https://res.cloudinary.com/dtz4rslmb/image/upload/v1738831296/loupe_1_ijxbmh.png"
                    alt="search"
                  />
                </button>
                <input
                  type="text"
                  placeholder="Search for events"
                  className="text-[16px] focus:outline-none focus:ring-0 focus:border-transparent"
                />
              </div>
              <button
                className="px-2 py-2.5 bg-[#09B451] text-white hover:bg-green-600 ml-[-2px] text-[15px] font-[poppins]"
                style={{ borderRadius: '0 5px 5px 0' }}
              >
                Check Status
              </button>
            </div>

            <div className="flex pt-6 mb-2 items-end">
              <h2 className="text-3xl font-bold mb-4">Upcoming Events</h2>
              <p className="mb-4 ml-7 font-light text-gray-400 text-3xl">
                Stay informed
              </p>
            </div>

            <div className="space-y-4">
              {events.map((event, index) => (
                <div
                  key={index}
                  className="flex items-start border-gray-200 rounded-lg shadow-sm pt-7 pb-7"
                >
                  <div className="pr-[10px] pl-[17px] mr-4 font-[poppins]">
                    <p className="text-[13px] pl-1.5 mt-12 md:mt-4 sm:mt-8">
                      {event.month}
                    </p>
                    <span className="text-4xl font-semibold pl-2">
                      {event.date}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="border-l border-black pl-[11px] pt-[2px] pb-[3px]">
                      <h3 className="text-lg font-bold">{event.title}</h3>
                      <p
                        className="mt-1 text-black-500 text-sm"
                        style={{ maxWidth: '670px' }}
                      >
                        {event.description}
                      </p>
                      <p
                        className="text-sm font-[poppins]"
                        dangerouslySetInnerHTML={{ __html: event.time }}
                      ></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsEvents;
