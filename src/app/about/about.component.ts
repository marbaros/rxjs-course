import { Component, OnInit } from "@angular/core";
import { concat, interval, merge, of } from "rxjs";
import { delay, map } from "rxjs/operators";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"],
})
export class AboutComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    //concat
    const source1$ = of(1, 2, 3);
    const source2$ = of(4, 5, 6).pipe(delay(5000));
    const source3$ = of(7, 8, 9);

    //concat wartet auf die Streams bis dieser completed, sind bevor es zum nächsten geht
    const result$ = concat(source1$, source2$, source3$);
    //result$.subscribe(console.log);

    //merge gibt alle Werte sofort aus wenn diese kommen.
    const result2$ = merge(source1$, source2$, source3$);
    result2$.subscribe(console.log);

    //const interval$ = interval(1000);
    //const interval2$ = interval$.pipe(map((val) => val * 2));
    //merge(interval$, interval2$).subscribe(console.log);
  }
}
