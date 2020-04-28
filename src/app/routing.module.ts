import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { ExamComponent } from './exam/exam.component';
import { RegistrationComponent } from './registration/registration.component';
import { AvailableExamsComponent } from './available-exams/available-exams.component';
import { InstructionsComponent } from './instructions/instructions.component';
import { NewQuestionPaperComponent } from './admin/new-question-paper/new-question-paper.component';
import { MyQuestionPapersComponent } from './admin/my-question-papers/my-question-papers.component';
import { AdminInstructionsComponent } from './admin/admin-instructions/admin-instructions.component';
import { AdminExamComponent } from './admin/admin-exam/admin-exam.component';
import { ExamSchedulingComponent } from './admin/exam-scheduling/exam-scheduling.component';
import { BatchComponent } from './admin/batch/batch.component';
import { AddBatchComponent } from './admin/add-batch/add-batch.component';
import { ScoresComponent } from './scores/scores.component';
import { ExamAnalysisComponent } from './exam-analysis/exam-analysis.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'exam',
    component: ExamComponent
  },
  {
    path: 'register',
    component: RegistrationComponent
  },
  {
    path: 'availableexams',
    component: AvailableExamsComponent
  },
  {
    path: 'instructions',
    component: InstructionsComponent
  },
  {
    path: 'newquestionpaper',
    component: NewQuestionPaperComponent
  },
  {
    path: 'myQuestionPapers',
    component: MyQuestionPapersComponent
  },
  {
    path: 'adminInstructions',
    component: AdminInstructionsComponent
  },
  {
    path: 'previewExam',
    component: AdminExamComponent
  },
  {
    path:'examScheduling',
    component : ExamSchedulingComponent
  },
  {
    path:'batchList',
    component : BatchComponent
  },
  {
    path:'addBatch',
    component : AddBatchComponent
  },
  {
    path:'scores',
    component : ScoresComponent
  },
  {
    path:'examAnalysis',
    component : ExamAnalysisComponent
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})
export class RoutingModule { }
