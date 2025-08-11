// import 'dotenv/config';
// import express from "express";
// import fetch from "node-fetch";
// import OpenAI from "openai";
// import cors from "cors";
//
// const app = express();
// app.use(cors());
// app.use(express.json());
//
// const PORT = process.env.PORT || 3001;
// const TMDB_API_KEY = process.env.TMDB_API_KEY;
// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
//
// if (!TMDB_API_KEY || !OPENAI_API_KEY) {
//     console.error("FATAL ERROR: API keys are missing. Check your .env file.");
//     process.exit(1);
// }
// const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
//
//
// // --- توابع کمکی ---
// async function searchTMDB(type, query, lang = 'en') {
//     const url = `https://api.themoviedb.org/3/search/${type}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=${lang}`;
//     return (await fetch(url)).json();
// }
// async function findMoviesWithActor(personId, lang = 'en') {
//     const url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_cast=${personId}&sort_by=popularity.desc&language=${lang}`;
//     return (await fetch(url)).json();
// }
// async function findSimilarMovies(movieId, lang = 'en') {
//     const url = `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${TMDB_API_KEY}&language=${lang}`;
//     return (await fetch(url)).json();
// }
//
// // --- توابع هوش مصنوعی ---
// async function detectLanguage(query) {
//     const prompt = `Detect the primary language of the text. Respond with 'en' for Persian or 'en-US' for English. Text: "${query}". Return JSON: { "lang": "code" }`;
//     try {
//         const completion = await openai.chat.completions.create({
//             model: "gpt-4o-mini",
//             messages: [{ role: "user", content: prompt }],
//             response_format: { type: "json_object" },
//         });
//         return JSON.parse(completion.choices[0].message.content).lang || 'en';
//     } catch {
//         return 'en'; // Fallback
//     }
// }
// async function findMovieByContext(query) {
//     const prompt = `A user provided a phrase (dialogue, character, or theme): "${query}". Identify the original English movie/show title. Return JSON: { "title": "The English Title" } or null.`;
//     try {
//         const completion = await openai.chat.completions.create({ model: "gpt-4o-mini", messages: [{ role: "user", content: prompt }], response_format: { type: "json_object" } });
//         return JSON.parse(completion.choices[0].message.content).title;
//     } catch (error) {
//         console.error("OpenAI context search failed:", error.message);
//         return null;
//     }
// }
//
// // --- روت اصلی ---
// app.post("/api/search", async (req, res) => {
//     const { query } = req.body;
//     if (!query) return res.status(400).json({ error: "Query is required" });
//     console.log(`\n--- New Search Request --- Query: "${query}"`);
//
//     try {
//         const lang = await detectLanguage(query);
//         console.log(`Language Detected: ${lang}`);
//
//         const [personSearch, movieSearch] = await Promise.all([
//             searchTMDB('person', query, lang),
//             searchTMDB('movie', query, lang)
//         ]);
//
//         const topPerson = personSearch.results?.[0];
//         const topMovie = movieSearch.results?.[0];
//
//         const personPopularity = topPerson?.popularity || 0;
//         const moviePopularity = topMovie?.popularity || 0;
//
//         console.log(`Popularity Check - Movie: ${moviePopularity}, Person: ${personPopularity}`);
//
//         const SENSITIVITY_FACTOR = 4;
//
//         if (topPerson && (personPopularity > moviePopularity * SENSITIVITY_FACTOR || (topMovie && topMovie.title.toLowerCase() !== query.toLowerCase() && personPopularity > moviePopularity))) {
//             console.log(`Decision: Actor search for "${topPerson.name}"`);
//             const movies = await findMoviesWithActor(topPerson.id, lang);
//             const title = lang === 'en' ? `فیلم‌های با حضور ${topPerson.name}` : `Movies featuring ${topPerson.name}`;
//             return res.json({ results: movies.results || [], title });
//         }
//
//         if (topMovie) {
//             console.log(`Decision: Similar movies search for "${topMovie.title}"`);
//             const similarMovies = await findSimilarMovies(topMovie.id, lang);
//             const title = lang === 'en' ? `آثاری با حال و هوای «${topMovie.title}»` : `Works with the vibe of "${topMovie.title}"`;
//             return res.json({ results: similarMovies.results || [], title });
//         }
//
//         console.log("Decision: Context search with AI");
//         const aiSuggestedTitle = await findMovieByContext(query);
//         if (aiSuggestedTitle) {
//             const contextSearch = await searchTMDB('multi', aiSuggestedTitle, lang);
//             const title = lang === 'en' ? `نتیجه یافت‌شده برای: «${query}»` : `Result for: "${query}"`;
//             return res.json({ results: contextSearch.results || [], title });
//         }
//
//         console.log("Decision: No clear intent, returning empty.");
//         const title = lang === 'en' ? `نتیجه‌ای برای «${query}» یافت نشد` : `No results found for "${query}"`;
//         return res.json({ results: [], title });
//
//     } catch (err) {
//         console.error("[Main Handler] UNCAUGHT ERROR:", err);
//         res.status(500).json({ error: "Internal server error." });
//     }
// });
//
//
// app.get("/api/trending", async (req, res) => {
//     try {
//         const url = `https://api.themoviedb.org/3/trending/all/day?api_key=${TMDB_API_KEY}&language=en`;
//         const data = await (await fetch(url)).json();
//         res.json(data);
//     } catch (err) { res.status(500).json({ error: 'Could not get trending list.' }); }
// });
//
// app.listen(PORT, () => console.log(`✅ Server is running on http://localhost:${PORT}`));


