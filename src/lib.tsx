import * as env from './env';

export async function httpApiGetText(url: string, cabeceras: any) {
    
    try {
        const response = await fetch(url, {
                method: 'GET',
                headers: cabeceras,
        });

        const data = await response.text();
        return ({code: response.status, message: data});
    }
    catch(e){
        console.log(" Error: ", e); 
        return ({code: 400, message: "Error en la petición api"});
    }
}

export async function httpApiPostText(url: string, metodo: string, cabeceras: any, bd: any) {
    
    try {
        const response = await fetch(url, {
                method: metodo,
                headers: cabeceras,
                body: JSON.stringify(bd)
        });            
        const data = await response.text();
        return ({code: response.status, message: data});
    }
    catch(e){
        console.log(" Error: ", e); 
        return ({code: 400, message: "Error en la petición api"});
    }
}

export async function httpApiPostParams(url: string, metodo: string, cabeceras: any, bd: any) {
    
    try {
        const response = await fetch(url, {
                method: metodo,
                headers: cabeceras,
                body: bd
        });            
        const data = await response.text();
        return ({code: 200, message: data});
    }
    catch(e){
        console.log(" Error: ", e); 
        return ({code: 400, message: "Error en la petición api"});
    }
}

export const getCentros = async (dominio: string, usr: string, inventario_corp: string) =>{

    const xmlBodyCentros = `<?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
        xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
        xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
            <fncPermisosAsociados xmlns="http://www.extranetrosen.cl/wsSeguridad20">
            <strDominio>${dominio}</strDominio>
            <strUsuario>${usr}</strUsuario>
            <strArea>${inventario_corp}</strArea>
            <strConcepto>centros</strConcepto>
            </fncPermisosAsociados>
        </soap:Body>
        </soap:Envelope>
    `;

    const recurso = `${env.REACT_APP_API_URL_PROD}/wsseguridad/wsseguridad20.asmx?op=fncPermisosAsociados`;
    const response = await httpApiPostParams(recurso, "POST", {
        'Host': 'www.extranetrosen.cl',
        'Content-Type': 'text/xml',
        'Content-Length': 'length'
    }, xmlBodyCentros);

    return await (response);

}

export const getAlmacenes = async (dominio: string, usr: string, inventario_corp: string) =>{

    const xmlBodyCentros = `<?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
        xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
        xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
            <fncPermisosAsociados xmlns="http://www.extranetrosen.cl/wsSeguridad20">
            <strDominio>${dominio}</strDominio>
            <strUsuario>${usr}</strUsuario>
            <strArea>${inventario_corp}</strArea>
            <strConcepto>almacenes</strConcepto>
            </fncPermisosAsociados>
        </soap:Body>
        </soap:Envelope>
    `;

    const recurso = `${env.REACT_APP_API_URL_PROD}/wsseguridad/wsseguridad20.asmx?op=fncPermisosAsociados`;
    const response = await httpApiPostParams(recurso, "POST", {
        'Host': 'www.extranetrosen.cl',
        'Content-Type': 'text/xml',
        'Content-Length': 'length'
    }, xmlBodyCentros);

    return await (response);

}

export function getDominios(xm: string) {
    
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xm, "text/xml");

    const doms = xmlDoc.getElementsByTagName("linDominios");

    const domsArr = [];
    for (let i = 0; i < doms.length; i++) {
        const valor = doms[i].getElementsByTagName("dominio")[0].childNodes[0].nodeValue;
        domsArr.push(valor);
    }

    return (domsArr);
}

export function getXmlNodeFromXmlString(nodeName: string, xml: string): any {
    
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");

    const doms = xmlDoc.getElementsByTagName(nodeName);

    if (doms.length > 1){
        const domsArr = [];
        for (let i = 0; i < doms.length; i++) {
            const valor = doms[i].childNodes[0].nodeValue;
            domsArr.push(valor);
            return (domsArr);
        }
    } else {
        const valor = doms[0].childNodes[0].nodeValue;
        return (valor);
    }
};

export function getXmlNodeFromXmlStringArray(nodeFather: string, nodeName: string, xml: string): any {
    
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");

    const doms = xmlDoc.getElementsByTagName(nodeFather);

    const domsArr = [];
    for (let i = 0; i < doms.length; i++) {
        const valor = doms[i].getElementsByTagName(nodeName)[0].childNodes[0].nodeValue;
        domsArr.push(valor);
    }

    return (domsArr);
};




