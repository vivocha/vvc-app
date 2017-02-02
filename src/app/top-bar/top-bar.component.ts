import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'vvc-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {

  public agent = {
    img: 'http://s3.amazonaws.com/vivocha/u/ma/marchitos/1242260695996.0361?_=1460456503407',
    name: 'Marco Amadori'
  };

  constructor() { }

  ngOnInit() {
  }
  close() {

  }
  minimize() {

  }

}
