import * as React from 'react';

import { ICampanasCySProps } from './ICampanasCySProps';
import { escape } from '@microsoft/sp-lodash-subset';2
import pnp from "sp-pnp-js";
import { IListItem } from './IListItem'; 
import { ICampanasState } from './ICampanasState';

export default class CampanasCyS extends React.Component<ICampanasCySProps, ICampanasState> {

  constructor(props: ICampanasCySProps, state: ICampanasState) {  
    super(props);  
  
    this.state = {  
      status: 'Ready',  
      items: []  
    }; 
 
 
    this.campanas();
}

private interna(id){
  window.location.href = "/sites/comunidadinline/Paginas/campanas.aspx?Buscar="+id;             //Abre una interna filtrada por la clase especificada
}


public _renderCurrencies(imgitem) {                                                       //Funcion para mostrar la imagen de la lista 
  var img = document.createElement('div');
  img.innerHTML = imgitem;
  return img.getElementsByTagName('img')[0].getAttribute("src");
}

  public render(): React.ReactElement<ICampanasCySProps> {

    const items1 = this.state.items.map((item: IListItem, i: number)=> {  
   
      var active = i===0 ? "active" : "";
      var mostrarbtn = item.contenido.length < 300? 'hide' : "";
      var limite = item.contenido.substring(0,300);
      
      return (
        <div className={"item" + " " + active}>
        <div className="row">
          <div className="holder col-md-7">
            <h3 className="text-center">{item.Title}</h3>
              <img className="img-fluid bounceInLeft wow animated" src={this._renderCurrencies(item.imagen)}/>
            </div>
            <div className="col-md-5">
              <div className="col-xs-12 padt-30 ">
                <h3 className="title-h3">{item.subtitulo}</h3>
                <p className="text-descripcion"> {limite}
                   </p>
                <input value ="Conoce más" type="button" onClick={() => this.interna(item.Id)} className={"btn btn-default" + " " + "powcol" + " " + mostrarbtn}/>
               </div>
            </div>
          </div>
        </div>
              
        );
         
    });

    return(
      <section id="campanas">
   
      <h2 className="widget-title">campañas</h2>
       <div id="Carousel-campa" className="carousel slide container">
         <div className="carousel-inner"> 
             {items1}
            </div>   
         
         <a data-slide="prev" href="#Carousel-campa" className="left carousel-control">
          <img className="flecha-left" src="/sites/comunidadinline/Style%20Library/Images/left-flecha.png" style={{marginTop:'90%'}}/>
        </a>
        <a data-slide="next" href="#Carousel-campa" className="right carousel-control">
          <img className="flecha-right pos-top" src="/sites/comunidadinline/Style%20Library/Images/right-flecha.png" style={{marginTop:'90%'}}/>
        </a>
        </div>
   
    </section>
    );
  }
 //Metodo para la consulta de la data a la lista seleccionada en la configuración de la webpart
 private campanas(): void {
  if(!this.props.cantidad){                                                       //Condicional para el top de la consulta
    var cantidad = 7;
}else{
 cantidad = this.props.cantidad;
}

  pnp.sp.web.lists.getByTitle(this.props.description)
  .items.select('Title', 'Id', 'imagen','contenido','subtitulo').top(cantidad).orderBy('Created', false).get() 
    .then((items: IListItem[]): void => {
      this.setState({
        items: items
      }); console.log('items:' + items);
  }, (error: any): void => {        //Imprime si existe el error
    console.log(error);
  });
  
  }

}