// file: server/index.js

import 'dotenv/config';
import express from "express";
import fetch from "node-fetch";
import OpenAI from "openai";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!TMDB_API_KEY || !OPENAI_API_KEY) {
    console.error("FATAL ERROR: API keys are missing. Check your .env file.");
    process.exit(1);
}
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// --- مدیریت ژانرها ---
let genreMap = new Map();
let genreNameToIdMap = new Map();

async function initializeGenres() {
    try {
        const [faGenres, enGenres] = await Promise.all([
            fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=fa-IR`).then(res => res.json()),
            fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`).then(res => res.json())
        ]);

        faGenres.genres.forEach(genre => genreMap.set(genre.id, genre.name));
        enGenres.genres.forEach(genre => genreNameToIdMap.set(genre.name.toLowerCase(), genre.id));

        console.log("✅ Genres initialized successfully (Persian & English).");
    } catch (error) {
        console.error("❌ Failed to initialize genres:", error);
    }
}

function mapGenresToMovies(movies) {
    return movies.map(movie => ({
        ...movie,
        genres: movie.genre_ids ? movie.genre_ids.map(id => genreMap.get(id)).filter(Boolean) : []
    }));
}

// --- توابع تخصصی TMDB ---
async function searchTMDB(type, query, lang = 'fa-IR') {
    const url = `https://api.themoviedb.org/3/search/${type}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=${lang}`;
    return (await fetch(url)).json();
}
async function discoverByGenre(genreId, lang = 'fa-IR') {
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&language=${lang}`;
    return (await fetch(url)).json();
}
async function findMoviesWithActor(personId, lang = 'fa-IR') {
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_cast=${personId}&sort_by=popularity.desc&language=${lang}`;
    return (await fetch(url)).json();
}
async function findSimilarMovies(movieId, lang = 'fa-IR') {
    const url = `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${TMDB_API_KEY}&language=${lang}`;
    return (await fetch(url)).json();
}

// --- هوش مصنوعی ---
async function analyzeQueryIntent(query) {
    const genreList = Array.from(genreNameToIdMap.keys()).join(', ');
    const prompt = `
        Analyze the user's search query (in Persian) to determine their primary intent from the following types: 'genre_search', 'actor_search', 'specific_movie_search', 'context_search'.
        Query: "${query}"
        If the intent is 'genre_search', identify the corresponding English genre name from this list: [${genreList}].
        Return JSON: { "type": "...", "value": "..." }.
        Examples:
        - Query: "فیلم ترسناک" -> { "type": "genre_search", "value": "Horror" }
        - Query: "تام هنکس" -> { "type": "actor_search", "value": "تام هنکس" }
        - Query: "Inception" -> { "type": "specific_movie_search", "value": "Inception" }
        - Query: "مردی که حافظه اش را از دست داده" -> { "type": "context_search", "value": "مردی که حافظه اش را از دست داده" }
    `;
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", messages: [{ role: "user", content: prompt }], response_format: { type: "json_object" },
        });
        return JSON.parse(completion.choices[0].message.content);
    } catch (e) {
        console.error("AI intent analysis failed, falling back to context search.", e);
        return { type: 'context_search', value: query };
    }
}
async function findMovieByContext(query) {
    const prompt = `A user provided a phrase (dialogue, character, or theme): "${query}". Identify the original English movie/show title. Return JSON: { "title": "The English Title" } or null.`;
    try {
        const completion = await openai.chat.completions.create({ model: "gpt-4o-mini", messages: [{ role: "user", content: prompt }], response_format: { type: "json_object" } });
        return JSON.parse(completion.choices[0].message.content).title;
    } catch (error) {
        return null;
    }
}

