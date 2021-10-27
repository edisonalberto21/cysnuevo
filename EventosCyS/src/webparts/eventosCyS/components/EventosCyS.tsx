import * as React from 'react';
import { IEventosCySProps } from './IEventosCySProps';
import { escape } from '@microsoft/sp-lodash-subset';
import pnp, { Item } from "sp-pnp-js";
import { Items } from '../Items';
import * as moment from 'moment';
import { CamlQuery } from "sp-pnp-js"; 
import * as jQuery from 'jquery';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { addDays, getDateRangeArray } from 'office-ui-fabric-react/lib/utilities/dateMath/DateMath';
import { Calendar, DayOfWeek, DateRangeType } from 'office-ui-fabric-react/lib/Calendar';

const DayPickerStrings = {                                   //Constantes del tiempo fijos
  months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  shortMonths: ['Ene', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  days: ['Sabado', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
  shortDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  goToToday: 'Go to today',
  weekNumberFormatString: 'Week number {0}',
  prevMonthAriaLabel: 'Previous month',
  nextMonthAriaLabel: 'Next month',
  prevYearAriaLabel: 'Previous year',
  nextYearAriaLabel: 'Next year',
  prevYearRangeAriaLabel: 'Previous year range',
  nextYearRangeAriaLabel: 'Next year range',
  closeButtonAriaLabel: 'Close'
};

export interface ICalendarInlineExampleState {   //Se declara estado inicial
  selectedDate?: Date | null;
  selectedDateRange?: Date[] | null;
  Items: Items[];  
  searchState : string;
}

export interface ICalendarInlineExampleProps {    //Se declaran props
  isMonthPickerVisible?: boolean;
  dateRangeType: DateRangeType;
  autoNavigateOnSelection: boolean;
  showGoToToday: boolean;
  showNavigateButtons?: boolean;
  highlightCurrentMonth?: boolean;
  highlightSelectedMonth?: boolean;
  isDayPickerVisible?: boolean;
  showMonthPickerAsOverlay?: boolean;
  showWeekNumbers?: boolean;
  minDate?: Date;
  maxDate?: Date;
  restrictedDates?: Date[];
  showSixWeeksByDefault?: boolean;
  workWeekDays?: DayOfWeek[];
  firstDayOfWeek?: DayOfWeek;
}


export default class EventosCyS extends React.Component<IEventosCySProps, ICalendarInlineExampleState> {

public constructor(props: IEventosCySProps) {
    super(props);

    this.state = {                   //Se inicializa el estado dl componente
      selectedDate: null,
      selectedDateRange: null,
      Items:[],
      searchState: ""
    };

    this._onDismiss = this._onDismiss.bind(this);             //Funciones globales para el componete del calendario y la funcion de consulta
    this._onSelectDate = this._onSelectDate.bind(this);
    this._goNext = this._goNext.bind(this);
    this._goPrevious = this._goPrevious.bind(this);
    this.Eventos();
  }
  public _renderCurrencies(imgitem) {                                                       //Funcion para mostrar la imagen de la lista 
    var img = document.createElement('div') ;
    img.innerHTML = imgitem ;
    return img.getElementsByTagName('img')[0].getAttribute("src");
  }

  public render(): JSX.Element {
    
    moment.locale('es');
  //prueba
  const items1: JSX.Element[] = this.state.Items.map((item1: Items, index: number): JSX.Element => { 
        
    const fecha =item1.Fechainicio ? item1.Fechainicio: "";                                     //Fecha inicial del evento, viene de la lista eventos
    const fechafinalizacion =item1.FechaFinal ? item1.FechaFinal: "";                            //Fecha final del evento, viene de la lista eventos
    var fechaini =fecha ? fecha.split("T")[1].split(":"): "";
    var horarioinicial = fechaini[0] + ":" + fechaini[1];
    var fechafin =fechafinalizacion ? fechafinalizacion.split("T")[1].split(":"): "";
    var horariofinal = fechafin[0] + ":" + fechafin[1];
    var mes = moment(fecha, ["MM-DD-YYYY", "YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY"]).format('MMMM');     //Formato utilizado desde la libreria moment()
    var dia = moment(fecha, ["MM-DD-YYYY", "YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY"]).format('DD');        //Formato utilizado desde la libreria moment()
    var nombredia = moment(fecha, ["MM-DD-YYYY", "YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY"]).format('dddd');
    var horainicio = moment(fecha, ["MM-DD-YYYY", "YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY"]).format('hhhh');
    var info = !this.state.selectedDate ? 'Not set' : this.state.selectedDate.toLocaleString();
    var objectinfo =this.state.selectedDate ?  this.state.selectedDate.toLocaleString().split(" ")[0]: "";
    var eventos =objectinfo ? objectinfo.split("/")[1] + objectinfo.split("/")[0]: ""; 
    var fechaevento =fecha ? fecha.split("T")[0].split("-")[1].replace("0","") + fecha.split("T")[0].split("-")[2]: "";
    var evento1 = moment(objectinfo, ["MM-DD-YYYY", "YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY"]).format('DD/MM');            //Formato recibido desde el evento del calendario
    var evento2 = moment(fecha.split("T")[0], ["MM-DD-YYYY", "YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY"]).format('DD/MM');    //Formato de la fecha actual del evento
  
      //Validacion para el primer render del componente principal,
      var s = item1.Title ? item1.Title : "";
      var t = item1.Descripcion ? item1.Descripcion : "";
  
      if(s.toLowerCase().indexOf(this.state.searchState.toLowerCase())!= -1 || t.toLowerCase().indexOf(this.state.searchState.toLowerCase())!= -1){ 
            if(jQuery('.space .row-striped') && item1.Clase==='Evento' &&  info !='Not set' && evento1 != evento2){     //Muestra la data organizada por orden descente, ppor la clase "Eventos"
            jQuery('.superiors').show();  
             
               return ( <div className="row row-stripe superiors">
              <div className="col-xs-1 text-center bg-fecha-date pad-v-15">
                <h4>{mes}</h4>
                <h2>{dia}</h2>
              </div>
                <div className="col-xs-3 pad-0">
               <div className="row">
               <img src={this._renderCurrencies(item1.Imagen)}/>
                </div>
                  </div>
                     <div className="col-xs-12 col-md-8">
                      <h5 className="titulo-evento">{item1.NombreEvento}</h5>
                        <ul className="list-inline">
                          <li className="list-inline-item"><i className="fa fa-calendar-o" aria-hidden="true"></i>{nombredia}</li>
                          <li className="list-inline-item"><i className="fa fa-clock-o" aria-hidden="true"></i> {horarioinicial} - {horariofinal}</li>
                          <li className="list-inline-item"><i className="fa fa-location-arrow" aria-hidden="true"></i>{item1.Lugar}</li>
                        </ul>
                      <p>{item1.Descripcion}</p>
                  </div>
               </div>
  
          );
            }
          }
            });
  //prueba
  
  
      const items: JSX.Element[] = this.state.Items.map((item: Items, i: number): JSX.Element => { 
        
        const fecha =item.Fechainicio ? item.Fechainicio: "";                                     //Fecha inicial del evento, viene de la lista eventos
        const fechafinalizacion =item.FechaFinal ? item.FechaFinal: "";                            //Fecha final del evento, viene de la lista eventos
        var fechaini =fecha ? fecha.split("T")[1].split(":"): "";
        var horarioinicial = fechaini[0] + ":" + fechaini[1];
        var fechafin =fechafinalizacion ? fechafinalizacion.split("T")[1].split(":"): "";
        var horariofinal = fechafin[0] + ":" + fechafin[1];
        var mes = moment(fecha, ["MM-DD-YYYY", "YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY"]).format('MMMM');     //Formato utilizado desde la libreria moment()
        var dia = moment(fecha, ["MM-DD-YYYY", "YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY"]).format('DD');        //Formato utilizado desde la libreria moment()
        var nombredia = moment(fecha, ["MM-DD-YYYY", "YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY"]).format('dddd');
        var horainicio = moment(fecha, ["MM-DD-YYYY", "YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY"]).format('hhhh');
        var info = !this.state.selectedDate ? 'Not set' : this.state.selectedDate.toLocaleString();
        var objectinfo =this.state.selectedDate ?  this.state.selectedDate.toLocaleString().split(" ")[0]: "";
        var eventos =objectinfo ? objectinfo.split("/")[1] + objectinfo.split("/")[0]: ""; 
        var fechaevento =fecha ? fecha.split("T")[0].split("-")[1].replace("0","") + fecha.split("T")[0].split("-")[2]: "";
        var evento1 = moment(objectinfo, ["MM-DD-YYYY", "YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY"]).format('DD/MM');            //Formato recibido desde el evento del calendario
        var evento2 = moment(fecha.split("T")[0], ["MM-DD-YYYY", "YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY"]).format('DD/MM');    //Formato de la fecha actual del evento
      
        var sa = item.Title ? item.Title : "";
        var ta = item.Descripcion ? item.Descripcion : "";
        if(sa.toLowerCase().indexOf(this.state.searchState.toLowerCase())!= -1 || ta.toLowerCase().indexOf(this.state.searchState.toLowerCase())!= -1){ 
          if(info==='Not set' && item.Clase==='Evento'){                      //Validacion para el primer render del componente principal,
                                                                        //Muestra la data organizada por orden descente, ppor la clase "Eventos"
        return ( <div className="row row-striped medio">
                    <div className="col-xs-1 text-center bg-fecha-date pad-v-15">
                      <h4>{mes}</h4>
                      <h2>{dia}</h2>
                    </div>
                    <div className="col-xs-3 pad-0">
                      <div className="row">
                        <img src={this._renderCurrencies(item.Imagen)}/>
                      </div>
                    </div>
                    <div className="col-xs-12 col-md-8">
                      <h5 className="titulo-evento">{item.NombreEvento}</h5>
                        <ul className="list-inline">
                          <li className="list-inline-item"><i className="fa fa-calendar-o" aria-hidden="true"></i>{nombredia}</li>
                          <li className="list-inline-item"><i className="fa fa-clock-o" aria-hidden="true"></i> {horarioinicial} - {horariofinal}</li>
                          <li className="list-inline-item"><i className="fa fa-location-arrow" aria-hidden="true"></i>{item.Lugar}</li>
                        </ul>
                        <p>{item.Descripcion}</p>
                    </div>
                  </div>);
  
      }
  
        else if(evento1===evento2 && item.Clase==='Evento' ){             //Validación cuando se selecciona una fecha del calendario
          jQuery('.superiors').hide();                                                       //filtrado por la clase Evento
        return ( <div className="row row-striped  inferior">
                    <div className="col-xs-1 text-center bg-fecha-date pad-v-15">
                        <h4>{mes}</h4>
                        <h2>{dia}</h2>
                   </div>
                 <div className="col-xs-3 pad-0">
                   <div className="row">
                    <img src={this._renderCurrencies(item.Imagen)}/>
                   </div>
                 </div>
                <div className="col-xs-12 col-md-8">
                  <h5 className="titulo-evento">{item.NombreEvento}</h5>
                    <ul className="list-inline">
                      <li className="list-inline-item"><i className="fa fa-calendar-o" aria-hidden="true"></i>{nombredia}</li>
                      <li className="list-inline-item"><i className="fa fa-clock-o" aria-hidden="true"></i> {horarioinicial} - {horariofinal}</li>
                      <li className="list-inline-item"><i className="fa fa-location-arrow" aria-hidden="true"></i>{item.Lugar}</li>
                    </ul>
                    <p>{item.Descripcion}</p>
                </div>
            </div>
   
    );
  
         }
  
         if(item.Clase==='FechaEspecial' && evento1===evento2){                //Validación cuando se selecciona una fecha del calendario
                                                                                //filtrado por la clase "Fecha Especial"
      
          return ( <div className="row row-striped">
                      <div className="col-xs-1 text-center bg-fecha-date pad-v-15">
                          <h4>{mes}</h4>
                          <h2>{dia}</h2>
                     </div>
                   <div className="col-xs-3 pad-0">
                     <div className="row">
                      <img src={this._renderCurrencies(item.Imagen)}/>
                     </div>
                   </div>
                  <div className="col-xs-12 col-md-8">
                    <h5 className="titulo-evento">{item.NombreEvento}</h5>
                     <p>{item.Descripcion}</p>
                  </div>
              </div>
      
      );
           }
           
           }
       
   });  
  
      const divStyle: React.CSSProperties = {                     //Propiedades del componente del Calendario
        height: 'auto'
      };
  
      const buttonStyle: React.CSSProperties = {
        margin: '17px 10px 0 0'
      };
  
      let dateRangeString: string | null = null;
      if (this.state.selectedDateRange) {
        const rangeStart = this.state.selectedDateRange[0];
        const rangeEnd = this.state.selectedDateRange[this.state.selectedDateRange.length - 1];
        dateRangeString = rangeStart.toLocaleDateString() + '-' + rangeEnd.toLocaleDateString();
      }
  
      return (
        <div style={divStyle}>
  
  
          <div className="container" style={{marginTop:'30px'}}>
    <div className="row">
          <div className="col-sm-6 col-sm-offset-3">
              <div id="imaginary_container"> 
                  <div className="input-group stylish-input-group">
                      <input id="tags" type="search" className="form-control" onChange={e => this.setState({ searchState:e.target.value })} placeholder="Search"/>
                          <span className="input-group-addon">
                          <i className="fas fa-search"></i>
                       </span>
                  </div>
              </div>
          </div>
    </div>
  </div>
         
          <div>
            <div className= "col-md-5">
          <Calendar                                                //Se visualiza el componente Calendario, con sus respectivos props
            onSelectDate={this._onSelectDate}
            onDismiss={this._onDismiss}
            isMonthPickerVisible={this.props.isMonthPickerVisible}
            dateRangeType={this.props.dateRangeType}
            autoNavigateOnSelection={this.props.autoNavigateOnSelection}
            showGoToToday={this.props.showGoToToday}
            value={this.state.selectedDate!}
            firstDayOfWeek={this.props.firstDayOfWeek ? this.props.firstDayOfWeek : DayOfWeek.Sunday}
            strings={DayPickerStrings}
            highlightCurrentMonth={this.props.highlightCurrentMonth}
            //highlightSelectedMonth={this.props.highlightSelectedMonth}
            isDayPickerVisible={this.props.isDayPickerVisible}
            showMonthPickerAsOverlay={this.props.showMonthPickerAsOverlay}
            showWeekNumbers={this.props.showWeekNumbers}
            minDate={this.props.minDate}
            maxDate={this.props.maxDate}
           // restrictedDates={this.props.restrictedDates}
          //  showSixWeeksByDefault={this.props.showSixWeeksByDefault}
            //workWeekDays={this.props.workWeekDays}
            
           
          />
          </div>
          {this.props.showNavigateButtons && (
            <div>
              <DefaultButton style={buttonStyle} onClick={this._goPrevious} text="Previous" />
              <DefaultButton style={buttonStyle} onClick={this._goNext} text="Next" />
            </div>
          )}
      <div className="col-md-7 space">
          <h2 className="widget-title text-left">Eventos</h2>
            {items}
            {items1}
          </div>
       </div>
     </div>
      );
    }
  
    private _onDismiss(): void {                                                               //Metodo para guaradr el estado anterior
      this.setState((prevState: ICalendarInlineExampleState) => {
        return prevState;
      });
    }
  
    private _goPrevious(): void {                                                              //FUncionamiento del año y mes del calendario
      this.setState((prevState: ICalendarInlineExampleState) => {
        const selectedDate = prevState.selectedDate || new Date();
        const dateRangeArray = getDateRangeArray(selectedDate, this.props.dateRangeType, DayOfWeek.Sunday);
  
        let subtractFrom = dateRangeArray[0];
        let daysToSubtract = dateRangeArray.length;
  
        if (this.props.dateRangeType === DateRangeType.Month) {
          subtractFrom = new Date(subtractFrom.getFullYear(), subtractFrom.getMonth(), 1);
          daysToSubtract = 1;
        }
  
        const newSelectedDate = addDays(subtractFrom, -daysToSubtract);
  
        return {
          selectedDate: newSelectedDate
        };
      });
    }
  
    private _goNext(): void {
      this.setState((prevState: ICalendarInlineExampleState) => {
        const selectedDate = prevState.selectedDate || new Date();
        const dateRangeArray = getDateRangeArray(selectedDate, this.props.dateRangeType, DayOfWeek.Sunday);
        const newSelectedDate = addDays(dateRangeArray.pop()!, 1);
  
        return {
          selectedDate: newSelectedDate
        };
      });
    }
  
    private _onSelectDate(date: Date, dateRangeArray: Date[]): void {    //Cambia el estado del componente por cada fecha seleccionada
      this.setState((prevState: ICalendarInlineExampleState) => {
        return {
          selectedDate: date,
          selectedDateRange: dateRangeArray
        };
      });
    }
  
    private Eventos(){                  //Hace la consulta a la lista eventos, organizada en forma descendente, por encima de la fecha actual
                                      
      var Fecha = new Date().toISOString();    //Toma el tiempo actual, para hacer el query actualizado
      Fecha = Fecha.split('T')[0];
  
  var Horario = new Date().getHours() +":"+ new Date().getMinutes() +":00Z";
  
  
      const xml = "<View>"+
      "<ViewFields>"+
          "<FieldRef Name='Title'/>"+
          "<FieldRef Name='Descripcion'/>"+
          "<FieldRef Name='Imagen'/>"+
          "<FieldRef Name='Fechainicio'/>"+
          "<FieldRef Name='FechaFinal'/>"+
          "<FieldRef Name='Lugar'/>"+
          "<FieldRef Name='NombreEvento'/>"+
          "<FieldRef Name='Clase'/>"+
        "</ViewFields>"+
        "<Query>"+
       "<OrderBy><FieldRef Name='Fechainicio' Ascending='False'/></OrderBy></Query>"+
         "</View>";
  
  const q: CamlQuery = {
  ViewXml: xml,
  };
  
  pnp.sp.web.lists.getByTitle(this.props.description).getItemsByCAMLQuery(q).then((items: any[]) => {      //Hace la consulta por pnp a la lista
  
    this.setState({
      Items:items
  });
  
  });
  }
  
   
  }
  