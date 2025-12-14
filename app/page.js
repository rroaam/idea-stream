'use client';
import { useState, useMemo } from 'react';
import { MapPin, Clock, DollarSign, Target, Flag, ChevronRight, X, Filter, ArrowUpDown, Check } from 'lucide-react';

// ============================================
// MOCK DATA - 12 Golf Courses
// ============================================
const generateTeeTimes = (courseId, priceBase) => {
  const today = new Date();
  const times = [];

  for (let day = 0; day < 7; day++) {
    const date = new Date(today);
    date.setDate(date.getDate() + day);

    // Morning times (6am - 11am)
    const morningSlots = [6, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11];
    morningSlots.forEach((hour, idx) => {
      // Use deterministic availability based on day and hour
      if ((day + idx + courseId) % 3 !== 0) {
        const h = Math.floor(hour);
        const m = (hour % 1) * 60;
        times.push({
          id: `${courseId}-${day}-m-${hour}`,
          date: date.toISOString().split('T')[0],
          time: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`,
          period: 'morning',
          price: priceBase + ((day + idx) % 20),
          spots: ((day + idx + courseId) % 4) + 1
        });
      }
    });

    // Afternoon times (12pm - 4pm)
    const afternoonSlots = [12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16];
    afternoonSlots.forEach((hour, idx) => {
      if ((day + idx + courseId) % 4 !== 0) {
        const h = Math.floor(hour);
        const m = (hour % 1) * 60;
        times.push({
          id: `${courseId}-${day}-a-${hour}`,
          date: date.toISOString().split('T')[0],
          time: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`,
          period: 'afternoon',
          price: priceBase + ((day + idx) % 15) + 10,
          spots: ((day + idx + courseId) % 4) + 1
        });
      }
    });

    // Twilight times (5pm - 7pm)
    const twilightSlots = [17, 17.5, 18, 18.5, 19];
    twilightSlots.forEach((hour, idx) => {
      if ((day + idx + courseId) % 3 !== 1) {
        const h = Math.floor(hour);
        const m = (hour % 1) * 60;
        times.push({
          id: `${courseId}-${day}-t-${hour}`,
          date: date.toISOString().split('T')[0],
          time: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`,
          period: 'twilight',
          price: Math.floor(priceBase * 0.7) + ((day + idx) % 10),
          spots: ((day + idx + courseId) % 4) + 1
        });
      }
    });
  }

  return times;
};

const MOCK_COURSES = [
  {
    id: 1,
    name: "Pine Valley Golf Club",
    address: "1 Pine Valley Way",
    city: "Pine Valley",
    distance: 3.2,
    difficulty: "advanced",
    priceRange: "$$$",
    basePrice: 125,
    hasDrivingRange: true,
    holes: 18,
    par: 72,
    yearEstablished: 1913,
    description: "Consistently ranked among the finest courses in the nation. A challenging layout through pristine pine forests with immaculate conditioning.",
    amenities: ["Pro Shop", "Restaurant", "Locker Room", "Cart Rental", "Club Rental", "Practice Green"],
    phone: "(555) 123-4567",
    website: "https://pinevalleygc.example.com"
  },
  {
    id: 2,
    name: "Oakmont Country Club",
    address: "1234 Hulton Road",
    city: "Oakmont",
    distance: 7.8,
    difficulty: "advanced",
    priceRange: "$$$",
    basePrice: 145,
    hasDrivingRange: true,
    holes: 18,
    par: 71,
    yearEstablished: 1903,
    description: "Historic championship course known for its lightning-fast greens and challenging church pew bunkers. Host to multiple major championships.",
    amenities: ["Pro Shop", "Fine Dining", "Locker Room", "Caddie Service", "Practice Facility", "Spa"],
    phone: "(555) 234-5678",
    website: "https://oakmont.example.com"
  },
  {
    id: 3,
    name: "Meadowbrook Municipal",
    address: "500 Fairway Drive",
    city: "Riverside",
    distance: 2.1,
    difficulty: "beginner",
    priceRange: "$",
    basePrice: 28,
    hasDrivingRange: true,
    holes: 18,
    par: 70,
    yearEstablished: 1962,
    description: "A welcoming municipal course perfect for beginners and families. Well-maintained with forgiving fairways and reasonable rates.",
    amenities: ["Pro Shop", "Snack Bar", "Cart Rental", "Club Rental", "Practice Green"],
    phone: "(555) 345-6789",
    website: "https://meadowbrookmuni.example.com"
  },
  {
    id: 4,
    name: "Shadow Creek Links",
    address: "789 Shadow Lane",
    city: "Henderson",
    distance: 12.4,
    difficulty: "intermediate",
    priceRange: "$$",
    basePrice: 75,
    hasDrivingRange: true,
    holes: 18,
    par: 72,
    yearEstablished: 1989,
    description: "A stunning desert oasis featuring dramatic elevation changes and strategically placed water hazards. A true test of shot-making.",
    amenities: ["Pro Shop", "Restaurant", "Cart Rental", "Practice Range", "Short Game Area"],
    phone: "(555) 456-7890",
    website: "https://shadowcreek.example.com"
  },
  {
    id: 5,
    name: "Willow Creek Golf Course",
    address: "2200 Willow Road",
    city: "Springfield",
    distance: 5.6,
    difficulty: "beginner",
    priceRange: "$",
    basePrice: 32,
    hasDrivingRange: false,
    holes: 18,
    par: 68,
    yearEstablished: 1978,
    description: "A friendly neighborhood course with gentle terrain. Great for learning the game or enjoying a relaxed round with friends.",
    amenities: ["Pro Shop", "Snack Bar", "Cart Rental", "Practice Green"],
    phone: "(555) 567-8901",
    website: "https://willowcreek.example.com"
  },
  {
    id: 6,
    name: "The Preserve at Ironwood",
    address: "4500 Ironwood Trail",
    city: "Scottsdale",
    distance: 18.9,
    difficulty: "advanced",
    priceRange: "$$$",
    basePrice: 135,
    hasDrivingRange: true,
    holes: 18,
    par: 73,
    yearEstablished: 2001,
    description: "An environmental masterpiece carved through natural desert terrain. Each hole offers breathtaking views and strategic challenges.",
    amenities: ["Pro Shop", "Fine Dining", "Locker Room", "Caddie Service", "Practice Facility", "Fitness Center"],
    phone: "(555) 678-9012",
    website: "https://preserveironwood.example.com"
  },
  {
    id: 7,
    name: "Rolling Hills Golf Club",
    address: "888 Summit Drive",
    city: "Greendale",
    distance: 8.3,
    difficulty: "intermediate",
    priceRange: "$$",
    basePrice: 62,
    hasDrivingRange: true,
    holes: 18,
    par: 71,
    yearEstablished: 1954,
    description: "A classic parkland design with mature trees and well-bunkered greens. Challenging but fair for players of all skill levels.",
    amenities: ["Pro Shop", "Restaurant", "Cart Rental", "Practice Range", "Lessons"],
    phone: "(555) 789-0123",
    website: "https://rollinghillsgc.example.com"
  },
  {
    id: 8,
    name: "Harbor Links",
    address: "1 Marina Boulevard",
    city: "Portside",
    distance: 15.2,
    difficulty: "intermediate",
    priceRange: "$$",
    basePrice: 85,
    hasDrivingRange: false,
    holes: 18,
    par: 72,
    yearEstablished: 1967,
    description: "A beautiful coastal course with stunning ocean views. Wind plays a significant factor, making club selection crucial.",
    amenities: ["Pro Shop", "Oceanview Restaurant", "Cart Rental", "Club Rental"],
    phone: "(555) 890-1234",
    website: "https://harborlinks.example.com"
  },
  {
    id: 9,
    name: "Sunset Valley Executive",
    address: "300 Valley View Road",
    city: "Westbrook",
    distance: 4.1,
    difficulty: "beginner",
    priceRange: "$",
    basePrice: 22,
    hasDrivingRange: true,
    holes: 9,
    par: 27,
    yearEstablished: 1985,
    description: "A well-designed executive 9-hole course, perfect for a quick round after work. Great for honing your short game.",
    amenities: ["Pro Shop", "Snack Bar", "Practice Range", "Practice Green"],
    phone: "(555) 901-2345",
    website: "https://sunsetvalley.example.com"
  },
  {
    id: 10,
    name: "Cypress Ridge Country Club",
    address: "5600 Cypress Point Drive",
    city: "Monterey",
    distance: 22.7,
    difficulty: "advanced",
    priceRange: "$$$",
    basePrice: 150,
    hasDrivingRange: true,
    holes: 18,
    par: 72,
    yearEstablished: 1928,
    description: "A legendary oceanside course with dramatic cliff-side holes. The back nine is among the most scenic in golf.",
    amenities: ["Pro Shop", "Fine Dining", "Locker Room", "Spa", "Caddie Service", "Golf Academy"],
    phone: "(555) 012-3456",
    website: "https://cypressridge.example.com"
  },
  {
    id: 11,
    name: "Fairview Public Golf",
    address: "1100 Park Avenue",
    city: "Fairview",
    distance: 6.4,
    difficulty: "beginner",
    priceRange: "$",
    basePrice: 35,
    hasDrivingRange: true,
    holes: 18,
    par: 70,
    yearEstablished: 1971,
    description: "A well-maintained public course offering great value. Wide fairways and accessible greens make it ideal for casual golfers.",
    amenities: ["Pro Shop", "Grill", "Cart Rental", "Club Rental", "Practice Range"],
    phone: "(555) 112-2334",
    website: "https://fairviewpublic.example.com"
  },
  {
    id: 12,
    name: "Stonebridge Golf Resort",
    address: "7800 Stone Bridge Road",
    city: "Highland",
    distance: 11.8,
    difficulty: "intermediate",
    priceRange: "$$",
    basePrice: 89,
    hasDrivingRange: true,
    holes: 18,
    par: 72,
    yearEstablished: 1995,
    description: "A resort-style course featuring stone bridges, cascading waterfalls, and meticulously maintained bentgrass greens.",
    amenities: ["Pro Shop", "Restaurant", "Locker Room", "Cart Rental", "Practice Facility", "Resort Lodging"],
    phone: "(555) 223-4456",
    website: "https://stonebridgeresort.example.com"
  }
].map(course => ({
  ...course,
  teeTimes: generateTeeTimes(course.id, course.basePrice)
}));

// ============================================
// UTILITY FUNCTIONS
// ============================================
const formatDate = (dateStr) => {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.getTime() === today.getTime()) return 'Today';
  if (date.getTime() === tomorrow.getTime()) return 'Tomorrow';

  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

const formatTime = (timeStr) => {
  const [hours, minutes] = timeStr.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${displayHour}:${minutes} ${ampm}`;
};

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'beginner': return { bg: '#2C5530', text: '#F5F1E8' };
    case 'intermediate': return { bg: '#D4C4A8', text: '#1A1A1A' };
    case 'advanced': return { bg: '#B85C38', text: '#F5F1E8' };
    default: return { bg: '#1A1A1A', text: '#F5F1E8' };
  }
};

// ============================================
// COMPONENTS
// ============================================

// Noise texture overlay component
const NoiseOverlay = () => (
  <div
    className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    }}
  />
);

// Landing Page Component
const LandingPage = ({ onSubmit }) => {
  const [zipCode, setZipCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^\d{5}$/.test(zipCode)) {
      setError('Please enter a valid 5-digit zip code');
      return;
    }
    setError('');
    onSubmit(zipCode);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ backgroundColor: '#F5F1E8' }}>
      {/* Header */}
      <div className="text-center mb-12">
        <div className="mb-6 flex justify-center">
          <div
            className="w-24 h-24 flex items-center justify-center"
            style={{
              border: '3px solid #1A1A1A',
              backgroundColor: '#2C5530'
            }}
          >
            <Flag size={48} color="#F5F1E8" strokeWidth={2.5} />
          </div>
        </div>
        <h1
          className="text-5xl md:text-7xl font-black tracking-tighter mb-4 uppercase"
          style={{
            color: '#1A1A1A',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontStretch: 'condensed',
            letterSpacing: '-0.05em'
          }}
        >
          FIND TEE TIMES
        </h1>
        <p
          className="text-lg md:text-xl"
          style={{
            color: '#1A1A1A',
            fontFamily: 'system-ui, sans-serif',
            opacity: 0.7
          }}
        >
          Book your next round at courses near you
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-4">
          <label
            htmlFor="zipcode"
            className="block text-sm font-bold uppercase tracking-wider mb-2"
            style={{ color: '#1A1A1A' }}
          >
            Enter Your Zip Code
          </label>
          <div className="relative">
            <MapPin
              className="absolute left-4 top-1/2 transform -translate-y-1/2"
              size={20}
              color="#1A1A1A"
              strokeWidth={2}
            />
            <input
              type="text"
              id="zipcode"
              value={zipCode}
              onChange={(e) => {
                setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5));
                setError('');
              }}
              placeholder="12345"
              className="w-full p-4 pl-12 text-xl outline-none transition-all"
              style={{
                border: '3px solid #1A1A1A',
                backgroundColor: '#FFFFFF',
                fontFamily: 'ui-monospace, monospace',
                letterSpacing: '0.1em'
              }}
              maxLength={5}
            />
          </div>
          {error && (
            <p className="mt-2 text-sm font-medium" style={{ color: '#B85C38' }}>
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full p-4 text-lg font-bold uppercase tracking-wider transition-all hover:translate-y-[-2px]"
          style={{
            border: '3px solid #1A1A1A',
            backgroundColor: '#2C5530',
            color: '#F5F1E8'
          }}
        >
          Search Courses
        </button>
      </form>

      {/* Footer decoration */}
      <div className="mt-16 flex items-center gap-4">
        <div className="w-16 h-0.5" style={{ backgroundColor: '#1A1A1A', opacity: 0.3 }} />
        <span
          className="text-sm uppercase tracking-widest"
          style={{ color: '#1A1A1A', opacity: 0.5 }}
        >
          Est. 2024
        </span>
        <div className="w-16 h-0.5" style={{ backgroundColor: '#1A1A1A', opacity: 0.3 }} />
      </div>
    </div>
  );
};

