import { Component, OnInit, Output, EventEmitter, Input, forwardRef } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
  standalone: true,
  selector: "app-bh-timepicker",
  templateUrl: "./bh-timepicker.component.html",
  styleUrls: ["./bh-timepicker.component.scss"],
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BhTimepickerComponent),
      multi: true,
    },
  ],
})
export class BhTimepickerComponent implements OnInit, ControlValueAccessor {
  IsHour: boolean = true;
  EnableClock: boolean;
  Hour: string;
  Minute: string;
  SelectedTime: string = "";
  IsOpened: boolean;
  Root: any;
  IsReady: boolean = false;

  onTuched: () => {};
  onChange: (_: any) => {};
  disabled: boolean;

  @Input()
  set value(Data: string) {
    if (Data !== null) {
      this.SelectedTime = Data;
    }
  }

  @Output() OnSelect = new EventEmitter();
  constructor() {}

  ngOnInit(): void {
    this.IsOpened = false;
    this.Hour = "00";
    this.Minute = "00";
    this.EnableClock = false;
    this.IsHour = true;
    this.IsReady = true;
  }

  SelectedHour(HourValue: number) {
    if (HourValue < 10) {
      this.Hour = "0" + HourValue.toString();
    } else {
      this.Hour = HourValue.toString();
    }
    //this.SelectedTime = this.Hour + ":" + this.Minute;
    this.IsHour = false;
  }

  SelectedMinute(MinHand: number) {
    let $min = (event.currentTarget as HTMLElement).closest('div[name="min-sec"]')?.querySelector("span");
    $min.classList.remove("tick-selected");
    const $ele = event.currentTarget as HTMLElement;
    $ele.classList.add('tick-selected');
    this.Root.find('div[name="min-hand"]').css({
      transform: `rotate(calc(${MinHand}*30deg)`,
    });

    let TotalMinute: any = MinHand * 5;
    if (TotalMinute < 10) {
      this.Minute = "0" + TotalMinute.toString();
    } else {
      if (TotalMinute === 60) TotalMinute = "00";
      this.Minute = TotalMinute.toString();
    }
    //this.SelectedTime = this.Hour + ":" + this.Minute;
  }

  GetClock() {
    this.Root = (event.currentTarget as HTMLElement).closest('div[name="bh-clock-parent"]');
    this.IsHour = true;
    this.IsOpened = true;
    this.EnableClock = !this.EnableClock;
    this.Root.find('input[name="timing"]').focus();
  }

  CloseComponent() {
    this.EnableClock = false;
  }

  DisableClick() {
    if (this.IsOpened) {
      event.preventDefault();
    }
  }

  GetSelectedTime() {
    this.SelectedTime = this.Hour + ":" + this.Minute;
    this.onChange(this.SelectedTime);
    this.OnSelect.emit(
      JSON.stringify({ hour: this.Hour, minute: this.Minute })
    );
    this.EnableClock = false;
  }

  // ---------------------------- impelmenting controlvalueaccessor ---------------------------------

  writeValue(value: string): void {
    this.SelectedTime = value ? value : "";
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {}

  setDisabledState?(isDisabled: boolean): void {}
}
