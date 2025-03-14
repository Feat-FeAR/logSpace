// JavaScript code for the 'SubIndexGenerator.html' shortcode

async function generateIndex(xmlUrl) {
    try {
        // Fetch the XML file
        const response = await fetch(xmlUrl);
        if (!response.ok) throw new Error("Failed to load index.xml");

        // Parse the XML response
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "application/xml");

        // Select all <item> elements
        const items = xmlDoc.querySelectorAll("channel > item");
        const container = document.getElementById("dynamicIndex");

        items.forEach(item => {
            const title = item.querySelector("title")?.textContent;
            const link = item.querySelector("link")?.textContent;

            if (title && link) {
                const button = document.createElement("a");
                button.href = link;
                button.textContent = title;
                button.classList.add("index-button"); // Apply button styling
                container.appendChild(button);
            }
        });
        
    } catch (error) {
        console.error("Error fetching index.xml:", error);
    }
}

// Fetch the local index
generateIndex("index.xml");
