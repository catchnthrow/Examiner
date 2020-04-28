import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SuperNavTopComponent } from './super-nav-top/super-nav-top.component';
import { SuperNavTopGuestComponent } from './super-nav-top-guest/super-nav-top-guest.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { RoutingModule } from './routing.module';
import { ExamComponent } from './exam/exam.component';
//import { UserDataService } from './services/user-data.service';
import { AvailableExamsComponent } from './available-exams/available-exams.component';
import { CoreModule } from './modules/core/core.module';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './Interceptor/token.interceptor';
import { InstructionsComponent } from './instructions/instructions.component';
import { SuperNavTopAdminComponent } from './super-nav-top-admin/super-nav-top-admin.component';
import { SuperNavTopContainerComponent } from './super-nav-top-container/super-nav-top-container.component';
import { NewQuestionPaperComponent } from './admin/new-question-paper/new-question-paper.component';
import { MyQuestionPapersComponent } from './admin/my-question-papers/my-question-papers.component';
import { AdminInstructionsComponent } from './admin/admin-instructions/admin-instructions.component';
import { AdminExamComponent } from './admin/admin-exam/admin-exam.component';
import { ExamSchedulingComponent } from './admin/exam-scheduling/exam-scheduling.component';
import { BatchComponent } from './admin/batch/batch.component';
import { AddBatchComponent } from './admin/add-batch/add-batch.component';
import { ScoresComponent } from './scores/scores.component';
import { ExamAnalysisComponent } from './exam-analysis/exam-analysis.component';
@NgModule({
  declarations: [
    AppComponent,
    SuperNavTopComponent,
    SuperNavTopGuestComponent,
    LoginComponent,
    RegistrationComponent,
    ProfileComponent,
    HomeComponent,
    ExamComponent,
    AvailableExamsComponent,
    InstructionsComponent,
    SuperNavTopAdminComponent,
    SuperNavTopContainerComponent,
    NewQuestionPaperComponent,
    MyQuestionPapersComponent,
    AdminInstructionsComponent,
    AdminExamComponent,
    ExamSchedulingComponent,
    BatchComponent,
    AddBatchComponent,
    ScoresComponent,
    ExamAnalysisComponent   
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RoutingModule,
    FormsModule,
    CoreModule,
    NgbModule.forRoot()
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
  }
],
  bootstrap: [AppComponent]
})
export class AppModule { }
