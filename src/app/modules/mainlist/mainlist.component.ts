import { AfterViewInit, Component, effect, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Note, NotesServices } from '../../services/data-access/notes.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ImageServices } from '../../services/data-access/image.service';
import {v4 as uuid} from 'uuid'
import { Session } from '@supabase/supabase-js';

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
  private _formBuilder = inject(FormBuilder);
  noteServices = inject(NotesServices);
  imageServices = inject(ImageServices)

  constructor(){
    this.getSession();
  }

  noteSelected: Note | null = null;
  errorMessageFile = signal('');
  errorMessagePhoto = signal('');

  private dataSession:any;  


  form = this._formBuilder.group({
    title: this._formBuilder.control('', Validators.required),
    description: this._formBuilder.control('')
  })


  async getSession(){
    const { data: { session } } = await this.authService.session();
  // Si necesitas usar la sesión, puedes hacer algo como esto
  this.dataSession = session;


  }

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

  //blueImages

  uploadPhotos(event: Event){
    const input = event.target as HTMLInputElement;

    console.log(input.files);
    
    if(!input.files || input.files.length ===0){
      this.errorMessageFile.set('La imagen no existe')
      return
    }
    const file: File = input.files[0];
    const id: string = uuid()

    this.imageServices.uploadBucketPhoto('blueImages', this.dataSession?.user.id + '/'+ id, file).then((data) => {
      if(data.error){
        this.errorMessagePhoto.set(`${data.error.message}, subir una foto diferente`);
      } else{
        this.getSelectedPhoto()
      }
    })


  }

  getSelectedPhoto(){
    this.imageServices.download('blueImages', this.dataSession?.user.id + '/')
    .then((data:any)=>{
      console.log(data);
    })
  }
}
