import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { GrammarComponent } from './exercises/grammar/grammar.component';
import { FlashcardsComponent } from './exercises/flashcards/flashcards.component';
import { LessonviewComponent } from './lessonview/lessonview.component';
import { HeaderComponent } from './header/header.component';
import { CreateWordListComponent } from './create-word-list/create-word-list.component';
import { CreateSentenceListComponent } from './create-sentence-list/create-sentence-list.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuBarComponent,
    GrammarComponent,
    FlashcardsComponent,
    LessonviewComponent,
    HeaderComponent,
    CreateWordListComponent,
    CreateSentenceListComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
