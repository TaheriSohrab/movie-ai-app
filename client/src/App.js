// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import './App.css';
//
// // کامپوننت هوک برای تشخیص صدا (بدون تغییر)
// const useVoiceRecognition = () => {
//     const [isListening, setIsListening] = useState(false);
//     const [transcript, setTranscript] = useState('');
//     const recognitionRef = useRef(null);
//
//     useEffect(() => {
//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//         if (!SpeechRecognition) {
//             console.warn('Speech Recognition not supported in this browser.');
//             return;
//         }
//
//         const recognition = new SpeechRecognition();
//         recognition.continuous = false;
//         recognition.lang = 'fa-IR';
//         recognition.interimResults = false;
//
//         recognition.onstart = () => setIsListening(true);
//         recognition.onresult = (event) => setTranscript(event.results[0][0].transcript);
//         recognition.onend = () => setIsListening(false);
//         recognition.onerror = (event) => {
//             console.error('Speech recognition error:', event.error);
//             setIsListening(false);
//         };
//
//         recognitionRef.current = recognition;
//     }, []);
//
//     const startListening = () => {
//         if (recognitionRef.current && !isListening) {
//             try {
//                 setTranscript('');
//                 recognitionRef.current.start();
//             } catch (error) {
//                 console.error("Could not start voice recognition:", error);
//                 alert("امکان فعال‌سازی جستجوی صوتی وجود ندارد.");
//             }
//         }
//     };
//
//     return { isListening, transcript, startListening };
// };
//
// // کامپوننت اصلی اپلیکیشن
// function App() {
//     const [searchQuery, setSearchQuery] = useState('');
//     // مقدار اولیه movies را یک آرایه خالی قرار می‌دهیم تا هرگز undefined نباشد
//     const [movies, setMovies] = useState([]);
//     const [resultsTitle, setResultsTitle] = useState('');
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [selectedMovie, setSelectedMovie] = useState(null);
//
//     const { isListening, transcript, startListening } = useVoiceRecognition();
//
//     // جستجوی خودکار بعد از اتمام تشخیص صدا
//     const handleSearchRef = useRef();
//
//     useEffect(() => {
//         handleSearchRef.current = (query) => handleSearch(query);
//     });
//
//     useEffect(() => {
//         if (transcript) {
//             setSearchQuery(transcript);
//             if (handleSearchRef.current) {
//                 handleSearchRef.current(transcript);
//             }
//         }
//     }, [transcript]);
//
//     useEffect(() => {
//         const fetchTrending = async () => {
//             setLoading(true);
//             setError(null);
//             try {
//                 const response = await axios.get('/api/trending');
//                 // --- اصلاح کلیدی اینجا انجام شده است ---
//                 // ما همیشه از response.data استفاده می‌کنیم
//                 // و چک می‌کنیم که results وجود داشته باشد
//                 if (response.data && response.data.results) {
//                     setMovies(response.data.results);
//                     setResultsTitle('محبوب‌ترین‌های امروز');
//                 } else {
//                     setMovies([]); // اگر نتیجه‌ای نبود، آرایه خالی ست کن
//                 }
//             } catch (error) {
//                 setError('خطا در دریافت لیست محبوب‌ترین‌ها.');
//                 console.error('Error fetching trending:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchTrending();
//     }, []);
//
//     const handleSearch = async (queryToSearch) => {
//         const finalQuery = typeof queryToSearch === 'string' ? queryToSearch : searchQuery;
//         if (!finalQuery.trim()) return;
//
//         setLoading(true);
//         setError(null);
//         setSelectedMovie(null);
//
//         try {
//             const response = await axios.post('/api/search', { query: finalQuery });
//             // چک کردن وجود results در پاسخ جستجو
//             setMovies(response.data.results || []);
//             setResultsTitle(response.data.title || ``);
//         } catch (error) {
//             setError(error.response?.data?.error || 'خطا در جستجو.');
//             console.error('Search error:', error);
//             setMovies([]); // در صورت خطا، آرایه را خالی کن
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const handleFormSubmit = (e) => {
//         e.preventDefault();
//         handleSearch(searchQuery);
//     }
//
//     // بقیه کامپوننت‌ها (MovieCard, MovieModal, JSX) بدون تغییر باقی می‌مانند
//     // ... (کدهای مربوط به کامپوننت‌های داخلی و JSX از پاسخ قبلی اینجا کپی شوند)
//     const MovieCard = ({ movie }) => (
//         <div className="movie-card" onClick={() => setSelectedMovie(movie)}>
//             <div className="movie-poster">
//                 <img
//                     src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'placeholder.svg'}
//                     alt={movie.title || movie.name}
//                     loading="lazy"
//                 />
//                 {movie.vote_average > 0 && (
//                     <div className="movie-score">
//                         <span>{Math.round(movie.vote_average * 10)}</span>
//                     </div>
//                 )}
//             </div>
//             <div className="movie-info">
//                 <h3>{movie.title || movie.name}</h3>
//                 <p>
//                     { (movie.release_date || movie.first_air_date) ? new Date(movie.release_date || movie.first_air_date).toLocaleDateString('fa-IR', { year: 'numeric' }) : ''}
//                 </p>
//             </div>
//         </div>
//     );
//
//     const MovieModal = ({ movie, onClose }) => {
//         if (!movie) return null;
//         return (
//             <div className="modal-overlay" onClick={onClose}>
//                 <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//                     <button className="modal-close" onClick={onClose}>×</button>
//                     <div className="modal-header">
//                         <img src={movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : ''} alt="" className="modal-backdrop"/>
//                         <div className="modal-header-overlay">
//                             <h2>{movie.title || movie.name}</h2>
//                             <div className="modal-meta">
//                                 <span>{new Date(movie.release_date || movie.first_air_date).toLocaleDateString('fa-IR')}</span>
//                                 <span>•</span>
//                                 <span>امتیاز: {Math.round(movie.vote_average * 10)} از ۱۰۰</span>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="modal-body">
//                         <div className="modal-poster"><img src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`: 'placeholder.svg'} alt={movie.title || movie.name}/></div>
//                         <div className="modal-details"><p>{movie.overview || 'توضیحاتی در دسترس نیست.'}</p></div>
//                     </div>
//                 </div>
//             </div>
//         );
//     };
//
//     return (
//         <div className="App">
//             <header className="app-header">
//                 <h1>Like That</h1>
//                 <p style={{fontSize:"20px",textTransform:"capitalize"}}>The First and The most Powerful Intelligent Movies/Series/Anime Search engine</p>
//             </header>
//
//             <main>
//                 <form onSubmit={handleFormSubmit}>
//                     <div className="search-form-container">
//                         <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
//                         <input
//                             type="text"
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                             placeholder={isListening ? "در حال گوش دادن..." : "جستجوی فیلم، سریال یا بازیگر..."}
//                             className="search-input"
//                             disabled={isListening}
//                         />
//                         <button type="button" className={`voice-btn ${isListening ? 'listening' : ''}`} onClick={startListening} title="جستجوی صوتی">
//                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11h-1c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92z"/></svg>
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
//                                 <MovieCard key={`${movie.id}-${movie.credit_id || ''}`} movie={movie} />
//                             ))}
//                         </div>
//                     </section>
//                 )}
//
//                 {!loading && !error && movies.length === 0 && (
//                     <div className="error-message">نتیجه‌ای یافت نشد. لطفاً عبارت دیگری را امتحان کنید.</div>
//                 )}
//
//             </main>
//
//             {selectedMovie && <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}
//         </div>
//     );
// }
//
//
// export default App;



// file: src/App.js

// file: src/App.js

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

// هوک تشخیص صدا بدون تغییر باقی می‌ماند
const useVoiceRecognition = ({ onResult }) => {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;
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
            if (event.error === 'not-allowed') alert('دسترسی به میکروفون داده نشد.');
            setIsListening(false);
        };
        recognitionRef.current = recognition;
    }, [onResult]);
    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            try {
                recognitionRef.current.start();
            } catch (error) {
                alert("امکان فعال‌سازی جستجوی صوتی وجود ندارد.");
            }
        }
    };
    return { isListening, startListening };
};

