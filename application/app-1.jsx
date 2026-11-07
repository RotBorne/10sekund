import { useState } from 'react';
function App(){
const[tekst,setTekst]=useState('');
const [lista, setLista] = useState([]);

function dodajzad(){
  if(tekst.trim() !==''){
    setLista([...lista,tekst]);
    setTekst('');
  }
}


    return(
        <>
        <header>nagłówek xD</header>

        <body1>
            <input type="text" placeholder="pisz tu" value={tekst} 
            onChange={function(e){setTekst(e.target.value);}}
            ></input>
            <button onClick={dodajzad} >zapisz</button>
        </body1>
      <ul>
        {lista.map(function(rzecz,index){
          return <li key={index}>{rzecz}</li>;
        })}
      </ul>
</>
    );

}
export default App;