import fs from 'fs';
import { createPlot } from '../src/plot';

describe('createPlot', () => {
    describe('2D plot', () => {
        const trainingData = [
            { x: 1, y: 2.1 },
            { x: 2, y: 4.9 },
            { x: 3, y: 6.8 },
            { x: 4, y: 8.2 }
        ];

        const testData = [
            { x: 5, y: 10.1 },
            { x: 6, y: 12.3 }
        ];

        const axes = { x: 'x', y: 'y' };
        const outputPath = './test-plot-2d.png';

        // Approximate regression function: y ≈ 2x + 0.1
        const regressionFunction = ({ x }) => 2 * x + 0.1;

        afterAll(() => {
            // Clean up the generated file after the test
            // if (fs.existsSync(outputPath)) {
            //     fs.unlinkSync(outputPath);
            // }
        });

        it('should generate a 2D plot without errors', (done) => {
            createPlot(trainingData, testData, axes, outputPath, regressionFunction);

            // Wait for the file to be created
            setTimeout(() => {
                expect(fs.existsSync(outputPath)).toBe(true);
                done();
            }, 3000); // Allow time for the plot to be generated
        });
    });

    describe('3D plot', () => {
        const trainingData = [
            { x: 1, y: 2, z: 3.1 },
            { x: 2, y: 4, z: 6.2 },
            { x: 3, y: 6, z: 9.3 },
            { x: 4, y: 8, z: 12.4 }
        ];

        const testData = [
            { x: 5, y: 10, z: 15.5 },
            { x: 6, y: 12, z: 18.6 }
        ];

        const axes = { x: 'x', y: 'y', z: 'z' };
        const outputPath = './test-plot-3d.png';

        // Approximate regression function: z ≈ 2x + y + 0.1
        const regressionFunction = ({ x, y }) =>  x + y + 0.1;

        afterAll(() => {
            // Clean up the generated file after //     the test
            // if (fs.existsSync(outp// utPath)) {
            //     fs.unlinkSync(outputPath);
            // }
        });

        it('should generate a 3D plot without errors', (done) => {
            createPlot(trainingData, testData, axes, outputPath, regressionFunction);

            // Wait for the file to be created
            setTimeout(() => {
                expect(fs.existsSync(outputPath)).toBe(true);
                done();
            }, 3000); // Allow time for the plot to be generated
        });
    });
});