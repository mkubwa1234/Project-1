// Wait for the DOM content to be fully loaded before executing the script
document.addEventListener("DOMContentLoaded", function () {
    
    // Get references to various elements in the HTML document
    const searchForm = document.getElementById("searchForm"); // Reference to the search form
    const searchInput = document.getElementById("searchInput"); // Reference to the search input field
    const languageSelect = document.getElementById("languageSelect"); // Reference to the language select dropdown
    const resultsDiv = document.getElementById("results"); // Reference to the div where search results will be displayed
    const submitButton = document.querySelector("button[type='submit']"); // Reference to the submit button
    
    // Event Listener 1: Listen for changes in the search input field
    searchInput.addEventListener("input", function(event) {
        // Get the current value of the input field
        const inputValue = event.target.value;
        console.log("Search input value changed:", inputValue); // Log the value to the console
    });

    // Event Listener 2: Listen for changes in the language select dropdown
    languageSelect.addEventListener("change", function(event) {
        // Get the selected language from the dropdown
        const selectedLanguage = event.target.value;
        console.log("Selected language changed:", selectedLanguage); // Log the selected language to the console
    });

    // Event Listener 3: Listen for the "reset" event on the form
    searchForm.addEventListener("reset", function(event) {
        console.log("Form reset event triggered"); // Log a message to the console
    });

    // Event Listener 4: Listen for click event on the submit button
    submitButton.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent the default form submission behavior
        
        // Get the search term and selected language
        const searchTerm = searchInput.value.trim(); // Trim whitespace from the search term
        const language = languageSelect.value;
        
        // Fetch the Bible verse using the API
        fetch(`https://bible-api.com/${searchTerm}?translation=${language}`)
            .then(response => {
                // Check if the response is successful
                if (!response.ok) {
                    throw new Error("Failed to fetch Bible verse");
                }
                return response.json(); // Parse the response body as JSON
            })
            .then(data => {
                // Once the data is fetched successfully, call the translateVerse function
                translateVerse(data, language);
            })
            .catch(error => {
                // Handle any errors that occur during the fetch operation
                console.error("Error fetching Bible verse:", error);
                resultsDiv.textContent = "An error occurred while fetching the Bible verse. Please try again later.";
            });
    });

    // Function to translate the fetched Bible verse into the selected language
    function translateVerse(data, language) {
        // Get the text of the Bible verse, or display a default message if not found
        const verseText = data.text || "Verse not found";
        
        // Check if the selected language is English (web), as it doesn't require translation
        if (language !== "web") {
            // If the selected language is not English, fetch the translation
            fetch(`https://bible-api.com/${data.reference}?translation=${language}`)
                .then(response => {
                    // Check if the response is successful
                    if (!response.ok) {
                        throw new Error(`Failed to fetch ${language} translation`);
                    }
                    return response.json();
                })
                .then(translationData => {
                    // Once the translation data is fetched successfully, display the translated text
                    const translatedText = translationData.text || "Translation not found";
                    resultsDiv.innerHTML = `<p><strong>${language.toUpperCase()} Translation:</strong> ${translatedText}</p>`;
                })
                .catch(error => {
                    // Handle any errors that occur during the translation fetch operation
                    console.error(`Error fetching ${language} translation:`, error);
                    resultsDiv.textContent = `An error occurred while fetching the ${language} translation. Please try again later.`;
                });
        } else {
            // If the selected language is English, display the original Bible verse text
            resultsDiv.innerHTML = `<p>${verseText}</p>`;
        }
    }
});
