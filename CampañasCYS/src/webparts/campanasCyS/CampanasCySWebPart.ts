import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown
} from '@microsoft/sp-webpart-base';

import * as strings from 'CampanasCySWebPartStrings';
import CampanasCyS from './components/CampanasCyS';
import { ICampanasCySProps } from './components/ICampanasCySProps';

export interface ICampanasCySWebPartProps {
  description: string;
  cantidad: number;
 
}

export default class CampanasCySWebPart extends BaseClientSideWebPart<ICampanasCySWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ICampanasCySProps> = React.createElement(
      CampanasCyS,
      {
        description: this.properties.description,
        cantidad : this.properties.cantidad
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
                PropertyPaneTextField('description', {
                  label: 'Lista Asociada'
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
                   selectedKey: '4',
                  }),
              ]
            }
          ]
        }
      ]
    };
  }
}
