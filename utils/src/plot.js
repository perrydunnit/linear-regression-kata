import puppeteer from 'puppeteer';

/**
 * Creates a plot of the training and test data, delegating to either createPlot2d or createPlot3d.
 * 
 * @param {*} trainingData The data that the regression function was trained on (array of objects with x, y, and optional z).
 * @param {*} testData The data that the regression function was tested on (array of objects with x, y, and optional z).
 * @param {*} axes The axes to use from the data for the x, y, and z axes. If z is not provided, the plot will be 2D.
 * @param {*} outputPath Where to put the PNG of the plot.
 * @param {*} regressionFunction The function that was used to make the predictions.
 */
export const createPlot = async (trainingData, testData, axes, outputPath, regressionFunction) => {
    const { z: zAxis } = axes;

    if (zAxis) {
        // Call createPlot3d if z-axis is provided
        await createPlot3d(trainingData, testData, axes, outputPath, regressionFunction);
    } else {
        // Call createPlot2d if no z-axis is provided
        await createPlot2d(trainingData, testData, axes, outputPath, regressionFunction);
    }
};

/**
 * Creates a 2D plot of the training and test data, along with the regression function's predictions.
 * 
 * @param {*} trainingData The data that the regression function was trained on (array of objects with x and y).
 * @param {*} testData The data that the regression function was tested on (array of objects with x and y).
 * @param {*} axes The axes to use from the data for the x and y axes.
 * @param {*} outputPath Where to put the PNG of the plot.
 * @param {*} regressionFunction The function that was used to make the predictions.
 */
export const createPlot2d = async (trainingData, testData, axes, outputPath, regressionFunction) => {
    const { x: xAxis, y: yAxis } = axes;

    // Extract data for plotting
    const trainingX = trainingData.map(point => point[xAxis]);
    const trainingY = trainingData.map(point => point[yAxis]);
    const testX = testData.map(point => point[xAxis]);
    const testY = testData.map(point => point[yAxis]);

    // Determine the domain of the x-axis
    const allX = [...trainingX, ...testX];
    const xMin = Math.min(...allX);
    const xMax = Math.max(...allX);

    // Generate a range of x values for the regression line
    const regressionX = Array.from({ length: 100 }, (_, i) => xMin + (i * (xMax - xMin) / 99));
    const regressionY = regressionX.map(x => regressionFunction({ [xAxis]: x }));

    // Create traces for the plot
    const trainingTrace = {
        x: trainingX,
        y: trainingY,
        mode: 'markers',
        type: 'scatter',
        name: 'Training Data',
        marker: { color: 'blue' }
    };

    const testTrace = {
        x: testX,
        y: testY,
        mode: 'markers',
        type: 'scatter',
        name: 'Test Data',
        marker: { color: 'red' }
    };

    const predictionTrace = {
        x: regressionX,
        y: regressionY,
        mode: 'lines',
        type: 'scatter',
        name: 'Regression Line',
        line: { color: 'green' }
    };

    const data = [trainingTrace, testTrace, predictionTrace];

    // Define layout
    const layout = {
        title: '2D Regression Plot',
        xaxis: { title: xAxis },
        yaxis: { title: yAxis }
    };

    // Create the plot HTML
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
        </head>
        <body>
            <div id="plot"></div>
            <script>
                const data = ${JSON.stringify(data)};
                const layout = ${JSON.stringify(layout)};
                Plotly.newPlot('plot', data, layout);
            </script>
        </body>
        </html>
    `;

    // Use Puppeteer to render the plot and save it as a PNG
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Load the HTML content
    await page.setContent(htmlContent);

    // Wait for the plot to render
    await page.waitForSelector('#plot');

    // Take a screenshot of the plot
    const plotElement = await page.$('#plot');
    await plotElement.screenshot({ path: outputPath });

    console.log('2D Plot saved to', outputPath);

    // Close the browser
    await browser.close();
};

/**
 * Creates a 3D plot of the training and test data, along with the regression function's predictions.
 * 
 * @param {*} trainingData The data that the regression function was trained on (array of objects with x, y, and z).
 * @param {*} testData The data that the regression function was tested on (array of objects with x, y, and z).
 * @param {*} axes The axes to use from the data for the x, y, and z axes.
 * @param {*} outputPath Where to put the PNG of the plot.
 * @param {*} regressionFunction The function that was used to make the predictions.
 */
export const createPlot3d = async (trainingData, testData, axes, outputPath, regressionFunction) => {
    const { x: xAxis, y: yAxis, z: zAxis } = axes;

    // Extract data for plotting
    const trainingX = trainingData.map(point => point[xAxis]);
    const trainingY = trainingData.map(point => point[yAxis]);
    const trainingZ = trainingData.map(point => point[zAxis]);
    const testX = testData.map(point => point[xAxis]);
    const testY = testData.map(point => point[yAxis]);
    const testZ = testData.map(point => point[zAxis]);

    // Determine the domain of the x-axis and y-axis
    const allX = [...trainingX, ...testX];
    const allY = [...trainingY, ...testY];
    const xMin = Math.min(...allX);
    const xMax = Math.max(...allX);
    const yMin = Math.min(...allY);
    const yMax = Math.max(...allY);

    // Generate a grid of x and y values for the regression line
    const regressionX = Array.from({ length: 20 }, (_, i) => xMin + (i * (xMax - xMin) / 19));
    const regressionY = Array.from({ length: 20 }, (_, i) => yMin + (i * (yMax - yMin) / 19));
    const regressionZ = [];

    regressionX.forEach(x => {
        regressionY.forEach(y => {
            regressionZ.push(regressionFunction({ [xAxis]: x, [yAxis]: y }));
        });
    });

    // Flatten the grid for Plotly
    const flatX = regressionX.flatMap(x => Array(regressionY.length).fill(x));
    const flatY = Array.from({ length: regressionX.length }, () => regressionY).flat();

    // Create traces for the plot
    const trainingTrace = {
        x: trainingX,
        y: trainingY,
        z: trainingZ,
        mode: 'markers',
        type: 'scatter3d',
        name: 'Training Data',
        marker: { color: 'blue' }
    };

    const testTrace = {
        x: testX,
        y: testY,
        z: testZ,
        mode: 'markers',
        type: 'scatter3d',
        name: 'Test Data',
        marker: { color: 'red' }
    };

    const predictionTrace = {
        x: flatX,
        y: flatY,
        z: regressionZ,
        mode: 'lines',
        type: 'scatter3d',
        name: 'Regression Line',
        line: { color: 'green' }
    };

    const data = [trainingTrace, testTrace, predictionTrace];

    // Define layout
    const layout = {
        title: '3D Regression Plot',
        scene: {
            xaxis: { title: xAxis },
            yaxis: { title: yAxis },
            zaxis: { title: zAxis }
        }
    };

    // Create the plot HTML
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
        </head>
        <body>
            <div id="plot"></div>
            <script>
                const data = ${JSON.stringify(data)};
                const layout = ${JSON.stringify(layout)};
                Plotly.newPlot('plot', data, layout);
            </script>
        </body>
        </html>
    `;

    // Use Puppeteer to render the plot and save it as a PNG
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Load the HTML content
    await page.setContent(htmlContent);

    // Wait for the plot to render
    await page.waitForSelector('#plot');

    // Take a screenshot of the plot
    const plotElement = await page.$('#plot');
    await plotElement.screenshot({ path: outputPath });

    console.log('3D Plot saved to', outputPath);

    // Close the browser
    await browser.close();
};