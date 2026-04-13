"use client"

import React from "react"
import { Star, BookOpen, GraduationCap, Users, Lightbulb , ArrowRight} from "lucide-react"
import { Link } from "react-router-dom";

const tutorData = [
  { name: "John Doe", subject: "Mathematics", image: "/placeholder.svg?height=280&width=220" },
  { name: "Julian Jameson", subject: "Science", image: "/placeholder.svg?height=280&width=220" },
  { name: "Sarah Chen", subject: "Literature", image: "/placeholder.svg?height=280&width=220" },
  { name: "Michael Ross", subject: "History", image: "/placeholder.svg?height=280&width=220" },
]

const testimonialData = [
  {
    name: "Regina Miles",
    role: "Parent",
    image: "/placeholder.svg?height=48&width=48",
    text: "WiSchool has been a game-changer for our child's education. The personalized attention and supportive environment have made all the difference.",
    rating: 5,
  },
  {
    name: "David Thompson",
    role: "Student",
    image: "/placeholder.svg?height=48&width=48",
    text: "Choosing WiSchool was the best decision we made for our family. Our child is thriving academically and socially, thanks to the dedicated staff.",
    rating: 5,
  },
  {
    name: "Emily Carter",
    role: "Parent",
    image: "/placeholder.svg?height=48&width=48",
    text: "At WiSchool, every student truly matters. The caring community and focus on individual needs have exceeded our expectations.",
    rating: 4,
  },
]

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${star <= rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`}
        />
      ))}
    </div>
  )
}

function SectionDivider() {
  return <div className="h-1 w-16 rounded-full bg-emerald-600" />
}

export default function Academics() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative px-6 py-20 text-white md:px-12 lg:py-28"
       style={{
          background: "linear-gradient(135deg, #0d3321 0%, #0a4020 50%, #061a10 100%)",
        }}>
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
            <div className="max-w-2xl text-center lg:text-left">
              <p className="mb-3 text-sm font-medium uppercase tracking-widest text-emerald-300">Excellence in Education</p>
              <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">Academics</h1>
              <p className="text-lg leading-relaxed text-emerald-100/90">
                At WiSchool, we&apos;re committed to providing a dynamic and enriching academic experience that prepares
                students for success in an ever-changing world. Our comprehensive academic programs are designed to
                foster critical thinking, creativity, and a lifelong love for learning.
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="flex h-64 w-64 items-center justify-center rounded-full bg-emerald-700/50">
                <GraduationCap className="h-32 w-32 text-emerald-200" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Primary School Curriculum */}
      <section className="px-6 py-16 md:px-12 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
            <div className="space-y-6 lg:w-1/2">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700">
                <BookOpen className="h-4 w-4" />
                Foundation Years
              </div>
              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Primary School Curriculum</h2>
              <SectionDivider />
              <p className="leading-relaxed text-gray-600">
                At WiSchool, our primary school curriculum is designed to provide a strong foundation for academic
                success while nurturing students&apos; curiosity, creativity, and love for learning.
              </p>

              <div className="space-y-5">
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-emerald-700">Core Subjects</h3>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {["Language Arts", "Mathematics", "Science", "Social Studies", "Art", "Physical Education"].map(
                      (subject) => (
                        <span key={subject} className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">
                          {subject}
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-emerald-700">Enrichment Programs</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex gap-3">
                      <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500" />
                      <span>
                        <strong className="text-gray-900">STEM Education:</strong> Hands-on learning integrating
                        science, technology, engineering, and mathematics.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500" />
                      <span>
                        <strong className="text-gray-900">Environmental Education:</strong> Outdoor exploration and
                        conservation projects.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500" />
                      <span>
                        <strong className="text-gray-900">Character Education:</strong> Building values like respect,
                        responsibility, and empathy.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2">
              <div className="relative">
                <div className="absolute -left-4 -top-4 h-full w-full rounded-2xl bg-emerald-100" />
                <img
                  src="/placeholder.svg?height=400&width=500"
                  alt="Primary Education"
                  className="relative rounded-2xl object-cover shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Secondary School Curriculum */}
      <section className="bg-gray-50 px-6 py-16 md:px-12 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center gap-12 lg:flex-row-reverse lg:gap-16">
            <div className="space-y-6 lg:w-1/2">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700">
                <GraduationCap className="h-4 w-4" />
                Advanced Learning
              </div>
              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Secondary School Curriculum</h2>
              <SectionDivider />
              <p className="leading-relaxed text-gray-600">
                Our secondary school program offers a rigorous academic curriculum that prepares students for higher
                education and future careers through critical thinking and inquiry-based learning.
              </p>

              <div className="space-y-5">
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-emerald-700">Core Subjects</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex gap-3">
                      <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500" />
                      English Language and Literature
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500" />
                      Advanced Mathematics
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500" />
                      Sciences: Biology, Chemistry, Physics
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500" />
                      Social Sciences & Foreign Languages
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-emerald-700">AP & Honors Courses</h3>
                  <p className="text-gray-600">
                    Opportunities for motivated students to pursue advanced coursework and earn college credit in
                    calculus, biology, chemistry, literature, and more.
                  </p>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-emerald-700">College & Career Prep</h3>
                  <p className="text-gray-600">
                    Comprehensive guidance through college applications, standardized testing, essay writing, and career
                    exploration programs.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2">
              <div className="relative">
                <div className="absolute -right-4 -top-4 h-full w-full rounded-2xl bg-emerald-100" />
                <img
                  src="/placeholder.svg?height=400&width=500"
                  alt="Secondary Education"
                  className="relative rounded-2xl object-cover shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Faculty Profiles */}
      <section className="px-6 py-16 md:px-12 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700">
              <Users className="h-4 w-4" />
              Our Team
            </div>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Faculty Profiles</h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Meet the dedicated educators who make WiSchool a vibrant and supportive learning community.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tutorData.map((tutor, index) => (
              <div
                key={index}
                className="group overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="aspect-[4/5] overflow-hidden bg-gray-100">
                  <img
                    src={tutor.image}
                    alt={tutor.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 text-center">
                  <h3 className="text-lg font-semibold text-gray-900">{tutor.name}</h3>
                  <p className="text-sm text-emerald-600">{tutor.subject}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Resources & Extracurricular */}
      <section className="bg-emerald-900 px-6 py-16 text-white md:px-12 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-800 px-4 py-1.5 text-sm font-medium text-emerald-200">
                <BookOpen className="h-4 w-4" />
                Learning Tools
              </div>
              <h2 className="text-3xl font-bold md:text-4xl">Academic Resources</h2>
              <p className="text-emerald-100/80">Access a wealth of resources to support student learning and success.</p>
              <ul className="space-y-3">
                {["Online Libraries", "Educational Websites", "Interactive Study Tools", "Research Databases"].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-700 text-emerald-200">
                        ✓
                      </span>
                      {item}
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-800 px-4 py-1.5 text-sm font-medium text-emerald-200">
                <Lightbulb className="h-4 w-4" />
                Beyond Classroom
              </div>
              <h2 className="text-3xl font-bold md:text-4xl">Extracurricular Activities</h2>
              <p className="text-emerald-100/80">Get involved and explore your interests with our wide range of activities.</p>
              <ul className="space-y-3">
                {["Student Clubs & Organizations", "Sports Teams & Athletics", "Arts & Music Programs", "Community Service"].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-700 text-emerald-200">
                        ✓
                      </span>
                      {item}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-16 md:px-12 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">What People Say</h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              See what our students and parents have to say about their experiences at WiSchool.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonialData.map((item, index) => (
              <div key={index} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <StarRating rating={item.rating} />
                <p className="mt-4 leading-relaxed text-gray-600">{item.text}</p>
                <div className="mt-6 flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-12 w-12 rounded-full bg-gray-100 object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-emerald-600">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-gray-50 px-6 py-16 md:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Ready to Join WiSchool?</h2>
          <p className="mb-8 text-lg text-gray-600">
            Take the first step towards an exceptional education for your child.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
                  to="/student-admission"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-500 transition-all shadow-lg shadow-green-900/40 text-sm"
                >
                  Apply Now <ArrowRight className="w-4 h-4" />
                </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
