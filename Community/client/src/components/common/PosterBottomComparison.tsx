import React from 'react';
import { CheckCircle2, PlusCircle, AlertCircle, Lightbulb, Bus } from 'lucide-react';

export const PosterBottomComparison: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-[1700px] mx-auto px-4 sm:px-6 py-8">
      
      {/* 1. Green Card: Existing Features in APSRTC */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-emerald-950 leading-tight">
              Existing Features in APSRTC <span className="text-emerald-700 text-xs font-semibold block sm:inline">(for regular buses)</span>
            </h3>
          </div>

          <ul className="mt-4 space-y-2 text-xs text-emerald-900/90 font-medium">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold shrink-0">✓</span>
              <span>Live bus tracking (GPS based)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold shrink-0">✓</span>
              <span>Expected arrival time (ETA)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold shrink-0">✓</span>
              <span>Search for nearby bus stops</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold shrink-0">✓</span>
              <span>Upcoming buses at a stop</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold shrink-0">✓</span>
              <span>Search services between two stops</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold shrink-0">✓</span>
              <span>Route information (basic)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold shrink-0">✓</span>
              <span>Bus schedules / time tables</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold shrink-0">✓</span>
              <span>Live tracking for city and non-reservation buses</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold shrink-0">✓</span>
              <span>Emergency reporting / grievance</span>
            </li>
          </ul>
        </div>

        <p className="text-[10px] text-emerald-700/80 italic pt-2 border-t border-emerald-200/60 font-medium">
          (From APSRTC LIVE TRACK & APSRTC official app)
        </p>
      </div>

      {/* 2. Blue Card: Features in Our Prototype */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-3xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <PlusCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-blue-950 leading-tight">
              Features in Our Prototype <span className="text-blue-700 text-xs font-semibold block sm:inline">(Already Available but Unified & Simplified)</span>
            </h3>
          </div>

          <ul className="mt-4 space-y-1.5 text-xs text-blue-950 font-medium">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold shrink-0">•</span>
              <span>One place to search A → B and see all regular buses</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold shrink-0">•</span>
              <span>Show all Ordinary / Metro / Palle Velugu buses</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold shrink-0">•</span>
              <span>Live count of buses on the route</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold shrink-0">•</span>
              <span>Live location of each bus on the route</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold shrink-0">•</span>
              <span>Complete stop list for each bus</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold shrink-0">•</span>
              <span>Bus type and route details (clearly visible)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold shrink-0">•</span>
              <span>Walking route to bus stop • bus route map</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold shrink-0">•</span>
              <span>ETA, delays, skipped stops, bunching info</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold shrink-0">•</span>
              <span>Alternative bus suggestion</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold shrink-0">•</span>
              <span>Get-off / approaching bus alert</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold shrink-0">•</span>
              <span>Leave-home guidance (when to start)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold shrink-0">•</span>
              <span>Save favourite routes & stops</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold shrink-0">•</span>
              <span>Offline access to saved routes/stops</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 3. Orange Card: Features Not Available */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-amber-950 leading-tight">
              Features Not Available / Not Clearly Solved <span className="text-amber-800 text-xs font-semibold block sm:inline">in Current APSRTC Apps</span>
            </h3>
          </div>

          <ul className="mt-4 space-y-2 text-xs text-amber-950 font-medium">
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold shrink-0">•</span>
              <span>Simple A → B search with all suitable buses (especially for regular services)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold shrink-0">•</span>
              <span>Showing number of currently running buses on a route</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold shrink-0">•</span>
              <span>Full stop-by-stop view for a selected bus</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold shrink-0">•</span>
              <span>Alternative bus suggestion when delayed/cancelled</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold shrink-0">•</span>
              <span>Dedicated notification when bus is approaching</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold shrink-0">•</span>
              <span>"When to leave home" guidance</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold shrink-0">•</span>
              <span>Integrated walking + bus journey planner</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold shrink-0">•</span>
              <span>Clear display of delays, skipped stops, cancellations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold shrink-0">•</span>
              <span>Better offline mode for poor network areas</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 4. Purple Card: The Result */}
      <div className="bg-purple-50/70 border border-purple-200 rounded-3xl p-6 space-y-5 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-purple-950 leading-tight">
              The Result
            </h3>
          </div>

          <div className="mt-4 space-y-4 text-xs text-purple-950/90 leading-relaxed font-medium">
            <p>
              A single, easy-to-use app for all <strong>APSRTC regular buses</strong> (Ordinary, Metro, Palle Velugu, etc.).
            </p>
            <p>
              Helping passengers plan, track, and reach their destination with less confusion and more confidence.
            </p>
          </div>
        </div>

        {/* Hand-drawn slogan box */}
        <div className="p-4 bg-white/90 border border-purple-200/90 rounded-2xl flex items-center justify-between shadow-2xs">
          <div>
            <p className="font-serif italic font-extrabold text-blue-900 text-sm tracking-tight">
              Same Buses.
            </p>
            <p className="font-serif italic font-extrabold text-blue-700 text-base tracking-tight">
              Smarter Journey.
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-100/80 border border-blue-300/80 flex items-center justify-center text-blue-700">
            <Bus className="w-6 h-6" />
          </div>
        </div>
      </div>

    </div>
  );
};
