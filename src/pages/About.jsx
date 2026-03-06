import React from "react";
import { Facebook, Send, Github } from "lucide-react";
import {
  Search,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Users as UsersIcon,
} from "lucide-react";

import SectionTitle from "../components/navbar/layout/SectionTitle.jsx";
import FeatureCard from "../components/navbar/card/FeatureCard.jsx";
import LeaderCard from "../components/navbar/card/LeaderCard.jsx";
import MemberCard from "../components/navbar/card/MemberCard.jsx";


import { leaders, members, features } from "../data/aboutData.js";

export default function About() {
  return (
    <div className=" bg-white ">
      {/* HERO */}
      <header className="bg-[#2f60a9] py-12">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-2xl font-[Battambang] leading-tight text-white md:text-4xl font-semibold">
              ត្រៀមខ្លួនរួចជាស្រេចដើម្បីចាប់ផ្ដើមជាមួយយើង?
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 font-[Battambang] text-white md:text-base font-semibold">
              ចូលរួមជាមួយសិស្សជាង ១០០០
              នាក់ផ្សេងទៀតក្នុងការកសាងអនាគតបច្ចេកវិទ្យារបស់អ្នក។
            </p>

            <div className="mx-auto mt-6 flex max-w-2xl items-center justify-center">
              <input
                className="w-full rounded-xl bg-white text-amber-500 text-center text-sm py-3 font-[Battambang] outline-none font-semibold"
                placeholder="ចុះឈ្មោះឥឡូវនេះ"
              />
            </div>
          </div>
        </div>
      </header>

      {/* ABOUT SECTION */}
      <section className="mx-auto max-w-[1490px] px-4 py-12 md:py-16">
        <div className="grid items-center gap-8 md:grid-cols-2 ">
          <div>
            <hr className="border-gray-300 my-5 w-290" />
            <div className="flex items-center gap-4">
              {/* Vertical Line */}
              <div className="w-1 h-10 bg-orange-300"></div>
              {/* Title */}              
              <h1 className="text-2xl max-w-[1490px] font-[Battambang] font-semibold">
                <span className="text-slate-800">អំពី</span>{" "}
                <span className="text-orange-300">ដំណាក់កាល</span>
              </h1>
            </div>

            <p className="text-sm font-[Battambang] text-slate-500 mt-4 ">
              ជួយលើកទឺកចិត្តនិងជួយឲ្យនិស្សិតខ្មែរបង្កើតសមត្ថភាពក្នុងការសរសេរកូដ
              និងកសាងអាជីពនៅក្នុងវិស័យបច្ចេកវិទ្យា
            </p>

            <hr className="border-gray-300 my-5 w-290" />

            <h2 className="text-2xl font-[Battambang] text-[#073170] leading-tight mt-15 font-semibold">
              បេសកកម្មរបស់ពួកយើង
            </h2>
            <p className="mt-4 text-sm font-[Battambang] leading-7 text-slate-500 ">
              ជំនាន់កូដ
              មានបេសកកម្មក្នងការបំបាត់ឧបសគ្គនានាក្នុងការវិស័យអប់រំបច្ចេកវិទ្យានៅកម្ពុជា។
              យើងជឿជាក់ថា
              និស្សិតគ្រប់រូបគួរតែមានឱកាសទទួលបានការអប់រំជំនាញសរសេរកូដដែលមានគុណភាពជាភាសាជាតិរបស់ពួកគេ។
            </p>
            <p className="mt-4 text-sm font-[Battambang] leading-7 text-[#999da0]">
              ដោយផ្ដល់វគ្គសិក្សាឥតគិតថ្លៃ ដែលមានមាតិការពេញលេញជាភាសាខ្មែរ
              យើងកំពុងផ្ដល់អំណាច ដល់អ្នកជំនាន់ក្រោយនៃអ្នកអភិវឌ្ឍន៍កម្មវិធី
              និងអ្នកច្នៃប្រឌិតនៅកម្ពុជា។
            </p>

            <button className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#395f99] px-4 py-2 text-sm font-[Battambang] text-white shadow-sm">
              ចូលរួមជាមួយពួកយើង <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm mt-40">
            <div className="overflow-hidden rounded-xl bg-slate-100">
              <img
                src="src/assets/Learning.png"
                alt="learning"
                className="h-56 w-full object-cover md:h-64"
              />
            </div>
          </div>
        </div>

        {/* FEATURES */}
        <div className="mt-12 font-[Battambang] text-[#073170] text-center font-semibold mt-10">
          <SectionTitle title="តម្លៃរបស់យើង" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <FeatureCard key={f.title} item={f} />
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1490px] px-4 py-12 mt-8 md:py-16 font-[Battambang]">
          <SectionTitle
            title={
              <>
                <span className="text-[#073170] font-semibold">
                  គ្រូណែនាំដ៏
                </span>
                <span className="text-orange-300 font-semibold">ល្អបំផុត</span>
                <span className="text-[#073170] font-semibold">របស់យើង</span>
              </>
            }
            subtitle="ជួបជាមួយគ្រូណែនាំជាគន្លឹះនៃការអប់រំដែលនៅពីក្រោយការលូតលាស់ជួយជំរុញការរីកចម្រើន និងការអភិវឌ្ឍរបស់យើង​"
          />

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {leaders.map((x) => (
              <LeaderCard key={x.name + x.role} item={x} />
            ))}
          </div>

          <div className="mt-12">
            <div className="flex items-end justify-between gap-4">
              <SectionTitle
                title={
                  <>
                    <span className="text-[#073170] font-semibold">
                      ក្រុមការងារ
                    </span>
                    <span className="text-orange-300 font-semibold">ដ៏ល្អ</span>
                    <span className="text-[#073170] font-semibold">
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
                <MemberCard key={idx} item={m} />
              ))}

              {/* CENTER LOGO */}
              <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
                <div className="h-40 w-40 md:h-44 md:w-44 rounded-full border-4 border-slate-200 bg-slate-50 flex items-center justify-center">
                  <img
                    src="src/assets/jomnorncode_logo (2).png"
                    alt="Team Logo"
                    className="h-full w-full object-contain p-3"
                  />
                </div>
              </div>
              {members.slice(4).map((m, idx) => (
                <MemberCard key={idx + 4} item={m} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="mx-auto max-w-[1490px] px-4 py-12 md:py-16 font-[Battambang]">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-10">
          <SectionTitle
            title={
              <>
                <span className="text-orange-300 font-semibold">
                  ទាក់ទងមកយើងខ្ញុំ
                </span>
              </>
            }
            subtitle={
              <>
                មានសំណួរឬចង់និយាយសួរសុខទុក្ខបន្តិចមែនទេ?
                <br />
                យើងរីករាយណាស់ក្នុងការទទួលសារពីអ្នក!
              </>
            }
          />

          <div className="mt-8 grid gap-8 md:grid-cols-2 font-[Battambang]">
            {/* Form */}
            <form className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <label className="block text-sm font-semibold text-slate-800">
                ឈ្មោះ
              </label>
              <div className="mt-2 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                <UsersIcon className="h-4 w-4 text-slate-400" />
                <input
                  className="w-full text-sm outline-none"
                  placeholder="ឈ្មោះរបស់អ្នក"
                />
              </div>

              <label className="mt-4 block text-sm font-semibold text-slate-800">
                អ៊ីមែល
              </label>
              <div className="mt-2 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 ">
                <Mail className="h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  className="w-full text-sm outline-none"
                  placeholder="example@gmail.com"
                />
              </div>

              <label className="mt-4 block text-sm font-semibold text-slate-800">
                សាររបស់អ្នក
              </label>
              <textarea
                className="mt-2 h-32 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                placeholder="តើខ្ញុំអាចជួយអ្នកអ្វីបានខ្លះ?"
              />

              <button
                type="button"
                className="mt-4 w-full rounded-lg bg-[#395f99] px-4 py-2 text-sm text-white shadow-sm hover:bg-[#395f99]"
              >
                ផ្ញើសារ
              </button>
            </form>

            {/* Contact info */}
            <div className="">
              <p className="text-lg font-semibold text-slate-800">
                ព័ត៌មានទំនាក់ទំនង
              </p>
              <p className="mt-2 text-xs leading-6 text-slate-600">
                អ្នកក៏អាចទាក់ទងមកខ្ញុំតាមរយៈអ៊ីមែល
                ឬស្វែងរកខ្ញុំនៅលើបណ្តាញសង្គមផងដែរ
              </p>

              <div className="mt-5 space-y-3 text-xs text-slate-700 ">
                {/* <div className="flex items-start gap-2">
                  <Mail className="mt-0.5 h-4 w-4 text-slate-500" />
                  
                </div> */}
                <div>
                  <p className="font-semibold">
                    អាសយដ្ឋានអ៊ីមែល:{" "}
                    <span className="text-blue-300">
                      yourloveoyou@gmail.com
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
                  <p className="font-semibold">
                    ទីតាំង:{" "}
                    <span className="text-slate-400">
                      ខណ្ឌទួលគោក, ភ្នំពេញ, កម្ពុជា
                    </span>
                  </p>
                  <p className="mt-4 font-semibold">តាមដានខ្ញុំ</p>
                  <hr className="mt-4 bg-gray-400" />
                </div>
                <div className="flex items-center gap-4 text-slate-700">
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
  );
}
