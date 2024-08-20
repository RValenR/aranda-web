import { AfterViewInit, Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Note, NotesServices } from '../../services/data-access/notes.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-mainlist',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './mainlist.component.html',
  styleUrl: './mainlist.component.css'
})
export class MainlistComponent implements AfterViewInit {

  private authService = inject(AuthService);
  private router = inject(Router);
  noteServices = inject(NotesServices);

  noteSelected: Note | null = null;

  private _formBuilder = inject(FormBuilder);

  form = this._formBuilder.group({
    title: this._formBuilder.control('', Validators.required),
    description: this._formBuilder.control('')
  })



  onLogout() {
    this.authService.logOut()
    this.router.navigate(['/auth']);
  }

  ngAfterViewInit(){
    this.noteServices.getAllNotes()
  }
  newNote(){
    if(this.form.invalid) return;

    if(this.noteSelected){
      this.noteServices.updateNote({
        title: this.form.value.title ?? '',
        description: this.form.value.description ?? '',
        id: this.noteSelected.id
      })
    }else{
      this.noteServices.insertNote({
        title: this.form.value.title ?? '',
        description: this.form.value.description ?? '',
      })
    }

    this.form.reset();
    this.noteSelected = null;

  }

  editNote(note: Note){
    this.noteSelected = note;
    console.log(this.noteSelected);

    this.form.setValue({
      title: this.noteSelected.title,
      description: this.noteSelected.description,
    })
  }

  deleteNote(note: Note){
    this.noteServices.deleteNote(note.id);
  }
}
