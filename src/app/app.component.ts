import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Restaurant {
  id?: number;
  name: string;
  description: string;
  location: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  restaurants: Restaurant[] = [];
  restaurant: Restaurant = { name: '', description: '', location: '' };
  editing: boolean = false;

  private apiUrl = 'http://localhost/restaurant/restanurant_list.php';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getRestaurants();
  }

  getRestaurants(): void {
    this.http.get<Restaurant[]>(this.apiUrl).subscribe(data => this.restaurants = data);
  }

  addRestaurant(): void {
    if (this.editing) {
      this.http.put(this.apiUrl, this.restaurant).subscribe(() => {
        this.getRestaurants();
        this.resetForm();
      });
    } else {
      this.http.post<Restaurant>(this.apiUrl, this.restaurant).subscribe(() => {
        this.getRestaurants();
        this.resetForm();
      });
    }
  }

  editRestaurant(restaurant: Restaurant): void {
    this.restaurant = { ...restaurant };
    this.editing = true;
  }

  deleteRestaurant(id?: number): void {
    if (id !== undefined) {
      this.http.request('DELETE', this.apiUrl, { body: { id } }).subscribe(() => {
        this.getRestaurants();
      }, error => {
        console.error('Delete failed', error);
      });
    }
  }

  resetForm(): void {
    this.restaurant = { name: '', description: '', location: '' };
    this.editing = false;
  }
}