// Course Card Component
const CourseCard = ({ course, onClick }) => {
  const diffColors = getDifficultyColor(course.difficulty);
  const nextThreeTimes = course.teeTimes.slice(0, 3);

  return (
    <div
      onClick={onClick}
      className="cursor-pointer transition-all hover:translate-y-[-4px]"
      style={{
        border: '3px solid #1A1A1A',
        backgroundColor: '#FFFFFF'
      }}
    >
      {/* Card Header */}
      <div className="p-4" style={{ borderBottom: '2px solid #1A1A1A' }}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3
              className="text-xl font-black uppercase tracking-tight mb-1"
              style={{ color: '#1A1A1A' }}
            >
              {course.name}
            </h3>
            <div className="flex items-center gap-2 text-sm" style={{ color: '#1A1A1A', opacity: 0.7 }}>
              <MapPin size={14} strokeWidth={2} />
              <span style={{ fontFamily: 'ui-monospace, monospace' }}>
                {course.distance} mi
              </span>
              <span className="mx-1">•</span>
              <span>{course.city}</span>
            </div>
          </div>
          <ChevronRight size={24} color="#1A1A1A" />
        </div>
      </div>

      {/* Badges Row */}
      <div
        className="flex flex-wrap gap-2 p-4"
        style={{ borderBottom: '2px solid #1A1A1A', backgroundColor: '#F5F1E8' }}
      >
        {/* Difficulty Badge */}
        <span
          className="px-3 py-1 text-xs font-bold uppercase tracking-wider"
          style={{
            backgroundColor: diffColors.bg,
            color: diffColors.text,
            border: '2px solid #1A1A1A'
          }}
        >
          {course.difficulty}
        </span>

        {/* Price Badge */}
        <span
          className="px-3 py-1 text-xs font-bold"
          style={{
            backgroundColor: '#D4C4A8',
            color: '#1A1A1A',
            border: '2px solid #1A1A1A',
            fontFamily: 'ui-monospace, monospace'
          }}
        >
          {course.priceRange}
        </span>

        {/* Holes Badge */}
        <span
          className="px-3 py-1 text-xs font-bold"
          style={{
            backgroundColor: '#1A1A1A',
            color: '#F5F1E8',
            border: '2px solid #1A1A1A',
            fontFamily: 'ui-monospace, monospace'
          }}
        >
          {course.holes}H / PAR {course.par}
        </span>

        {/* Driving Range Badge */}
        {course.hasDrivingRange && (
          <span
            className="px-3 py-1 text-xs font-bold uppercase flex items-center gap-1"
            style={{
              backgroundColor: '#2C5530',
              color: '#F5F1E8',
              border: '2px solid #1A1A1A'
            }}
          >
            <Target size={12} strokeWidth={2.5} />
            Range
          </span>
        )}
      </div>

      {/* Next Available Times */}
      <div className="p-4">
        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#1A1A1A', opacity: 0.6 }}>
          Next Available
        </p>
        <div className="flex flex-wrap gap-2">
          {nextThreeTimes.map((time) => (
            <div
              key={time.id}
              className="px-3 py-2 text-center"
              style={{
                border: '2px solid #1A1A1A',
                backgroundColor: '#F5F1E8'
              }}
            >
              <div
                className="text-sm font-bold"
                style={{ fontFamily: 'ui-monospace, monospace', color: '#1A1A1A' }}
              >
                {formatTime(time.time)}
              </div>
              <div className="text-xs" style={{ color: '#2C5530', fontWeight: 'bold' }}>
                ${time.price}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Filter Controls Component
const FilterControls = ({
  sortBy,
  setSortBy,
  showDrivingRangeOnly,
  setShowDrivingRangeOnly,
  difficultyFilter,
  setDifficultyFilter,
  priceFilter,
  setPriceFilter
}) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="mb-6">
      {/* Main Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none px-4 py-3 pr-10 font-bold uppercase text-sm tracking-wider cursor-pointer outline-none"
            style={{
              border: '3px solid #1A1A1A',
              backgroundColor: '#FFFFFF',
              color: '#1A1A1A'
            }}
          >
            <option value="distance">Distance</option>
            <option value="price">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="difficulty">Difficulty</option>
          </select>
          <ArrowUpDown
            className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
            size={16}
            color="#1A1A1A"
          />
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-3 font-bold uppercase text-sm tracking-wider flex items-center gap-2 transition-all"
          style={{
            border: '3px solid #1A1A1A',
            backgroundColor: showFilters ? '#1A1A1A' : '#FFFFFF',
            color: showFilters ? '#F5F1E8' : '#1A1A1A'
          }}
        >
          <Filter size={16} />
          Filters
        </button>

        {/* Driving Range Toggle */}
        <button
          onClick={() => setShowDrivingRangeOnly(!showDrivingRangeOnly)}
          className="px-4 py-3 font-bold uppercase text-sm tracking-wider flex items-center gap-2 transition-all"
          style={{
            border: '3px solid #1A1A1A',
            backgroundColor: showDrivingRangeOnly ? '#2C5530' : '#FFFFFF',
            color: showDrivingRangeOnly ? '#F5F1E8' : '#1A1A1A'
          }}
        >
          <Target size={16} />
          Driving Range
          {showDrivingRangeOnly && <Check size={14} />}
        </button>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div
          className="mt-4 p-4 grid grid-cols-1 md:grid-cols-2 gap-4"
          style={{
            border: '3px solid #1A1A1A',
            backgroundColor: '#F5F1E8'
          }}
        >
          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-2" style={{ color: '#1A1A1A' }}>
              Difficulty
            </label>
            <div className="flex flex-wrap gap-2">
              {['all', 'beginner', 'intermediate', 'advanced'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficultyFilter(diff)}
                  className="px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all"
                  style={{
                    border: '2px solid #1A1A1A',
                    backgroundColor: difficultyFilter === diff ? '#1A1A1A' : '#FFFFFF',
                    color: difficultyFilter === diff ? '#F5F1E8' : '#1A1A1A'
                  }}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-2" style={{ color: '#1A1A1A' }}>
              Price Range
            </label>
            <div className="flex flex-wrap gap-2">
              {['all', '$', '$$', '$$$'].map((price) => (
                <button
                  key={price}
                  onClick={() => setPriceFilter(price)}
                  className="px-3 py-2 text-xs font-bold tracking-wider transition-all"
                  style={{
                    border: '2px solid #1A1A1A',
                    backgroundColor: priceFilter === price ? '#1A1A1A' : '#FFFFFF',
                    color: priceFilter === price ? '#F5F1E8' : '#1A1A1A',
                    fontFamily: 'ui-monospace, monospace'
                  }}
                >
                  {price === 'all' ? 'ALL' : price}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Course List Component
const CourseList = ({ zipCode, onBack, onSelectCourse }) => {
  const [sortBy, setSortBy] = useState('distance');
  const [showDrivingRangeOnly, setShowDrivingRangeOnly] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');

  const filteredAndSortedCourses = useMemo(() => {
    let courses = [...MOCK_COURSES];

    // Apply filters
    if (showDrivingRangeOnly) {
      courses = courses.filter(c => c.hasDrivingRange);
    }
    if (difficultyFilter !== 'all') {
      courses = courses.filter(c => c.difficulty === difficultyFilter);
    }
    if (priceFilter !== 'all') {
      courses = courses.filter(c => c.priceRange === priceFilter);
    }

    // Apply sorting
    switch (sortBy) {
      case 'distance':
        courses.sort((a, b) => a.distance - b.distance);
        break;
      case 'price':
        courses.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case 'price-desc':
        courses.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case 'difficulty':
        const diffOrder = { beginner: 0, intermediate: 1, advanced: 2 };
        courses.sort((a, b) => diffOrder[a.difficulty] - diffOrder[b.difficulty]);
        break;
    }

    return courses;
  }, [sortBy, showDrivingRangeOnly, difficultyFilter, priceFilter]);

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: '#F5F1E8' }}>
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-2 transition-all hover:opacity-70"
              style={{ color: '#1A1A1A' }}
            >
              <ChevronRight size={16} className="rotate-180" />
              New Search
            </button>
            <h1
              className="text-3xl md:text-4xl font-black uppercase tracking-tight"
              style={{ color: '#1A1A1A' }}
            >
              Courses Near {zipCode}
            </h1>
            <p className="text-sm mt-1" style={{ color: '#1A1A1A', opacity: 0.6 }}>
              {filteredAndSortedCourses.length} courses found
            </p>
          </div>
          <div
            className="hidden md:flex w-16 h-16 items-center justify-center"
            style={{ border: '3px solid #1A1A1A', backgroundColor: '#2C5530' }}
          >
            <Flag size={32} color="#F5F1E8" strokeWidth={2.5} />
          </div>
        </div>

        {/* Filter Controls */}
        <FilterControls
          sortBy={sortBy}
          setSortBy={setSortBy}
          showDrivingRangeOnly={showDrivingRangeOnly}
          setShowDrivingRangeOnly={setShowDrivingRangeOnly}
          difficultyFilter={difficultyFilter}
          setDifficultyFilter={setDifficultyFilter}
          priceFilter={priceFilter}
          setPriceFilter={setPriceFilter}
        />

        {/* Course Grid */}
        {filteredAndSortedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAndSortedCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onClick={() => onSelectCourse(course)}
              />
            ))}
          </div>
        ) : (
          <div
            className="text-center p-12"
            style={{ border: '3px solid #1A1A1A', backgroundColor: '#FFFFFF' }}
          >
            <p className="text-xl font-bold uppercase" style={{ color: '#1A1A1A' }}>
              No courses match your filters
            </p>
            <p className="mt-2" style={{ color: '#1A1A1A', opacity: 0.6 }}>
              Try adjusting your filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Course Detail Modal Component
const CourseDetail = ({ course, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const diffColors = getDifficultyColor(course.difficulty);

  // Get unique dates from tee times
  const availableDates = useMemo(() => {
    const dates = [...new Set(course.teeTimes.map(t => t.date))];
    return dates.sort();
  }, [course.teeTimes]);

  // Set initial selected date
  useMemo(() => {
    if (availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates, selectedDate]);

  // Get tee times for selected date grouped by period
  const timesByPeriod = useMemo(() => {
    if (!selectedDate) return { morning: [], afternoon: [], twilight: [] };

    const timesForDate = course.teeTimes.filter(t => t.date === selectedDate);
    return {
      morning: timesForDate.filter(t => t.period === 'morning'),
      afternoon: timesForDate.filter(t => t.period === 'afternoon'),
      twilight: timesForDate.filter(t => t.period === 'twilight')
    };
  }, [course.teeTimes, selectedDate]);

  return (
    <div
      className="fixed inset-0 z-40 overflow-auto"
      style={{ backgroundColor: 'rgba(26, 26, 26, 0.9)' }}
      onClick={onClose}
    >
      <div
        className="min-h-screen md:py-8 md:px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="max-w-4xl mx-auto"
          style={{ backgroundColor: '#F5F1E8' }}
        >
          {/* Modal Header */}
          <div
            className="sticky top-0 z-10 flex items-center justify-between p-4"
            style={{
              backgroundColor: '#1A1A1A',
              borderBottom: '3px solid #1A1A1A'
            }}
          >
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight" style={{ color: '#F5F1E8' }}>
              {course.name}
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center transition-all hover:opacity-70"
              style={{ backgroundColor: '#F5F1E8' }}
            >
              <X size={24} color="#1A1A1A" strokeWidth={3} />
            </button>
          </div>

          {/* Course Info */}
          <div className="p-6" style={{ borderBottom: '3px solid #1A1A1A' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span
                    className="px-3 py-1 text-sm font-bold uppercase tracking-wider"
                    style={{
                      backgroundColor: diffColors.bg,
                      color: diffColors.text,
                      border: '2px solid #1A1A1A'
                    }}
                  >
                    {course.difficulty}
                  </span>
                  <span
                    className="px-3 py-1 text-sm font-bold"
                    style={{
                      backgroundColor: '#D4C4A8',
                      color: '#1A1A1A',
                      border: '2px solid #1A1A1A',
                      fontFamily: 'ui-monospace, monospace'
                    }}
                  >
                    {course.priceRange}
                  </span>
                  <span
                    className="px-3 py-1 text-sm font-bold"
                    style={{
                      backgroundColor: '#1A1A1A',
                      color: '#F5F1E8',
                      border: '2px solid #1A1A1A',
                      fontFamily: 'ui-monospace, monospace'
                    }}
                  >
                    {course.holes}H / PAR {course.par}
                  </span>
                  {course.hasDrivingRange && (
                    <span
                      className="px-3 py-1 text-sm font-bold uppercase flex items-center gap-1"
                      style={{
                        backgroundColor: '#2C5530',
                        color: '#F5F1E8',
                        border: '2px solid #1A1A1A'
                      }}
                    >
                      <Target size={14} strokeWidth={2.5} />
                      Range
                    </span>
                  )}
                </div>

                <p className="mb-4" style={{ color: '#1A1A1A', lineHeight: 1.6 }}>
                  {course.description}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} color="#1A1A1A" />
                    <span style={{ color: '#1A1A1A' }}>
                      {course.address}, {course.city} — <span style={{ fontFamily: 'ui-monospace, monospace' }}>{course.distance} mi</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} color="#1A1A1A" />
                    <span style={{ color: '#1A1A1A', fontFamily: 'ui-monospace, monospace' }}>
                      Est. {course.yearEstablished}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column - Amenities */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: '#1A1A1A' }}>
                  Amenities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {course.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="px-3 py-2 text-sm"
                      style={{
                        border: '2px solid #1A1A1A',
                        backgroundColor: '#FFFFFF',
                        color: '#1A1A1A'
                      }}
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Date Selector */}
          <div className="p-6" style={{ borderBottom: '3px solid #1A1A1A', backgroundColor: '#D4C4A8' }}>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: '#1A1A1A' }}>
              Select Date
            </h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {availableDates.map((date) => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className="px-4 py-3 text-center whitespace-nowrap transition-all flex-shrink-0"
                  style={{
                    border: '3px solid #1A1A1A',
                    backgroundColor: selectedDate === date ? '#1A1A1A' : '#FFFFFF',
                    color: selectedDate === date ? '#F5F1E8' : '#1A1A1A',
                    minWidth: '100px'
                  }}
                >
                  <div className="text-sm font-bold uppercase">{formatDate(date)}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Tee Times Grid */}
          <div className="p-6">
            <h3 className="text-lg font-bold uppercase tracking-wider mb-4" style={{ color: '#1A1A1A' }}>
              Available Tee Times
            </h3>

            {/* Morning */}
            {timesByPeriod.morning.length > 0 && (
              <div className="mb-6">
                <div
                  className="flex items-center gap-2 mb-3 px-3 py-2"
                  style={{ backgroundColor: '#2C5530' }}
                >
                  <Clock size={16} color="#F5F1E8" />
                  <span className="text-sm font-bold uppercase tracking-wider" style={{ color: '#F5F1E8' }}>
                    Morning
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {timesByPeriod.morning.map((time) => (
                    <button
                      key={time.id}
                      className="p-3 text-center transition-all hover:translate-y-[-2px]"
                      style={{
                        border: '2px solid #1A1A1A',
                        backgroundColor: '#FFFFFF'
                      }}
                    >
                      <div
                        className="text-lg font-bold"
                        style={{ fontFamily: 'ui-monospace, monospace', color: '#1A1A1A' }}
                      >
                        {formatTime(time.time)}
                      </div>
                      <div className="text-sm font-bold" style={{ color: '#2C5530' }}>
                        ${time.price}
                      </div>
                      <div className="text-xs mt-1" style={{ color: '#1A1A1A', opacity: 0.6 }}>
                        {time.spots} {time.spots === 1 ? 'spot' : 'spots'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Afternoon */}
            {timesByPeriod.afternoon.length > 0 && (
              <div className="mb-6">
                <div
                  className="flex items-center gap-2 mb-3 px-3 py-2"
                  style={{ backgroundColor: '#D4C4A8' }}
                >
                  <Clock size={16} color="#1A1A1A" />
                  <span className="text-sm font-bold uppercase tracking-wider" style={{ color: '#1A1A1A' }}>
                    Afternoon
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {timesByPeriod.afternoon.map((time) => (
                    <button
                      key={time.id}
                      className="p-3 text-center transition-all hover:translate-y-[-2px]"
                      style={{
                        border: '2px solid #1A1A1A',
                        backgroundColor: '#FFFFFF'
                      }}
                    >
                      <div
                        className="text-lg font-bold"
                        style={{ fontFamily: 'ui-monospace, monospace', color: '#1A1A1A' }}
                      >
                        {formatTime(time.time)}
                      </div>
                      <div className="text-sm font-bold" style={{ color: '#2C5530' }}>
                        ${time.price}
                      </div>
                      <div className="text-xs mt-1" style={{ color: '#1A1A1A', opacity: 0.6 }}>
                        {time.spots} {time.spots === 1 ? 'spot' : 'spots'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Twilight */}
            {timesByPeriod.twilight.length > 0 && (
              <div className="mb-6">
                <div
                  className="flex items-center gap-2 mb-3 px-3 py-2"
                  style={{ backgroundColor: '#B85C38' }}
                >
                  <Clock size={16} color="#F5F1E8" />
                  <span className="text-sm font-bold uppercase tracking-wider" style={{ color: '#F5F1E8' }}>
                    Twilight
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {timesByPeriod.twilight.map((time) => (
                    <button
                      key={time.id}
                      className="p-3 text-center transition-all hover:translate-y-[-2px]"
                      style={{
                        border: '2px solid #1A1A1A',
                        backgroundColor: '#FFFFFF'
                      }}
                    >
                      <div
                        className="text-lg font-bold"
                        style={{ fontFamily: 'ui-monospace, monospace', color: '#1A1A1A' }}
                      >
                        {formatTime(time.time)}
                      </div>
                      <div className="text-sm font-bold" style={{ color: '#2C5530' }}>
                        ${time.price}
                      </div>
                      <div className="text-xs mt-1" style={{ color: '#1A1A1A', opacity: 0.6 }}>
                        {time.spots} {time.spots === 1 ? 'spot' : 'spots'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CTA Footer */}
          <div
            className="sticky bottom-0 p-6"
            style={{
              backgroundColor: '#1A1A1A',
              borderTop: '3px solid #1A1A1A'
            }}
          >
            <a
              href={course.website}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full p-4 text-center text-lg font-bold uppercase tracking-wider transition-all hover:translate-y-[-2px]"
              style={{
                border: '3px solid #F5F1E8',
                backgroundColor: '#2C5530',
                color: '#F5F1E8'
              }}
            >
              Book at Course Website
            </a>
            <p className="text-center text-sm mt-3" style={{ color: '#F5F1E8', opacity: 0.6 }}>
              {course.phone}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN APP COMPONENT
// ============================================
export default function GolfTeeTimes() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'list'
  const [zipCode, setZipCode] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);

  const handleZipCodeSubmit = (zip) => {
    setZipCode(zip);
    setCurrentView('list');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    setZipCode('');
    setSelectedCourse(null);
  };

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
  };

  const handleCloseDetail = () => {
    setSelectedCourse(null);
  };

  return (
    <>
      <NoiseOverlay />
      {currentView === 'landing' && (
        <LandingPage onSubmit={handleZipCodeSubmit} />
      )}
      {currentView === 'list' && (
        <CourseList
          zipCode={zipCode}
          onBack={handleBackToLanding}
          onSelectCourse={handleSelectCourse}
        />
      )}
      {selectedCourse && (
        <CourseDetail
          course={selectedCourse}
          onClose={handleCloseDetail}
        />
      )}
    </>
  );
}
