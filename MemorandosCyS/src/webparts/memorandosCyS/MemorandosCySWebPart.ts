import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'MemorandosCySWebPartStrings';
import MemorandosCyS from './components/MemorandosCyS';
import { IMemorandosCySProps } from './components/IMemorandosCySProps';

export interface IMemorandosCySWebPartProps {
  ruta: string;
  description: string;
  listName: string;
}

export default class MemorandosCySWebPart extends BaseClientSideWebPart<IMemorandosCySWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IMemorandosCySProps> = React.createElement(
      MemorandosCyS,
      {
        description: this.properties.description,
        ruta: this.properties.ruta,
        listName: this.properties.listName, 
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
                PropertyPaneTextField('listName', {  
                  label: 'Lista Asociada'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
