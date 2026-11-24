const { RekognitionClient, CompareFacesCommand } = require('@aws-sdk/client-rekognition');

// Cliente de Rekognition en la misma región us-east-1 (o us-east-2)
const rekognitionClient = new RekognitionClient({ region: 'us-east-1' });

const compareFaces = async (sourceImageBase64, targetImageBase64) => {
    // Limpiar encabezados data:image si existen y convertir Base64 a Buffer
    const sourceBytes = Buffer.from(sourceImageBase64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const targetBytes = Buffer.from(targetImageBase64.replace(/^data:image\/\w+;base64,/, ''), 'base64');

    const command = new CompareFacesCommand({
        SourceImage: { Bytes: sourceBytes },
        TargetImage: { Bytes: targetBytes },
        SimilarityThreshold: 80 // Umbral mínimo de coincidencia (80%)
    });

    const response = await rekognitionClient.send(command);

    if (response.FaceMatches && response.FaceMatches.length > 0) {
        const similarity = response.FaceMatches[0].Similarity;
        return {
            isMatch: true,
            similarity: similarity,
            message: 'Rostros coinciden exitosamente'
        };
    } else {
        return {
            isMatch: false,
            similarity: 0,
            message: 'Rostros no coinciden'
        };
    }
};

module.exports = { compareFaces };
