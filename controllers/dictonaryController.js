import asyncHandler from "express-async-handler";
import axios from "axios";

const DICTIONARY_API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const MYMEMORY_API_URL = "https://api.mymemory.translated.net/get";

export const hindiDictionary = asyncHandler(async (req, res) => {
  try {
    const { word } = req.params;

    if (!word) {
      return res
        .status(400)
        .json({ error: "Please provide a word to search." });
    }

    // Fetch the word meaning from the dictionary API
    const response = await axios.get(`${DICTIONARY_API_URL}${word}`);
    const data = response.data;

    const meanings = data[0]?.meanings
      ?.map((meaning) => meaning.definitions.map((def) => def.definition))
      .flat();

    if (!meanings || meanings.length === 0) {
      return res.status(404).json({ error: "Meaning not found." });
    }

    // Function to translate text to Hindi using MyMemory API
    const translateToHindi = async (text) => {
      try {
        const response = await axios.get(`${MYMEMORY_API_URL}`, {
          params: {
            q: text,
            langpair: "en|hi",
          },
        });
        return response.data.responseData.translatedText || text;
      } catch (error) {
        console.error("Error translating to Hindi:", error.message);
        return text; // Fallback to the original text in case of failure
      }
    };

    // Limit to 5 English meanings and translate them to Hindi
    const limitedMeanings = meanings.slice(0, 5);
    const hindiMeanings = await Promise.all(
      limitedMeanings.map((meaning) => translateToHindi(meaning))
    );

    // Respond with English and Hindi meanings
    res.json({
      word,
      meanings: limitedMeanings,
      hindiMeanings,
    });
  } catch (error) {
    console.error(
      "Error fetching word meaning:",
      error.response?.status,
      error.response?.data || error.message
    );
    res
      .status(500)
      .json({ error: "Failed to fetch the word meaning. Try again later." });
  }
});