// --- روت جدید برای جزئیات ---
app.get("/api/details/:type/:id", async (req, res) => {
    const { type, id } = req.params;
    const lang = req.query.lang || 'fa-IR';

    if (!type || !id || (type !== 'movie' && type !== 'tv')) {
        return res.status(400).json({ error: "Invalid type or ID" });
    }
    try {
        const url = `https://api.themoviedb.org/3/${type}/${id}?api_key=${TMDB_API_KEY}&language=${lang}&append_to_response=credits`;
        const details = await (await fetch(url)).json();
        const director = details.credits?.crew.find((member) => member.job === 'Director');
        const cast = details.credits?.cast.slice(0, 10);
        res.json({ ...details, director: director || null, cast: cast || [] });
    } catch (err) {
        res.status(500).json({ error: "Could not fetch details." });
    }
});

// --- روت اصلی جستجو ---
app.post("/api/search", async (req, res) => {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Query is required" });
    try {
        const lang = query.match(/[a-zA-Z]/) ? 'en-US' : 'fa-IR';
        const intent = await analyzeQueryIntent(query);
        console.log(`Query: "${query}", Intent: ${intent.type}, Value: ${intent.value}`);
        let finalResults = [], finalTitle = "";

        switch (intent.type) {
            case 'genre_search':
                const genreId = genreNameToIdMap.get(intent.value.toLowerCase());
                if (genreId) {
                    const genreMovies = await discoverByGenre(genreId, lang);
                    finalResults = genreMovies.results || [];
                    finalTitle = lang === 'fa-IR' ? `محبوب‌ترین‌های ژانر ${genreMap.get(genreId)}` : `Popular ${intent.value} Movies`;
                }
                break;
            case 'actor_search':
                const personSearch = await searchTMDB('person', intent.value, lang);
                const topPerson = personSearch.results?.[0];
                if (topPerson) {
                    const actorMovies = await findMoviesWithActor(topPerson.id, lang);
                    finalResults = actorMovies.results || [];
                    finalTitle = lang === 'fa-IR' ? `فیلم‌های با حضور ${topPerson.name}` : `Movies featuring ${topPerson.name}`;
                }
                break;
            case 'specific_movie_search':
                const movieSearch = await searchTMDB('movie', intent.value, lang);
                const topMovie = movieSearch.results?.[0];
                if(topMovie) {
                    const similarMovies = await findSimilarMovies(topMovie.id, lang);
                    finalResults = similarMovies.results || [];
                    finalTitle = lang === 'fa-IR' ? `آثاری با حال و هوای «${topMovie.title}»` : `Works with the vibe of "${topMovie.title}"`;
                }
                break;
            case 'context_search':
                const aiSuggestedTitle = await findMovieByContext(intent.value);
                if (aiSuggestedTitle) {
                    const contextSearch = await searchTMDB('multi', aiSuggestedTitle, lang);
                    finalResults = contextSearch.results || [];
                    finalTitle = lang === 'fa-IR' ? `نتیجه یافت‌شده برای: «${intent.value}»` : `Result for: "${intent.value}"`;
                }
                break;
        }

        if (finalResults.length === 0) {
            finalTitle = lang === 'fa-IR' ? `نتیجه‌ای برای «${query}» یافت نشد` : `No results found for "${query}"`;
        }
        const resultsWithGenres = mapGenresToMovies(finalResults);
        return res.json({ results: resultsWithGenres, title: finalTitle });
    } catch (err) {
        res.status(500).json({ error: "Internal server error." });
    }
});

// --- روت ترندها ---
app.get("/api/trending", async (req, res) => {
    try {
        const url = `https://api.themoviedb.org/3/trending/all/day?api_key=${TMDB_API_KEY}&language=fa-IR`;
        const data = await (await fetch(url)).json();
        const resultsWithGenres = mapGenresToMovies(data.results);
        res.json({ ...data, results: resultsWithGenres });
    } catch (err) { res.status(500).json({ error: 'Could not get trending list.' }); }
});

// --- شروع به کار سرور ---
app.listen(PORT, async () => {
    await initializeGenres();
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});