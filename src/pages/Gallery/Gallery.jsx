import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import HeroSection from "../../components/HeroSection";
import { Grid3X3, Images } from "lucide-react";

const GALLERY_ITEMS = [
  { id: 1, category: "Classrooms", title: "Interactive Learning", src: "https://picsum.photos/seed/cls1/600/450" },
  { id: 2, category: "Sports", title: "Football Championship", src: "https://picsum.photos/seed/spt2/600/450" },
  { id: 3, category: "Science Lab", title: "Chemistry Experiments", src: "https://picsum.photos/seed/lab3/600/450" },
  { id: 4, category: "Events", title: "Graduation Ceremony 2024", src: "https://picsum.photos/seed/evt4/600/450" },
  { id: 5, category: "Classrooms", title: "STEM Workshop", src: "https://picsum.photos/seed/cls5/600/450" },
  { id: 6, category: "Sports", title: "Athletics Day", src: "https://picsum.photos/seed/spt6/600/450" },
  { id: 7, category: "Events", title: "Cultural Day Festival", src: "https://picsum.photos/seed/evt7/600/450" },
  { id: 8, category: "Science Lab", title: "Biology Practical", src: "https://picsum.photos/seed/lab8/600/450" },
  { id: 9, category: "Classrooms", title: "Digital Literacy Class", src: "https://picsum.photos/seed/cls9/600/450" },
  { id: 10, category: "Sports", title: "Basketball Tournament", src: "https://picsum.photos/seed/spt10/600/450" },
  { id: 11, category: "Events", title: "Prize Giving Day", src: "https://picsum.photos/seed/evt11/600/450" },
  { id: 12, category: "Science Lab", title: "Physics Demonstration", src: "https://picsum.photos/seed/lab12/600/450" },
  { id: 13, category: "Classrooms", title: "Group Study Session", src: "https://picsum.photos/seed/cls13/600/450" },
  { id: 14, category: "Sports", title: "Swimming Gala", src: "https://picsum.photos/seed/spt14/600/450" },
  { id: 15, category: "Events", title: "Independence Day", src: "https://picsum.photos/seed/evt15/600/450" },
  { id: 16, category: "Science Lab", title: "Computer Lab Session", src: "https://picsum.photos/seed/lab16/600/450" },
  { id: 17, category: "Classrooms", title: "Art & Craft", src: "https://picsum.photos/seed/cls17/600/450" },
  { id: 18, category: "Sports", title: "Field Day Results", src: "https://picsum.photos/seed/spt18/600/450" },
];

const CATEGORIES = ["All", ...new Set(GALLERY_ITEMS.map((g) => g.category))];

export default function Gallery() {
  const [active, setActive] = useState("All");
  const [selected, setSelected] = useState(null);

  const filtered = active === "All" ? GALLERY_ITEMS : GALLERY_ITEMS.filter((g) => g.category === active);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <HeroSection
        title="School Gallery"
        text="A visual journey through life at WiSchool — from classrooms and labs to sports fields and celebrations."
        image="https://picsum.photos/seed/gallery-hero/1600/600"
      />

      {/* Filter tabs */}
      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-8">
        <div className="flex items-center gap-3 flex-wrap">
          <Grid3X3 className="w-4 h-4 text-gray-400" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={`
                px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer
                ${active === cat
                  ? "bg-green-600 text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-green-300"}
              `}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto text-xs text-gray-400 flex items-center gap-1">
            <Images className="w-3.5 h-3.5" /> {filtered.length} photos
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-5 lg:px-10 pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
              onClick={() => setSelected(item)}
            >
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => { e.target.src = `https://picsum.photos/seed/${item.id + 100}/600/450`; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white text-xs font-semibold leading-tight">{item.title}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-green-500/80 text-white text-[10px] rounded-full">
                  {item.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={selected.src}
              alt={selected.title}
              className="w-full max-h-[75vh] object-contain rounded-2xl"
            />
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-white font-semibold">{selected.title}</p>
                <p className="text-gray-400 text-sm">{selected.category}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 text-sm cursor-pointer"
              >
                Close ✕
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}