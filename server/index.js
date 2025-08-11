// // import 'dotenv/config';
// // import express from "express";
// // import fetch from "node-fetch";
// // import OpenAI from "openai";
// // import cors from "cors";
// //
// // const app = express();
// // app.use(cors());
// // app.use(express.json());
// //
// // const PORT = process.env.PORT || 3001;
// // const TMDB_API_KEY = process.env.TMDB_API_KEY;
// // const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
// //
// // if (!TMDB_API_KEY || !OPENAI_API_KEY) {
// //     console.error("FATAL ERROR: API keys are missing. Check your .env file.");
// //     process.exit(1);
// // }
// // const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
// //
// //
// // // --- توابع کمکی ---
// // async function searchTMDB(type, query) {
// //     const url = `https://api.themoviedb.org/3/search/${type}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=fa-IR`;
// //     return (await fetch(url)).json();
// // }
// //
// // // --- توابع تخصصی ---
// // async function findMoviesWithActor(personId) {
// //     const url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_cast=${personId}&sort_by=popularity.desc&language=fa-IR`;
// //     return (await fetch(url)).json();
// // }
// //
// // async function findSimilarMovies(movieId) {
// //     const url = `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${TMDB_API_KEY}&language=fa-IR`;
// //     return (await fetch(url)).json();
// // }
// //
// // async function findMovieByContext(query) {
// //     const prompt = `You are a movie detective. A user provided a phrase in Persian (e.g., a dialogue, character, or theme). Identify the original English movie/show title. Phrase: "${query}". Return JSON: { "title": "The English Title" } or { "title": null }.`;
// //     try {
// //         const completion = await openai.chat.completions.create({ model: "gpt-4o", messages: [{ role: "user", content: prompt }], response_format: { type: "json_object" } });
// //         const result = JSON.parse(completion.choices[0].message.content);
// //         return result.title;
// //     } catch (error) {
// //         console.error("OpenAI context search failed:", error.message);
// //         return null;
// //     }
// // }
// //
// //
// // // --- روت اصلی با منطق مقایسه محبوبیت ---
// // app.post("/api/search", async (req, res) => {
// //     const { query } = req.body;
// //     if (!query) return res.status(400).json({ error: "Query is required" });
// //     console.log(`\n--- New Search Request --- Query: "${query}"`);
// //
// //     try {
// //         // 1. جستجوی موازی برای شخص و فیلم
// //         const [personSearch, movieSearch] = await Promise.all([
// //             searchTMDB('person', query),
// //             searchTMDB('movie', query)
// //         ]);
// //
// //         const topPerson = personSearch.results?.[0];
// //         const topMovie = movieSearch.results?.[0];
// //
// //         // 2. منطق تصمیم‌گیری هوشمند بر اساس محبوبیت
// //         const personPopularity = topPerson?.popularity || 0;
// //         const moviePopularity = topMovie?.popularity || 0;
// //
// //         console.log(`Popularity Check - Movie: ${moviePopularity}, Person: ${personPopularity}`);
// //
// //         // اولویت اول: جستجوی بازیگر
// //         // اگر شخص پیدا شد و محبوبیتش به طور چشمگیری بیشتر از فیلم بود، یا فیلمی با این نام وجود نداشت
// //         if (topPerson && (personPopularity > moviePopularity * 5 || moviePopularity === 0)) {
// //             console.log(`Decision: Actor search for "${topPerson.name}"`);
// //             const movies = await findMoviesWithActor(topPerson.id);
// //             return res.json({ results: movies.results || [], title: `فیلم‌های با حضور ${topPerson.name}` });
// //         }
// //
// //         // اولویت دوم: جستجوی فیلم‌های مشابه
// //         // اگر فیلم پیدا شد و محبوبیتش بسیار بیشتر از شخص بود
// //         if (topMovie && (moviePopularity > personPopularity * 5 || personPopularity === 0)) {
// //             console.log(`Decision: Similar movies search for "${topMovie.title}"`);
// //             const similarMovies = await findSimilarMovies(topMovie.id);
// //             return res.json({ results: similarMovies.results || [], title: `آثاری با حال و هوای «${topMovie.title}»` });
// //         }
// //
// //         // اولویت سوم: جستجو بر اساس دیالوگ/شخصیت/مضمون با هوش مصنوعی
// //         console.log("Decision: Context search with AI");
// //         const aiSuggestedTitle = await findMovieByContext(query);
// //         if (aiSuggestedTitle) {
// //             const contextSearch = await searchTMDB('multi', aiSuggestedTitle);
// //             return res.json({ results: contextSearch.results || [], title: `` });
// //         }
// //
// //         // اگر هیچ‌کدام نتیجه ندادند
// //         console.log("Decision: No clear intent, returning empty.");
// //         return res.json({ results: [], title: `نتیجه‌ای برای «${query}» یافت نشد` });
// //
// //     } catch (err) {
// //         console.error("[Main Handler] UNCAUGHT ERROR:", err);
// //         res.status(500).json({ error: "خطای داخلی سرور." });
// //     }
// // });
// //
// //
// // // بقیه روت‌ها بدون تغییر
// // app.get("/api/trending", async (req, res) => {
// //     try {
// //         const url = `https://api.themoviedb.org/3/trending/all/day?api_key=${TMDB_API_KEY}&language=en`;
// //         const data = await (await fetch(url)).json();
// //         res.json(data);
// //     } catch (err) { res.status(500).json({ error: 'امکان دریافت لیست محبوب‌ترین‌ها وجود ندارد.' }); }
// // });
// //
// // app.listen(PORT, () => console.log(`✅ Server is running on http://localhost:${PORT}`));
//
//
//
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
// // --- توابع کمکی ---
// async function searchTMDB(type, query, lang = 'fa-IR') {
//     const url = `https://api.themoviedb.org/3/search/${type}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=${lang}`;
//     return (await fetch(url)).json();
// }
// async function findMoviesWithActor(personId, lang = 'fa-IR') {
//     const url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_cast=${personId}&sort_by=popularity.desc&language=${lang}`;
//     return (await fetch(url)).json();
// }
// async function findSimilarMovies(movieId, lang = 'fa-IR') {
//     const url = `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${TMDB_API_KEY}&language=${lang}`;
//     return (await fetch(url)).json();
// }
//
// // --- توابع هوش مصنوعی ---
// async function detectLanguage(query) {
//     const prompt = `Detect the primary language of the text. Respond with 'fa-IR' for Persian or 'en-US' for English. Text: "${query}". Return JSON: { "lang": "code" }`;
//     try {
//         const completion = await openai.chat.completions.create({
//             model: "gpt-4o-mini",
//             messages: [{ role: "user", content: prompt }],
//             response_format: { type: "json_object" },
//         });
//         return JSON.parse(completion.choices[0].message.content).lang || 'fa-IR';
//     } catch {
//         return 'fa-IR'; // Fallback
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
//         // ضریب حساسیت: هر چه بالاتر باشد، باید محبوبیت بازیگر بسیار بیشتر باشد تا انتخاب شود
//         const SENSITIVITY_FACTOR = 4;
//
//         if (topPerson && (personPopularity > moviePopularity * SENSITIVITY_FACTOR || (topMovie && topMovie.title.toLowerCase() !== query.toLowerCase() && personPopularity > moviePopularity))) {
//             console.log(`Decision: Actor search for "${topPerson.name}"`);
//             const movies = await findMoviesWithActor(topPerson.id, lang);
//             const title = lang === 'fa-IR' ? `فیلم‌های با حضور ${topPerson.name}` : `Movies featuring ${topPerson.name}`;
//             return res.json({ results: movies.results || [], title });
//         }
//
//         if (topMovie) {
//             console.log(`Decision: Similar movies search for "${topMovie.title}"`);
//             const similarMovies = await findSimilarMovies(topMovie.id, lang);
//             const title = lang === 'fa-IR' ? `آثاری با حال و هوای «${topMovie.title}»` : `Works with the vibe of "${topMovie.title}"`;
//             return res.json({ results: similarMovies.results || [], title });
//         }
//
//         console.log("Decision: Context search with AI");
//         const aiSuggestedTitle = await findMovieByContext(query);
//         if (aiSuggestedTitle) {
//             const contextSearch = await searchTMDB('multi', aiSuggestedTitle, lang);
//             const title = lang === 'fa-IR' ? `نتیجه یافت‌شده برای: «${query}»` : `Result for: "${query}"`;
//             return res.json({ results: contextSearch.results || [], title });
//         }
//
//         console.log("Decision: No clear intent, returning empty.");
//         const title = lang === 'fa-IR' ? `نتیجه‌ای برای «${query}» یافت نشد` : `No results found for "${query}"`;
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
//         const url = `https://api.themoviedb.org/3/trending/all/day?api_key=${TMDB_API_KEY}&language=fa-IR`; // زبان ترندها فارسی باشد بهتر است
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


