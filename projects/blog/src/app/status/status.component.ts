import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StatusService, Status } from './status.service';

@Component({
  selector: 'status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {
  public status$: Observable<Status>;

  constructor(private statusService: StatusService) {
    this.status$ = new Observable<Status>();
  }

  ngOnInit(): void {
    this.status$ = this.statusService.observeStatus();
  }
}
