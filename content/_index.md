---
title: "The log_Space"
bookFlatSection: true
bookSearchExclude: true
weight: 10
---

# The log_Space

<style>
    /*
    Alternatively, you can use Google Fonts to load the font from their servers.
    No need to host the TTF file yourself.
    @import url('https://fonts.googleapis.com/css2?family=Megrim&display=swap');
    */
    @font-face {
        font-family: 'Megrim';
        src: url('fonts/Megrim-Regular.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
    }
    body {
        text-align: center;
        margin: 20px;
    }
    .grid-container {
        display: grid;
        grid-template-columns: repeat(2, 1fr); /* 2 columns */
        grid-template-rows: repeat(3, auto); /* 3 rows */
        gap: 30px;
        max-width: 700px;
        margin: auto;
        margin-top: 50px;
    }
    .grid-item {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .label {
        font-family: "Megrim", system-ui; /* With fallback option */
        font-size: clamp(22px, 3vw, 28px); /* Responsive font size */
        font-weight: bold;
        font-style: normal;
        align-self: flex-start; /* Aligns the label to the left */
    }
    .grid-item a {
        text-decoration: none;
    }
    .grid-item img {
        width: 100%;
        max-width: 350px; /* Adjust size */
        height: auto;
        border-radius: 5px; /* Optional rounded corners */
        cursor: pointer;
        transition: transform 0.2s ease-in-out;
    }
    .grid-item img:hover {
        transform: scale(1.05); /* Slight zoom effect */
    }
</style>

<div class="grid-container">
    <!-- Repeat this block for 6 images -->
    <div class="grid-item">
        <div class="label">Biophysics</div>
        <a href="docs/biophysics/">
            {{< figure src="images/Index_Biophysics.webp" title="Index_Biophysics" >}}
        </a>
    </div>
    <div class="grid-item">
        <div class="label">Omics</div>
        <a href="docs/omics/">
            {{< figure src="images/Index_Omics.webp" title="Index_Omics" >}}
        </a>
    </div>
    <div class="grid-item">
        <div class="label">Devel</div>
        <a href="docs/devel/">
            {{< figure src="images/Index_Devel.webp" title="Index_Devel" >}}
        </a>
    </div>
    <div class="grid-item">
        <div class="label">SetUps</div>
        <a href="docs/setups/">
            {{< figure src="images/Index_SetUps.webp" title="Index_SetUps" >}}
        </a>
    </div>
    <div class="grid-item">
        <div class="label">Lab</div>
        <a href="docs/lab/">
            {{< figure src="images/Index_Lab.webp" title="Index_Lab" >}}
        </a>
    </div>
</div>