// --- توابع کمکی ---
async function searchTMDB(type, query, lang = 'fa-IR') {
    const url = `https://api.themoviedb.org/3/search/${type}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=${lang}`;
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

// --- توابع هوش مصنوعی ---
async function detectLanguage(query) {
    const prompt = `Detect the primary language of the text. Respond with 'fa-IR' for Persian or 'en-US' for English. Text: "${query}". Return JSON: { "lang": "code" }`;
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
        });
        return JSON.parse(completion.choices[0].message.content).lang || 'fa-IR';
    } catch {
        return 'fa-IR'; // Fallback
    }
}
async function findMovieByContext(query) {
    const prompt = `A user provided a phrase (dialogue, character, or theme): "${query}". Identify the original English movie/show title. Return JSON: { "title": "The English Title" } or null.`;
    try {
        const completion = await openai.chat.completions.create({ model: "gpt-4o-mini", messages: [{ role: "user", content: prompt }], response_format: { type: "json_object" } });
        return JSON.parse(completion.choices[0].message.content).title;
    } catch (error) {
        console.error("OpenAI context search failed:", error.message);
        return null;
    }
}

// --- روت اصلی ---
app.post("/api/search", async (req, res) => {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Query is required" });
    console.log(`\n--- New Search Request --- Query: "${query}"`);

    try {
        const lang = await detectLanguage(query);
        console.log(`Language Detected: ${lang}`);

        const [personSearch, movieSearch] = await Promise.all([
            searchTMDB('person', query, lang),
            searchTMDB('movie', query, lang)
        ]);

        const topPerson = personSearch.results?.[0];
        const topMovie = movieSearch.results?.[0];

        const personPopularity = topPerson?.popularity || 0;
        const moviePopularity = topMovie?.popularity || 0;

        console.log(`Popularity Check - Movie: ${moviePopularity}, Person: ${personPopularity}`);

        const SENSITIVITY_FACTOR = 4;

        if (topPerson && (personPopularity > moviePopularity * SENSITIVITY_FACTOR || (topMovie && topMovie.title.toLowerCase() !== query.toLowerCase() && personPopularity > moviePopularity))) {
            console.log(`Decision: Actor search for "${topPerson.name}"`);
            const movies = await findMoviesWithActor(topPerson.id, lang);
            const title = lang === 'fa-IR' ? `فیلم‌های با حضور ${topPerson.name}` : `Movies featuring ${topPerson.name}`;
            return res.json({ results: movies.results || [], title });
        }

        if (topMovie) {
            console.log(`Decision: Similar movies search for "${topMovie.title}"`);
            const similarMovies = await findSimilarMovies(topMovie.id, lang);
            const title = lang === 'fa-IR' ? `آثاری با حال و هوای «${topMovie.title}»` : `Works with the vibe of "${topMovie.title}"`;
            return res.json({ results: similarMovies.results || [], title });
        }

        console.log("Decision: Context search with AI");
        const aiSuggestedTitle = await findMovieByContext(query);
        if (aiSuggestedTitle) {
            const contextSearch = await searchTMDB('multi', aiSuggestedTitle, lang);
            const title = lang === 'fa-IR' ? `نتیجه یافت‌شده برای: «${query}»` : `Result for: "${query}"`;
            return res.json({ results: contextSearch.results || [], title });
        }

        console.log("Decision: No clear intent, returning empty.");
        const title = lang === 'fa-IR' ? `نتیجه‌ای برای «${query}» یافت نشد` : `No results found for "${query}"`;
        return res.json({ results: [], title });

    } catch (err) {
        console.error("[Main Handler] UNCAUGHT ERROR:", err);
        res.status(500).json({ error: "Internal server error." });
    }
});


app.get("/api/trending", async (req, res) => {
    try {
        const url = `https://api.themoviedb.org/3/trending/all/day?api_key=${TMDB_API_KEY}&language=fa-IR`;
        const data = await (await fetch(url)).json();
        res.json(data);
    } catch (err) { res.status(500).json({ error: 'Could not get trending list.' }); }
});

app.listen(PORT, () => console.log(`✅ Server is running on http://localhost:${PORT}`));