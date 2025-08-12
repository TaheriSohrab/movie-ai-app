// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import './App.css';
//
// // هوک تشخیص صدا بدون تغییر باقی می‌ماند
// const useVoiceRecognition = ({ onResult }) => {
//     const [isListening, setIsListening] = useState(false);
//     const recognitionRef = useRef(null);
//     useEffect(() => {
//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//         if (!SpeechRecognition) return;
//         const recognition = new SpeechRecognition();
//         recognition.continuous = false;
//         recognition.lang = 'fa-IR';
//         recognition.interimResults = false;
//         recognition.onstart = () => setIsListening(true);
//         recognition.onend = () => setIsListening(false);
//         recognition.onresult = (event) => {
//             const transcript = event.results[0][0].transcript;
//             if (onResult) onResult(transcript);
//         };
//         recognition.onerror = (event) => {
//             console.error('Speech recognition error:', event.error);
//             if (event.error === 'not-allowed') alert('دسترسی به میکروفون داده نشد.');
//             setIsListening(false);
//         };
//         recognitionRef.current = recognition;
//     }, [onResult]);
//     const startListening = () => {
//         if (recognitionRef.current && !isListening) {
//             try {
//                 recognitionRef.current.start();
//             } catch (error) {
//                 alert("امکان فعال‌سازی جستجوی صوتی وجود ندارد.");
//             }
//         }
//     };
//     return { isListening, startListening };
// };
//
// function App() {
//     const [searchQuery, setSearchQuery] = useState('');
//     const [movies, setMovies] = useState([]);
//     const [resultsTitle, setResultsTitle] = useState('');
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [selectedMovie, setSelectedMovie] = useState(null);
//     const [detailedMovie, setDetailedMovie] = useState(null);
//     const [isModalLoading, setIsModalLoading] = useState(false);
//
//     const handleSearch = async (queryToSearch) => {
//         if (!queryToSearch.trim()) return;
//         setSearchQuery(queryToSearch); // نوار جستجو را هم آپدیت کن
//         setLoading(true);
//         setError(null);
//         setSelectedMovie(null);
//         try {
//             const response = await axios.post('/api/search', { query: queryToSearch });
//             setMovies(response.data.results || []);
//             setResultsTitle(response.data.title || '');
//         } catch (err) {
//             setError(err.response?.data?.error || 'خطا در جستجو.');
//             setMovies([]);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     // --- تابع جدید برای کلیک روی بازیگر ---
//     const handleActorClick = (actorName) => {
//         closeModal();
//         // یک تأخیر کوتاه می‌دهیم تا مودال کاملاً بسته شود و بعد جستجو انجام شود
//         setTimeout(() => {
//             handleSearch(actorName);
//         }, 300);
//     };
//
//     const { isListening, startListening } = useVoiceRecognition({
//         onResult: (transcript) => {
//             handleSearch(transcript);
//         }
//     });
//
//     useEffect(() => {
//         const fetchTrending = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.get('/api/trending');
//                 setMovies(response.data.results || []);
//                 setResultsTitle('محبوب‌ترین‌های امروز');
//             } catch (err) {
//                 setError('خطا در دریافت لیست محبوب‌ترین‌ها.');
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchTrending();
//     }, []);
//
//     const handleMovieClick = async (movie) => {
//         setSelectedMovie(movie);
//         setDetailedMovie(null);
//         setIsModalLoading(true);
//         try {
//             const lang = movie.original_language === 'fa' ? 'fa-IR' : 'en-US';
//             const type = movie.media_type === 'tv' || movie.first_air_date ? 'tv' : 'movie';
//             const response = await axios.get(`/api/details/${type}/${movie.id}?lang=${lang}`);
//             setDetailedMovie(response.data);
//         } catch (error) {
//             console.error("Failed to fetch movie details:", error);
//         } finally {
//             setIsModalLoading(false);
//         }
//     };
//
//     const closeModal = () => {
//         setSelectedMovie(null);
//         setDetailedMovie(null);
//     };
//
//     const handleFormSubmit = (e) => {
//         e.preventDefault();
//         handleSearch(searchQuery);
//     };
//
//     return (
//         <div className="App">
//             <header className="app-header">
//                 {/*<h1>Like That</h1>*/}
//                 <img src="/assets/images/image.png" height={150} width={150} />
//
//                 <p style={{ fontSize: "20px", textTransform: "capitalize" }}>The First and The most Powerful Intelligent Movies/Series/Anime Search engine</p>
//             </header>
//             <main>
//                 <form onSubmit={handleFormSubmit}>
//                     <div className="search-form-container">
//                         <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
//                         <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={isListening ? "در حال گوش دادن..." : "جستجوی فیلم، سریال یا بازیگر..."} className="search-input" disabled={isListening} />
//                         <button type="button" className={`voice-btn ${isListening ? 'listening' : ''}`} onClick={startListening} title="جستجوی صوتی">
//                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" /><path d="M17 11h-1c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92z" /></svg>
//                         </button>
//                         <button type="submit" className="search-btn">جستجو</button>
//                     </div>
//                 </form>
//
//                 {loading && <div className="loading-container"><div className="spinner"></div></div>}
//                 {error && <div className="error-message">{error}</div>}
//
//                 {!loading && !error && movies.length > 0 && (
//                     <section className="results-section">
//                         <h2>{resultsTitle}</h2>
//                         <div className="movies-grid">
//                             {movies.map((movie) => (
//                                 <MovieCard key={`${movie.id}-${movie.credit_id || ''}`} movie={movie} onMovieClick={handleMovieClick} />
//                             ))}
//                         </div>
//                     </section>
//                 )}
//                 {!loading && !error && movies.length === 0 && resultsTitle && !resultsTitle.includes("محبوب") && (
//                     <div className="error-message">نتیجه‌ای یافت نشد. لطفاً عبارت دیگری را امتحان کنید.</div>
//                 )}
//             </main>
//             <MovieModal
//                 movie={selectedMovie}
//                 details={detailedMovie}
//                 isLoading={isModalLoading}
//                 onClose={closeModal}
//                 onActorClick={handleActorClick}
//             />
//         </div>
//     );
// }
//
// const MovieCard = ({ movie, onMovieClick }) => (
//     <div className="movie-card" onClick={() => onMovieClick(movie)}>
//         <div className="movie-poster">
//             <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'placeholder.svg'} alt={movie.title || movie.name} loading="lazy" />
//         </div>
//         <div className="movie-info">
//             <h3>{movie.title || movie.name}</h3>
//             <div className="genre-score-container">
//                 {movie.genres && movie.genres.length > 0 && (
//                     <span className="movie-genres">{movie.genres.slice(0, 2).join(' • ')}</span>
//                 )}
//                 {movie.vote_average > 0 && (
//                     <span className="movie-score-badge">{movie.vote_average.toFixed(1)}</span>
//                 )}
//             </div>
//         </div>
//     </div>
// );
//
// const MovieModal = ({ movie, details, isLoading, onClose, onActorClick }) => {
//     if (!movie) return null;
//     const finalData = details || movie;
//     const releaseDate = finalData.release_date || finalData.first_air_date;
//
//     return (
//         <div className="modal-overlay" onClick={onClose}>
//             <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//                 <button className="modal-close" onClick={onClose}>×</button>
//                 {isLoading && <div className="modal-spinner-container"><div className="spinner"></div></div>}
//                 {!isLoading && (
//                     <>
//                         <div className="modal-header">
//                             <img src={finalData.backdrop_path ? `https://image.tmdb.org/t/p/w1280${finalData.backdrop_path}` : ''} alt="" className="modal-backdrop" />
//                             <div className="modal-header-overlay">
//                                 <h2>{finalData.title || finalData.name}</h2>
//                                 {finalData.tagline && <p className="tagline">"{finalData.tagline}"</p>}
//                                 <div className="modal-meta">
//                                     {releaseDate && <span>{new Date(releaseDate).toLocaleDateString('en')}</span>}
//                                     {finalData.vote_average > 0 && <span>•</span>}
//                                     {finalData.vote_average > 0 && <span>امتیاز: {Math.round(finalData.vote_average * 10)} از ۱۰۰</span>}
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="modal-body">
//                             <div className="modal-poster"><img src={finalData.poster_path ? `https://image.tmdb.org/t/p/w500${finalData.poster_path}` : 'placeholder.svg'} alt={finalData.title || finalData.name} /></div>
//                             <div className="modal-details">
//                                 <h3>درباره فیلم</h3>
//                                 <p>{finalData.overview || 'توضیحاتی در دسترس نیست.'}</p>
//                                 {details?.director && (
//                                     <div className="credits-section">
//                                         <h4>کارگردان</h4>
//                                         <p className="director-name">{details.director.name}</p>
//                                     </div>
//                                 )}
//                                 {details?.cast && details.cast.length > 0 && (
//                                     <div className="credits-section">
//                                         <h4>بازیگران اصلی</h4>
//                                         <div className="cast-grid">
//                                             {details.cast.map(actor => (
//                                                 <div key={actor.id} className="cast-member" onClick={() => onActorClick(actor.name)}>
//                                                     <img src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : 'placeholder.svg'} alt={actor.name} />
//                                                     <div className="cast-info">
//                                                         <span className="actor-name">{actor.name}</span>
//                                                         <span className="character-name">{actor.character}</span>
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };
//
// export default App;

