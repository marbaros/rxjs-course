import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Course } from "../model/course";
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll,
  shareReplay,
  exhaustMap,
  throttle,
  throttleTime,
} from "rxjs/operators";
import { merge, fromEvent, Observable, concat, interval } from "rxjs";
import { Lesson } from "../model/lesson";
import { createHttpObservable } from "../common/util";

@Component({
  selector: "course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"],
})
export class CourseComponent implements OnInit, AfterViewInit {
  course$: Observable<Course>;
  lessons$: Observable<Lesson[]>;

  @ViewChild("searchInput", {
    read: ElementRef,
    static: true,
  })
  input: ElementRef;
  courseId: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.params["id"];
    this.course$ = createHttpObservable<Course>(
      `/api/courses/${this.courseId}`
    );
  }

  ngAfterViewInit() {
    const searchLessons$ = fromEvent<any>(
      this.input.nativeElement,
      "keyup"
    ).pipe(
      map((event: KeyboardEvent) => (event.target as HTMLInputElement).value),
      startWith(""),
      //warte etwas => also wenn sich für 500ms keine Werte kommen dann letzten abschicken
      debounceTime(500),
      //ignorie alles und lasse nur werte alle 500ms durch.
      //throttleTime(500)

      //und schicke nur wenn sich die Werte geändert haben
      distinctUntilChanged(),
      //sobald ein nuer Wert komm dann breche den aktuellen request ab ( unsubsribe ) und erzeuge ein neuen request
      switchMap((searchTerm) => this.loadLessons(searchTerm))
    );

    //const initailLessons$ = this.loadLessons();
    //this.lessons$ = concat(initailLessons$, searchLessons$);
    this.lessons$ = searchLessons$;
  }

  loadLessons(searchTerm: string = ""): Observable<Lesson[]> {
    return createHttpObservable<Lesson[]>(
      `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${searchTerm}`
    ).pipe(map((response) => Object.values(response["payload"])));
  }
}
