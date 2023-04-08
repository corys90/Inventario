const initalState = {
    emp: {
            pais: "",
            user: "",
            centros: [],
            almacenes: []
        },
    datatable: [],
    datatableSelected: [],
    dataItemsSelected: ["corys90"],
};

const Reducer = (state = initalState, action: any) => {

    switch(action.type){
        case "SetEntornoEmp" : {
            return {...state, emp: action.emp};
        }
        case "GetEntornoEmp" : {
            return {...state};
        }
        case "SetDataTable" : {
            return {...state, datatable: action.datatable};
        }
        case "SetDataTableSelected" : {
            return {...state, datatableSelected: action.datatableSelected};
        }      
        case "SetDataItemsSelected" : {
            return {...state, dataItemsSelected: action.dataitemsSelected};
        }                      
        default: return state;
    }
}

export default Reducer;
