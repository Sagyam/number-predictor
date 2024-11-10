// lib/number-predictor.ts
import { InferenceSession, Tensor } from 'onnxruntime-web';

let model: InferenceSession | null = null;

// Initialize the model
async function initModel() {
    if (!model) {
        try {
            model = await InferenceSession.create('/model.onnx');
        } catch (error) {
            console.error('Failed to load the prediction model:', error);
            throw new Error('Failed to load the prediction model');
        }
    }
}

export async function predictNumber(numbers: number[]): Promise<number> {
    // Ensure model is initialized
    if (!model) {
        await initModel();
    }

    try {
        // Validate input
        if (numbers.length !== 15) {
            throw new Error('Input must be exactly 15 numbers');
        }

        // Prepare input tensor
        const inputTensor = new Tensor('float32', new Float32Array(numbers), [1, 15]);

        // Run inference
        const feeds = { input: inputTensor };

        const results = await model!.run(feeds);

        // Get the output tensor name (first output)
        const outputName = model!.outputNames[0];

        // Access the correct output tensor
        const outputTensor = results[outputName];
        if (!outputTensor) {
            throw new Error('No output tensor found');
        }

        const outputData = outputTensor.data as Float32Array;

        // Return the prediction
        return Number(outputData[0].toFixed(2));
    } catch (error) {
        console.error('Prediction error:', error);
        throw error;
    }
}

// Optional: Helper function to check model metadata
export async function getModelInfo() {
    if (!model) {
        await initModel();
    }
    return {
        inputNames: model!.inputNames,
        outputNames: model!.outputNames
    };
}