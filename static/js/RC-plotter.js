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

    for (let j = -10; j <= 40; j += 0.1) {
        t.push(j);

        let iValue;
        if (r0 === 0) {
            iValue = (Math.abs(j) < 1e-5) ? 100 : (V/R) * Heaviside(j);
        } else {
            let expTerm = Math.exp(-j / (C*R*r0 / (r0 + R)));
            iValue = (V/(R + r0)) * (1 + (R/r0)*expTerm) * Heaviside(j);
        }
        i.push(iValue);
    }
    return { t, i };
}

// Function to update both plots
function updatePlots(r0) {
    let iData = generateCurrentData(r0);
    let vData = generateVoltageData(r0);

    // Update first plot (v(t))
    Plotly.react(plot1Div, [{
        x: vData.t,
        y: vData.v,
        type: 'scatter',
        mode: 'lines',
        line: { color: 'red' }
    }], {
        title: {
            text: `Voltage drop across parallel`,
            y: 0.80,
            yanchor: 'top',
            pad: { t: 5 }
        },
        xaxis: { title: 'time (ms)', range: [-10, 40] },
        yaxis: { title: 'v<sub>p</sub> (mV)', range: [0, 25] },
        width: 700,  // Manually set width
        height: 300  // Adjust height
    });

    // Update second plot (i(t))
    Plotly.react(plot2Div, [{
        x: iData.t,
        y: iData.i,
        type: 'scatter',
        mode: 'lines',
        line: { color: 'blue' }
    }], {
        title: {
            text: `Total current`,
            y: 0.85,
            yanchor: 'top',
            pad: { t: 5 }
        },
        xaxis: { title: 'time (ms)', range: [-10, 40] }, 
        yaxis: { title: 'i (nA)', range: [0, 20] },
        width: 700,  // Manually set width
        height: 400  // Adjust height
    });
}

// Initial plot update
updatePlots(parseFloat(slider.value));

// Update plots on slider change
slider.addEventListener("input", () => {
    let r0 = parseFloat(slider.value);
    sliderValue.textContent = `${r0.toFixed(1)} MΩ`;
    updatePlots(r0);  // Update the plots with the new r0 value
});
