import { Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MOVIE } from 'src/app/models/Movie';
import { AlertService } from 'src/app/services/alert.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  searchKeyword!: string;
  loading = true;
  movies!: MOVIE[];
  expand!:boolean;
  detailsVisibility: { [movieId: string]: boolean } = {};
  movieInfo: any;

  constructor(private sharedService: SharedService, public alertService: AlertService, private route: ActivatedRoute) {}
  
  ngOnInit(): void {
    this.alertService.alertMessage='';
    this.route.queryParams.subscribe((params) => {
      this.loading = true;
      this.searchKeyword = params['search'];
      this.sharedService.searchMovies(this.searchKeyword).subscribe(res=>{
        this.movies=res.Search as MOVIE[];
        this.loading =false
        if(res.Response =='False'){
          this.alertService.isError=true;
          this.alertService.alertMessage=res.Error;
        }
      })
    });
  }
  
  getMovieInfo(id:string){
    this.sharedService.getMovieDetails(id).subscribe(res=>{
      this.movieInfo=res as MOVIE;
      this.detailsVisibility[id] = false; 
      this.toggleDetails(id);
    })
  }

  toggleDetails(movieId: string): void {
    this.detailsVisibility[movieId] = !this.detailsVisibility[movieId];
  }

  hideInfo(movieId: string): void {
    this.detailsVisibility[movieId] = false;
  }
}
