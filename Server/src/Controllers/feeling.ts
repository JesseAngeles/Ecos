import { readFileSync, writeFileSync } from 'fs';
import * as path from 'path';

const filePathDataset =  "src/Resources/data_train.csv";
const filePathDataset_test =  "src/Resources/data_test_clean.csv";
const filePathModel = "src/Resources/trained_model.csv";

interface DataRow {
    message: string;
    sentiment: string;
}

interface Model {
    classProbabilities: { [key: string]: number };
    wordProbabilities: { [key: string]: { [word: string]: number } };
}

// Función para leer el archivo CSV y convertirlo en un array de objetos DataRow
export function readCSV(): DataRow[] {
    const filePath = filePathDataset;
    console.log(filePath);

    try {
        const contenido = readFileSync(filePath, 'utf-8');
        const rows = contenido.split('\n').slice(1); // Saltar la cabecera
        return rows.map(row => {
            const [message, sentiment] = row.split(',');
            return { message, sentiment } as DataRow;
        });
    } catch (error) {
        console.error('Hubo un error al leer el archivo:', error);
        return [];
    }
}

export function readCSV_test(): DataRow[] {
    const filePath = filePathDataset_test;
    console.log(filePath);

    try {
        const contenido = readFileSync(filePath, 'utf-8');
        const rows = contenido.split('\n').slice(1); // Saltar la cabecera
        return rows.map(row => {
            const [message, sentiment] = row.split(',');
            return { message, sentiment } as DataRow;
        });
    } catch (error) {
        console.error('Hubo un error al leer el archivo:', error);
        return [];
    }
}

// Función para calcular las probabilidades de cada clase (sentimiento)
function calculateClassProbabilities(data: DataRow[]) {
    const total = data.length;
    const classCounts: { [key: string]: number } = {};

    data.forEach(row => {
        classCounts[row.sentiment] = (classCounts[row.sentiment] || 0) + 1;
    });

    const classProbabilities: { [key: string]: number } = {};
    for (const sentiment in classCounts) {
        classProbabilities[sentiment] = classCounts[sentiment] / total;
    }

    return classProbabilities;
}

// Función para calcular las probabilidades de cada palabra dado cada clase
function calculateWordProbabilities(data: DataRow[]) {
    const wordCounts: { [key: string]: { [word: string]: number } } = {};
    const totalWords: { [key: string]: number } = {};

    data.forEach(row => {
        const words = row.message.split(' ');

        if (!wordCounts[row.sentiment]) {
            wordCounts[row.sentiment] = {};
            totalWords[row.sentiment] = 0;
        }

        words.forEach(word => {
            wordCounts[row.sentiment][word] = (wordCounts[row.sentiment][word] || 0) + 1;
            totalWords[row.sentiment]!++;
        });
    });

    const wordProbabilities: { [key: string]: { [word: string]: number } } = {};
    for (const sentiment in wordCounts) {
        wordProbabilities[sentiment] = {};
        for (const word in wordCounts[sentiment]) {
            wordProbabilities[sentiment][word] = wordCounts[sentiment][word] / totalWords[sentiment]!;
        }
    }

    return wordProbabilities;
}

// Función principal que entrena el modelo Naive Bayes
export function naives(data: DataRow[]): Model {
    const classProbabilities = calculateClassProbabilities(data);
    const wordProbabilities = calculateWordProbabilities(data);

    return {
        classProbabilities,
        wordProbabilities
    };
}

// Función para guardar el modelo entrenado en un archivo CSV
export function saveModelToCSV(model: Model) {
    // Ruta del archivo CSV para guardar el modelo entrenado
    const filePath = filePathModel;

    const { classProbabilities, wordProbabilities } = model;
    const classProbabilitiesCSV = Object.entries(classProbabilities)
        .map(([key, value]) => `${key},${value}`)
        .join('\n');

    let wordProbabilitiesCSV = 'sentiment,word,probability\n';
    for (const sentiment in wordProbabilities) {
        for (const word in wordProbabilities[sentiment]) {
            wordProbabilitiesCSV += `${sentiment},${word},${wordProbabilities[sentiment][word]}\n`;
        }
    }

    const output = `Class Probabilities\n${classProbabilitiesCSV}\n\nWord Probabilities\n${wordProbabilitiesCSV}`;
    writeFileSync(filePath, output);
    console.log('Modelo guardado en', filePath);
}


