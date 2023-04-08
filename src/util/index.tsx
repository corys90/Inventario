import XLSX from 'sheetjs-style';
import * as FileSaver from 'file-saver';
import { httpApiGetText, httpApiPostParams } from "../lib";

export const fncPerfilesDelUsuario = async (recurso: string, dominio: string, user: string) =>{

    const data = await httpApiPostParams(recurso, "POST", {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': 'length' 
    }, `strDominio=${dominio}&strUsuario=${user}`);

    return await data;
};

export const fncValidaUsuario = async (recurso: string, dominio: string, user: string, password: string) =>{

    const data = await httpApiPostParams(recurso, "POST", {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': 'length' 
    }, `strDominio=${dominio}&strUsuario=${user}&strPassword=${password}`);

    return data;
};

export const fncDominios = async (recurso: string) =>{

    const data = await httpApiGetText(recurso, {
        'Content-Type': 'text/xml; charset=utf-8',
        'Content-Length': 'length' 
    });

    return data;
}

export const fncTokensDelPerfil = async (recurso: string, dominio: string, user: string, perfil: string) =>{

    const data = await httpApiPostParams(recurso, "POST", {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': 'length' 
    }, `strDominio=${dominio}&strUsuario=${user}&strPerfil=${perfil}`);

    return data;
};

export const fncTokensDelUsuario = async (recurso: string, dominio: string, user: string) =>{

    const data = await httpApiPostParams(recurso, "POST", {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': 'length' 
    }, `strDominio=${dominio}&strUsuario=${user}`);

    return data;
};

export const fncUsuariosDeUnPerfil = async (recurso: string, perfil: string) =>{

    const data = await httpApiPostParams(recurso, "POST", {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': 'length' 
    }, `id_perfil=${perfil}`);

    return await data;
};

export const fncUsuariosDelDominio = async (recurso: string, dominio: string) =>{

    const data = await httpApiPostParams(recurso, "POST", {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': 'length' 
    }, `strDominio=${dominio}`);

    return await data;
};

export const fncValidaTokenUsuario = async (recurso: string, dominio: string, user: string, token: string) =>{

    const data = await httpApiPostParams(recurso, "POST", {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': 'length' 
    }, `strDominio=${dominio}&strUsuario=${user}&strIdToken=${token}`);

    return await data;
};

export const exportToExcel = (fineName: string, datos: any) => {

    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fineName + fileExtension);
}