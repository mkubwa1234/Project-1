document.addEventListener("DOMContentLoaded", function () {
    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchInput");
    const languageSelect = document.getElementById("languageSelect");
    const resultsDiv = document.getElementById("results");

    searchForm.addEventListener("submit", function (event) {
        event.preventDefault(); 

        const searchTerm = searchInput.value.trim();
        const language = languageSelect.value;

        fetch(`https://bible-api.com/${searchTerm}?translation=${language}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch Bible verse");
                }
                return response.json();
            })
            .then(data => {
                translateVerse(data, language);
            })
            .catch(error => {
                console.error("Error fetching Bible verse:", error);
                resultsDiv.textContent = "An error occurred while fetching the Bible verse. Please try again later.";
            });
    });

    function translateVerse(data, language) {
        const verseText = data.text || "Verse not found";
        if (language !== "web") {
            fetch(`https://bible-api.com/${data.reference}?translation=${language}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to fetch ${language} translation`);
                    }
                    return response.json();
                })
                .then(translationData => {
                    const translatedText = translationData.text || "Translation not found";
                    resultsDiv.innerHTML = `<p><strong>${language.toUpperCase()} Translation:</strong> ${translatedText}</p>`;
                })
                .catch(error => {
                    console.error(`Error fetching ${language} translation:`, error);
                    resultsDiv.textContent = `An error occurred while fetching the ${language} translation. Please try again later.`;
                });
        } else {
            resultsDiv.innerHTML = `<p>${verseText}</p>`;
        }
    }
});