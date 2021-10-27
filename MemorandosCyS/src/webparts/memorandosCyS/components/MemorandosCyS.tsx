import * as React from 'react';

import { IMemorandosCySProps } from './IMemorandosCySProps';
import { escape } from '@microsoft/sp-lodash-subset';
import pnp, { Item } from "sp-pnp-js";
import { Items } from './Items';
import { IMemorandosState } from './IMemorandosState';
import * as moment from 'moment';   

export default class MemorandosCyS extends React.Component<IMemorandosCySProps, IMemorandosState> {
  
  public miArray1 = [];  

  constructor(props: IMemorandosCySProps, state: IMemorandosState) {
    
    super(props);
    
    this.state = {
      Items: [],
      search: ""                                                                 //Si inicializa el estado en el constructor con un array vacio
     };
   
     this.Memorandos();                                                          //Método para hacer la consulta a la lista
     this.handleClick= this.handleClick.bind(this);                            
   
   }

   public handleClick(e){                                                        //Metodo para busqueda segun el item seleccionado
     
    this.miArray1= [];                                                          //Se inicializa el array para que la data no se duplique
    const tipo= e.target.name;                                                 //Toma el atributo name seleccionado del input
    this.llenado(tipo);                                                     

  }

  private vertodos(clase){
      window.location.href = "/sites/comunidadinline/Paginas/Memorandos.aspx?Buscar="+clase;             //Abre una interna filtrada por la clase especificada
  }


private llenado(itemc){                                                                                    //Recibe el state inicial y llena el array deneral miarray


this.miArray.map((item, i: number) => {   //Recorre el primer elemeto del array
  item.Title.map((item1, index: number) => { 
      if(item1.Clase['Title']===itemc ){                                                    //Filra el array por el tem seleccionado en el boton de la vista
        
          this.miArray1.push({                                                              //Llena el array auxiliar
              Title: item1.Title ?  item1.Title : "",
              Descripcion: item1.Descripcion ,
              Fecha: item1.Fecha ,
              Clase: item1.Clase ? item1.Clase: "",
              File : item1.File 
      
          }) ;
      }
  });
  this.setState({
      Items:this.miArray1                                                                        //Inicializa el estado con la nueva data
  });
});
   

}
  public render(): React.ReactElement<IMemorandosCySProps> {
    moment.locale('es');
    const items: JSX.Element[] = this.state.Items.map((item: Items, i: number): JSX.Element => {   //Recorre el primer elemeto del array
    const class1 = item.Clase ? item.Clase : "";
    const Titulo =class1['Title']?class1['Title']:""  ;
    const Url=item.File['ServerRelativeUrl'];
    const fecha = item.Fecha;
    var mes = moment(fecha, ["MM-DD-YYYY", "YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY"]).format('MMM');       //Libreria momentpara darle formato a la fecha
    var dia = moment(fecha, ["MM-DD-YYYY", "YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY"]).format('DD');         //Libreria momentpara darle formato a la fecha
    var ocultar = i > 5 && this.state.search.length === 0 ? 'hide' : "";
  
   var titulo =  item.Title ? item.Title : "";
   var descripcion =  item.Descripcion ? item.Descripcion : "";
   if(titulo.toLowerCase().indexOf(this.state.search.toLowerCase())!= -1 || descripcion.toLowerCase().indexOf(this.state.search.toLowerCase())!= -1){  
       
      
// if(i<6){
   
return (
   
    <div className={"col-md-6 " + ocultar}>
        
      <a href={Url} target="_blank">
     <div className="row row-striped ">
       <div className="col-xs-2 text-center bg-fecha-date">
            <h4>{mes}</h4>
            <h4>{dia}</h4>
     </div>
       <div className="col-xs-10">
       <h5 className="titulo-evento">{item.Title}</h5>
       <p>{item.Descripcion}</p>
      </div>
    </div>
    </a>
   </div>
 
 );
}
//}
}); 
const itemsR = this.state.Items.map((itemM: Items, index: number) => {                       //Constante auxiliar para validar el boton en los filtros
 
    if(this.state.Items.length===this.miArray1.length && index===0){
       return(
        <div className="col-xs-12" >
        <input type="button" name="Políticas" className="btn btn-primary btn-lg btn-center"  value="Ver todos" onClick={() => this.vertodos(itemM.Clase['Title'])}/>
        </div>
       );
   }

});  


 return (

  <div className = "col-md-12 bg-memorandos" id="memorandos">
          <h2 className="widget-title-2 ">Memorandos</h2> 
        <div className="container-fluid">

<div className="container">
<div className="row">
    <div className="col-sm-6 col-sm-offset-3">
        <div id="imaginary_container"> 
            <div className="input-group stylish-input-group">
                <input id="tags" type="search" className="form-control" onChange={e => this.setState({ search:e.target.value })} placeholder="Search"/>
                    <span className="input-group-addon">
                    <i className="fas fa-search"></i>
                 </span>
            </div>
        </div>
    </div>
</div>
</div>
        
        
    <div className="btn-pref btn-group btn-group-justified btn-group-lg" role="group" aria-label="...">

        <div className="btn-group" role="group">
          <input type="button"  className="btn btn-default" name="Reconocimiento"  onClick={this.handleClick} /><i className="fas fa-award font-24"></i>
            <div  className="hidden-xs">Reconocimientos</div>
            <a href="#tab1"></a>
            
    </div>
    <div className="btn-group" role="group">
        <input  type="button" name="Políticas"  className="btn btn-default" onClick={this.handleClick.bind(this)}/><i className="fas fa-atlas font-24"></i>
            <div className="hidden-xs">Políticas</div>
            <a href="#tab2"></a>
        
    </div>
    <div className="btn-group" role="group">
        <input type="button" id="following" name="Jornada_Laboral" className="btn btn-default" onClick={this.handleClick.bind(this)}/><i className="far fa-clock font-24"></i>
    <a href="#tab3"></a>
            <div className="hidden-xs">Jornada laboral</div>
       
    </div>
    
    <div className="btn-group" role="group">
        <input type="button" name="Novedades" className="btn btn-default" onClick={this.handleClick.bind(this)}/><i className="fas fa-bullhorn font-24"></i>
            <div className="hidden-xs">Novedades </div>
    <a href="#tab4"></a>
       
    </div>
    
  <div className="btn-group" role="group">
        <input type="button"  name="Administrativos" className="btn btn-default" onClick={this.handleClick.bind(this)} /><i className="fas fa-briefcase font-24"></i>
            <div className="hidden-xs">Administrativos</div>
    <a href="#tab6"></a>
        
    </div>
    
    <div className="btn-group" role="group">
        <input type="button" name="Capacitaciones"  className="btn btn-default" onClick={this.handleClick.bind(this)}/><i className="fas fa-chalkboard-teacher font-24"></i>
            <div className="hidden-xs">Capacitaciones</div>
    <a href="#tab7"></a>
      
    </div>
    <div className="btn-group" role="group">
        <input type="button" name="SST" className="btn btn-default" onClick={this.handleClick.bind(this)}/><i className="fas fa-atlas font-24"></i>
            <div className="hidden-xs">SST</div>
    <a href="#tab8"></a>
       
    </div>
    <div className="btn-group" role="group">
        <input type="button" name="Calidad" className="btn btn-default" onClick={this.handleClick.bind(this)}/><i className="fas fa-atlas font-24"></i>
            <div className="hidden-xs">Calidad</div>
    <a href="#tab9"></a>
       
    </div>
    <div className="btn-group" role="group">
        <input type="button" name="Campañas" className="btn btn-default" onClick={this.handleClick}/><i className="fas fa-atlas font-24"></i>
            <div className="hidden-xs">Campañas</div>
    <a href="#tab10"></a>
       
    </div>
</div>

    <div className="well">
  <div className="tab-content">
    <div className="tab-pane fade in active" id="tab1">
   {/* <div className="row"><h5>Reconocimientos</h5></div>*/}
    

    
     {items}
     {itemsR}
        
         </div>
         </div>
      </div>
     </div>
 </div>
      
 
 );
}
public miArray = [];                                                              //Array principal
private Memorandos(): void {                                                      //Metodo para actualizar el estado con la consulta a la lista Eventos

pnp.sp.web.lists.getByTitle(this.props.listName)
  .items.select('Descripcion,Title,NombreDocumento,Fecha,Clase/Title&$expand=Clase,File/Name&$expand=File').orderBy('Created', false).get()    //selecciona los items de la lista 
  .then((items: Items[]): void => {
    this.miArray.push({
        Title: items
      
    });
    this.setState({
     Items: items
     });
     
}, (error: any): void => {        //Imprime si existe el error
  console.log(error);
   });
}

}
