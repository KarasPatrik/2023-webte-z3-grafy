 function parseXMLData(xmlDoc) {
    const zaznamElements = xmlDoc.querySelectorAll('zaznam');

    const categories = [];
    const seriesData = {};

    zaznamElements.forEach((zaznam) => {
    const rok = zaznam.querySelector('rok').textContent;
    categories.push(rok);

    const hodnotenieElements = zaznam.querySelectorAll('hodnotenie > *');
    hodnotenieElements.forEach((element) => {
    const category = element.tagName;

    if (!seriesData[category]) {
    seriesData[category] = [];
}

    seriesData[category].push(parseInt(element.textContent));
});
});

    return { categories, seriesData };
}

 function createBarChart(categories, seriesData ) {
     const customColors =
         ["#e60049", "#0bb4ff", "#50e991", "#e6d800", "#9b19f5", "#ffa300", "#dc0ab4", "#b3d4ff", "#00bfa0"];

     const chartData = {
         chart: {
             type: 'bar',
             horizontal: false,
         },
         yaxis: {
             title: {
                 text: 'Počet študentov'
             }
         },
         xaxis: {
             categories: categories,
         },
         grid: {
             borderColor: '#e7e7e7',
             row: {
                 colors: ['#f3f3f3', 'transparent'],
                 opacity: 0.5
             },
         },
         responsive: [
             {
                 breakpoint: 768,
                 options: {
                     plotOptions: {
                         bar: {
                             horizontal: true
                         }
                     },
                     xaxis: {
                         title: {
                             text: 'Počet študentov'
                         }
                     },
                     yaxis: {
                         title: {
                             text: ''
                         },
                         labels: {
                             rotate: 45,
                             offsetY: 25,
                         }
                     },
                     legend:{
                         position: 'top'
                     },
                     chart:{
                         height:'650px'
                     }
                 }
             }
         ],
         series: Object.keys(seriesData).map((category, index) => ({
             name: category,
             data: seriesData[category],
             color: customColors[index % customColors.length], // Loop back to the beginning if needed
         })),
     };

     const chart = new ApexCharts(document.querySelector('#chart_first'), chartData);
     chart.render();
 }
 function createPieCharts(categories, seriesData) {
     const customColors = ["#e60049", "#0bb4ff", "#50e991", "#e6d800", "#9b19f5", "#ffa300", "#dc0ab4", "#b3d4ff", "#00bfa0"];

     for (let i = 0; i < 6; i++) {
         let data = [];
         for (const category in seriesData) {
             if (seriesData.hasOwnProperty(category)) {
                 data.push(seriesData[category][i]);
             }
        }

         const chartData = {
             chart: {
                 type: 'pie',
             },
             labels: Object.keys(seriesData),
             series: data,
             colors: customColors,
         };
         document.getElementById('label_' + (i + 1).toString()).innerHTML = categories[i].toString();
         const chart = new ApexCharts(document.getElementById('chart_' + (i + 1).toString()), chartData);
         chart.render();
     }
 }
 function createLineChart(categories, seriesData){
     const customColors = ["#e60049", "#0bb4ff", "#50e991", "#e6d800", "#9b19f5", "#ffa300", "#dc0ab4", "#b3d4ff", "#00bfa0"];
     let dataA = [];
     let dataB = [];
     for (let i = 0; i < 6; i++) {
         dataA.push(seriesData['A'][i]);
         dataB.push(seriesData['B'][i]);

     }
     const chartData = {
         series: [
             {
                 name: 'A',
                 data: dataA,
             },
             {
                 name: 'B',
                 data: dataB,
             }
         ],
         chart: {
             type: 'line',
             dropShadow: {
                 enabled: true,
                 color: '#000',
                 top: 18,
                 left: 7,
                 blur: 10,
                 opacity: 0.2
             },
         },
         colors: customColors,
         dataLabels: {
             enabled: true,
         },
         stroke: {
             curve: 'smooth'
         },
         grid: {
             borderColor: '#e7e7e7',
             row: {
                 colors: ['#f3f3f3', 'transparent'],
                 opacity: 0.5
             },
         },
         markers: {
             size: 1
         },
         xaxis: {
             categories: categories,
             title: {
                 text: 'Obdobie'
             }
         },
         yaxis: {
             title: {
                 text: 'Počet študentov'
             },
         },
         responsive: [
             {
                 breakpoint: 768,
                 options: {
                     chart: {
                         height: 350,
                     },
                 },
             },
         ],
     }
     const chart = new ApexCharts(document.getElementById('line_chart'), chartData);
     chart.render();
 }




 // Load XML data dynamically
    fetch('z03.xml')
    .then(response => response.text())
    .then(data => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, 'application/xml');
        const { categories, seriesData } = parseXMLData(xmlDoc);
        createBarChart(categories, seriesData)
        createPieCharts(categories, seriesData)
        createLineChart(categories, seriesData)
})
    .catch(error => console.error('Error loading XML:', error));
