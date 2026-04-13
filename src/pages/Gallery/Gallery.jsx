import React from 'react'

// src/Gallery.jsx  

const Gallery = () => {  
  const images = [  
    { title: "School Children", src: "https://res.cloudinary.com/dtz4rslmb/image/upload/v1738795380/pexels-137666-710743_yugufh.jpg" },  
    { title: "School Children", src: "https://res.cloudinary.com/dtz4rslmb/image/upload/v1738795380/pexels-137666-710743_yugufh.jpg" },  
    { title: "School Event", src: "https://res.cloudinary.com/dtz4rslmb/image/upload/v1738795380/pexels-137666-710743_yugufh.jpg" },  
    { title: "School Children", src: "https://res.cloudinary.com/dtz4rslmb/image/upload/v1738795380/pexels-137666-710743_yugufh.jpg" },  
    { title: "School Event", src: "https://res.cloudinary.com/dtz4rslmb/image/upload/v1738795380/pexels-137666-710743_yugufh.jpg" },  
    { title: "School Children", src: "https://res.cloudinary.com/dtz4rslmb/image/upload/v1738795380/pexels-137666-710743_yugufh.jpg" }, 
    { title: "School Children", src: "https://res.cloudinary.com/dtz4rslmb/image/upload/v1738795380/pexels-137666-710743_yugufh.jpg" },  
    { title: "School Children", src: "https://res.cloudinary.com/dtz4rslmb/image/upload/v1738795380/pexels-137666-710743_yugufh.jpg" },  
    { title: "School Event", src: "https://res.cloudinary.com/dtz4rslmb/image/upload/v1738795380/pexels-137666-710743_yugufh.jpg" },
    { title: "School Children", src: "https://res.cloudinary.com/dtz4rslmb/image/upload/v1738795380/pexels-137666-710743_yugufh.jpg" },  
    { title: "School Children", src: "https://res.cloudinary.com/dtz4rslmb/image/upload/v1738795380/pexels-137666-710743_yugufh.jpg" },  
    { title: "School Event", src: "https://res.cloudinary.com/dtz4rslmb/image/upload/v1738795380/pexels-137666-710743_yugufh.jpg" },
    { title: "School Children", src: "https://res.cloudinary.com/dtz4rslmb/image/upload/v1738795380/pexels-137666-710743_yugufh.jpg" },  
    { title: "School Children", src: "https://res.cloudinary.com/dtz4rslmb/image/upload/v1738795380/pexels-137666-710743_yugufh.jpg" },  
    { title: "School Event", src: "https://res.cloudinary.com/dtz4rslmb/image/upload/v1738795380/pexels-137666-710743_yugufh.jpg" },
    { title: "School Children", src: "https://res.cloudinary.com/dtz4rslmb/image/upload/v1738795380/pexels-137666-710743_yugufh.jpg" },  
    { title: "School Children", src: "https://res.cloudinary.com/dtz4rslmb/image/upload/v1738795380/pexels-137666-710743_yugufh.jpg" },  
    { title: "School Event", src: "https://res.cloudinary.com/dtz4rslmb/image/upload/v1738795380/pexels-137666-710743_yugufh.jpg" }
  ];  

  return (  
    <div className="">  
     <header className="bg-cover bg-center h-100 h-100 md:h-125 sm:h-120 flex flex-col items-center justify-center text-white relative" 
       style={{ backgroundImage: 'url(https://res.cloudinary.com/dtz4rslmb/image/upload/v1738792553/hd_image_mrxgax.png)' }}> 
       <div className="absolute inset-0 bg-black opacity-10"></div>
       <div>
          <div className='absolute top-[80px] sm:top-[120px] md:top-[157px] left-[32px] sm:left-[42px] md:left-[65.07px]'>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-[poppins]">Gallery</h1>
          <p className="mt-2 text-[18px] sm:text-[19px] md:text-[24px] font-[poppins]">
          Welcome to the WiSchol Gallery! Explore our collection of photos and videos showcasing the vibrant learning experience at WiSchol. From classroom activities to special events and community celebrations, our gallery offers a glimpse into the dynamic experiences of our school community.. 
          </p>
            

          </div>
        </div>
       
      </header>
      
      
      <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4 mx-4 lg:ml-20 lg:mr-20 mt-7 not-visited:">  
        {images.map((image, index) => (  
          <div key={index} className="bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">  
            <img src={image.src} alt={image.title} className="rounded-t-lg w-full h-50 object-cover" />  
            <div className="p-4">  
              <h3 className="font-semibold">{image.title}.</h3>  
            </div>  
          </div>  
        ))}  
      </div>  
    </div>  
  );  
};  

 

export default Gallery;
