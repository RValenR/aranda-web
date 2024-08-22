import { computed, inject, Injectable, signal } from "@angular/core";
import { SupabaseService } from "../supabase.service";
import { AuthService } from "../auth.service";

export interface Note {
    id: string
    title: string;
    description: string | null;
    user_id: string
}
interface NoteState {
    notes: any[];
    loading: boolean;
    error: boolean;
}

@Injectable({ providedIn: 'root' })

export class NotesServices {

    private s_client = inject(SupabaseService).supabaseClient;
    private _authService = inject(AuthService)

    private state = signal<NoteState>({
        notes: [],
        loading: false,
        error: false,
    })

    //Selectores
    notes = computed(() => this.state().notes);
    loading = computed(() => this.state().loading);
    error = computed(() => this.state().error);

    async getAllNotes() {
        try {
            this.state.update((state) => ({
                ...state,
                loading: true,
            }))
            const {data: {session}} = await this._authService.session();
            const { data } = await this.s_client
            .from('notes')
            .select()
            .eq('user_id', session?.user.id)
            .returns<Note[]>();

            console.log(data, 'datos iniciales');
            if (data && data.length > 0) {
                this.state.update((state) => ({
                    ...state,
                    notes: data
                }))

            }
        } catch (error) {
            this.state.update((state) => ({
                ...state,
                error: true,
            }))
        } finally {
            this.state.update((state) => ({
                ...state,
                loading: false,
            }))
        }
    }


    async insertNote(note: {title: string; description: null | string}){
        try {
            const {data: {session}} = await this._authService.session();
            const response = await this.s_client.from('notes').insert({
                user_id: session?.user.id,
                title: note.title,
                description: note.description
            });
            console.log(response);
            this.getAllNotes();
        } catch (error) {
            this.state.update((state) => ({
                ...state,
                error: true,
            }))
        }
    }

    async updateNote(note: {title: string; description: null | string, id: string}){
        try {
            const response = await this.s_client.from('notes').update({
                ...note
            }).eq('id', note.id);
            console.log(response);
            this.getAllNotes();
        } catch (error) {
            this.state.update((state) => ({
                ...state,
                error: true,
            }))
        }
    }

    async deleteNote(id: string){
        try {
            const response = await this.s_client.from('notes').delete().eq('id', id);
            this.getAllNotes();
        } catch (error) {
            this.state.update((state) => ({
                ...state,
                error: true,
            }))
        }
    }
}
