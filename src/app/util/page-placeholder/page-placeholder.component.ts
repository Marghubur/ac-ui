import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

/*

<page-placeholder [matrix]="[11.2, 11.1, 11.1]"></page-placeholder>


style: 1 = circular
       2 = thin line
       3 = 2 * thin line
       4 = 3 * thin line
       ...

martix explanation: (First charater = no. of rows, 2nd charater = no. of columns and last charater = style)
11.2 => 1: row, 1: column and 1: circular
11.1 => 1: row, 1: column and 2: thin line
11.1 => 1: row, 1: column and 2: thin line

*/

@Component({
  standalone: true,
  selector: 'page-placeholder',
  templateUrl: './page-placeholder.component.html',
  styleUrls: ['./page-placeholder.component.scss'],
  imports: [CommonModule],
})
export class PagePlaceholderComponent implements OnInit {
  matrixData: Array<number> = [];
  shapeValue: number = 1;
  placeholderMatrix: Array<PlaceholderMatrix> = [];

  @Input()
  set shape(size: number) {
    if (size <= 4) {
      this.shapeValue = size;
    }
  }

  getUpdateClassStyle(abbr: string, innerDiv: HTMLDivElement) {
    let e = abbr.split(",");
    if (e.length > 3) {
      throw "Invalid tag width and height";
    }

    if(e.length < 3) {
      let i = e.length;
      while(i != 3) {
        e.push('.6');
        i++;
      }
    }

    let h = 0;
    let w = 0;
    if (e.length >= 1) {
      try {
        w = parseFloat(e[1]);
        h = parseFloat(e[2]);
      } catch (_) {
        console.log("Invalid height value in placeholder creation");
      }
    }

    switch(e[0]) {
      case 'o':
        innerDiv.classList.add("me-2", "circular-2", "skeleton");
        innerDiv.setAttribute("style", `width: ${w}vw; height: ${w}vw;`);
        break;
      case '-':
        innerDiv.classList.add("rounded", "mx-1", "skeleton");
        innerDiv.setAttribute("style", `width: ${w}vw; height: ${h}vw; max-width: 99%;`);
        break;
      case '=':
        innerDiv.classList.add("rounded", "mx-1", "flex-column", "skeleton");
        innerDiv.setAttribute("style", `width: ${w}vw; height: ${h}vw; max-width: calc(80vw * 0.5);`);
        break;
      case '~':
        innerDiv.classList.add("rounded", "mx-1", "mb-2", "skeleton");
        innerDiv.setAttribute("style", `width: ${w}vw; height: ${h}vw; max-width: calc(80vw * 0.5);`);
        break;
    }
  }

  updateParent(abbr: string, parentDiv: HTMLDivElement) {
    switch(abbr[0]) {
      case '=':
      case '~':
        parentDiv.classList.add("flex-column");
    }
  }

  createNode(data: PlaceholderTag): HTMLDivElement {
    let parentDiv: HTMLDivElement = document.createElement('div');

    if (data.c) {
      parentDiv.classList.add(...data.c);
    }

    let innerDiv: HTMLDivElement = null;
    if (data.s) {
      this.updateParent(data.s, parentDiv);
      innerDiv = document.createElement('div');
      this.getUpdateClassStyle(data.s, innerDiv);
    }

    if (data.r ||innerDiv) {
      let width = 100;
      for (let i = 0; i < (data.r || 1); i++) {
        if(data.s[0] == "~") {
          var currentWidth = parseInt(innerDiv.style.width, 10);
          innerDiv.style.width = currentWidth - 2 + 'vw';
        }

        // if (i > 0 && data.s != 'o') {
        //   innerDiv.classList.add('mt-2');
        // }

        parentDiv.appendChild(innerDiv.cloneNode(true));
        width -= 10;
      }
    }

    if (data.d) {
      let i = 0;
      while (i < data.d.length) {
        let childDiv = this.createNode(data.d[i]);
        parentDiv.appendChild(childDiv);
        i++;
      }
    }

    return parentDiv;
  }

  @Input()
  set matrix(mat: Array<PlaceholderTag>) {
    if (mat) {
      const fragment = document.createDocumentFragment();
      mat.forEach(x => {
        let nodes = this.createNode(x);
        fragment.appendChild(nodes);
      });
      document.getElementById("placeholder-div").innerHTML = "";
      document.getElementById("placeholder-div").appendChild(fragment);
    }
  }

  ngOnInit(): void {}
}

export interface PlaceholderMatrix {
  rows: number;
  columns: number;
  style: string;
  flex: string;
}

export interface PlaceholderTag {
  d?: Array<PlaceholderTag>;
  c?: Array<string>;
  s?: string;
  r?: number;
}
