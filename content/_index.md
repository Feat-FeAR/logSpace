---
title: "The log_Space"
bookFlatSection: true
bookSearchExclude: true
weight: 10
---

# The log_Space

<style>
    body {
        text-align: center;
        margin: 20px;
    }
    .grid-container {
        display: grid;
        grid-template-columns: repeat(2, 1fr); /* 2 columns */
        grid-template-rows: repeat(3, auto); /* 3 rows */
        gap: 20px;
        max-width: 700px;
        margin: auto;
        margin-top: 50px;
    }
    .grid-item {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .grid-item .label {
        font-size: 24px;
        font-weight: bold;
        align-self: flex-start; /* Aligns the label to the left */
    }
    .grid-item a {
        text-decoration: none;
    }
    .grid-item img {
        width: 100%;
        max-width: 350px; /* Adjust size */
        height: auto;
        border-radius: 10px; /* Optional rounded corners */
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
        <a href="#section1">
            {{< figure src="/images/Index_Biophysics.webp" title="Index_Biophysics" >}}
        </a>
    </div>
    <div class="grid-item">
        <div class="label">Omics</div>
        <a href="#section1">
            {{< figure src="/images/Index_Omics.webp" title="Index_Omics" >}}
        </a>
    </div>
    <div class="grid-item">
        <div class="label">Devel</div>
        <a href="#section1">
            {{< figure src="/images/Index_Devel.webp" title="Index_Devel" >}}
        </a>
    </div>
    <div class="grid-item">
        <div class="label">SetUps</div>
        <a href="#section1">
            {{< figure src="/images/Index_SetUps.webp" title="Index_SetUps" >}}
        </a>
    </div>
    <div class="grid-item">
        <div class="label">Lab</div>
        <a href="#section1">
            {{< figure src="/images/Index_Lab.webp" title="Index_Lab" >}}
        </a>
    </div>
</div>
