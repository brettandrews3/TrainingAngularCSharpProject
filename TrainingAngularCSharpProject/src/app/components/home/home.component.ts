import { Component, OnInit } from '@angular/core';
import { Workout } from '../../models/workout';
import { WorkoutService } from '../../services/workout.service';
import * as _ from 'lodash';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public joggingData: Array<Workout>;
  public currentJogging: Workout;

  constructor(private workoutService: WorkoutService, public datePipe: DatePipe) {
    //...
    workoutService.get().subscribe((data: any) => this.joggingData = data);
    this.currentJogging = this.setInitialValuesForJoggingData();
  }
    ngOnInit(): void {
    }

  private setInitialValuesForJoggingData() {
    return {
      id: undefined,
      date: undefined,
      distanceInMiles: 0,
      timeInMinutes: 0      // Why does this default to 1 hour, xx minutes when posting to page?
    } as Workout;
  }

  public editClicked = function (id) {
    this.workoutService.getById(id).subscribe((data: Workout) => {
      this.currentJogging = {
        distanceInMiles: data.distanceInMiles,
        timeInMinutes: data.timeInMinutes,
        date: this.datePipe.transform(data.date, 'yyyy-MM-dd'),
        id: data.id
      } as Workout;
      console.log(this.currentJogging);
    })
    
  };

  public newClicked = function () {
    this.currentJogging = this.setInitialValuesForJoggingData();
  };

  public deleteClicked(id) {
    this.workoutService.getById(id).subscribe((data: Workout) => {
      const deleteIndex = _.findIndex(this.joggingData, { id: data.id });
      this.workoutService.remove(data).subscribe(
        result => this.joggingData.splice(deleteIndex, 1)
      );
    });
    
  }

  public createOrUpdateJogging = function (jogging: Workout) {
    // if jogging is present in joggingData, we can assume this is an update
    // otherwise it is adding a new element
    let joggingWithId;
    joggingWithId = _.find(this.joggingData, (el => el.id === jogging.id));

    if (joggingWithId) {
      const updateIndex = _.findIndex(this.joggingData, { id: joggingWithId.id });
      this.workoutService.update(jogging).subscribe(
        joggingRecord => this.joggingData.splice(updateIndex, 1, jogging)
      );
    } else {
      this.workoutService.add(jogging).subscribe(
        joggingRecord => this.joggingData.push(jogging)
      );
    }

    this.currentJogging = this.setInitialValuesForJoggingData();


  };

}
