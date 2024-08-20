import { inject, Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private s_client: SupabaseClient;

  // constructor() { 
  //   this.s_client = createClient(environment.apiUrl, environment.apiKey);
  // }
  private s_client = inject(SupabaseService).supabaseClient;

  //Sesion
  session(){
    return this.s_client.auth.getSession()
  }
  //Register
  signUp(email: string, password: string){
    return this.s_client.auth.signUp({email, password})
  }

  //Login
  signIn(email: string, password: string){
    return this.s_client.auth.signInWithPassword({email, password})
  }

  //logOut
  logOut(){
    return this.s_client.auth.signOut()
  }
}
