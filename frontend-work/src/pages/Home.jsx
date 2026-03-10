import Header from "../components/Header.jsx";
import SelectOption from "../components/SelectOption.jsx";
import React from "react";
import PainterGubbe from "../components/PainterGubbe.jsx";
import { FileText, Handshake, Star, Shield, Users, Zap, Mail, Phone, MapPin } from "lucide-react";

function Home() {
  return (
    <>
      {/* HERO – full screen */}
      <div className="min-h-screen flex items-center">
        <div className="w-full max-w-6xl mx-auto px-2">
          <div className="grid grid-cols-2 gap-16 items-start">

            <div className="flex flex-col">
              <Header />

              <h2 className="mt-6 text-white text-2xl font-semibold">
                Matching help to your solutions
              </h2>

              <div className="-mt-12">
                <PainterGubbe width="250" height="250" />
              </div>
            </div>

            <div className="flex flex-col mt-20">
              <SelectOption />
            </div>

          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="py-24 text-white">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-center mb-4">
            How It Works
          </h2>
          <p className="text-slate-400 text-center max-w-xl mx-auto mb-16">
            From posting a job to getting it done — in three simple steps.
          </p>

          <div className="grid grid-cols-3 gap-8">
            {[
              {
                step: "1",
                icon: FileText,
                title: "Post Your Job",
                desc: "Describe what you need, set a budget, and publish your ad for companies to see.",
              },
              {
                step: "2",
                icon: Handshake,
                title: "Pick an Offer",
                desc: "Receive offers from qualified companies, chat with them, and select the best fit.",
              },
              {
                step: "3",
                icon: Star,
                title: "Get It Done",
                desc: "Sign the contract, track the work, and leave a review when the job is completed.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative bg-gray-900/50 border border-slate-700/50 rounded-2xl p-8 text-center hover:border-blue-500/40 transition-all duration-300 group"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  {item.step}
                </div>
                <item.icon
                  size={36}
                  className="mx-auto mt-4 mb-4 text-blue-400 group-hover:text-blue-300 transition-colors"
                />
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ABOUT */}
      <div
        id="about"
        className="py-24 text-white"
      >
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-2 gap-16 items-center">

            {/* Left — text */}
            <div>
              <p className="text-blue-400 font-semibold text-sm uppercase tracking-wider mb-3">
                About WorkFlow
              </p>
              <h2 className="text-4xl font-bold mb-6 leading-tight">
                Connecting the right people
                <br />
                <span className="text-blue-400">to the right jobs</span>
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-6">
                WorkFlow is a platform that bridges the gap between customers who
                need help and skilled companies ready to deliver. Whether it's a
                home renovation, moving help, or professional services — we make
                matching seamless and secure.
              </p>
              <p className="text-slate-400 leading-relaxed">
                Our transparent process ensures fair pricing, open communication,
                and verified reviews — so both parties can work with confidence.
              </p>
            </div>

            {/* Right — feature cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: Shield,
                  title: "Secure Contracts",
                  desc: "Digital contracts with dual signing for peace of mind.",
                },
                {
                  icon: Users,
                  title: "Verified Reviews",
                  desc: "Real reviews from real jobs — no fakes, no fluff.",
                },
                {
                  icon: Zap,
                  title: "Fast Matching",
                  desc: "Post a job and start receiving offers within minutes.",
                },
                {
                  icon: Handshake,
                  title: "Fair Negotiation",
                  desc: "Chat directly with companies before committing.",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="bg-gray-900/60 border border-slate-700/50 rounded-xl p-5 hover:border-blue-500/30 transition-all duration-300"
                >
                  <feature.icon size={24} className="text-blue-400 mb-3" />
                  <h4 className="text-white font-semibold text-sm mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-gray-950/80">
        <div className="max-w-6xl mx-auto px-8 py-16">
          <div className="grid grid-cols-3 gap-12">

            {/* Brand */}
            <div>
              <h3 className="text-white font-bold text-xl mb-4">WorkFlow</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Bridging the gap between customers and companies — making it easy
                to find, hire, and collaborate with confidence.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {[
                  { label: "Browse Ads", href: "/results" },
                  { label: "Post a Job", href: "/create" },
                  { label: "Login", href: "/login" },
                  { label: "Create Account", href: "/register" },
                ].map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-slate-400 text-sm hover:text-blue-400 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                Contact Us
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-slate-400 text-sm">
                  <Mail size={16} className="text-blue-400 shrink-0" />
                  <a href="mailto:support@workflow.se" className="hover:text-blue-400 transition-colors">
                    support@workflow.se
                  </a>
                </li>
                <li className="flex items-center gap-3 text-slate-400 text-sm">
                  <Phone size={16} className="text-blue-400 shrink-0" />
                  <span>+46 70 123 45 67</span>
                </li>
                <li className="flex items-center gap-3 text-slate-400 text-sm">
                  <MapPin size={16} className="text-blue-400 shrink-0" />
                  <span>Stockholm, Sweden</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom bar */}
          <div className="border-t border-slate-800 mt-12 pt-8 flex items-center justify-between">
            <p className="text-slate-500 text-xs">
              © {new Date().getFullYear()} WorkFlow. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-500 text-xs hover:text-slate-300 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-500 text-xs hover:text-slate-300 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Home;