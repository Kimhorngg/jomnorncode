import React, { useState, useEffect } from "react";
import { Facebook, Send, Github } from "lucide-react";
import {
  Search,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Users as UsersIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import emailjs from "@emailjs/browser";

import SectionTitle from "../components/navbar/layout/SectionTitle.jsx";
import FeatureCard from "../components/navbar/card/FeatureCard.jsx";
import LeaderCard from "../components/navbar/card/LeaderCard.jsx";
import MemberCard from "../components/navbar/card/MemberCard.jsx";
import SignUp from "./SignUp";
import Login from "./LogIn";

import { leaders, members, features } from "../data/aboutData.js";
import aboutHeroImage from "../assets/aboutpage.png";
import learningImage from "../assets/image copy 5.png";
import teamLogo from "../assets/jomnorncode_logo.png";

// EmailJS Configuration
// Sign up at https://www.emailjs.com/
const EMAILJS_SERVICE_ID = "service_jomnorncode"; // Replace with your service ID
const EMAILJS_TEMPLATE_ID = "template_contact"; // Replace with your template ID
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY_HERE"; // Replace with your public key

export default function About() {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);

  // Initialize EmailJS
  useEffect(() => {
    if (EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY_HERE") {
      emailjs.init(EMAILJS_PUBLIC_KEY);
    }
  }, []);

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();

    if (!contactForm.name.trim()) {
      toast.error("សូមបំពេញឈ្មោះរបស់អ្នក");
      return;
    }

    if (!contactForm.email.trim() || !contactForm.email.includes("@")) {
      toast.error("សូមបំពេញអ៊ីមែលដែលមានសុvalidity");
      return;
    }

    if (!contactForm.message.trim()) {
      toast.error("សូមបំពេញសារ");
      return;
    }

    setIsSending(true);

    try {
      // Send email using EmailJS
      if (EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY_HERE") {
        throw new Error("EmailJS not configured");
      }

      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: "jomnorncode@gmail.com",
          from_name: contactForm.name,
          from_email: contactForm.email,
          message: contactForm.message,
          reply_to: contactForm.email,
        },
        EMAILJS_PUBLIC_KEY,
      );

      toast.success("សារបានផ្ញើដោយជោគជ័យ! សូមអរគុណ");
      setContactForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Email error:", error);
      // Fallback: Open mailto
      const mailtoLink = `mailto:jomnorncode@gmail.com?subject=ការទាក់ទងមកលេខយោង ពី ${encodeURIComponent(
        contactForm.name,
      )}&body=${encodeURIComponent(
        `ឈ្មោះ: ${contactForm.name}\nអ៊ីមែល: ${contactForm.email}\n\nសារ:\n${contactForm.message}`,
      )}`;
      window.location.href = mailtoLink;
      toast.success(
        "សូមផ្ញើអ៊ីមែលពីកម្មវិធីអ៊ីមែលរបស់អ្នក (ឬកំណត់អ្នកលេង EmailJS)",
      );
      setContactForm({ name: "", email: "", message: "" });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <div className="bg-[#fcfcfc] dark:bg-[#0f172a]">
        {/* HERO */}
        <header className="relative min-h-[460px] overflow-hidden pb-14 pt-24 md:min-h-[540px] md:py-16">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${aboutHeroImage})` }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(17,45,81,0.70)_0%,rgba(47,96,169,0.40)_42%,rgba(17,45,81,0.66)_100%)]" />
          <div className="absolute inset-0 backdrop-blur-[1.5px]" />

          <div className="relative mx-auto flex min-h-[460px] max-w-360 items-start px-6 pt-4 lg:px-12 md:min-h-[540px] md:items-center md:pt-0">
            <div className="mx-auto max-w-3xl text-center" data-aos="fade-up">
              <h1 className="text-2xl font-[Battambang] leading-tight text-white md:text-4xl font-semibold">
                ត្រៀមខ្លួនរួចជាស្រេចដើម្បីចាប់ផ្ដើមជាមួយយើង?
              </h1>
              <p className="mx-auto mt-3 max-w-2xl text-base leading-7 font-[Battambang] text-white md:text-lg font-semibold">
                ចូលរួមជាមួយសិស្សជាង ១០០០
                នាក់ផ្សេងទៀតក្នុងការកសាងអនាគតបច្ចេកវិទ្យារបស់អ្នក។
              </p>

              <div className="mx-auto mt-6 flex max-w-2xl items-center justify-center">
                <button
                  type="button"
                  onClick={() => setIsSignUpOpen(true)}
                  className="w-full rounded-xl border border-white/30 bg-white/88 py-3 text-center text-sm font-[Battambang] font-semibold text-[#f39c0f] shadow-lg backdrop-blur-sm transition hover:bg-white"
                >
                  ចុះឈ្មោះឥឡូវនេះ
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* ABOUT SECTION */}
        <section className="mx-auto max-w-420 px-6 lg:px-12 py-12 md:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div data-aos="fade-up">
              <hr className="border-gray-300 my-5 w-full max-w-[320px]" />
              <div className="flex items-center gap-4">
                {/* Vertical Line */}
                <div className="w-1 h-10 bg-[#f49d0d]"></div>
                {/* Title */}
                <h1 className="text-3xl font-[Battambang] font-semibold">
                  <span className="text-[#112d51] sm:text-xl md:text-2xl lg:text-3xl">
                    អំពី
                  </span>{" "}
                  <span className="text-[#f49d0d] sm:text-xl md:text-2xl lg:text-3xl">
                    ដំណាក់កាល
                  </span>
                </h1>
              </div>

              <p className=" md:text-lg text-xl font-[Battambang] text-slate-500 mt-4 ">
                <span className="text-base sm:text-sm md:text-lg lg:text-lg">
                  ជួយលើកទឺកចិត្តនិងជួយឲ្យនិស្សិតខ្មែរបង្កើតសមត្ថភាពក្នុងការសរសេរកូដ
                  និងកសាងអាជីពនៅក្នុងវិស័យបច្ចេកវិទ្យា
                </span>
              </p>

              <hr className="border-gray-300 my-5 w-full max-w-[320px]" />

              <h2 className="md:text-3xl text-2xl font-[Battambang] dark:text-white text-[#112d51] leading-tight mt-15 font-semibold">
                <span className="sm:text-xl md:text-2xl lg:text-3xl">
                  បេសកកម្មរបស់ពួកយើង
                </span>
              </h2>
              <p className="mt-4 md:text-lg text-xl font-[Battambang] leading-8 text-slate-500 ">
                <span className="text-base sm:text-sm md:text-lg lg:text-lg">
                  ជំនាន់កូដ
                  មានបេសកកម្មក្នងការបំបាត់ឧបសគ្គនានាក្នុងការវិស័យអប់រំបច្ចេកវិទ្យានៅកម្ពុជា។
                  យើងជឿជាក់ថា
                  និស្សិតគ្រប់រូបគួរតែមានឱកាសទទួលបានការអប់រំជំនាញសរសេរកូដដែលមានគុណភាពជាភាសាជាតិរបស់ពួកគេ។
                </span>
              </p>
              <p className="mt-4 text-lg font-[Battambang] leading-8 text-[#62748d]">
                <span className="text-base sm:text-sm md:text-lg lg:text-lg">
                  ដោយផ្ដល់វគ្គសិក្សាឥតគិតថ្លៃ ដែលមានមាតិការពេញលេញជាភាសាខ្មែរ
                  យើងកំពុងផ្ដល់អំណាច ដល់អ្នកជំនាន់ក្រោយនៃអ្នកអភិវឌ្ឍន៍កម្មវិធី
                  និងអ្នកច្នៃប្រឌិតនៅកម្ពុជា។
                </span>
              </p>

              <button className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#395f99] px-4 py-2 text-base font-[Battambang] text-white shadow-sm">
                <span className="sm:text-sm md:text-base lg:text-lg">
                  ចូលរួមជាមួយពួកយើង
                </span>{" "}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div
              className="rounded-2xl border border-slate-200 dark:border-[#314057] bg-white dark:bg-[#1c293e] p-4 shadow-sm mt-8 lg:mt-0"
              data-aos="fade-left"
            >
              <div className="overflow-hidden rounded-xl bg-slate-100 dark:bg-[#0f172a]">
                <img
                  src={learningImage}
                  alt="learning"
                  className="h-56 w-full object-cover sm:h-64 md:h-72"
                />
              </div>
            </div>
          </div>

          {/* FEATURES */}
          <div className="mt-12 font-[Battambang] text-[#073170​]  text-center font-semibold">
            <div data-aos="fade-up">
              <SectionTitle
                title={
                  <span className="sm:text-xl md:text-2xl lg:text-3xl">
                    តម្លៃរបស់យើង
                  </span>
                }
              />
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2​  lg:grid-cols-4">
              {features.map((f, index) => (
                <div
                  key={f.title}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <FeatureCard item={f} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TEAM */}
        <section className="bg-[#fcfcfc] dark:bg-[#0f172a]">
          <div className="mx-auto mt-8 max-w-420 px-4 py-12 font-[Battambang] sm:px-6 md:py-16 lg:px-12">
            <SectionTitle
              title={
                <>
                  <span className="text-[#112d51] dark:text-white font-semibold">
                    គ្រូណែនាំដ៏
                  </span>
                  <span className="text-[#f49d0d] font-semibold">ល្អបំផុត</span>
                  <span className="text-[#112d51] dark:text-white font-semibold">
                    របស់យើង
                  </span>
                </>
              }
              subtitle="ជួបជាមួយគ្រូណែនាំជាគន្លឹះនៃការអប់រំដែលនៅពីក្រោយការលូតលាស់ជួយជំរុញការរីកចម្រើន និងការអភិវឌ្ឍរបស់យើង​"
              subtitleClassName="text-base md:text-lg leading-8"
            />

            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              {leaders.map((x, index) => (
                <div
                  key={x.name + x.role}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <LeaderCard item={x} />
                </div>
              ))}
            </div>

            <div className="mt-12">
              <div
                className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
                data-aos="fade-up"
              >
                <SectionTitle
                  title={
                    <>
                      <span className="text-[#073170] dark:text-white font-semibold">
                        ក្រុមការងារ
                      </span>
                      <span className="text-[#f49d0d] font-semibold">
                        ដ៏ល្អ
                      </span>
                      <span className="text-[#073170] dark:text-white font-semibold">
                        របស់យើង
                      </span>
                    </>
                  }
                  subtitle={
                    <>
                      ជួបជាមួយក្រុមការងារដែលនៅពីក្រោយភាពជោគជ័យ និងការ
                      <br />
                      អភិវឌ្ឍន៍មិនឈប់ឈររបស់យើង។"
                    </>
                  }
                  subtitleClassName="text-base md:text-lg leading-8"
                />
                {/* <a
                href="#"
                className="hidden text-sm font-semibold text-blue-700 hover:text-blue-800 md:inline"
              >
                មើលទាំងអស់
              </a> */}
              </div>

              {/* <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {members.map((m, idx) => (
                <MemberCard key={idx} item={m} />
              ))}
            </div> */}
              <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {members.slice(0, 4).map((m, idx) => (
                  <div key={idx} data-aos="fade-up" data-aos-delay={idx * 80}>
                    <MemberCard item={m} />
                  </div>
                ))}

                {/* CENTER LOGO */}
                <div
                  className="flex items-center justify-center rounded-2xl border border-slate-200 dark:border-[#314057] bg-white dark:bg-[#1c293e] p-10 shadow-sm"
                  data-aos="zoom-in"
                >
                  <div className="h-40 w-40 md:h-44 md:w-44 rounded-full border-4 border-slate-200 dark:border-[#314057] bg-slate-50 dark:bg-[#0f172a] flex items-center justify-center">
                    <img
                      src={teamLogo}
                      alt="Team Logo"
                      className="h-full w-full object-contain p-3"
                    />
                  </div>
                </div>
                {members.slice(4).map((m, idx) => (
                  <div
                    key={idx + 4}
                    data-aos="fade-up"
                    data-aos-delay={(idx + 4) * 80}
                  >
                    <MemberCard item={m} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="mx-auto max-w-420 px-6 lg:px-12 py-12 md:py-16 font-[Battambang]">
          <div className="rounded-3xl bg-white dark:bg-[#1c293e] p-6 shadow-sm ring-1 ring-slate-200 dark:ring-[#314057] md:p-10">
            <div data-aos="fade-up">
              <SectionTitle
                title={
                  <>
                    <span className="text-[#f49d0d] font-semibold">
                      ទាក់ទងមកយើងខ្ញុំ
                    </span>
                  </>
                }
                subtitle={
                  <>
                    <p className="dark:text-[#fcfcfc]">
                      មានសំណួរឬចង់និយាយសួរសុខទុក្ខបន្តិចមែនទេ?
                      <br />
                      យើងរីករាយណាស់ក្នុងការទទួលសារពីអ្នក!
                    </p>
                  </>
                }
                subtitleClassName="text-base md:text-lg leading-8"
              />
            </div>

            <div className="mt-8 grid gap-8 md:grid-cols-2 font-[Battambang]">
              {/* Form */}
              <form
                onSubmit={handleContactSubmit}
                className="rounded-2xl border border-slate-200 dark:border-[#314057] bg-slate-50 dark:bg-[#0f172a] p-5"
                data-aos="fade-up"
              >
                <label className="block text-base font-semibold text-slate-800 dark:text-white">
                  ឈ្មោះ
                </label>
                <div className="mt-2 flex items-center gap-2 rounded-lg border border-slate-200 dark:border-[#314057] bg-white dark:bg-[#1a202c] px-3 py-2">
                  <UsersIcon className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                  <input
                    name="name"
                    value={contactForm.name}
                    onChange={handleContactChange}
                    className="w-full text-base outline-none bg-transparent dark:text-white"
                    placeholder="ឈ្មោះរបស់អ្នក"
                  />
                </div>

                <label className="mt-4 block text-base font-semibold text-slate-800 dark:text-white">
                  អ៊ីមែល
                </label>
                <div className="mt-2 flex items-center gap-2 rounded-lg border border-slate-200 dark:border-[#314057] bg-white dark:bg-[#1a202c] px-3 py-2 ">
                  <Mail className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                  <input
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    className="w-full text-base outline-none bg-transparent dark:text-white"
                    placeholder="example@gmail.com"
                  />
                </div>

                <label className="mt-4 block text-base font-semibold text-slate-800 dark:text-white">
                  សាររបស់អ្នក
                </label>
                <textarea
                  name="message"
                  value={contactForm.message}
                  onChange={handleContactChange}
                  className="mt-2 h-32 w-full resize-none rounded-lg border border-slate-200 dark:border-[#314057] bg-white dark:bg-[#1a202c] px-3 py-2 text-base outline-none dark:text-white"
                  placeholder="តើខ្ញុំអាចជួយអ្នកអ្វីបានខ្លះ?"
                />

                <button
                  type="submit"
                  disabled={isSending}
                  className="mt-4 w-full rounded-lg bg-[#395f99] px-4 py-2 text-base text-white shadow-sm hover:bg-[#2d4876] disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {isSending ? "កំពុងផ្ញើ..." : "ផ្ញើសារ"}
                </button>
              </form>

              {/* Contact info */}
              <div className="" data-aos="fade-left">
                <p className="text-3xl  font-semibold text-[#0f2b4c] dark:text-[#f39c0f]">
                  ព័ត៌មានទំនាក់ទំនង
                </p>
                <p className="mt-2 text-base leading-8 text-[#0f2b4c] dark:text-[#fcfcfc]">
                  អ្នកក៏អាចទាក់ទងមកខ្ញុំតាមរយៈអ៊ីមែល
                  ឬស្វែងរកខ្ញុំនៅលើបណ្តាញសង្គមផងដែរ
                </p>

                <div className="mt-5 space-y-3 text-base text-slate-700 ">
                  {/* <div className="flex items-start gap-2">
                  <Mail className="mt-0.5 h-4 w-4 text-slate-500" />
                  
                </div> */}
                  <div>
                    <p className="font-semibold text-[#0f2b4c] dark:text-[#fcfcfc]">
                      អាសយដ្ឋានអ៊ីមែល:{" "}
                      <span className="text-slate-500">
                        jomnorncode@gmail.com
                      </span>
                    </p>
                  </div>
                  {/* <div className="flex items-start gap-2">
                  <Phone className="mt-0.5 h-4 w-4 text-slate-500" />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-slate-600">(+855) 00 000 000</p>
                  </div>
                </div> */}
                  {/* <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-slate-500" />
                </div> */}
                  <div>
                    <p className="font-semibold text-[#0f2b4c] dark:text-[#fcfcfc]">
                      ទីតាំង:{" "}
                      <span className="text-slate-500">
                        ខណ្ឌទួលគោក, ភ្នំពេញ, កម្ពុជា
                      </span>
                    </p>
                    <p className="mt-4 font-semibold dark:text-[#fcfcfc]">
                      តាមដានខ្ញុំ
                    </p>
                    <hr className="mt-4 bg-gray-400" />
                  </div>
                  <div className="flex items-center gap-4 text-slate-700 dark:text-[#fcfcfc]">
                    <Facebook className="h-5 w-5 cursor-pointer hover:text-blue-600" />
                    <Send className="h-5 w-5 cursor-pointer hover:text-blue-500" />
                    <Github className="h-5 w-5 cursor-pointer hover:text-black" />
                  </div>
                </div>

                {/* <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">
                  ម៉ោងធ្វើការ
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  ច័ន្ទ–សុក្រ: 08:00–17:00
                </p>
                <p className="text-sm text-slate-600">សៅរ៍–អាទិត្យ: បិទ</p>
              </div> */}
              </div>
            </div>
          </div>
        </section>
      </div>

      <SignUp
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        openLogin={() => {
          setIsSignUpOpen(false);
          setIsLoginOpen(true);
        }}
      />

      <Login
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        openSignUp={() => {
          setIsLoginOpen(false);
          setIsSignUpOpen(true);
        }}
      />
    </>
  );
}
