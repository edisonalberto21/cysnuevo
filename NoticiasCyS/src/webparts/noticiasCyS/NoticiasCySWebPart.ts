import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown
} from '@microsoft/sp-webpart-base';

import * as strings from 'NoticiasCySWebPartStrings';
import NoticiasCyS from './components/NoticiasCyS';
import { INoticiasCySProps } from './components/INoticiasCySProps';

export interface INoticiasCySWebPartProps {
  listN: string;  
  siteUrl: string;
  cantidad:number;
  color: string;
}

export default class NoticiasCySWebPart extends BaseClientSideWebPart<INoticiasCySWebPartProps> {

  public render(): void {
    const element: React.ReactElement<INoticiasCySProps> = React.createElement(
      NoticiasCyS,
      {
        listN: this.properties.listN,  
        siteUrl: this.context.pageContext.web.absoluteUrl,
        cantidad: this.properties.cantidad,
        color: this.properties.color
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }


  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('listN', {  
                  label: strings.ListNameFieldLabel
                }),
                PropertyPaneDropdown('cantidad', {
                  label: 'Cantidad de Noticias',
                  options: [
                    { key: '1', text: '1' },
                    { key: '2', text: '2' },
                    { key: '3', text: '3' },
                    { key: '4', text: '4' },
                    { key: '5', text: '5' },
                    { key: '6', text: '6' },
                    { key: '7', text: '7' },
                   ],
                   selectedKey: '7',
                  }),
              
                  PropertyPaneDropdown('color', {
                    label: 'Color',
                    options: [
                      { key: '#00A9B5', text: 'Azul' },
                      { key: 'aqua', text: 'Agua' },
                      { key: 'gray', text: 'Gris' },
                      { key: 'yellow', text: 'Amarillo' },
                      { key: 'green', text: 'Verde' },
                      { key: 'violet', text: 'Purpura' },
                      { key: 'black', text: 'Negro' },
                      { key: 'white', text: 'blanco' },
                      { key: 'orange', text: 'naranja' },
                    ]}),
              ]
            }
          ]
        }
      ]
    };
  }
}
