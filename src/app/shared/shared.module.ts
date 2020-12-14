import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedRoutingModule } from './shared-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [FormsModule, ReactiveFormsModule],
})
export class SharedModule {}
