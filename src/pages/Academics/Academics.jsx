import Navbar from "../../components/Navbar/Navbar";
import HeroSection from "../../components/HeroSection";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const PRIMARY_SUBJECTS = ["Language Arts & Literacy", "Mathematics", "Basic Science & Technology", "Social Studies", "Physical & Health Education", "Creative Arts", "Civic Education"];
const SECONDARY_SUBJECTS = ["English Language & Literature", "Mathematics", "Physics", "Chemistry", "Biology", "Government / Civic Education", "Economics", "Information Technology", "Agricultural Science", "Fine Arts"];
const ENRICHMENT = ["STEM Education — hands-on science, technology, engineering, and maths projects", "Environmental Education — outdoor exploration and sustainability initiatives", "Character Education — values, integrity, empathy, and leadership development", "Digital Literacy — coding, computer skills, and responsible technology use"];
const COLLEGE_PREP = ["College Counselling — personalised guidance through application, essays, and financial aid", "Career Exploration — career fairs, mentorship sessions, and internship opportunities", "Advanced Classes — accelerated curricula for motivated learners in core subjects", "Community Service — structured volunteering and service-learning programmes"];
const TESTIMONIALS = [
  { text: "WiSchool has been a game-changer for our family. The personalised attention my child receives is exceptional.", name: "Mrs. Fatima Danladi", role: "Parent — SSS2 student" },
  { text: "Choosing WiSchool was the best decision we made. My child is thriving academically and loves going to school every day.", name: "Mr. Emmanuel Okafor", role: "Parent — JSS1 student" },
  { text: "The STEM programme alone has transformed how my daughter thinks and solves problems. Remarkable institution.", name: "Dr. Sadeeq Ibrahim", role: "Parent — SSS3 student" },
];

function CurriculumSection({ level, subjects, enrichment, title, subtitle }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-7">
      <div className="flex items-start gap-4 mb-5">
        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wide">{level}</span>
      </div>
      <h3 className="text-xl font-extrabold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-5 leading-relaxed">{subtitle}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">Core Subjects</p>
          <ul className="space-y-2">
            {subjects.map((s) => (
              <li key={s} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />{s}
              </li>
            ))}
          </ul>
        </div>
        {enrichment && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">{enrichment.label}</p>
            <ul className="space-y-2">
              {enrichment.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 mt-1.5" />{item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Academics() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <HeroSection
        title="Academics"
        text="Our comprehensive academic programmes are designed to foster critical thinking, creativity, and a lifelong love for learning — from primary school through secondary level."
        image="https://picsum.photos/seed/academics-hero/1600/600"
      />

      {/* Curriculum overview */}
      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-16 space-y-8">
        <div className="text-center mb-10">
          <p className="text-green-600 text-xs font-semibold uppercase tracking-widest mb-2">Curriculum</p>
          <h2 className="text-3xl font-extrabold text-gray-900">Our Academic Programmes</h2>
          <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">Two distinct programmes tailored to developmental stages — both underpinned by excellence and innovation.</p>
        </div>

        <CurriculumSection
          level="Primary"
          title="Primary School Curriculum"
          subtitle="A strong foundation for academic success, nurturing curiosity, creativity, and a love for learning through hands-on experiences and character development."
          subjects={PRIMARY_SUBJECTS}
          enrichment={{ label: "Enrichment Programmes", items: ENRICHMENT }}
        />

        <CurriculumSection
          level="Secondary"
          title="Secondary School Curriculum"
          subtitle="A rigorous academic programme that prepares students for higher education and future careers through inquiry-based learning and real-world application."
          subjects={SECONDARY_SUBJECTS}
          enrichment={{ label: "College & Career Preparation", items: COLLEGE_PREP }}
        />
      </div>

      {/* Resources */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-green-600 text-xs font-semibold uppercase tracking-widest mb-3">Resources</p>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Academic Resources</h2>
              <p className="text-gray-500 text-sm mb-5 leading-relaxed">WiSchool provides every student with access to a wealth of modern learning resources to support their academic journey.</p>
              <ul className="space-y-3 mb-6">
                {["Digital library with 10,000+ e-books and journals", "State-of-the-art science and computer labs", "Online learning management system (LMS)", "Dedicated teacher support hours and tutoring sessions"].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="w-5 h-5 rounded-full bg-green-100 border border-green-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-green-600" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-colors">
                Enquire Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[["10,000+", "Library Resources"], ["5", "Specialised Labs"], ["30+", "Subjects Offered"], ["99%", "Student Satisfaction"]].map(([val, label]) => (
                <div key={label} className="bg-green-50 border border-green-100 rounded-2xl p-5 text-center">
                  <p className="text-2xl font-extrabold text-green-700">{val}</p>
                  <p className="text-xs text-green-600 mt-1 font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Extracurricular */}
      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-16">
        <div className="text-center mb-10">
          <p className="text-green-600 text-xs font-semibold uppercase tracking-widest mb-2">Beyond the Classroom</p>
          <h2 className="text-2xl font-extrabold text-gray-900">Extracurricular Activities</h2>
          <p className="text-gray-500 text-sm mt-2 max-w-sm mx-auto">Explore your passions and develop new skills through our wide range of co-curricular programmes.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {["Debate Club", "Science Club", "Drama Society", "Football Team", "Coding Club", "Chess Club", "Basketball Team", "Music Ensemble", "Art Club", "Eco Warriors"].map((club) => (
            <div key={club} className="bg-white border border-gray-100 rounded-xl px-4 py-3 text-center text-sm font-medium text-gray-700 shadow-sm hover:border-green-300 hover:text-green-700 transition-colors">
              {club}
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-green-600 py-16">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-extrabold text-white">What Students & Parents Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map(({ text, name, role }) => (
              <div key={name} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <p className="text-white/90 text-sm italic leading-relaxed mb-4">"{text}"</p>
                <p className="text-white font-semibold text-sm">{name}</p>
                <p className="text-white/60 text-xs">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}