import { useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { MapPin } from 'lucide-react';

type WeatherCondition = 'sunny' | 'rainy' | 'snowy' | 'default';

type WeatherSample = {
  city: string;
  temp: number;
  description: string;
  feelsLike: number;
  min: number;
  max: number;
};

const sampleData: WeatherSample = {
  city: 'İstanbul',
  temp: 24,
  description: 'Güneşli', // Örnek olarak güneşli hava
  feelsLike: 25,
  min: 20,
  max: 27,
};

const forecastData = [
  { day: 'Pzt', temp: 22 },
  { day: 'Sal', temp: 24 },
  { day: 'Çar', temp: 23 },
  { day: 'Per', temp: 26 },
  { day: 'Cum', temp: 25 },
];

function detectCondition(description: string): WeatherCondition {
  const text = description.toLowerCase();

  if (text.includes('güneş') || text.includes('sun')) return 'sunny';
  if (text.includes('yağmur') || text.includes('rain')) return 'rainy';
  if (text.includes('kar') || text.includes('snow')) return 'snowy';

  return 'default';
}

function getBackgroundClass(condition: WeatherCondition): string {
  switch (condition) {
    case 'sunny':
      // Parlak mavi ve sarı gradyan
      return 'bg-gradient-to-br from-sky-300 via-sky-500 to-amber-300';
    case 'rainy':
      // Koyu gri ve mavi tonları
      return 'bg-gradient-to-br from-slate-900 via-slate-800 to-sky-800';
    case 'snowy':
      // Beyaz ve açık gri geçişleri
      return 'bg-gradient-to-br from-slate-100 via-slate-200 to-sky-100';
    default:
      // Bulutlu / nötr hava
      return 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900';
  }
}

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherSample>(sampleData);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Buraya şehir ismine göre API isteğini daha sonra ekleyebiliriz
    console.log('Şehir arandı:', city);

    if (!city.trim()) return;

    // Şimdilik sadece örnek veriyi güncelliyoruz
    setWeather({
      ...sampleData,
      city: city.trim(),
    });
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Tarayıcınız konum bilgisini desteklemiyor.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Konum alındı:', latitude, longitude);

        // Burada enlem-boylama göre gerçek hava durumu API çağrısı yapılabilir.
        // Şimdilik örnek veriyi "bulunduğun konum" olarak gösteriyoruz.
        setWeather({
          ...sampleData,
          city: 'Bulunduğun Konum',
          description: 'Konumuna göre örnek hava durumu',
        });

        setIsLocating(false);
      },
      () => {
        setLocationError('Konum alınırken bir hata oluştu veya izin verilmedi.');
        setIsLocating(false);
      },
    );
  };

  const condition = detectCondition(weather.description);
  const backgroundClass = getBackgroundClass(condition);

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 transition-all duration-700 ease-out ${backgroundClass}`}
    >
      <div className="w-full max-w-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-sky-300">
            Hava Durumu
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Şehir ismini yazarak güncel hava durumunu görüntüleyin.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 mb-2 sm:mb-3"
        >
          <input
            type="text"
            placeholder="Örn: İstanbul"
            className="flex-1 rounded-xl bg-slate-800/80 border border-slate-700 px-4 py-3 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <div className="flex gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleUseLocation}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900/80 border border-slate-700 px-3 py-3 text-xs sm:text-sm text-slate-100 hover:bg-slate-800 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-700 focus:ring-offset-slate-900 whitespace-nowrap"
            >
              <MapPin className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline">
                {isLocating ? 'Konum Alınıyor...' : 'Konumumu Kullan'}
              </span>
              <span className="sm:hidden">{isLocating ? 'Konum...' : 'Konum'}</span>
            </button>
            <button
              type="submit"
              className="rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium px-5 py-3 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-900"
            >
              Ara
            </button>
          </div>
        </form>

        {locationError && (
          <p className="mb-4 text-xs text-amber-300">
            {locationError}
          </p>
        )}

        <div className="rounded-2xl bg-slate-800/80 border border-slate-700 shadow-lg shadow-slate-900/40 p-5 backdrop-blur">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Şehir
              </p>
              <p className="text-xl font-semibold text-slate-50">
                {weather.city}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Sıcaklık
              </p>
              <p className="text-3xl font-semibold text-sky-300">
                {weather.temp}
                <span className="text-base align-top ml-0.5">°C</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-700 pt-4 mt-3">
            <p className="text-sm text-slate-200">{weather.description}</p>
            <div className="flex gap-4 text-xs text-slate-400">
              <span>Hissedilen: {weather.feelsLike}°C</span>
              <span>Min: {weather.min}°C</span>
              <span>Max: {weather.max}°C</span>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-700 pt-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
              5 Günlük Sıcaklık Tahmini
            </p>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: '#9ca3af', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#6b7280', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    width={30}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#020617',
                      border: '1px solid #1f2937',
                      borderRadius: 12,
                      padding: '8px 10px',
                    }}
                    labelStyle={{ color: '#9ca3af', fontSize: 11 }}
                    itemStyle={{ color: '#e5e7eb', fontSize: 12 }}
                    formatter={(value: number) => [`${value}°C`, 'Sıcaklık']}
                  />
                  <Area
                    type="monotone"
                    dataKey="temp"
                    stroke="#38bdf8"
                    strokeWidth={2}
                    fill="url(#tempGradient)"
                    dot={{ r: 3, strokeWidth: 1, stroke: '#0f172a', fill: '#38bdf8' }}
                    activeDot={{ r: 5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <p className="mt-3 text-[11px] text-slate-500">
            Not: Şu anda örnek veri gösteriliyor. Daha sonra gerçek bir hava
            durumu API&apos;sine bağlayabiliriz.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;