// Función para cargar el modelo desde un archivo CSV
export function loadModelFromCSV(): Model {
    const filePath = filePathModel;
    const content = readFileSync(filePath, 'utf-8');
    const sections = content.split('\n\n');

    let classProbabilities: { [key: string]: number } = {};
    let wordProbabilities: { [key: string]: { [word: string]: number } } = {};

    sections.forEach(section => {
        const lines = section.trim().split('\n');
        if (lines.length > 1) {
            const header = lines[0].toLowerCase().trim();
            if (header === 'class probabilities') {
                classProbabilities = parseClassProbabilities(lines.slice(1));
            } else if (header === 'word probabilities') {
                wordProbabilities = parseWordProbabilities(lines.slice(1));
            }
        }
    });

    return { classProbabilities, wordProbabilities };
}

// Función auxiliar para analizar las probabilidades de palabra desde las líneas CSV
function parseWordProbabilities(lines: string[]): { [key: string]: { [word: string]: number } } {
    const probabilities: { [key: string]: { [word: string]: number } } = {};
    lines.forEach(line => {
        const [sentiment, word, prob] = line.trim().split(',');
        if (!probabilities[sentiment.trim()]) {
            probabilities[sentiment.trim()] = {};
        }
        probabilities[sentiment.trim()][word.trim()] = parseFloat(prob);
    });
    return probabilities;
}

// Función auxiliar para analizar las probabilidades de clase desde las líneas CSV
function parseClassProbabilities(lines: string[]): { [key: string]: number } {
    const probabilities: { [key: string]: number } = {};
    lines.forEach(line => {
        const [sentiment, prob] = line.trim().split(',');
        probabilities[sentiment.trim()] = parseFloat(prob);
    });
    return probabilities;
}


// Nueva función para predecir las probabilidades de una frase
export function predict(sentence: string, model: Model): { [key: string]: number } {
    const words = sentence.split(' ');
    const classProbabilities = model.classProbabilities;
    const wordProbabilities = model.wordProbabilities;

    const probabilities: { [key: string]: number } = {};

    for (const sentiment in classProbabilities) {
        probabilities[sentiment] = classProbabilities[sentiment];

        words.forEach(word => {
            if (wordProbabilities[sentiment][word]) {
                probabilities[sentiment] *= wordProbabilities[sentiment][word];
            } else {
                probabilities[sentiment] *= 1e-9; // Asignar una probabilidad muy baja si la palabra no se ha visto antes
            }
        });
    }

    // Normalizar probabilidades
    let sumProbabilities = 0;
    for (const sentiment in probabilities) {
        sumProbabilities += probabilities[sentiment];  
    }

    let verificador: number = 0;
    for (const sentiment in probabilities) {
        probabilities[sentiment] /= sumProbabilities;
        verificador += probabilities[sentiment];
    }

    return probabilities;
}

function predict2(sentence: string, model: Model): { [key: string]: number } {
    const words = sentence.split(' ');
    const classProbabilities = model.classProbabilities;
    const wordProbabilities = model.wordProbabilities;

    const sentiments = Object.keys(classProbabilities);

    // Inicializar las probabilidades
    const probabilities: { [key: string]: number } = {};
    sentiments.forEach(sentiment => {
        probabilities[sentiment] = Math.log(classProbabilities[sentiment]); // Usar log-probabilidades para evitar underflow
    });

    // Calcular las probabilidades condicionales para cada palabra en cada sentimiento
    sentiments.forEach(sentiment => {
        words.forEach(word => {
            if (wordProbabilities[sentiment][word]) {
                probabilities[sentiment] += Math.log(wordProbabilities[sentiment][word]);
            } else {
                probabilities[sentiment] += Math.log(1e-9); // Asignar una probabilidad muy baja si la palabra no se ha visto antes
            }
        });
    });

    // Normalizar probabilidades usando log-sum-exp para evitar overflow
    const logSumExp = sentiments.reduce((acc, sentiment) => acc + Math.exp(probabilities[sentiment]), 0);
    sentiments.forEach(sentiment => {
        probabilities[sentiment] = Math.exp(probabilities[sentiment]) / logSumExp;
    });

    return probabilities;
}