// file: src/App.js

import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import './App.css';

// --- Axios Instance with Auth Interceptor ---
const api = axios.create({ baseURL: process.env.REACT_APP_SERVER_URL || 'http://localhost:4000' });
api.interceptors.request.use(config => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// --- Voice Recognition Hook ---
const useVoiceRecognition = ({ onResult }) => {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn('Speech Recognition not supported in this browser.');
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'fa-IR';
        recognition.interimResults = false;
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            if (onResult) onResult(transcript);
        };
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'not-allowed') alert('دسترسی به میکروفون داده نشد. لطفاً در تنظیمات مرورگر خود دسترسی را فعال کنید.');
            setIsListening(false);
        };
        recognitionRef.current = recognition;
    }, [onResult]);

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            try {
                recognitionRef.current.start();
            } catch (error) {
                console.error("Could not start voice recognition:", error);
                alert("امکان فعال‌سازی جستجوی صوتی وجود ندارد.");
            }
        }
    };
    return { isListening, startListening };
};

// --- Main App Component ---
function App() {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [showLoginPromptModal, setShowLoginPromptModal] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [resultsTitle, setResultsTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [selectedMovie, setSelectedMovie] = useState(null);
    const [detailedMovie, setDetailedMovie] = useState(null);
    const [isModalLoading, setIsModalLoading] = useState(false);
    const [trendingMovies, setTrendingMovies] = useState([]);

    const fetchCurrentUser = useCallback(async () => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            setAuthLoading(false);
            return;
        }
        try {
            const { data } = await api.get('/api/current_user');
            setUser(data);
        } catch (err) {
            localStorage.removeItem('jwtToken');
            setUser(null);
        } finally {
            setAuthLoading(false);
        }
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        if (token) {
            localStorage.setItem('jwtToken', token);
            window.history.pushState({}, document.title, "/");
        }
        fetchCurrentUser();
    }, [fetchCurrentUser]);

    const handleSearch = async (queryToSearch) => {
        if (!queryToSearch.trim()) return;
        if (!user) return setShowLoginPromptModal(true);
        if (user && !user.isPro && user.searchesLeft <= 0) return setShowUpgradeModal(true);

        setLoading(true);
        setError(null);
        setSearchQuery(queryToSearch);
        setMovies([]);

        try {
            const response = await api.post('/api/search', { query: queryToSearch });
            setMovies(response.data.results || []);
            setResultsTitle(response.data.title || '');
            if (response.data.userData) {
                setUser(prevUser => ({ ...prevUser, ...response.data.userData }));
            }
        } catch (err) {
            if (err.response && err.response.status === 402) {
                setShowUpgradeModal(true);
                setError('اعتبار جستجوی شما تمام شده است.');
            } else {
                setError(err.response?.data?.error || 'خطا در جستجو.');
            }
            setMovies([]);
        } finally {
            setLoading(false);
        }
    };

    const handleActorClick = (actorName) => {
        closeModal();
        setTimeout(() => handleSearch(actorName), 300);
    };

    const handleMovieClick = async (movie) => {
        if (!user) return setShowLoginPromptModal(true);
        if (user && !user.isPro && user.searchesLeft <= 0) return setShowUpgradeModal(true);

        setSelectedMovie(movie);
        setDetailedMovie(null);
        setIsModalLoading(true);
        try {
            const type = movie.media_type === 'tv' || movie.first_air_date ? 'tv' : 'movie';
            const response = await api.get(`/api/details/${type}/${movie.id}`);
            setDetailedMovie(response.data);
        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 402) {
                closeModal();
                setError('برای مشاهده جزئیات، لطفاً وارد شوید یا اشتراک خود را بررسی کنید.');
            }
        } finally {
            setIsModalLoading(false);
        }
    };

    const { isListening, startListening } = useVoiceRecognition({
        onResult: (transcript) => handleSearch(transcript)
    });

    const fetchTrending = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_SERVER_URL || 'http://localhost:4000'}/api/trending`);
            const trending = response.data.results || [];
            setTrendingMovies(trending);
            setMovies(trending);
            setResultsTitle('محبوب‌ترین‌های امروز');
        } catch (err) {
            setError('خطا در دریافت لیست محبوب‌ترین‌ها.');
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => { fetchTrending(); }, [fetchTrending]);

    const handleLogoClick = () => {
        setSearchQuery('');
        setError(null);
        setMovies(trendingMovies);
        setResultsTitle('محبوب‌ترین‌های امروز');
    };

    const handleLogin = () => { window.location.href = `${process.env.REACT_APP_SERVER_URL || 'http://localhost:4000'}/auth/google`; };
    const closeModal = () => { setSelectedMovie(null); setDetailedMovie(null); };

    if (authLoading) {
        return <div className="loading-container"><div className="spinner"></div></div>;
    }

    return (
        <div className="App">
            <header className="app-header">
                <div className="auth-section">
                    {user ? (
                        <div className="user-profile">
                            <span className="search-credit">{user.isPro ? 'Pro' : `${user.searchesLeft} جستجو`}</span>
                            <span>{user.displayName}</span>
                            <img src={user.photo} alt={user.displayName} />
                        </div>
                    ) : (
                        <button onClick={handleLogin} className="login-btn">ورود با گوگل</button>
                    )}
                </div>
                <h1 onClick={handleLogoClick} style={{ cursor: 'pointer' }}>Like That</h1>
                <p style={{fontSize:"20px",textTransform:"capitalize"}}>The First and The most Powerful Intelligent Movies/Series/Anime Search engine</p>
            </header>

            <main>
                <form onSubmit={(e) => { e.preventDefault(); handleSearch(searchQuery); }}>
                    <div className="search-form-container">
                        <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={isListening ? "در حال گوش دادن..." : "جستجوی فیلم، سریال، ژانر یا بازیگر..."} className="search-input" disabled={isListening} />
                        <button type="button" className={`voice-btn ${isListening ? 'listening' : ''}`} onClick={startListening} title="جستجوی صوتی">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" /><path d="M17 11h-1c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92z" /></svg>
                        </button>
                        <button type="submit" className="search-btn" disabled={loading || showUpgradeModal}>
                            {loading ? '...' : 'جستجو'}
                        </button>
                    </div>
                </form>

                {loading && <div className="loading-container"><div className="spinner"></div></div>}
                {error && <div className="error-message">{error}</div>}

                {!loading && !error && movies.length > 0 && (
                    <section className="results-section">
                        <h2>{resultsTitle}</h2>
                        <div className="movies-grid">
                            {movies.map((movie) => (
                                <MovieCard key={`${movie.id}-${movie.credit_id || ''}`} movie={movie} onMovieClick={handleMovieClick} />
                            ))}
                        </div>
                    </section>
                )}
                {!loading && !error && movies.length === 0 && resultsTitle && !resultsTitle.includes("محبوب") && (
                    <div className="error-message">نتیجه‌ای یافت نشد. لطفاً عبارت دیگری را امتحان کنید.</div>
                )}
            </main>

            <MovieModal
                movie={selectedMovie}
                details={detailedMovie}
                isLoading={isModalLoading}
                onClose={closeModal}
                onActorClick={handleActorClick}
            />

            {showLoginPromptModal && <LoginPromptModal onClose={() => setShowLoginPromptModal(false)} onLogin={handleLogin} />}
            {showUpgradeModal && <UpgradeModal onClose={() => setShowUpgradeModal(false)} />}
        </div>
    );
}

// --- Reusable Components (Defined outside the main App component) ---

const MovieCard = ({ movie, onMovieClick }) => (
    <div className="movie-card" onClick={() => onMovieClick(movie)}>
        <div className="movie-poster">
            <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'placeholder.svg'} alt={movie.title || movie.name} loading="lazy" />
        </div>
        <div className="movie-info">
            <h3>{movie.title || movie.name}</h3>
            <div className="genre-score-container">
                {movie.genres && movie.genres.length > 0 && <span className="movie-genres">{movie.genres.slice(0, 2).join(' • ')}</span>}
                {movie.vote_average > 0 && <span className="movie-score-badge">{movie.vote_average.toFixed(1)}</span>}
            </div>
        </div>
    </div>
);

const MovieModal = ({ movie, details, isLoading, onClose, onActorClick }) => {
    if (!movie) return null;
    const finalData = details || movie;
    const releaseDate = finalData.release_date || finalData.first_air_date;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>×</button>
                {isLoading && <div className="modal-spinner-container"><div className="spinner"></div></div>}
                {!isLoading && finalData && (
                    <>
                        <div className="modal-header">
                            <img src={finalData.backdrop_path ? `https://image.tmdb.org/t/p/w1280${finalData.backdrop_path}` : ''} alt="" className="modal-backdrop" />
                            <div className="modal-header-overlay">
                                <h2>{finalData.title || finalData.name}</h2>
                                {finalData.tagline && <p className="tagline">"{finalData.tagline}"</p>}
                                <div className="modal-meta">
                                    {releaseDate && <span>{new Date(releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>}
                                    {finalData.vote_average > 0 && <span>•</span>}
                                    {finalData.vote_average > 0 && <span>امتیاز: {Math.round(finalData.vote_average * 10)} از ۱۰۰</span>}
                                </div>
                            </div>
                        </div>
                        <div className="modal-body">
                            <div className="modal-poster"><img src={finalData.poster_path ? `https://image.tmdb.org/t/p/w500${finalData.poster_path}` : 'placeholder.svg'} alt={finalData.title || finalData.name} /></div>
                            <div className="modal-details">
                                <h3>درباره فیلم</h3>
                                <p>{finalData.overview || 'توضیحاتی در دسترس نیست.'}</p>
                                {details?.director && (
                                    <div className="credits-section">
                                        <h4>کارگردان</h4>
                                        <p className="director-name">{details.director.name}</p>
                                    </div>
                                )}
                                {details?.cast && details.cast.length > 0 && (
                                    <div className="credits-section">
                                        <h4>بازیگران اصلی</h4>
                                        <div className="cast-grid">
                                            {details.cast.map(actor => (
                                                <div key={actor.id} className="cast-member" onClick={() => onActorClick(actor.name)}>
                                                    <img src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : 'placeholder.svg'} alt={actor.name} />
                                                    <div className="cast-info">
                                                        <span className="actor-name">{actor.name}</span>
                                                        <span className="character-name">{actor.character}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const LoginPromptModal = ({ onClose, onLogin }) => (
    <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content subscription-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={onClose}>×</button>
            <h2>لطفاً وارد شوید</h2>
            <p>برای استفاده از جستجوی هوشمند، ابتدا باید وارد حساب کاربری خود شوید.</p>
            <button onClick={onLogin} className="google-login-btn">
                <svg viewBox="0 0 48 48" width="24px" height="24px"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></svg>
                <span>ورود با گوگل</span>
            </button>
        </div>
    </div>
);

const UpgradeModal = ({ onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content upgrade-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={onClose}>×</button>
            <h2>اعتبار شما به پایان رسید!</h2>
            <p>برای ادامه، یکی از پلن‌های ویژه ما را انتخاب کنید.</p>
            <div className="subscription-tiers">
                <div className="tier">
                    <div className="tier-icon">🎟️</div>
                    <h3>Cinephile</h3>
                    <div className="tier-price">$4.99 <span>/ ماه</span></div>
                    <ul className="tier-features">
                        <li>✓ جستجوی نامحدود</li>
                        <li>✓ دسترسی به تمام جزئیات</li>
                        <li>✓ ذخیره در علاقه‌مندی‌ها</li>
                    </ul>
                    <button className="purchase-btn">انتخاب پلن</button>
                </div>
                <div className="tier popular">
                    <span className="popular-badge">پیشنهاد ویژه</span>
                    <div className="tier-icon">🎬</div>
                    <h3>Director's Cut</h3>
                    <div className="tier-price">$9.99 <span>/ ماه</span></div>
                    <ul className="tier-features">
                        <li>✓ تمام ویژگی‌های Cinephile</li>
                        <li>✓ **جستجو با هوش مصنوعی پیشرفته**</li>
                        <li>✓ پیشنهادات شخصی‌سازی شده</li>
                        <li>✓ دسترسی زودهنگام به قابلیت‌ها</li>
                    </ul>
                    <button className="purchase-btn">انتخاب پلن</button>
                </div>
            </div>
        </div>
    </div>
);

export default App;