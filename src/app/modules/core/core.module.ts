import {  ModuleWithProviders, NgModule, Optional, SkipSelf  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDataService } from '../../services/user-data.service';
import { ExamService } from '../../services/exam.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers:[UserDataService, ExamService]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule:CoreModule){
    if(parentModule){
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }

  // static forRoot(): ModuleWithProviders {
  //   return {
  //     ngModule: CoreModule,
  //     providers: [
  //       {provide: UserServiceConfig, useValue: config }
  //     ]
  //   };
  // } 
 }
