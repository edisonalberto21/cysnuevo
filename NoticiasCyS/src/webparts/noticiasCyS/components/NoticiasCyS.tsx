import * as React from 'react';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { INoticiasCySProps } from './INoticiasCySProps';
import { Web } from "sp-pnp-js";
import pnp from "sp-pnp-js"; 
import { IListItem } from '../IListItem';
import { INoticiasState } from './INoticiasState';

export default class NoticiasCyS extends React.Component<INoticiasCySProps, INoticiasState> {

  constructor(props: INoticiasCySProps, state: INoticiasState) {                     //Se define el constructor
    super(props);
    this.state = {                                                                   //Estado inicial, array items vacio
      items: []
    };
    this.noticias();                                                             //Se ejecuta el método de consulta
   }

   private interna(id){
    window.location.href = "/sites/comunidadinline/Paginas/noticias.aspx?Buscar="+id;             //Abre una interna filtrada por la clase especificada
  }


   public _renderCurrencies(imgitem) {                                                       //Funcion para mostrar la imagen de la lista 
    var img = document.createElement('div');
    img.innerHTML = imgitem;
    return img.getElementsByTagName('img')[0].getAttribute("src");
}

  public render(): React.ReactElement<INoticiasCySProps> {
    console.log(this.state.items);
    const items: JSX.Element[] = this.state.items.map((item: IListItem, i: number): JSX.Element => {   //Recorre el primer elemeto del array, para mostrar la primera noticia
    var url = item.url ? item.url['Url'] : "#";
 
  if(i===0){
  return (
        <div>                                                                                                  
            <div className="col-md-3 null-pad">
                <div className="row">
                  <figure className="imghov col-md-4 null-pad" style={{background:this.props.color}}>
                    <img src={this._renderCurrencies(item.imagen)} alt={item.Title} className="bg-noticias"/>
                        <figcaption>
                          <h1>Noticias</h1>
                          <h2 className="desc-sect" style={{marginTop:'100px'}}>{item.Title}</h2>
                          <p>{item.descripcion}</p>
                          <a onClick={() => this.interna(item.Id)}>Ver más</a>
                        </figcaption>
                  </figure>
              </div>
            </div>
        </div>
 );
  }
});

const resulitems: JSX.Element[] = this.state.items.map((itemresult: IListItem, i: number): JSX.Element => { //Recorre todos los elementos del array excepto el primero
  var url = itemresult.url ? itemresult.url['Url'] : "#";
       if(i!=0){
    return (
        <div className="col-md-3 col-sm-6  col-xs-12 null-pad">
        <div className="row">
        <figure className="imghov col-md-4" style={{background:this.props.color}}>
        <img src={this._renderCurrencies(itemresult.imagen)} alt={itemresult.Title}/>
          <figcaption>
            <h3>{itemresult.Title}</h3>
            <p>{itemresult.descripcion}</p>
            <a onClick={() => this.interna(itemresult.Id)}>Ver más</a>
          </figcaption>
        </figure>
     </div>
  </div>
      
      );
    }
    }); 
   
    return (                                                         //Renderiza en la vista
           <section id="sect-noticias">
            <div>
                {items}
                {resulitems}
                </div> 
              </section>
     );
}
//Metodo para la consulta de la data a la lista seleccionada en la configuración de la webpart
private noticias(){
  if(!this.props.cantidad){                                                       //Condicional para el top de la consulta
       var cantidad = 7;
  }else{
    cantidad = this.props.cantidad;
  }
  pnp.sp.web.lists.getByTitle(this.props.listN)
    .items.select('Title', 'Id', 'imagen','descripcion','url').top(cantidad).orderBy('Created', false).get()    //selecciona los items de la lista 
    .then((items: IListItem[]): void => {
      this.setState({
        items: items
      }); 
  }, (error: any): void => {        //Imprime si existe el error
    console.log(error);
     });
}

}
