/// <reference types="jquery" />
/// <reference types="jquery" />
declare class Slider {
    states: {
        years: number;
        months: number;
    };
    state: number;
    year_from: number;
    year_until: number;
    year_count: number;
    size: number;
    year_from_active: number;
    year_until_active: number;
    month_from_active: number;
    month_until_active: number;
    $switcher: JQuery;
    $switch_years: JQuery;
    $switch_months: JQuery;
    $space: JQuery;
    $wind_space: JQuery;
    $slider_container: JQuery;
    $wind_slider: JQuery;
    $line_container: JQuery;
    $line: JQuery;
    $line_active: JQuery;
    $touch_from: JQuery;
    $touch_from_circle: JQuery;
    $touch_until: JQuery;
    $touch_until_circle: JQuery;
    $window_from: JQuery;
    $window_until: JQuery;
    $dates_container: JQuery;
    $dates_years: JQuery;
    $dates_months: JQuery;
    constructor(container: JQuery, from_year: number, until_year: number, date_from: Date, date_until: Date);
    private CreateSliderDates;
    private PutInPlaceLine;
    private DoSwitchYear;
    private DoSwitchMonth;
    private RedrawYear;
    private ChangeSizeRowForYear;
    private DrawLineForYear;
    private RedrawMonth;
    private ChangeSizeRowForMonth;
    private DrawLineForMonth;
    private MoveYears;
    private MoveTouch;
    private ChangeDate;
    private ChangeDateYears;
    private ChangeDateMonths;
    private GetDate;
}
