import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'EN' | 'TE';

export interface Translations {
  [key: string]: {
    en: string;
    te: string;
  };
}

export const translations: Translations = {
  // Brand & Header
  'brand.title': { en: 'APSRTC', te: 'ఏపీఎస్‌ఆర్‌టీసీ' },
  'brand.tagline': { en: 'Your Journey. Our Service.', te: 'మీ ప్రయాణం. మా సేవ.' },
  'brand.subtitle': { en: 'Live bus tracking • All Ordinary, Metro, Palle Velugu & more • Plan. Track. Reach.', te: 'లైవ్ బస్సు ట్రాకింగ్ • ఆర్డినరీ, మెట్రో, పల్లె వెలుగు & మరిన్ని • ప్రణాళిక. ట్రాకింగ్. గమ్యం.' },
  'brand.everyday': { en: 'For everyday travel.', te: 'రోజువారీ ప్రయాణానికి.' },
  'brand.noBooking': { en: 'No booking. Just board.', te: 'రిజర్వేషన్ అక్కర్లేదు. కేవలం బస్సు ఎక్కండి.' },
  
  // Badges
  'badge.ordinary': { en: 'City Ordinary', te: 'సిటీ ఆర్డినరీ' },
  'badge.metroExpress': { en: 'Metro Express', te: 'మెట్రో ఎక్స్‌ప్రెస్' },
  'badge.metroLiner': { en: 'Metro Liner', te: 'మెట్రో లైనర్' },
  'badge.palleVelugu': { en: 'Palle Velugu', te: 'పల్లె వెలుగు' },
  
  // Navigation Tabs
  'nav.home': { en: 'Plan Journey (Home)', te: 'ప్రయాణ ప్రణాళిక (హోమ్)' },
  'nav.buses': { en: 'Available Buses & Corridor', te: 'అందుబాటులో ఉన్న బస్సులు' },
  'nav.liveTracking': { en: 'Live Map & GPS Tracking', te: 'లైవ్ మ్యాప్ & జీపీఎస్' },
  'nav.nearbyStops': { en: 'Nearby Stops', te: 'సమీప బస్ స్టాప్‌లు' },
  'nav.savedRoutes': { en: 'Saved Routes', te: 'దాచిన రూట్లు' },
  'nav.profile': { en: 'Profile & Settings', te: 'ప్రొఫైల్ & సెట్టింగ్‌లు' },
  'nav.authority': { en: 'Authority', te: 'రవాణా శాఖ' },
  'nav.passenger': { en: 'Passenger', te: 'ప్రయాణీకుడు' },
  'nav.approachingAlert': { en: 'Bus Approaching Alert', te: 'బస్సు చేరుకుంటోంది అలర్ట్' },
  'nav.apiKey': { en: 'APSRTC API Key', te: 'ఏపీఎస్‌ఆర్‌టీసీ ఏపీఐ కీ' },

  // Home Page
  'home.greeting': { en: 'Good Morning, Sneha 👋', te: 'శుభోదయం, స్నేహ 👋' },
  'home.subGreeting': { en: 'Where would you like to travel in Visakhapatnam today?', te: 'ఈరోజు విశాఖపట్నంలో మీరు ఎక్కడికి ప్రయాణించాలనుకుంటున్నారు?' },
  'home.networkStatus': { en: 'APSRTC Live Network:', te: 'ఏపీఎస్‌ఆర్‌టీసీ నెట్‌వర్క్:' },
  'home.normalServices': { en: 'Normal Services Active', te: 'సాధారణ సేవలు నడుస్తున్నాయి' },
  'home.planTitle': { en: 'Plan Your Journey', te: 'మీ ప్రయాణాన్ని ప్లాన్ చేయండి' },
  'home.planSubtitle': { en: 'Everyday city transit. No seat reservations needed. Just board.', te: 'రోజువారీ ప్రయాణం. సీటు రిజర్వేషన్ అవసరం లేదు. ఎక్కేయండి.' },
  'home.allBusesPill': { en: 'All APSRTC Regular Buses', te: 'అన్ని సాధారణ ఏపీఎస్‌ఆర్‌టీసీ బస్సులు' },
  'home.fromStop': { en: 'From (Boarding Stop)', te: 'ప్రారంభ స్టాప్ (ఎక్కే ప్రదేశం)' },
  'home.toStop': { en: 'To (Destination Stop)', te: 'గమ్యస్థానం (దిగే ప్రదేశం)' },
  'home.findBuses': { en: 'Find Buses for Route', te: 'బస్సులను వెతకండి' },
  
  // Screen 11 Leave Home Guidance
  'leaveHome.badge': { en: 'Smart Departure Guidance (Screen 11)', te: 'స్మార్ట్ బయలుదేరే మార్గదర్శకత్వం' },
  'leaveHome.title': { en: '⏰ Leave by 6:08 PM to catch your bus on time', te: '⏰ బస్సు అందుకోవడానికి సాయంత్రం 6:08 గంటలకు బయలుదేరండి' },
  'leaveHome.desc': { en: 'Your bus arrives at Madhurawada Stop at 6:20 PM. Your walking distance is 450m (7 min walk).', te: 'మీ బస్సు మధురవాడ స్టాప్‌కు సాయంత్రం 6:20 గంటలకు చేరుకుంటుంది. మీ నడక దూరం 450 మీటర్లు (7 నిమిషాలు).' },
  'leaveHome.walkToStop': { en: 'Walk to Stop', te: 'స్టాప్‌కు నడక' },
  'leaveHome.busArrives': { en: 'Bus Arrives at Stop', te: 'బస్సు చేరుకునే సమయం' },
  'leaveHome.bufferTime': { en: 'Buffer Time', te: 'అదనపు సమయం' },
  'leaveHome.setReminder': { en: 'Set Departure Reminder', te: 'బయలుదేరే రిమైండర్ పెట్టండి' },
  'leaveHome.trackLive': { en: 'Track Bus Live on Map', te: 'మ్యాప్‌లో లైవ్ ట్రాక్ చేయండి' },

  // Quick Access
  'quick.title': { en: 'Quick Access & Services', te: 'త్వరిత సేవలు' },
  'quick.nearby': { en: 'Nearby Stops', te: 'సమీప స్టాప్‌లు' },
  'quick.nearbyDesc': { en: 'Find stops within 0.3 - 2 km', te: '0.3 నుండి 2 కి.మీ పరిధిలోని స్టాప్‌లు' },
  'quick.live': { en: 'Live Tracking', te: 'లైవ్ ట్రాకింగ్' },
  'quick.liveDesc': { en: 'Real-time GPS bus locations', te: 'నిజ సమయ జీపీఎస్ స్థానాలు' },
  'quick.types': { en: 'Bus Service Types', te: 'బస్సు సర్వీస్ రకాలు' },
  'quick.typesDesc': { en: 'Ordinary, Metro, Liner, Palle', te: 'ఆర్డినరీ, మెట్రో, లైనర్, పల్లె వెలుగు' },
  'quick.saved': { en: 'My Saved Trips', te: 'నా ప్రయాణాలు' },
  'quick.savedDesc': { en: 'Quick access to frequent routes', te: 'తరచూ ప్రయాణించే మార్గాలు' },

  // Popular Destinations
  'popular.title': { en: 'Popular Destinations from Madhurawada', te: 'మధురవాడ నుండి ప్రసిద్ధ గమ్యస్థానాలు' },
  'popular.subtitle': { en: 'Tap any destination for 1-click bus search', te: 'ఒక్క క్లిక్‌తో బస్సులను వెతకడానికి తాకండి' },
  'popular.viewAll': { en: 'View All Bus Corridors', te: 'అన్ని మార్గాలను చూడండి' },

  // Search Results (Screen 4 & 10)
  'search.corridorTitle': { en: 'APSRTC City Corridor', te: 'ఏపీఎస్‌ఆర్‌టీసీ సిటీ కారిడార్' },
  'search.busesAvailable': { en: 'Buses Available', te: 'బస్సులు అందుబాటులో ఉన్నాయి' },
  'search.noReservation': { en: 'Board any regular bus along this corridor. No reservation needed.', te: 'ఈ మార్గంలో ఏ బస్సునైనా ఎక్కవచ్చు. రిజర్వేషన్ అక్కర్లేదు.' },
  'search.allBuses': { en: 'All Buses', te: 'అన్ని బస్సులు' },
  'search.delayWarning': { en: '⚠️ Bus delayed by 20 min', te: '⚠️ బస్సు 20 నిమిషాలు ఆలస్యమైంది' },
  'search.altTitle': { en: 'Alternative Bus Suggestions Available', te: 'ప్రత్యామ్నాయ బస్సు సూచనలు అందుబాటులో ఉన్నాయి' },
  'search.altDesc': { en: 'Don\'t wait! The following alternative buses run on this exact corridor and will reach your destination faster:', te: 'వేచి ఉండకండి! ఈ మార్గంలో ప్రయాణించే ఇతర బస్సులు త్వరగా చేరుస్తాయి:' },
  'search.boardNow': { en: 'Board Now', te: 'ఇప్పుడే ఎక్కండి' },
  'search.viewDetails': { en: 'View Details', te: 'వివరాలు చూడండి' },
  'search.arrivingAtStop': { en: 'Arriving at Stop', te: 'స్టాప్‌కు చేరుకునే సమయం' },
  'search.nextStop': { en: 'Next stop:', te: 'తదుపరి స్టాప్:' },
  'search.lowCrowd': { en: 'Low Crowd', te: 'తక్కువ రద్దీ' },
  'search.modCrowd': { en: 'Moderate Crowd', te: 'మితమైన రద్దీ' },
  'search.heavyCrowd': { en: 'Heavy Crowd', te: 'ఎక్కువ రద్దీ' },
  'search.liveTrackBtn': { en: 'Live Tracking & Stops', te: 'లైవ్ ట్రాకింగ్ & స్టాప్‌లు' },

  // Live Bus Details (Screen 5, 6, 7, 12)
  'details.back': { en: 'Back to Bus Results', te: 'వెనుకకు' },
  'details.liveActive': { en: 'LIVE GPS TELEMETRY ACTIVE', te: 'లైవ్ జీపీఎస్ సిగ్నల్ సక్రియంగా ఉంది' },
  'details.inService': { en: 'In Service ✓', te: 'సర్వీస్‌లో ఉంది ✓' },
  'details.arrivingIn': { en: 'Arriving In', te: 'చేరుకునే సమయం' },
  'details.crowdLevel': { en: 'Crowd Level', te: 'రద్దీ స్థాయి' },
  'details.speed': { en: 'Current Speed', te: 'ప్రస్తుత వేగం' },
  'details.skippedNotice': { en: 'Service Alert: Hanumanthawaka Stop Temporarily Skipped (✗)', te: 'సేవా హెచ్చరిక: హనుమంతవాక స్టాప్ తాత్కాలికంగా దాటవేయబడింది (✗)' },
  'details.stopSeqTitle': { en: 'Complete Stop Sequence', te: 'పూర్తి స్టాప్‌ల క్రమం' },
  'details.yourStop': { en: 'Your Stop', te: 'మీ స్టాప్' },
  'details.nextStopNode': { en: 'Next Stop', te: 'తదుపరి స్టాప్' },
  'details.mapViewTitle': { en: 'Screen 7: Live Map View', te: 'లైవ్ మ్యాప్ వీక్షణ' },
  'details.busLocation': { en: 'Bus Location', te: 'బస్సు స్థానం' },
  'details.routeLine': { en: 'Route Line', te: 'రూట్ మార్గం' },

  // Nearby Stops (Screen 8)
  'nearby.radarTitle': { en: 'Nearby Stops & Live Departures', te: 'సమీప స్టాప్‌లు & లైవ్ నిష్క్రమణలు' },
  'nearby.radarDesc': { en: 'Stops within walking distance from your GPS coordinates (Madhurawada Area).', te: 'మీ జీపీఎస్ స్థానం నుండి నడక దూరంలో ఉన్న బస్ స్టాప్‌లు.' },
  'nearby.requestStop': { en: 'Request New Stop', te: 'కొత్త స్టాప్ కోరండి' },
  'nearby.searchPlaceholder': { en: 'Search stop or landmark...', te: 'స్టాప్ లేదా ప్రాంతం పేరు వెతకండి...' },
  'nearby.orderedBy': { en: 'Bus Stops Ordered by Walking Distance', te: 'నడక దూరం ప్రకారం బస్ స్టాప్‌లు' },
  'nearby.upcoming': { en: 'Upcoming Live Departures', te: 'రాబోయే బస్సుల వివరాలు' },

  // Saved Routes (Screen 13)
  'saved.title': { en: 'My Saved Routes', te: 'నా దాచిన రూట్లు' },
  'saved.subtitle': { en: 'Quick 1-click access to check active buses and arrival times for your daily commute.', te: 'రోజూ ప్రయాణించే బస్సులను ఒక్క క్లిక్‌తో తనిఖీ చేయండి.' },
  'saved.saveNew': { en: 'Save New Route', te: 'కొత్త రూట్ దాచుకోండి' },
  'saved.checkLive': { en: 'Check Live Buses', te: 'లైవ్ బస్సులను చూడండి' },

  // Approaching Alert Modal (Screen 9)
  'alert.badge': { en: 'Live Commuter Alert', te: 'లైవ్ ప్రయాణీకుల అలర్ట్' },
  'alert.approaching': { en: 'Your bus is approaching!', te: 'మీ బస్సు చేరుకుంటోంది!' },
  'alert.eta': { en: 'Estimated Arrival:', te: 'అంచనా సమయం:' },
  'alert.currentPos': { en: 'Current Position:', te: 'ప్రస్తుత ప్రదేశం:' },
  'alert.reg': { en: 'Bus Registration:', te: 'బస్సు రిజిస్ట్రేషన్:' },
  'alert.viewOnMap': { en: 'View on Live Map', te: 'లైవ్ మ్యాప్‌లో చూడండి' },
  'alert.dismiss': { en: 'Dismiss Alert', te: 'రద్దు చేయండి' },

  // Profile (Screen 14)
  'profile.title': { en: 'Durga Vaishnavi', te: 'దుర్గా వైష్ణవి' },
  'profile.badge': { en: 'Regular Commuter', te: 'రోజువారీ ప్రయాణీకురాలు' },
  'profile.langTitle': { en: 'App Language / భాష', te: 'యాప్ భాష' },
  'profile.langDesc': { en: 'Choose your preferred reading language', te: 'మీకు అనుకూలమైన భాషను ఎంచుకోండి' },
  'profile.alertsTitle': { en: 'Smart Commuter Alerts', te: 'స్మార్ట్ అలర్ట్‌లు' },
  'profile.helpline': { en: 'Help & Passenger Support', te: 'సహాయం & ప్రయాణీకుల సేవ' },
  'profile.tollFree': { en: 'APSRTC Central Toll-Free Helpline', te: 'ఏపీఎస్‌ఆర్‌టీసీ టోల్ ఫ్రీ నెంబర్' },

  // Splash / Loading Screen (Screen 1)
  'splash.stateTitle': { en: 'Andhra Pradesh State Road Transport Corporation', te: 'ఆంధ్రప్రదేశ్ రాష్ట్ర రోడ్డు రవాణా సంస్థ' },
  'splash.appTitle': { en: 'APSRTC Smart Travel', te: 'ఏపీఎస్‌ఆర్‌టీసీ స్మార్ట్ ట్రావెల్' },
  'splash.motto': { en: 'Smart Travel for a Better Tomorrow', te: 'మెరుగైన రేపటి కోసం స్మార్ట్ ప్రయాణం' },
  'splash.tagline': { en: 'Your Journey. Our Service.', te: 'మీ ప్రయాణం - మా సేవ.' },
  'splash.getStarted': { en: 'Get Started Now', te: 'ఇప్పుడే ప్రారంభించండి' },
  'splash.enterPortal': { en: 'Enter Smart Travel Portal →', te: 'పోర్టల్‌లోకి ప్రవేశించండి →' }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'EN',
  setLanguage: () => {},
  t: (key: string) => key
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('apsrtc_language');
    return (saved === 'TE' || saved === 'EN') ? saved : 'EN';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('apsrtc_language', lang);
  };

  const t = (key: string): string => {
    const entry = translations[key];
    if (!entry) return key;
    return language === 'TE' ? entry.te : entry.en;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
