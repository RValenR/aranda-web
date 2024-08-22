import { inject, Injectable } from "@angular/core";
import { SupabaseService } from "../supabase.service";

@Injectable({ providedIn: 'root' })

export class ImageServices {

    private s_client = inject(SupabaseService).supabaseClient;

    async createBucketPhoto(){
        const {data, error} = await this.s_client.storage.createBucket('blueImages');

        return {data, error}
    }
    

    async getBucketPhoto(){
        const {data, error} = await this.s_client.storage.getBucket('blueImages');

        return {data, error}
    }

    async uploadBucketPhoto(bucket: string, path: string, file: File){
        const {data, error} = await this.s_client.storage.from(bucket).upload(path, file);

        return {data, error}
    }

    async download(bucket: string, path: string){
        const {data, error} = await this.s_client.storage.from(bucket).list(path);
        return {data, error}
    }
}