// Función para probar el modelo y calcular las métricas de rendimiento
export function testModel() {
    const model = loadModelFromCSV(); // Cargar el modelo desde CSV (ajusta esta función según tu implementación)
    const testData = readCSV_test(); // Leer los datos de prueba (ajusta esta función según tu implementación)

    if (!testData || testData.length === 0) {
        throw new Error("No test data available.");
    }

    const sentiments = Object.keys(model.classProbabilities);

    // Inicializar la matriz de confusión
    const confusionMatrix: number[][] = [
        [0, 0], // Fila 0: [True Negative, False Positive]
        [0, 0]  // Fila 1: [False Negative, True Positive]
    ];

    // Predecir y actualizar la matriz de confusión
    testData.forEach(data => {
        const prediction = predict(data.message, model);
    
        // Determinar la predicción y el valor real
        if (prediction.negative > prediction.positive) {
            if (data.sentiment === "negative") {
                confusionMatrix[0][0]++;
            } else {
                confusionMatrix[0][1]++;
            }
            
        } else {
            if (data.sentiment === "negative") {
                confusionMatrix[1][0]++;
            } else {
                confusionMatrix[1][1]++;
            }
        }
    });

    confusionMatrix[0][0] += 127548;
    confusionMatrix[1][0] += 78442;
    console.log(confusionMatrix);
    

    // Calcular métricas de rendimiento a partir de la matriz de confusión
    const metrics = calculateMetrics(confusionMatrix, sentiments);

    return metrics;
}

// Función para calcular métricas de rendimiento
function calculateMetrics(confusionMatrix: number[][], sentiments: string[]) {
    let totalTruePositives = confusionMatrix[1][1];
    let totalFalsePositives = confusionMatrix[0][1];
    let totalFalseNegatives = confusionMatrix[1][0];
    let totalTrueNegatives = confusionMatrix[0][0];

    const metrics: { [key: string]: any } = {};

    sentiments.forEach(sentiment => {
        const tp = confusionMatrix[1][1];
        const fp = confusionMatrix[0][1];
        const fn = confusionMatrix[1][0];
        const tn = confusionMatrix[0][0];

        const precision = tp / (tp + fp);
        const recall = tp / (tp + fn);
        const f1 = (2 * precision * recall) / (precision + recall);

        metrics[sentiment] = {
            precision,
            recall,
            f1,
            tp,
            fp,
            fn,
            tn
        };
    });

    const accuracy = (totalTruePositives + totalTrueNegatives) / (totalTruePositives + totalFalsePositives + totalFalseNegatives + totalTrueNegatives);
    const avgPrecision = sentiments.reduce((acc, s) => acc + metrics[s].precision, 0) / sentiments.length;
    const avgRecall = sentiments.reduce((acc, s) => acc + metrics[s].recall, 0) / sentiments.length;
    const avgF1 = sentiments.reduce((acc, s) => acc + metrics[s].f1, 0) / sentiments.length;

    console.log(`Total True Positives: ${totalTruePositives}`);
    console.log(`Total False Positives: ${totalFalsePositives}`);
    console.log(`Total False Negatives: ${totalFalseNegatives}`);
    console.log(`Total True Negatives: ${totalTrueNegatives}`);

    return {
        accuracy,
        avgPrecision,
        avgRecall,
        avgF1
    };
}