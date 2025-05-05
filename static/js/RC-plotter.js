// JavaScript code for the 'RC-plotter.html' shortcode

// Get slider and value display
const slider = document.getElementById("slider");
const sliderValue = document.getElementById("sliderValue");
const plot1Div = document.getElementById("plot1");
const plot2Div = document.getElementById("plot2");

// Circuit constants 
const V = 20    // mV
const R = 5     // MΩ
const C = 5     // nF

// Heaviside step function H(x)
function Heaviside(x) {
    return x >= 0 ? 1 : 0;
}

// Function to generate v(t) data
function generateVoltageData(r0) {
    let t = []; // time
    let v = []; // voltage across the parallel elements

    for (let j = -10; j <= 40; j += 0.1) {
        t.push(j);

        let vValue;
        if (r0 === 0) {
            vValue = V * Heaviside(j);
        } else {
            let expTerm = Math.exp(-j / (C*R*r0 / (r0 + R)));
            vValue = ((V*R)/(R + r0)) * (1 - expTerm) * Heaviside(j);
        }
        v.push(vValue);
    }
    return { t, v };
}

// Function to generate i(t) data
function generateCurrentData(r0) {
    let t = []; // time
    let i = []; // total current
    let iR = []; // resistive component
    let iC = []; // capacitive component

    for (let j = -10; j <= 40; j += 0.1) {
        t.push(j);
        let iValue;
        let iRValue;
        let iCValue;
        if (r0 === 0) {
            iValue = (Math.abs(j) < 1e-5) ? 100 : (V/R) * Heaviside(j);
            iRValue = (V/R) * Heaviside(j)
            iCValue = (Math.abs(j) < 1e-5) ? 100 : 0 * Heaviside(j);
        } else {
            let expTerm = Math.exp(-j / (C*R*r0 / (r0 + R)));
            iValue = (V/(R + r0)) * (1 + (R/r0)*expTerm) * Heaviside(j);
            iRValue = (V/(R + r0)) * (1 - expTerm) * Heaviside(j);
            iCValue = (V/r0) * expTerm * Heaviside(j);
        }
        i.push(iValue);
        iR.push(iRValue);
        iC.push(iCValue);
    }
    return { t, i, iR, iC };
}

// Function to update both plots
function updatePlots(r0) {
    /*
    Tried using '{ responsive: true }' to adapt plots to window size but, in
    combination with 'scaleanchor' and 'scaleratio' for fixing the aspect ratio,
    cannot get rid of annoying visual flickering when using r0 slider. So went
    with a more basic approach: plot width is computed as a percentage relative
    to the *current* page width every time plots are updated (by page refreshing
    or r0 sliding). Simple and effective even on mobile.
    */
    // Refer to <div class="book-page"> from theme's 'baseof.html' file
    const contentWidth = document.querySelector(".book-page").offsetWidth;
    const plotWidth = contentWidth * 0.9;

    const iData = generateCurrentData(r0);
    const vData = generateVoltageData(r0);

    // Update first plot (v(t))
    Plotly.react(plot1Div, [{
        x: vData.t,
        y: vData.v,
        type: 'scatter',
        mode: 'lines',
        line: { color: '#73a0d0' }
    }], {
        /*
        title: {
            text: `Voltage drop across parallel`,
            y: 0.80,
            yanchor: 'top',
            pad: { t: 5 }
        },
        */
        xaxis: { title: 'time (ms)', range: [-10, 40] },
        yaxis: { title: 'v<sub>p</sub> (mV)', range: [0, 22] },
        width: plotWidth,
        height: plotWidth * 0.5, // fixed aspect ratio
        margin: { l: 80, r: 50, t: 40, b: 50 }
    }, { responsive: false }); // disable auto-resize

    // Update second plot (i(t))
    Plotly.react(plot2Div, [
        {
            x: iData.t,
            y: iData.iR,
            name: 'i<sub>R</sub>',
            type: 'scatter',
            mode: 'lines',
            line: { color: '#9388a3', dash: 'dot' }
        },
        {
            x: iData.t,
            y: iData.iC,
            name: 'i<sub>C</sub>',
            type: 'scatter',
            mode: 'lines',
            line: { color: '#9388a3', dash: 'dash' }
        },
        {
            x: iData.t,
            y: iData.i,
            name: 'i',
            type: 'scatter',
            mode: 'lines',
            line: { color: '#e65f5c' }
        }], {
        /*
        title: {
            text: `Total current`,
            y: 0.90,
            yanchor: 'top',
            pad: { t: 5 }
        },
        */
        xaxis: { title: 'time (ms)', range: [-10, 40] }, 
        yaxis: { title: 'i (nA)', range: [0, 22] },
        width: plotWidth,
        height: plotWidth * 0.8, // Fixed aspect ratio
        margin: { l: 80, r: 50, t: 50, b: 80 }
    }, { responsive: false }); // disable auto-resize
}

// Initial plot update
updatePlots(parseFloat(slider.value));

// Update plots on slider change
slider.addEventListener("input", () => {
    let r0 = parseFloat(slider.value);
    sliderValue.textContent = `${r0.toFixed(2)} MΩ`;
    updatePlots(r0);  // Update the plots with the new r0 value
});
