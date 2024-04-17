console.log("loaded");

var eventSource = new EventSource('https://old.iolab.sk/evaluation/sse/sse.php');


let dataPoints = [];
let lineChart = null;
let SinusChecked = true;
let CosinusChecked = true;
let multiplication = 1;


function updateChart(x, y1, y2) {

    const container = document.getElementById('line-chart-container');


    const xValue = parseFloat(x);
    const y1Value = parseFloat(y1);
    const y2Value = parseFloat(y2);


    dataPoints.push({ x: xValue, y1: y1Value, y2: y2Value });


    if (!lineChart) {
        lineChart = new ApexCharts(container, {
            chart: {
                type: 'line',
            },
            series: [
                {
                    name: 'Sínus',
                    data: dataPoints.map(point => ({ x: point.x, y: point.y1 })),
                },
                {
                    name: 'Kosínus',
                    data: dataPoints.map(point => ({ x: point.x, y: point.y2 })),
                },
            ],
            xaxis: {
                title: {
                    text: 'Iterácia',
                },
                type: 'numeric',
                categories: dataPoints.map(point => point.x),
            },
            yaxis: {
                title: {
                    text: 'Hodnota',
                },
                min: -5,
                max: 5,
                decimalsInFloat: 2,
            },
        });

        lineChart.render();
    } else {
        updateData();
    }
}

function updateData(){
    if(SinusChecked && CosinusChecked){
        lineChart.updateSeries([
            {
                name: 'Sínus',
                data: dataPoints.map(point => ({ x: point.x, y: point.y1 })),
            },
            {
                name: 'Kosínus',
                data: dataPoints.map(point => ({ x: point.x, y: point.y2 })),
            }
        ]);
    } else if(SinusChecked && !CosinusChecked){
        lineChart.updateSeries([
            {
                name: 'Sínus',
                data: dataPoints.map(point => ({ x: point.x, y: point.y1 })),
            },
            {
                name: 'Kosínus',
                data: [],
            }
        ]);
    } else if(!SinusChecked && CosinusChecked) {
        lineChart.updateSeries([
            {
                name: 'Sínus',
                data: [],
            },
            {
                name: 'Kosínus',
                data: dataPoints.map(point => ({x: point.x, y: point.y2})),
            }
        ]);
    } else {
        lineChart.updateSeries([
            {
                name: 'Sínus',
                data: [],
            },
            {
                name: 'Kosínus',
                data: [],
            }
        ]);
    }
}
function validateSinusCheckbox(ID){
    if(document.getElementById(ID).checked){
        SinusChecked = true;
    } else {
        SinusChecked = false;
    }
    updateData();
}
function validateCosinusCheckbox(ID){
    if(document.getElementById(ID).checked){
        CosinusChecked = true;
    } else {
        CosinusChecked = false;
    }
    updateData();
}

eventSource.onmessage = function(event) {
    var data = JSON.parse(event.data);

    updateChart(data.x, data.y1*multiplication, data.y2*multiplication);
};
document.getElementById('button_1').addEventListener('click', function() {
    eventSource.close();
    console.log('SSE connection closed.');
});

eventSource.onerror = function(error) {
    console.error('Error with SSE:', error);
};
document.addEventListener("DOMContentLoaded", function () {
    const slider = document.querySelector('range-slider');

    // Event listener for custom event from the slider
    slider.addEventListener('valueChanged', function (event) {
        multiplication = event.detail.value;
    });
});
