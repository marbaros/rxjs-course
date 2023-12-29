import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Course } from "../model/course";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import * as moment from "moment";
import { Observable, fromEvent } from "rxjs";
import {
  concatMap,
  debounceTime,
  distinctUntilChanged,
  exhaustMap,
  filter,
  mergeMap,
  tap,
} from "rxjs/operators";
import { fromPromise } from "rxjs/internal-compatibility";

@Component({
  selector: "course-dialog",
  templateUrl: "./course-dialog.component.html",
  styleUrls: ["./course-dialog.component.css"],
})
export class CourseDialogComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  course: Course;

  @ViewChild("saveButton", { static: true }) saveButton: ElementRef;

  @ViewChild("searchInput", { static: true }) searchInput: ElementRef;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: Course
  ) {
    this.course = course;

    this.form = fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required],
    });
  }

  ngOnInit() {
    //valueChanges ist ein Observable das bei jeder Änderung einen Wert ausgibt
    this.form.valueChanges
      .pipe(
        //nur wenn das formular valide ist, dann in den stream übernehmen
        filter(() => this.form.valid),
        debounceTime(1000),
        tap((changes) => console.log("Form changes:", changes)),
        // changes in ein neues Observable wandeln
        //also jede Änderung in ein neues Observable wandeln. Die Wandlung wird im saveCourses gemacht!
        //Wichtig: concatMap wartet jetzt bis das Observable aus saveCourses completet ist, bevor es einen neues erzeugt!
        concatMap((changes) => this.saveCourses(changes))
        //mergeMap würde nicht warten sondern sofort ein neues Observable erzeugen ohne zu warten. Also parallel abfeuertn.
      )
      .subscribe();
  }

  ngAfterViewInit() {}

  close() {
    this.dialogRef.close();
  }

  saveCourses(changes): Observable<Response> {
    return fromPromise(
      fetch(`/api/courses/${this.course.id}`, {
        method: "PUT",
        body: JSON.stringify(changes),
        headers: {
          "content-type": "application/json",
        },
      })
    );
  }

  save() {}
}
