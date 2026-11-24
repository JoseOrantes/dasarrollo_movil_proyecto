const { compareFaces } = require('./services/rekognition');
const { buildResponse } = require('./utils/response');

exports.handler = async (event) => {
    console.log('Evento entrante:', event);

    const httpMethod = event.httpMethod || event.requestContext?.http?.method;
    if (httpMethod === 'OPTIONS') {
        return buildResponse(200, { message: 'Preflight check ok' });
    }

    let body;
    try {
        body = JSON.parse(event.body || '{}');
    } catch (error) {
        return buildResponse(400, { message: 'JSON inválido' });
    }

    if (!body.sourceImageBase64 || !body.targetImageBase64) {
        return buildResponse(400, { message: 'sourceImageBase64 y targetImageBase64 son requeridos' });
    }

    try {
        const result = await compareFaces(body.sourceImageBase64, body.targetImageBase64);
        return buildResponse(200, result);
    } catch (error) {
        console.error('Error en CompareFaces:', error);
        return buildResponse(500, { message: error.message || 'Error al comparar rostros' });
    }
};
