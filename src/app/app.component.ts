import {Component, OnInit} from '@angular/core';
import {VvcService} from './core/vvc.service';
import {TranslateService} from 'ng2-translate';


@Component({
  selector: 'vvc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private defaultLang: string = 'en';

  constructor(private vvc: VvcService, private translate: TranslateService) {
  }
  ngOnInit() {
    this.vvc.ready().subscribe( conf => {

      if (!conf.lang) {
        conf.lang = this.defaultLang;
      }
      this.translate.getTranslation( conf.lang ).subscribe( () => {

        this.vvc.initContact();

      });
      this.translate.setDefaultLang(this.defaultLang);
      this.translate.use(conf.lang);

    });
    this.vvc.init();
  }
}
