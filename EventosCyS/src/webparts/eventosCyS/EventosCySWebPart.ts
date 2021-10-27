import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'EventosCySWebPartStrings';
import EventosCyS from './components/EventosCyS';
import { IEventosCySProps } from '../eventosCyS/components/IEventosCySProps';

export interface IEventosCySWebPartProps {
  description: string;
}

export default class EventosCySWebPart extends BaseClientSideWebPart<IEventosCySWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IEventosCySProps> = React.createElement(
      EventosCyS,
      {
        description: this.properties.description
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
                  label: 'Lista'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
