import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { successData } from 'src/app/posts/common.model';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.sass']
})
export class ErrorComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: successData) {}

  ngOnInit(): void {
  }

}
