export const SetEntornoEmp = (em:any) =>{
    return {type:"SetEntornoEmp", emp: em};
};

export const GetEntornoEmp = () =>{
    return {type:"GetEntornoEmp"};
};

export const SetDataTable= (dt:any) =>{
    return {type:"SetDataTable", datatable: dt};
};

export const SetDataTableSelected= (dt:any) =>{
    return {type:"SetDataTableSelected", datatableSelected: dt};
};

export const SetDataItemsSelected= (dt:any) =>{
    return {type:"SetDataItemsSelected", dataItemsSelected: dt};
};
