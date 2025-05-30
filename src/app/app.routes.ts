import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BillSplitComponent } from './pages/bill-split/bill-split.component';
import { ImgCompressComponent } from './pages/img-compress/img-compress.component';
import { KidsMathUtilComponent } from './pages/kids-math-util/kids-math-util.component';
import { PdfToWordComponent } from './pages/pdf-to-word/pdf-to-word.component';
import { PdfToWordAltComponent } from './pages/pdf-to-word-alt/pdf-to-word-alt.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'bill-split', component: BillSplitComponent },
  { path: 'img-compress', component: ImgCompressComponent },
  { path: 'kids-math-util', component: KidsMathUtilComponent },
  { path: 'pdf-to-word', component: PdfToWordComponent },
  { path: 'pdf-to-word-alt', component: PdfToWordAltComponent },
  { path: '**', redirectTo: '' }
];
