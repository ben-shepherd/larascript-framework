import Observer from "@src/core/observer/Observer";
import { UserData } from "../models/auth/User";
import { MovieData } from "../models/MovieModel";

export default class MovieObserver extends Observer<MovieData>
{  
    creating = (data: MovieData): MovieData => {
        console.log('MovieData is being created for the first time!')
        return data
    }

    updating = (data: MovieData): MovieData => {
        return data
    }

    onAuthorChanged = (data: UserData): UserData => {
        console.log(`The author has changed!`)
        return data
    }
}