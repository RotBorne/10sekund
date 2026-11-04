import React, {createContext, useState} from 'react';
export const ValueContext=createContext();
{/*Zbiór zmiennych z których korzysta cały program*/}
export const ValueProvider= ({typ}) => {
    const [valueTyp, setValueTyp]= useState(null);
    return(
        <ValueContext.Provider value={{valueTyp, setValueTyp}}>
        {typ}
        </ValueContext.Provider>
    );
};