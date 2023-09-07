"use strict";
class Slider {
    year_from;
    year_until;
    year_count;
    size;
    years;
    x_from;
    x_until;
    // month_from						: number;
    // month_until						: number;
    year_from_active;
    year_until_active;
    month_from_active;
    month_until_active;
    $switcher;
    $switch_years;
    $switch_months;
    $space;
    $slider_container;
    $line_container;
    $line;
    $line_active;
    $touch_from;
    $touch_until;
    $window_from;
    $window_until;
    $dates_container;
    $dates_years;
    $dates_months;
    constructor(container, from_year, until_year, date_from, date_until) {
        this.year_from = from_year;
        this.year_until = until_year;
        this.year_from_active = date_from.getFullYear();
        this.year_until_active = date_until.getFullYear();
        this.month_from_active = date_from.getMonth();
        this.month_until_active = date_until.getMonth();
        if (this.year_from_active < from_year || this.year_until_active > until_year) {
            container.append($('<div/>', { class: 'error', text: 'Неправильно введены данные' }));
            return;
        }
        this.year_count = this.year_until - this.year_from + 1;
        /* Elements */
        this.$switcher = $('<div/>', { class: 'switcher' });
        this.$switch_years = $('<span/>', { class: 'switch_years active', text: 'Все года' });
        this.$switch_months = $('<span/>', { class: 'switch_months inactive', text: 'Месяца' });
        this.$space = $('<div/>', { class: 'space' });
        this.$slider_container = $('<div/>', { class: 'slider_container' });
        this.$line_container = $('<div/>', { class: 'line_container' });
        this.$line = $('<div/>', { class: 'line' });
        this.$line_active = $('<div/>', { class: 'line_active' });
        this.$touch_from = $('<div/>', { class: 'touch from' });
        this.$touch_until = $('<div/>', { class: 'touch until' });
        this.$window_from = $('<div/>', { class: 'window_from' });
        this.$window_until = $('<div/>', { class: 'window_until' });
        this.$dates_container = $('<div/>', { class: 'dates_container' });
        this.$dates_years = $('<div/>', { class: 'dates years' });
        this.$dates_months = $('<div/>', { class: 'dates months hide' });
        /* Building DOM */
        container.append($('<div/>', { class: 'slider' }).append(this.$switcher.append($('<div/>').append(this.$switch_years), $('<div/>').append(this.$switch_months)), this.$space.append(this.$slider_container.append(this.$line_container.append(this.$line.append(this.$line_active, this.$touch_from, this.$touch_until), this.$window_from, this.$window_until), this.$dates_container.append(this.$dates_years, this.$dates_months)))));
        /* Events */
        this.$switch_years.on('click', () => { this.DoSwitch('years'); });
        this.$switch_months.on('click', () => { this.DoSwitch('months'); });
        this.$touch_from.on('mousedown.touch', (e) => {
            let x = e.pageX;
            this.$slider_container.on('mousemove.touch', (e) => { this.MoveTouch(e, 'from', x); });
            $(window).on('mouseup.touch', (e) => { this.$slider_container.off('mousemove.touch'); $(window).off('mouseup.touch'); });
        });
        this.$touch_until.on('mousedown.touch', (e) => {
            let x = e.pageX;
            this.$slider_container.on('mousemove.touch', (e) => { this.MoveTouch(e, 'until', x); });
            $(window).on('mouseup.touch', (e) => { this.$slider_container.off('mousemove.touch'); $(window).off('mouseup.touch'); });
        });
        this.$dates_years.on('mousedown.years', (e) => {
            this.$dates_years.on('mousemove.years', (e) => { this.MoveYears(e, 'mousemove'); });
            $(window).on('mouseup.years', (e) => { this.$dates_years.off('mousemove.years'); $(window).off('mouseup.years'); });
        });
        this.$dates_years.on('touchstart.years', (e) => {
            // let left_position = this.$slider_container.position().left;
            // let startX = e.touches[0].pageX;
            // this.$dates_years.on('touchmove.years', (e) => { this.MoveYears(e, 'touchmove', startX, left_position) });
            // $(window).on('touchend.years', (e) => { this.$dates_years.off('touchmove.years'); this.$dates_years.off('touchend.years'); });
        });
        this.$dates_years.on('wheel', (e) => { this.MoveYears(e, 'wheel'); });
        this.$dates_months.on('mousedown.months', (e) => {
            this.$dates_months.on('mousemove.months', (e) => { });
            $(window).on('mouseup.months', (e) => { this.$dates_months.off('touchmove.months'); $(window).off('touchend.months'); });
        });
        this.$dates_months.on('touchstart.months', (e) => {
            this.$dates_months.on('touchmove.months', (e) => { });
            $(window).on('touchend.months', (e) => { });
        });
        this.$dates_months.on('wheel', (e) => { });
        this.CreateSliderDates();
        this.Redraw();
        this.DrawLine();
        $(window).on('resize', () => { this.Redraw(); this.DrawLine(); });
    }
    CreateSliderDates() {
        let months = ['фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
        for (let i = 0; i <= (this.year_until - this.year_from); i++) {
            this.$dates_years.append($('<span/>', { class: 'year', text: this.year_from + i }));
        }
        for (let i = this.year_from; i <= this.year_until; i++) {
            this.$dates_months.append($('<span/>', { class: 'month', text: i }));
            for (const month of months) {
                this.$dates_months.append($('<span/>', { class: 'month', text: month }));
            }
        }
        this.$dates_months.append($('<span/>', { class: 'month', text: this.year_until + 1 }));
    }
    DoSwitch(param) {
        switch (param) {
            case 'years':
                if (this.$switch_years.hasClass('active'))
                    return;
                this.$switch_years.removeClass('inactive').addClass('active');
                this.$switch_months.removeClass('active').addClass('inactive');
                this.$dates_years.removeClass('hide');
                this.$dates_months.addClass('hide');
                break;
            case 'months':
                if (this.$switch_months.hasClass('active'))
                    return;
                this.$switch_months.removeClass('inactive').addClass('active');
                this.$switch_years.removeClass('active').addClass('inactive');
                this.$dates_months.removeClass('hide');
                this.$dates_years.addClass('hide');
                break;
        }
    }
    Redraw() {
        let width = Math.floor(this.$space.width());
        this.RedrawYear(width, this.year_count);
    }
    RedrawYear(width, count) {
        this.GetSizeRowForYear(width, count);
        this.$dates_years.children().width(this.size * 2);
        this.$dates_years.children(':first-child').width(this.size);
        this.$dates_years.children(':last-child').width(this.size);
    }
    GetSizeRowForYear(width, count) {
        switch (count) {
            case 1:
                this.size = width;
                break;
            case 2:
                this.size = Math.floor(width / 2);
                break;
            default:
                this.size = Math.floor(width / (2 * count - 2));
                break;
        }
        if (this.size < 79)
            this.size = 79;
    }
    DrawLine() {
        let left_from = Math.floor((this.year_from_active - this.year_from) * this.size + this.size / 12 * this.month_from_active);
        let left_until = Math.floor((this.year_until_active - this.year_from) * this.size + this.size / 12 * this.month_until_active);
        let width_line = left_until - left_from;
        this.$touch_from.css('left', left_from);
        this.$touch_until.css('left', left_until);
        this.$line_active.css('left', left_from + 5);
        this.$line_active.width(width_line);
    }
    RedrawLine() { }
    MoveYears(e, param, startX, left_pos) {
        let left = this.$slider_container.position().left;
        switch (param) {
            case 'wheel':
                e.originalEvent.wheelDelta < 0 ? left = left + e.originalEvent.offsetY : left = left - e.originalEvent.offsetY;
                if (Math.floor(-left + this.$space.width()) >= (this.$slider_container.width()) + e.originalEvent.offsetY)
                    return;
                break;
            case 'mousemove':
                left += e.originalEvent.movementX;
                if (Math.floor(-left + this.$space.width()) >= (this.$slider_container.width()) + e.originalEvent.movementX)
                    return;
                break;
            case 'touchmove':
            // let currentX = e.touches[0].pageX;
            // console.log(currentX - startX);
            // left = left_pos + currentX - startX;
            // break;
        }
        if (left > 0)
            return;
        this.$slider_container.css('left', left);
    }
    MoveTouch(e, param, x) {
        let left_from = this.$touch_from.position().left;
        let left_until = this.$touch_until.position().left;
        switch (param) {
            case 'from':
                left_from += e.originalEvent.movementX;
                if (left_from > (left_until - 20))
                    return;
                this.$touch_from.css('left', left_from);
                this.$line_active.css('left', left_from + 5);
                this.$line_active.width(this.$line_active.width() - e.originalEvent.movementX);
                break;
            case 'until':
                left_until += e.originalEvent.movementX;
                if (left_until < (left_from + 20))
                    return;
                this.$touch_until.css('left', left_until);
                this.$line_active.width(this.$line_active.width() + e.originalEvent.movementX);
                break;
        }
    }
}
//# sourceMappingURL=slider.js.map