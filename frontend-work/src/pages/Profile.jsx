import React from 'react';
import { Briefcase, MapPin, Building, Users, Mail, Plus, UserRoundCog } from 'lucide-react';

export default function Profile() {
  return (
              // make the banner into a component later
     <div className='min-h-screen w-full mt-15 justify-center bg-[#fafafa] shadow-2xl'>
      <div className='h-48 w-full bg-cover bg-center shadow-lg' style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517089152318-42ec560349c0?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
      </div>

      <div className='max-w-6xl mx-auto px-8 text-black'>
      <div className="grid grid-cols-12 gap-12">
          
          {/* 2. Sidebar column */}
          <div className="col-span-12 md:col-span-4 lg:col-span-3 -mt-16">
            <div className="flex flex-col">
              {/* Profile image */}
              <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-slate-200 mb-4 shadow-sm">
                <img src="https://media.tenor.com/kLddcBbInzwAAAAe/serious-dog.png" alt="Sam Lee" className="w-full h-full object-cover" />
              </div>

              <h1 className="text-2xl font-semibold mb-6">Cool Guy</h1>
              
              <button className="w-full py-2 px-2 bg-gray-200 hover:bg-blue-200 text-slate-700 font-medium rounded transition-colors mb-8">
              <div className="flex items-center gap-3"><UserRoundCog size={18} /> <span>Manage Profile</span></div>
              </button>

              {/* Sidebar info sections */}
              <div className="space-y-6 text-sm text-slate-600">
                <section>
                  <h2 className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-3">About</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3"><Briefcase size={18} /> <span>Your job title</span></div>
                    <div className="flex items-center gap-3"><Users size={18} /> <span>Your skills</span></div>
                    <div className="flex items-center gap-3"><MapPin size={18} /> <span>Your location</span></div>
                  </div>
                </section>

                <section>
                  <h2 className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-3">Contact</h2>
                  <div className="flex items-center gap-3"><Mail size={18} /> <span className="text-blue-600">coolguy@gmail.com</span></div>
                </section>

                <section>
                  <h2 className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-3">Refrences</h2>
                  <button className="flex items-center gap-3 text-blue-600 hover:underline">
                    <Plus size={18} /> <span>Add</span>
                  </button>
                </section>

                <section>
                  <h2 className='text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-3'>Languages</h2>
                  <button className="flex items-center gap-3 text-blue-600 hover:underline">
                    <Plus size={18} /> <span>Add</span>
                  </button>
                </section>
              </div>
            </div>
          </div>

          {/* 3. Main content column */}
          <div className="col-span-12 md:col-span-8 lg:col-span-9 py-8">
            
            {/* What youve worked on */}
            <section className="mb-8">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h2 className="text-lg font-medium">Worked on</h2>
                  <p className="text-xs text-slate-500">Others will only see what they can access.</p>
                </div>
                <button className="text-sm text-blue-600 font-medium hover:underline">View all</button>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                {[
                  "Previous Work",
                  "Previous Work",
                  "Previous Work",
                  "Previous Work",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded flex items-center justify-center mr-4 font-bold text-xs">≡</div>
                    <div>
                      <div className="text-sm font-medium text-slate-800">{item}</div>
                      <div className="text-[11px] text-slate-500">From dd/mm/yy - dd/mm/yy</div>
                    </div>
                  </div>
                ))}
                <button className="w-full py-3 text-xs text-slate-600 font-medium hover:bg-slate-50 border-t border-slate-100">
                  Show more
                </button>
              </div>
            </section>

            {/* Organisations youve worked for */}
            <section className="mb-8">
              <h2 className="text-lg font-medium mb-4">Places you've worked at</h2>
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-blue-500 text-xs">PEAB</span>
                </div>
                <div className="flex items-center gap-3 bg-white border border-slate-200 p-3 rounded shadow-sm max-w-sm">
                   <div className="w-8 h-8 bg-teal-600 rounded flex items-center justify-center">🏢</div>
                   <span className="font-semibold text-sm">Apartments</span>
                </div>
              </div>
            </section>

          </div>
        </div>

      </div>

    </div>
  )
}

