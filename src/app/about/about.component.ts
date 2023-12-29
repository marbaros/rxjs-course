import { Component, OnInit } from "@angular/core";
import { concat, of } from "rxjs";
import { delay } from "rxjs/operators";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"],
})
export class AboutComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    const source1$ = of(1, 2, 3);
    const source2$ = of(4, 5, 6).pipe(delay(5000));
    const source3$ = of(7, 8, 9);

    const result$ = concat(source1$, source2$, source3$);
    result$.subscribe(console.log);
  }
}
