import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'blog-app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.less']
})
export class AppShellComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log('Initialized!');
  }

}
