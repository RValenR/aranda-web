import { Routes } from '@angular/router';
import { RegisterComponent } from './modules/register/register.component';
import { AuthComponent } from './modules/auth/auth.component';
import { AppComponent } from './app.component';
import { MainlistComponent } from './modules/mainlist/mainlist.component';
import { privateGuard, publicGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
    {path: '', component:AppComponent},
    {path: 'register', component:RegisterComponent,  
        canActivate: [publicGuard]},
    {path: 'auth', component:AuthComponent,  
        canActivate: [publicGuard]},
    {path: 'mainlist', component:MainlistComponent,  
        canActivate: [privateGuard]} 
];