function App() {
    const [searchQuery, setSearchQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [resultsTitle, setResultsTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [detailedMovie, setDetailedMovie] = useState(null);
    const [isModalLoading, setIsModalLoading] = useState(false);

    const handleSearch = async (queryToSearch) => {
        if (!queryToSearch.trim()) return;
        setSearchQuery(queryToSearch); // نوار جستجو را هم آپدیت کن
        setLoading(true);
        setError(null);
        setSelectedMovie(null);
        try {
            const response = await axios.post('/api/search', { query: queryToSearch });
            setMovies(response.data.results || []);
            setResultsTitle(response.data.title || '');
        } catch (err) {
            setError(err.response?.data?.error || 'خطا در جستجو.');
            setMovies([]);
        } finally {
            setLoading(false);
        }
    };

    // --- تابع جدید برای کلیک روی بازیگر ---
    const handleActorClick = (actorName) => {
        closeModal();
        // یک تأخیر کوتاه می‌دهیم تا مودال کاملاً بسته شود و بعد جستجو انجام شود
        setTimeout(() => {
            handleSearch(actorName);
        }, 300);
    };

    const { isListening, startListening } = useVoiceRecognition({
        onResult: (transcript) => {
            handleSearch(transcript);
        }
    });

    useEffect(() => {
        const fetchTrending = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/api/trending');
                setMovies(response.data.results || []);
                setResultsTitle('محبوب‌ترین‌های امروز');
            } catch (err) {
                setError('خطا در دریافت لیست محبوب‌ترین‌ها.');
            } finally {
                setLoading(false);
            }
        };
        fetchTrending();
    }, []);

    const handleMovieClick = async (movie) => {
        setSelectedMovie(movie);
        setDetailedMovie(null);
        setIsModalLoading(true);
        try {
            const lang = movie.original_language === 'fa' ? 'fa-IR' : 'en-US';
            const type = movie.media_type === 'tv' || movie.first_air_date ? 'tv' : 'movie';
            const response = await axios.get(`/api/details/${type}/${movie.id}?lang=${lang}`);
            setDetailedMovie(response.data);
        } catch (error) {
            console.error("Failed to fetch movie details:", error);
        } finally {
            setIsModalLoading(false);
        }
    };

    const closeModal = () => {
        setSelectedMovie(null);
        setDetailedMovie(null);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        handleSearch(searchQuery);
    };

    return (
        <div className="App">
            <header className="app-header">
                {/*<h1>Like That</h1>*/}
                <img src="/assets/images/image.png" height={150} width={150} />

                <p style={{ fontSize: "20px", textTransform: "capitalize" }}>The First and The most Powerful Intelligent Movies/Series/Anime Search engine</p>
            </header>
            <main>
                <form onSubmit={handleFormSubmit}>
                    <div className="search-form-container">
                        <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={isListening ? "در حال گوش دادن..." : "جستجوی فیلم، سریال یا بازیگر..."} className="search-input" disabled={isListening} />
                        <button type="button" className={`voice-btn ${isListening ? 'listening' : ''}`} onClick={startListening} title="جستجوی صوتی">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" /><path d="M17 11h-1c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92z" /></svg>
                        </button>
                        <button type="submit" className="search-btn">جستجو</button>
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
        </div>
    );
}

const MovieCard = ({ movie, onMovieClick }) => (
    <div className="movie-card" onClick={() => onMovieClick(movie)}>
        <div className="movie-poster">
            <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'placeholder.svg'} alt={movie.title || movie.name} loading="lazy" />
        </div>
        <div className="movie-info">
            <h3>{movie.title || movie.name}</h3>
            <div className="genre-score-container">
                {movie.genres && movie.genres.length > 0 && (
                    <span className="movie-genres">{movie.genres.slice(0, 2).join(' • ')}</span>
                )}
                {movie.vote_average > 0 && (
                    <span className="movie-score-badge">{movie.vote_average.toFixed(1)}</span>
                )}
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
                {!isLoading && (
                    <>
                        <div className="modal-header">
                            <img src={finalData.backdrop_path ? `https://image.tmdb.org/t/p/w1280${finalData.backdrop_path}` : ''} alt="" className="modal-backdrop" />
                            <div className="modal-header-overlay">
                                <h2>{finalData.title || finalData.name}</h2>
                                {finalData.tagline && <p className="tagline">"{finalData.tagline}"</p>}
                                <div className="modal-meta">
                                    {releaseDate && <span>{new Date(releaseDate).toLocaleDateString('en')}</span>}
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

export default App;